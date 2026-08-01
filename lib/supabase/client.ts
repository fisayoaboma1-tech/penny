import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export type AuthScope = 'user' | 'admin'

// Memory storage for SSR - prevents localStorage errors on the server
const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  key: () => null,
  get length() { return 0 }
}

export function createClient(scope: AuthScope = 'user') {
  // Use unique storage keys to completely isolate user and admin sessions
  const storageKey = `pennywise-${scope}-auth`

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: storageKey,
        storage: typeof window !== 'undefined' ? localStorage : memoryStorage,
      },
    }
  )
}