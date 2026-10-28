"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { createClient } from "../lib/supabase/client"
import { User, Session } from "@supabase/supabase-js"

interface ProfileRow {
  id: string
  full_name: string
  email: string
  phone_number: string
  country_code: string
  created_at: string
  updated_at: string
  is_admin: boolean
  balance: number
  restricted?: boolean
  profile_image_url?: string
  hide_balance?: boolean
  push_notifications?: boolean
  email_notifications?: boolean
  sms_notifications?: boolean
  preferred_language?: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  profile: ProfileRow | null
  isAdmin: boolean | null
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  refreshProfile: () => Promise<void>
  theme: string | undefined
  setTheme: (theme: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [theme, setThemeState] = useState<string | undefined>(undefined)
  const { setTheme: setThemeMode } = useTheme()
  // Create client once with lazy initializer to prevent infinite re-renders
  const [supabase] = useState(() => createClient())
  const profileChannel = useRef<any>(null)
  const currentUserIdRef = useRef<string | null>(null)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (error) {
        console.error("Failed to load profile for auth user:", error)
        return null
      }

      return data as ProfileRow | null
    } catch (error) {
      console.error("Error loading profile:", error)
      return null
    }
  }

  const applyProfile = (nextProfile: ProfileRow | null) => {
    setProfile(nextProfile)
    // Only set isAdmin if this is actually an admin user
    // This prevents the user context from showing admin users
    setIsAdmin(nextProfile?.is_admin ?? false)
  }

  const subscribeToProfile = (userId: string) => {
    // Don't subscribe to admin profiles in the user context
    // This prevents real-time updates from affecting the wrong context
    if (profile?.is_admin) {
      return
    }

    // Unsubscribe from existing channel if any
    if (profileChannel.current) {
      try {
        profileChannel.current.unsubscribe()
      } catch (e) {
        console.error("Error unsubscribing from profile channel:", e)
      }
      profileChannel.current = null
    }

    // Create new channel with callbacks BEFORE subscribing
    const channel = supabase
      .channel(`profile-${userId}`)
    
    channel.on(
      "postgres_changes",
      { 
        event: "UPDATE", 
        schema: "public", 
        table: "profiles", 
        filter: `id=eq.${userId}` 
      },
      (payload: any) => {
        if (payload.new) {
          const updatedProfile = payload.new as ProfileRow
          applyProfile(updatedProfile)
        }
      }
    )

    // Subscribe after setting up callbacks
    channel.subscribe()
    profileChannel.current = channel
  }

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        const profileRow = await fetchProfile(session.user.id)
        applyProfile(profileRow)
        if (profileRow?.id) {
          subscribeToProfile(profileRow.id)
        }
      } else {
        if (profileChannel.current) {
          profileChannel.current.unsubscribe()
          profileChannel.current = null
        }
        applyProfile(null)
      }

      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: Session | null) => {
        const newUserId = session?.user?.id ?? null

        // Skip if this is the same user and not a logout event
        if (newUserId === currentUserIdRef.current && event !== 'SIGNED_OUT') {
          return
        }

        // Update the current user ref
        currentUserIdRef.current = event === 'SIGNED_OUT' ? null : newUserId

        // Update state
        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          const profileRow = await fetchProfile(session.user.id)
          applyProfile(profileRow)
          if (profileRow?.id) {
            subscribeToProfile(profileRow.id)
          }
        } else {
          if (profileChannel.current) {
            profileChannel.current.unsubscribe()
            profileChannel.current = null
          }
          applyProfile(null)
        }

        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
      if (profileChannel.current) {
        profileChannel.current.unsubscribe()
      }
    }
  }, [supabase])

  const updateTheme = (newTheme: string) => {
    setThemeState(newTheme)
    // Save to user metadata
    if (user) {
      supabase.auth.updateUser({
        data: { theme_preference: newTheme }
      }).catch(err => console.error("Failed to save theme:", err))
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      // Only sign out from the user client, not the admin client
      const { error } = await supabase.auth.signOut({ scope: "local" })
      if (error) throw error

      currentUserIdRef.current = null
      setUser(null)
      setSession(null)
      setProfile(null)
      setIsAdmin(null)
      setThemeState(undefined)
      if (profileChannel.current) {
        profileChannel.current.unsubscribe()
        profileChannel.current = null
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshProfile = async () => {
    if (!user) return
    const profileRow = await fetchProfile(user.id)
    applyProfile(profileRow)
  }

  const refreshSession = async () => {
    setLoading(true)
    try {
      const { data: { session: nextSession }, error } = await supabase.auth.getSession()
      if (error) {
        throw error
      }

      const nextUser = nextSession?.user ?? null
      currentUserIdRef.current = nextUser?.id ?? null
      setSession(nextSession)
      setUser(nextUser)

      if (nextUser) {
        const nextProfile = await fetchProfile(nextUser.id)
        applyProfile(nextProfile)
        if (nextProfile?.id) {
          subscribeToProfile(nextProfile.id)
        }
      } else {
        if (profileChannel.current) {
          profileChannel.current.unsubscribe()
          profileChannel.current = null
        }
        applyProfile(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // Load theme preference when user changes
  useEffect(() => {
    if (user) {
      const savedTheme = user.user_metadata?.theme_preference
      if (savedTheme) {
        setThemeState(savedTheme)
        // Apply the theme using next-themes
        setThemeMode(savedTheme)
      }
    }
  }, [user, setThemeMode])

  return (
    <AuthContext.Provider value={{ user, session, loading, profile, isAdmin, signOut, refreshSession, refreshProfile, theme, setTheme: updateTheme }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
