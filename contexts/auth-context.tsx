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
  const supabase = createClient()
  const profileChannel = useRef<any>(null)

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error || !data) {
        console.error("Failed to load profile for auth user:", error)
        return null
      }

      return data as ProfileRow
    } catch (error) {
      console.error("Error loading profile:", error)
      return null
    }
  }

  const applyProfile = (nextProfile: ProfileRow | null) => {
    setProfile(nextProfile)
    setIsAdmin(nextProfile?.is_admin ?? false)
  }

  const subscribeToProfile = (userId: string) => {
    if (profileChannel.current) {
      profileChannel.current.unsubscribe()
      profileChannel.current = null
    }

    const channel = supabase
      .channel(`profile-${userId}`)
      .on(
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
            // Don't update admin profile from real-time if this is an admin user
            // This prevents admin sessions from being affected by user updates
            if (updatedProfile.is_admin && user?.user_metadata?.is_admin) {
              return
            }
            applyProfile(updatedProfile)
          }
        }
      )
      .subscribe()

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
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    setIsAdmin(null)
    setThemeState(undefined)
    if (profileChannel.current) {
      profileChannel.current.unsubscribe()
      profileChannel.current = null
    }
    setLoading(false)
  }

  const refreshProfile = async () => {
    if (!user) return
    const profileRow = await fetchProfile(user.id)
    applyProfile(profileRow)
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
    <AuthContext.Provider value={{ user, session, loading, profile, isAdmin, signOut, refreshProfile, theme, setTheme: updateTheme }}>
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
