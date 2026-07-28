import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch user preferences from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("hide_balance, push_notifications, email_notifications, sms_notifications, preferred_language")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching preferences:", profileError)
      return NextResponse.json(
        { error: "Failed to fetch preferences" },
        { status: 500 }
      )
    }

    // Return preferences with defaults if any are null
    const preferences = {
      hide_balance: profile.hide_balance ?? false,
      push_notifications: profile.push_notifications ?? true,
      email_notifications: profile.email_notifications ?? true,
      sms_notifications: profile.sms_notifications ?? false,
      preferred_language: profile.preferred_language ?? "en",
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("Error in GET /api/user/preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { hide_balance, push_notifications, email_notifications, sms_notifications, preferred_language } = body

    // Update user preferences in profiles table
    const { data: profile, error: updateError } = await supabase
      .from("profiles")
      .update({
        hide_balance,
        push_notifications,
        email_notifications,
        sms_notifications,
        preferred_language,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating preferences:", updateError)
      return NextResponse.json(
        { error: "Failed to update preferences" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      preferences: {
        hide_balance: profile.hide_balance,
        push_notifications: profile.push_notifications,
        email_notifications: profile.email_notifications,
        sms_notifications: profile.sms_notifications,
        preferred_language: profile.preferred_language,
      }
    })
  } catch (error) {
    console.error("Error in POST /api/user/preferences:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}