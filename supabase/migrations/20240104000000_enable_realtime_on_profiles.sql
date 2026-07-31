-- Enable real-time for the profiles table
-- Run this in your Supabase SQL Editor

-- 1. Enable real-time on the profiles table
alter publication supabase_realtime add table profiles;

-- 2. Verify the table is in the publication
SELECT 
  schemaname,
  tablename,
  pubname
FROM pg_publication_tables 
WHERE tablename = 'profiles';

-- 3. Check the publication configuration
SELECT 
  pubname,
  puballtables,
  pubinsert,
  pubupdate,
  pubdelete
FROM pg_publication 
WHERE pubname = 'supabase_realtime';