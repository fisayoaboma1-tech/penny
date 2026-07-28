-- ============================================
-- ADMIN DASHBOARD SETUP - RUN IN SUPABASE
-- ============================================
-- Go to: Supabase Dashboard > SQL Editor > New Query
-- Copy and paste everything below and click Run
-- ============================================

-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create index for faster admin queries
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON public.profiles(is_admin);

-- ============================================
-- HOW TO MAKE A USER ADMIN:
-- ============================================
-- After running the above SQL, you can make any user admin by:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Find the user you want to make admin
-- 3. Copy their user ID
-- 4. Run this SQL (replace USER_ID with the actual ID):
--
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = 'USER_ID';
--
-- Or if you want to make the first registered user admin:
-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE id = (SELECT id FROM public.profiles LIMIT 1);
-- ============================================

-- ============================================
-- SUCCESS!
-- ============================================
-- After running this:
-- 1. Make at least one user admin using the instructions above
-- 2. The admin can now log in at /dashboard/login
-- 3. The admin dashboard will fetch real users from the database
-- ============================================