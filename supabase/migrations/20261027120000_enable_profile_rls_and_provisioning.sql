create or replace function public.is_profile_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and is_admin = true
  );
$$;

revoke all on function public.is_profile_admin() from public;
grant execute on function public.is_profile_admin() to authenticated;

create or replace function public.create_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    email,
    phone_number,
    country_code
  )
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data ->> 'full_name', ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'User'
    ),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'phone_number', ''),
    coalesce(new.raw_user_meta_data ->> 'country_code', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists create_profile_after_auth_signup on auth.users;
create trigger create_profile_after_auth_signup
  after insert on auth.users
  for each row execute function public.create_profile_for_auth_user();

insert into public.profiles (id, full_name, email, phone_number, country_code)
select
  users.id,
  coalesce(
    nullif(users.raw_user_meta_data ->> 'full_name', ''),
    nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
    'User'
  ),
  coalesce(users.email, ''),
  coalesce(users.raw_user_meta_data ->> 'phone_number', ''),
  coalesce(users.raw_user_meta_data ->> 'country_code', '')
from auth.users as users
on conflict (id) do nothing;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if not public.is_profile_admin() and (
    new.is_admin is distinct from old.is_admin
    or new.balance is distinct from old.balance
    or new.restricted is distinct from old.restricted
  ) then
    raise exception 'Only administrators can change privileged profile fields';
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_privileges_before_update on public.profiles;
create trigger protect_profile_privileges_before_update
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_profile_admin()));

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = (select auth.uid()) or (select public.is_profile_admin()))
  with check (id = (select auth.uid()) or (select public.is_profile_admin()));

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
  on public.profiles
  for delete
  to authenticated
  using ((select public.is_profile_admin()));
