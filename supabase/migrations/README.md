# Supabase SQL Migrations

Run these SQL commands in your Supabase SQL Editor in order.

## Migration 1: Create profiles table

```sql
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone_number text,
  country_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "Admins can manage all profiles"
  on public.profiles
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
```

## Migration 2: Add profile_image_url column

```sql
alter table profiles
add column if not exists profile_image_url text;
```

## Migration 3: Add admin and balance columns

```sql
alter table profiles
add column if not exists is_admin boolean default false;

alter table profiles
add column if not exists balance numeric default 0;

alter table profiles
add column if not exists restricted boolean default false;

alter table profiles
add column if not exists hide_balance boolean default false;

alter table profiles
add column if not exists push_notifications boolean default true;

alter table profiles
add column if not exists email_notifications boolean default true;

alter table profiles
add column if not exists sms_notifications boolean default false;

alter table profiles
add column if not exists preferred_language text default 'en';
```

## Migration 4: Enable realtime on profiles

```sql
alter publication supabase_realtime add table public.profiles;
```

## Migration 5: Create wallet_transactions table

```sql
create extension if not exists pgcrypto;

create table if not exists public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('credit', 'debit', 'transfer')),
  amount numeric not null,
  title text not null,
  subtitle text not null default 'Transaction processing',
  detail_title text not null,
  detail_description text not null,
  detail_footer text not null default 'Transactions are completed within 24 to 48 hours.',
  status text not null default 'processing',
  created_at timestamptz not null default now()
);

create index if not exists wallet_transactions_user_created_idx
  on public.wallet_transactions (user_id, created_at desc);

alter table public.wallet_transactions enable row level security;

drop policy if exists "Users can view their own wallet transactions" on public.wallet_transactions;
drop policy if exists "Users can insert their own wallet transactions" on public.wallet_transactions;
drop policy if exists "Admins can manage wallet transactions" on public.wallet_transactions;

create policy "Users can view their own wallet transactions"
  on public.wallet_transactions
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can insert their own wallet transactions"
  on public.wallet_transactions
  for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "Admins can manage wallet transactions"
  on public.wallet_transactions
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and is_admin = true
    )
  );
```

## How to apply

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run each migration in order (1-5)
4. All features will be ready to use