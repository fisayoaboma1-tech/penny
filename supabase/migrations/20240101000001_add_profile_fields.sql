-- Add profile_image_url and balance columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT DEFAULT 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg',
ADD COLUMN IF NOT EXISTS balance DECIMAL(10,2) DEFAULT 0.00;

-- Update existing profiles to have default values
UPDATE public.profiles 
SET 
  profile_image_url = COALESCE(profile_image_url, 'https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg'),
  balance = COALESCE(balance, 0.00)
WHERE profile_image_url IS NULL OR balance IS NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);

-- Update the handle_new_user function to set default values
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

-- Drop and recreate the trigger to use the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();