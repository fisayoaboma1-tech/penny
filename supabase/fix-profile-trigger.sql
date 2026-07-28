-- Fix the profile creation trigger
-- Run this in Supabase SQL Editor

-- First, drop the existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    phone_number, 
    country_code, 
    profile_image_url, 
    balance,
    is_admin
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'phone_number', '00000000000'),
    COALESCE(NEW.raw_user_meta_data->>'country_code', '+1'),
    'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg',
    0.00,
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Test: Check if the trigger exists
SELECT 
  trigger_name,
  event_manipulation,
  action_timing,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verify profiles exist
SELECT 
  p.id,
  p.full_name,
  p.phone_number,
  p.country_code,
  p.balance,
  p.is_admin
FROM public.profiles p
ORDER BY p.created_at DESC;