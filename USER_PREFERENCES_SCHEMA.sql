-- User Preferences Schema Migration
-- This adds columns to store user preferences that persist across sessions

-- Add preference columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS hide_balance BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS sms_notifications BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';

-- Create an index for faster queries on user preferences
CREATE INDEX IF NOT EXISTS idx_profiles_user_preferences 
ON public.profiles(id, hide_balance, push_notifications, email_notifications, sms_notifications, preferred_language);

-- Optional: Add a comment to document the columns
COMMENT ON COLUMN public.profiles.hide_balance IS 'Whether to hide the balance amount (show ••••• instead)';
COMMENT ON COLUMN public.profiles.push_notifications IS 'Whether user wants to receive push notifications';
COMMENT ON COLUMN public.profiles.email_notifications IS 'Whether user wants to receive email notifications';
COMMENT ON COLUMN public.profiles.sms_notifications IS 'Whether user wants to receive SMS notifications';
COMMENT ON COLUMN public.profiles.preferred_language IS 'User preferred language code (en, es, fr, de, zh, etc.)';

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN (
    'hide_balance',
    'push_notifications', 
    'email_notifications',
    'sms_notifications',
    'preferred_language'
  )
ORDER BY column_name;