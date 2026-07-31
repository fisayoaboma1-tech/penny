create table if not exists profiles (
  id uuid primary key references auth.users(id),
  full_name text not null,
  phone_number text not null,
  country_code text not null,
  email text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
