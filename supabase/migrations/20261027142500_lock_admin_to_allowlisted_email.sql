create or replace function public.is_allowlisted_pennywise_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, auth
as $$
  select exists (
    select 1
    from auth.users
    where id = user_id
      and lower(email) = 'pennywiseadmin@outlook.com'
  );
$$;

revoke all on function public.is_allowlisted_pennywise_admin(uuid) from public;

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
      and public.is_allowlisted_pennywise_admin(id)
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
    country_code,
    is_admin
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
    coalesce(new.raw_user_meta_data ->> 'country_code', ''),
    public.is_allowlisted_pennywise_admin(new.id)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if new.is_admin is distinct from public.is_allowlisted_pennywise_admin(new.id) then
    raise exception 'Only the allowlisted account can have administrator access';
  end if;

  if not public.is_profile_admin() and (
    new.balance is distinct from old.balance
    or new.restricted is distinct from old.restricted
  ) then
    raise exception 'Only administrators can change privileged profile fields';
  end if;

  return new;
end;
$$;

update public.profiles
set is_admin = public.is_allowlisted_pennywise_admin(id)
where is_admin is distinct from public.is_allowlisted_pennywise_admin(id);

drop policy if exists "Admins can manage wallet transactions" on public.wallet_transactions;
create policy "Admins can manage wallet transactions"
  on public.wallet_transactions
  for all
  to authenticated
  using ((select public.is_profile_admin()))
  with check ((select public.is_profile_admin()));
