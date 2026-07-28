-- ============================================
-- FINAL DATABASE SCHEMA FOR PENNYWISE
-- Run this in Supabase SQL Editor if not already done
-- ============================================

-- 1. Create profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT,
  phone_number TEXT,
  country_code TEXT,
  balance DECIMAL(10,2) DEFAULT 0.00,
  profile_image_url TEXT DEFAULT 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 5. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, country_code, profile_image_url, balance)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'country_code',
    'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg',
    0.00
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Update existing profiles with default values
UPDATE public.profiles 
SET 
  profile_image_url = COALESCE(profile_image_url, 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg'),
  balance = COALESCE(balance, 0.00)
WHERE profile_image_url IS NULL OR balance IS NULL;

-- ============================================
-- SCHEMA COMPLETE
-- ============================================
-- This schema provides:
-- 1. User profiles with balance and profile image
-- 2. Row Level Security for data protection
-- 3. Automatic profile creation on signup
-- 4. Default values for new users
-- ============================================