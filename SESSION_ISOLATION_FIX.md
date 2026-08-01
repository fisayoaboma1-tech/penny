# Session Isolation Fix - Admin vs User Sessions

## Problem
When logging in as admin and then logging in as a normal user (or vice versa) in the same browser, one session would log out the other. This happened because both auth contexts were listening to global auth state changes and reacting to all session changes.

## Root Cause
The application had two separate Supabase clients:
- User client: `createClient()` (default)
- Admin client: `createClient("admin")`

Each client uses different cookie names:
- User: `pennywise-user-session`
- Admin: `pennywise-admin-session`

However, both auth contexts (`AuthContext` and `AdminAuthContext`) were listening to **all** auth state changes from their respective clients. When any session changed (login/logout), both contexts would process the event, causing them to interfere with each other.

## Solution
Modified both auth contexts to filter auth state changes and only respond to sessions that belong to their scope:

### 1. User Auth Context (`contexts/auth-context.tsx`)
Added a check in the `onAuthStateChange` listener to ignore admin users:

```typescript
if (session?.user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .maybeSingle()

  // If this is an admin user, ignore the event in the user context
  if (profile?.is_admin) {
    return
  }
}
```

**Result**: The user context now only processes non-admin user sessions.

### 2. Admin Auth Context (`contexts/admin-auth-context.tsx`)
Added a check in the `onAuthStateChange` listener to ignore non-admin users:

```typescript
if (session?.user) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .maybeSingle()

  // If this is NOT an admin user, ignore the event in the admin context
  if (!profile?.is_admin) {
    return
  }
}
```

**Result**: The admin context now only processes admin user sessions.

## How It Works

### Session Storage
Each auth scope uses separate storage:
- **User sessions**: Stored in `pennywise-user-session` cookie
- **Admin sessions**: Stored in `pennywise-admin-session` cookie

### Context Isolation
- **User Context** (`AuthContext`): Only reacts to non-admin user login/logout events
- **Admin Context** (`AdminAuthContext`): Only reacts to admin user login/logout events

### Event Flow
1. **Normal user logs in**:
   - User context processes the event ✓
   - Admin context ignores the event (not an admin) ✓

2. **Admin logs in**:
   - User context ignores the event (is an admin) ✓
   - Admin context processes the event ✓

3. **Admin logs out**:
   - User context ignores the event (was an admin) ✓
   - Admin context processes the event ✓

4. **Normal user logs out**:
   - User context processes the event ✓
   - Admin context ignores the event (not an admin) ✓

## Testing Instructions

### Test 1: Admin login doesn't log out user
1. Open browser tab 1
2. Log in as a normal user at `/login`
3. Verify you're logged in and can access user features
4. Open browser tab 2
5. Log in as admin at `/dashboard/login`
6. Go back to tab 1
7. **Expected**: User is still logged in ✓
8. **Expected**: Admin is logged in tab 2 ✓

### Test 2: User login doesn't log out admin
1. Open browser tab 1
2. Log in as admin at `/dashboard/login`
3. Verify you can access the admin dashboard
4. Open browser tab 2
5. Log in as a normal user at `/login`
6. Go back to tab 1
7. **Expected**: Admin is still logged in ✓
8. **Expected**: User is logged in tab 2 ✓

### Test 3: Independent logout
1. With both sessions active (from tests 1 & 2)
2. Log out as admin from tab 1
3. **Expected**: User session in tab 2 remains active ✓
4. Log out as user from tab 2
5. **Expected**: Both sessions are now logged out ✓

### Test 4: Session persistence
1. Log in as both admin and user (in separate tabs)
2. Close tab 2 (user session)
3. Reopen tab 2
4. **Expected**: User session persists ✓
5. Close tab 1 (admin session)
6. Reopen tab 1
7. **Expected**: Admin session persists ✓

## Files Modified

1. **`contexts/auth-context.tsx`** - Added admin user filter in auth state change listener and fixed realtime subscription order
2. **`contexts/admin-auth-context.tsx`** - Added non-admin user filter in auth state change listener and fixed realtime subscription order
3. **`app/dashboard/layout.tsx`** - Created admin layout with AdminAuthProvider
4. **`app/dashboard/page.tsx`** - Updated to use useAdminAuth hook
5. **`app/dashboard/login/page.tsx`** - Updated to use useAdminAuth hook
6. **`app/dashboard/settings/page.tsx`** - Updated to use useAdminAuth hook
7. **`components/admin/admin-sidebar.tsx`** - Updated to use admin auth signOut

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Same Origin)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐          ┌──────────────┐            │
│  │  User Tab    │          │  Admin Tab   │            │
│  ├──────────────┤          ├──────────────┤            │
│  │ AuthContext  │          │AdminAuthCtx  │            │
│  │ (User Scope) │          │(Admin Scope) │            │
│  └──────┬───────┘          └──────┬───────┘            │
│         │                        │                      │
│         │  pennywise-user-       │  pennywise-admin-   │
│         │  session cookie        │  session cookie     │
│         │                        │                      │
└─────────┼────────────────────────┼─────────────────────┘
          │                        │
          ▼                        ▼
   ┌──────────────┐      ┌──────────────┐
   │ Supabase     │      │ Supabase     │
   │ User Client  │      │ Admin Client │
   └──────────────┘      └──────────────┘
```

## Benefits

1. **Independent Sessions**: Admin and user sessions no longer interfere with each other
2. **Same Browser**: Both can be logged in simultaneously in different tabs
3. **Separate Logout**: Logging out from one doesn't affect the other
4. **Session Persistence**: Each session persists independently
5. **Clean Architecture**: Clear separation between admin and user authentication

## Notes

- The fix uses the existing infrastructure in `lib/supabase/client.ts` which already supports separate cookie names
- No changes to Supabase configuration are needed
- The solution is backward compatible with existing user sessions
- Admin sessions are completely isolated from user sessions

## Recent Fixes (v2)

### Fixed: Realtime Subscription Error
**Issue**: `cannot add postgres_changes callbacks for realtime after subscribe()`

**Root Cause**: Callbacks were being added to Supabase channels AFTER calling `.subscribe()`, which is not allowed.

**Solution**: Restructured both auth contexts to:
1. Create the channel
2. Add all callbacks with `.on()`
3. THEN call `.subscribe()`

This ensures callbacks are registered before the subscription starts.

**Files Updated**:
- `contexts/auth-context.tsx` - Fixed `subscribeToProfile` function
- `contexts/admin-auth-context.tsx` - Fixed `subscribeToProfile` function

## Recent Fixes (v3)

### Fixed: Sessions Still Interfering
**Issue**: Admin and user sessions were still affecting each other despite filtering.

**Root Cause**: Auth contexts were processing events even for the same user, causing unnecessary state updates and potential race conditions.

**Solution**: Added `currentUserIdRef` to both auth contexts to track the current user ID and only update state when:
1. The user ID changes, OR
2. A logout event occurs

This prevents duplicate processing of the same session and ensures clean state management.

**Files Updated**:
- `contexts/auth-context.tsx` - Added `currentUserIdRef` and user ID checking
- `contexts/admin-auth-context.tsx` - Added `currentUserIdRef` and user ID checking

**Key Changes**:
```typescript
// Track current user ID
const currentUserIdRef = useRef<string | null>(null)

// In auth state change listener:
const newUserId = session?.user?.id ?? null
if (newUserId === currentUserIdRef.current && event !== 'SIGNED_OUT') {
  return // Ignore duplicate events
}
currentUserIdRef.current = newUserId

// In signOut:
currentUserIdRef.current = null
```

## Recent Fixes (v4) - FINAL SOLUTION

### Fixed: Complete Session Isolation
**Issue**: The root cause was that `createBrowserClient` from `@supabase/ssr` uses cookies for session storage, and both user and admin clients were using the same internal cookie names, causing them to overwrite each other's sessions.

**Root Cause**: The `storageKey` option in `createBrowserClient` doesn't work with cookies - it only works with localStorage. Both clients were sharing the same cookie storage.

**Solution**: Switched to `createSupabaseClient` from `@supabase/supabase-js` with a custom storage adapter that uses completely separate localStorage keys for user and admin sessions:

```typescript
// lib/supabase/client.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

function createStorageAdapter(scope: AuthScope) {
  const storageKey = `pennywise-${scope}-auth-storage`
  
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return null
      if (key.includes('auth-token')) {
        return localStorage.getItem(storageKey)
      }
      return localStorage.getItem(key)
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return
      if (key.includes('auth-token')) {
        localStorage.setItem(storageKey, value)
      } else {
        localStorage.setItem(key, value)
      }
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return
      if (key.includes('auth-token')) {
        localStorage.removeItem(storageKey)
      } else {
        localStorage.removeItem(key)
      }
    },
  }
}

export function createClient(scope: AuthScope = 'user') {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: `pennywise-${scope}-auth`,
        storage: createStorageAdapter(scope),
      },
    }
  )
}
```

**Key Benefits**:
- User sessions stored in `pennywise-user-auth-storage` localStorage key
- Admin sessions stored in `pennywise-admin-auth-storage` localStorage key
- Completely isolated - logging in/out of one doesn't affect the other
- SSR-safe with `typeof window === 'undefined'` checks
- Both contexts simplified to just manage their own state

**Files Updated**:
- `lib/supabase/client.ts` - Switched to `createSupabaseClient` with custom storage adapter
- `contexts/auth-context.tsx` - Simplified to manage user session only
- `contexts/admin-auth-context.tsx` - Simplified to manage admin session only
