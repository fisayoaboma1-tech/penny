"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import { createClient } from "../lib/supabase/client"
import { User, Session } from "@supabase/supabase-js"

interface AdminProfileRow {
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

interface AdminAuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  profile: AdminProfileRow | null
  isAdmin: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<AdminProfileRow | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  // Create client once with lazy initializer to prevent infinite re-renders
  const [supabase] = useState(() => createClient("admin"))
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
        console.error("Failed to load admin profile:", error)
        return null
      }

      return data as AdminProfileRow | null
    } catch (error) {
      console.error("Error loading admin profile:", error)
      return null
    }
  }

  const applyProfile = (nextProfile: AdminProfileRow | null) => {
    setProfile(nextProfile)
    setIsAdmin(nextProfile?.is_admin ?? false)
  }

  const isAdminUser = (userId: string): boolean => {
    // Check if the user is actually an admin
    // This is used to filter auth state changes
    return profile?.id === userId && profile?.is_admin === true
  }

  const subscribeToProfile = (userId: string) => {
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
      .channel(`admin-profile-${userId}`)
    
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
          const updatedProfile = payload.new as AdminProfileRow
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

  const signOut = async () => {
    setLoading(true)
    currentUserIdRef.current = null
    // Only sign out from the admin client, not the user client
    await supabase.auth.signOut({ scope: 'local' })
    setUser(null)
    setSession(null)
    setProfile(null)
    setIsAdmin(false)
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

  return (
    <AdminAuthContext.Provider value={{ user, session, loading, profile, isAdmin, signOut, refreshProfile }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}