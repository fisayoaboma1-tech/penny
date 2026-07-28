-- Check and fix admin user profile

-- Check if admin profile exists
SELECT 
  id,
  full_name,
  balance,
  is_admin,
  created_at
FROM public.profiles
WHERE id = 'a07e7139-0670-4108-956f-1949f8cbad2c';

-- If no results above, create the admin profile:
INSERT INTO public.profiles (
  id, 
  full_name, 
  phone_number, 
  country_code, 
  balance, 
  is_admin
)
VALUES (
  'a07e7139-0670-4108-956f-1949f8cbad2c',
  'Pennywise Admin',
  '00000000000',
  '+1',
  0.00,
  true
)
ON CONFLICT (id) DO UPDATE SET
  is_admin = true;

-- Verify admin profile was created/updated
SELECT 
  id,
  full_name,
  balance,
  is_admin,
  created_at
FROM public.profiles
WHERE id = 'a07e7139-0670-4108-956f-1949f8cbad2c';
