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
