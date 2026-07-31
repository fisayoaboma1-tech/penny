import { createBrowserClient } from '@supabase/ssr'

export type AuthScope = 'user' | 'admin'

export function createClient(scope: AuthScope = 'user') {
  const scopedName = `pennywise-${scope}-auth`
  const sharedOptions = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
      storageKey: scopedName,
      // Prevent session from being cleared on auth state changes
      persist: 'local',
    },
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      ...sharedOptions,
      cookieOptions: {
        name: scopedName,
        maxAge: 60 * 60 * 24 * 365, // 1 year
      },
    }
  )
}
