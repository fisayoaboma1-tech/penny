-- Verify users exist and check admin dashboard query

-- Check ALL profiles
SELECT 
  id,
  full_name,
  phone_number,
  country_code,
  balance,
  is_admin,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Check ONLY non-admin users (this is what the dashboard queries)
SELECT 
  id,
  full_name,
  phone_number,
  country_code,
  balance,
  is_admin,
  created_at
FROM public.profiles
WHERE is_admin = false
ORDER BY created_at DESC;

-- Count non-admin users
SELECT COUNT(*) as non_admin_count
FROM public.profiles
WHERE is_admin = false;

-- If the above returns 0 but you know users exist, try this:
-- Maybe is_admin is stored differently, let's check distinct values
SELECT DISTINCT is_admin, COUNT(*)
FROM public.profiles
GROUP BY is_admin;