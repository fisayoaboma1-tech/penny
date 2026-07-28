-- Run this SQL in Supabase Dashboard > SQL Editor

-- Add is_admin column if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Make the user admin (replace with your user ID if different)
UPDATE public.profiles 
SET is_admin = true 
WHERE id = 'a07e7139-0670-4108-956f-1949f8cbad2c';