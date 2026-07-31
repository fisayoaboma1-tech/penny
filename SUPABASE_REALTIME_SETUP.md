# Supabase Real-Time Setup Guide

## What Was Fixed

Your Supabase real-time functionality wasn't working because:

1. **Real-time wasn't enabled** on the `profiles` table in Supabase
2. **No real-time subscriptions** were set up in your components to listen for changes

## Changes Made

### 1. SQL Migration File Created
**File:** `supabase/migrations/20240104000000_enable_realtime_on_profiles.sql`

This file contains the SQL needed to enable real-time on your profiles table.

### 2. Components Updated with Real-Time Subscriptions

#### Admin Dashboard (`app/dashboard/page.tsx`)
- Added real-time subscription to listen for ALL profile changes
- Automatically updates the users list when balances or restrictions change
- Updates selected user details in real-time
- Updates edit balance modal data in real-time

#### Wallet Page (`app/wallet/page.tsx`)
- Added real-time subscription for balance updates
- Balance automatically refreshes when admin edits it
- Shows "Last updated just now" when changes occur

#### Transfer Page (`app/wallet/transfer/page.tsx`)
- Added real-time subscription for restriction and balance updates
- Transfer restrictions take effect immediately
- Balance updates reflect in real-time

#### Services Page (`app/wallet/services/page.tsx`)
- Added real-time subscription for restriction updates
- Transfer restrictions are enforced immediately

## SQL Code to Run in Supabase SQL Editor

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- Enable real-time for the profiles table
alter publication supabase_realtime add table profiles;

-- Verify the configuration
SELECT 
  schemaname,
  tablename,
  pubname,
  puballtables,
  pubinsert,
  pubupdate,
  pubdelete
FROM pg_publication_tables 
WHERE tablename = 'profiles';

-- Check if the table is already in the publication
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';
```

## How It Works

### For Admin Dashboard:
When an admin edits a user's balance or restriction status:
1. Admin saves changes → Updates database
2. Real-time subscription detects the change
3. All connected admin dashboards update automatically
4. No page refresh needed

### For Wallet Pages:
When an admin edits a user's balance or restriction:
1. Admin saves changes → Updates database
2. Real-time subscription on user's wallet detects the change
3. Balance updates automatically on wallet page
4. Restriction status updates immediately
5. User sees changes in real-time

## Testing the Setup

1. **Run the SQL** in Supabase SQL Editor
2. **Open admin dashboard** in one browser tab
3. **Open wallet page** in another tab (logged in as the user being edited)
4. **Edit balance or restriction** in admin dashboard
5. **Watch the wallet page update automatically** without refreshing

## Important Notes

- Real-time only works when the table is in the `supabase_realtime` publication
- The subscriptions filter by user ID for security
- All subscriptions are cleaned up when components unmount
- Console logs show when updates are received (useful for debugging)

## Troubleshooting

If real-time still isn't working:

1. **Check Supabase Dashboard:**
   - Go to Database → Replication
   - Verify `profiles` table is listed
   - Check that real-time is enabled

2. **Check Browser Console:**
   - Look for "Profile change received" logs
   - Look for "Balance update received" logs
   - Check for any errors

3. **Verify Environment Variables:**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` is set
   - Ensure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set

4. **Check Network Tab:**
   - Look for WebSocket connections to Supabase
   - Should see `wss://` connections

## What Happens Now

✅ Admin edits balance → User's wallet updates instantly
✅ Admin restricts user → Transfer button disables immediately
✅ Admin unrestricts user → Transfer button enables immediately
✅ Multiple admin tabs stay in sync
✅ No more manual page refreshes needed