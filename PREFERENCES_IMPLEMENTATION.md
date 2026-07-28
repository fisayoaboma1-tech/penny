# User Preferences Persistence - Implementation Guide

## Overview
All user preferences (balance visibility, notifications, language) now persist across sessions and are unique per user account.

## What Was Implemented

### 1. Database Schema
**File:** `USER_PREFERENCES_SCHEMA.sql`

Added 5 new columns to the `profiles` table:
- `hide_balance` - BOOLEAN (default: false)
- `push_notifications` - BOOLEAN (default: true)
- `email_notifications` - BOOLEAN (default: true)
- `sms_notifications` - BOOLEAN (default: false)
- `preferred_language` - TEXT (default: 'en')

**To apply:** Run the SQL in your Supabase dashboard → SQL Editor

### 2. API Route
**File:** `app/api/user/preferences/route.ts`

- `GET /api/user/preferences` - Fetches user preferences from database
- `POST /api/user/preferences` - Updates user preferences in database

Both endpoints require authentication and automatically associate preferences with the logged-in user.

### 3. React Query Setup
**Files:**
- `components/query-provider.tsx` - Query client provider for the app
- `hooks/use-user-preferences.ts` - Custom hook for managing preferences

**Features:**
- Automatic caching with 1-minute stale time
- Optimistic updates
- Auto-refetch after mutations
- Type-safe preference updates

### 4. Updated Components

#### Balance Card (`components/wallet/balance-card.tsx`)
- **Before:** `useState(true)` - resets on refresh
- **After:** Uses `useUserPreferences()` hook - persists in database
- **Behavior:** Toggle saves to database, survives refresh, unique per user

#### Notifications Page (`app/notifications/page.tsx`)
- **Before:** Three separate `useState` hooks - resets on refresh
- **After:** Uses `useUserPreferences()` hook - persists in database
- **Behavior:** Each toggle saves immediately, survives refresh, unique per user

#### Language Page (`app/language/page.tsx`)
- **Before:** `useState("en")` - resets on refresh
- **After:** Uses `useUserPreferences()` hook - persists in database
- **Behavior:** Selection saves to database, survives refresh, unique per user

## How It Works

### Data Flow
```
User toggles setting
    ↓
updatePreference() called
    ↓
POST /api/user/preferences
    ↓
Saves to Supabase profiles table
    ↓
React Query invalidates cache
    ↓
Auto-refetches updated preferences
    ↓
UI updates with new value
```

### On Page Load
```
Component mounts
    ↓
useUserPreferences() hook called
    ↓
GET /api/user/preferences
    ↓
Fetches from Supabase profiles table
    ↓
Returns user's saved preferences
    ↓
UI renders with saved values
```

## Technologies Used

1. **Supabase** - Database storage (already set up)
2. **React Query (TanStack Query)** - State management and caching
3. **Next.js API Routes** - Server-side API endpoints
4. **TypeScript** - Type safety

## Benefits

✅ **Persists across refreshes** - Settings saved to database
✅ **Per-user preferences** - Each account has its own settings
✅ **Real-time sync** - Changes reflect immediately in UI
✅ **Type-safe** - Full TypeScript support
✅ **Optimistic updates** - UI updates before server confirms
✅ **Auto-caching** - React Query handles caching efficiently

## Testing

1. **Run the SQL schema** in Supabase dashboard
2. **Login with a user account**
3. **Toggle balance visibility** → Refresh → Should stay hidden
4. **Change notification settings** → Refresh → Should persist
5. **Select a language** → Refresh → Should stay selected
6. **Logout and login with different account** → Should show that account's preferences

## Next Steps

1. Run `USER_PREFERENCES_SCHEMA.sql` in Supabase
2. Test the persistence features
3. (Optional) Add more preferences using the same pattern

## Architecture Pattern

To add more preferences in the future:

1. **Add column to SQL schema:**
   ```sql
   ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS new_preference BOOLEAN DEFAULT true;
   ```

2. **Update TypeScript interface** in `hooks/use-user-preferences.ts`:
   ```typescript
   export interface UserPreferences {
     // ... existing fields
     new_preference: boolean
   }
   ```

3. **Update API route** to fetch/update the new field

4. **Use in component:**
   ```typescript
   const { updatePreference } = useUserPreferences()
   updatePreference("new_preference", value)
   ```

That's it! The pattern is reusable for any future preferences.