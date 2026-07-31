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
      select 1
      from public.profiles
      where id = auth.uid()
        and is_admin = true
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where id = auth.uid()
        and is_admin = true
    )
  );
