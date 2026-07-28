-- Check and fix user profiles
-- Run this in Supabase SQL Editor

-- First, let's see what profiles exist
SELECT 
  p.id,
  p.full_name,
  p.balance,
  p.is_admin,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;

-- If the new users don't have profiles, create them:
-- Replace the user IDs with the actual IDs from your Auth users table

-- For user: Fila delop (fcfdfce7-3180-4539-85f7-5db7f0213dd2)
INSERT INTO public.profiles (id, full_name, phone_number, country_code, balance, is_admin)
VALUES ('fcfdfce7-3180-4539-85f7-5db7f0213dd2', 'Fila delop', '00000000000', '+1', 0.00, false)
ON CONFLICT (id) DO NOTHING;

-- For user: Rafad yoail (e312ebe6-2361-45fd-86d3-50c97acf55cc)
INSERT INTO public.profiles (id, full_name, phone_number, country_code, balance, is_admin)
VALUES ('e312ebe6-2361-45fd-86d3-50c97acf55cc', 'Rafad yoail', '00000000000', '+1', 0.00, false)
ON CONFLICT (id) DO NOTHING;

-- For user: rta hahha (48aee215-ced6-4f12-a748-59b581c14bac)
INSERT INTO public.profiles (id, full_name, phone_number, country_code, balance, is_admin)
VALUES ('48aee215-ced6-4f12-a748-59b581c14bac', 'rta hahha', '00000000000', '+1', 0.00, false)
ON CONFLICT (id) DO NOTHING;

-- Verify the profiles were created
SELECT 
  p.id,
  p.full_name,
  p.balance,
  p.is_admin,
  p.created_at
FROM public.profiles p
ORDER BY p.created_at DESC;
