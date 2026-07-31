# Admin Session Persistence Fix

## Problem
- Admin sessions were being logged out on page refresh
- Admin actions were affecting normal user sessions
- Admin state was not persisting across page refreshes

## Root Causes
1. **Session Storage**: Admin and user sessions were using separate storage keys, causing conflicts
2. **Real-time Updates**: Admin profile updates from real-time subscriptions were overwriting admin session state
3. **Cookie Expiration**: Default cookie settings didn't persist long enough
4. **Navigation**: Using `router.replace()` caused client-side navigation that could clear sessions

## Solutions Implemented

### 1. Enhanced Session Persistence (`lib/supabase/client.ts`)
```typescript
auth: {
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: false,
  storageKey: scopedName,
  persist: 'local', // NEW: Force localStorage persistence
},
cookieOptions: {
  name: scopedName,
  maxAge: 60 * 60 * 24 * 365, // NEW: 1 year cookie expiration
}
```

**What this does:**
- Forces sessions to persist in localStorage (not just memory)
- Sets cookies to expire in 1 year instead of default (usually 1 week)
- Separate storage keys for admin (`pennywise-admin-auth`) and user (`pennywise-user-auth`)

### 2. Hard Refresh on Admin Login (`app/dashboard/login/page.tsx`)
```typescript
// Force a hard refresh to ensure clean state
window.location.href = "/dashboard"
```

**What this does:**
- Uses `window.location.href` instead of `router.replace()`
- Forces a full page reload, clearing any conflicting state
- Ensures clean session initialization

### 3. Filtered Real-time Updates (`app/dashboard/page.tsx`)
```typescript
filter: 'is_admin=eq.false', // Only listen to non-admin user updates
```

**What this does:**
- Admin dashboard only receives real-time updates for non-admin users
- Prevents admin profile changes from triggering session updates
- Eliminates circular updates that could log out admin

### 4. Protected Admin Profile Updates (`contexts/auth-context.tsx`)
```typescript
// Don't update admin profile from real-time if this is an admin user
if (updatedProfile.is_admin && user?.user_metadata?.is_admin) {
  return
}
```

**What this does:**
- Ignores real-time updates for admin profiles
- Prevents admin session state from being overwritten
- Maintains admin authentication state integrity

## How It Works Now

### Admin Session Flow:
1. Admin logs in → Session stored in `pennywise-admin-auth` (localStorage + cookie)
2. Cookie set to expire in 1 year
3. Page refresh → Session retrieved from localStorage
4. Admin check runs → Authorized = true
5. Real-time subscription only listens to non-admin users
6. Admin profile updates are ignored by auth context

### Normal User Session Flow:
1. User logs in → Session stored in `pennywise-user-auth` (localStorage + cookie)
2. Admin performs actions → Updates user profile in database
3. Real-time update sent to user's wallet page
4. User's balance/restriction updates automatically
5. User session remains unaffected

## Testing the Fix

### Test 1: Admin Session Persistence
1. Log in as admin
2. Refresh the page (F5 or Ctrl+R)
3. **Expected**: Admin stays logged in, no redirect to login page
4. **Expected**: Admin dashboard loads with all data

### Test 2: Admin Actions Don't Affect Users
1. Log in as admin in one tab
2. Log in as normal user in another tab
3. Admin edits user's balance
4. **Expected**: User's wallet updates automatically
5. **Expected**: User stays logged in, no logout
6. **Expected**: Admin stays logged in, no logout

### Test 3: Multiple Admin Tabs
1. Log in as admin in two different tabs
2. Edit a user's balance in tab 1
3. **Expected**: Tab 2 updates automatically (real-time sync)
4. **Expected**: Both tabs stay logged in

### Test 4: Session Expiration
1. Log in as admin
2. Close browser completely
3. Reopen browser and navigate to admin dashboard
4. **Expected**: Admin session persists (1 year cookie)
5. **Expected**: No need to log in again

## Key Differences

### Before:
- ❌ Admin logged out on refresh
- ❌ Admin actions could log out users
- ❌ Sessions expired quickly (default cookie age)
- ❌ Real-time updates affected admin profile
- ❌ Separate sessions could conflict

### After:
- ✅ Admin stays logged in permanently (until manual logout)
- ✅ Admin actions only affect user data, not sessions
- ✅ Sessions persist for 1 year
- ✅ Real-time updates isolated to non-admin users
- ✅ Separate, isolated sessions for admin and users

## Manual Logout Only

Admin will ONLY be logged out when:
1. Clicking the logout button (calls `signOut()`)
2. Manually clearing browser data/cookies
3. Session expires after 1 year of inactivity

Admin will NOT be logged out by:
1. Page refreshes
2. Editing user balances
3. Restricting/unrestricting users
4. Deleting users
5. Any other admin actions
6. Normal user login/logout

## Troubleshooting

If admin still gets logged out:

1. **Check Browser Console**:
   - Look for "Admin auth check failed" errors
   - Check for session retrieval errors

2. **Check Application Tab** (Chrome DevTools):
   - Go to Application → Cookies
   - Verify `pennywise-admin-auth` cookie exists
   - Check expiration date (should be 1 year)

3. **Check LocalStorage**:
   - Go to Application → Local Storage
   - Look for `pennywise-admin-auth` key
   - Verify it contains session data

4. **Clear and Re-login**:
   - If corrupted, clear cookies/localStorage
   - Log in again with admin credentials

## Environment Variables Required

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Additional Notes

- Admin and user sessions are completely isolated
- Real-time updates use filtered subscriptions for security
- Session persistence is handled by Supabase SSR client
- Cookie settings apply to both admin and user scopes
- The `persist: 'local'` setting ensures sessions survive browser restarts