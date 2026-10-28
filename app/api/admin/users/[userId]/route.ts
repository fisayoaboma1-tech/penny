import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId)) {
    return NextResponse.json({ error: "Invalid user ID." }, { status: 400 })
  }

  const sessionClient = await createClient()
  const { data: { user }, error: authError } = await sessionClient.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: "Authentication is required." }, { status: 401 })
  }

  const { data: adminProfile, error: profileError } = await sessionClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error("Could not verify admin access for user deletion", profileError)
    return NextResponse.json({ error: "Admin access could not be verified." }, { status: 500 })
  }
  if (!adminProfile.is_admin) {
    return NextResponse.json({ error: "Administrator access is required." }, { status: 403 })
  }
  if (userId === user.id) {
    return NextResponse.json({ error: "You cannot delete your own admin account." }, { status: 400 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("User deletion requires SUPABASE_SERVICE_ROLE_KEY to be configured.")
    return NextResponse.json({ error: "User deletion is not configured on this server." }, { status: 500 })
  }

  const adminClient = createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data: targetProfile, error: targetError } = await adminClient
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .maybeSingle()

  if (targetError) {
    console.error("Could not verify target account for deletion", targetError)
    return NextResponse.json({ error: "The account could not be verified." }, { status: 500 })
  }
  if (!targetProfile) {
    return NextResponse.json({ error: "The account was not found." }, { status: 404 })
  }
  if (targetProfile.is_admin) {
    return NextResponse.json({ error: "Admin accounts cannot be deleted from this screen." }, { status: 403 })
  }

  const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId)
  if (deleteError) {
    console.error("Could not delete user account", deleteError)
    return NextResponse.json({ error: "The account could not be deleted." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
