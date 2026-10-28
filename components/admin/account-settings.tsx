"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Fingerprint,
  Loader2,
  LockKeyhole,
  Mail,
  Save,
  ShieldCheck,
  User,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AccountSettings({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const dashboardPath = "/admin-template"
  const loginPath = "/admin-template/login"
  const { user, profile, loading: authLoading, isAdmin, refreshProfile } = useAdminAuth()
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [authorized, setAuthorized] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const [saveError, setSaveError] = useState("")
  const [section, setSection] = useState<"profile" | "security">("profile")
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formData, setFormData] = useState({ full_name: "", email: "", phone_number: "" })
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [supabase] = useState(() => createClient("admin"))

  useEffect(() => {
    if (authLoading) return
    if (!user || !isAdmin) {
      router.replace(loginPath)
      return
    }

    setAuthorized(true)
    if (profile) {
      setAdminProfile(profile)
      setFormData({
        full_name: profile.full_name || "",
        email: profile.email || user.email || "",
        phone_number: profile.phone_number || "",
      })
    }
  }, [authLoading, user, isAdmin, profile, router, loginPath])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    setSaveMessage("")
    setSaveError("")

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name.trim(),
          phone_number: formData.phone_number.trim(),
        })
        .eq("id", user.id)

      if (error) throw error
      await refreshProfile()
      setSaveMessage("Your profile details have been saved successfully.")
    } catch (error) {
      console.error("Failed to save admin profile:", error)
      setSaveError(error instanceof Error ? error.message : "Unable to save profile changes.")
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file || !user) return

    setSaveMessage("")
    setSaveError("")

    if (!file.type.startsWith("image/")) {
      setSaveError("Choose an image file to update your profile photo.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setSaveError("Choose an image smaller than 5 MB.")
      return
    }

    setUploadingImage(true)

    try {
      const body = new FormData()
      body.append("file", file)
      const response = await fetch("/api/upload", { method: "POST", body })
      const result = await response.json()

      if (!response.ok || typeof result.url !== "string") {
        throw new Error(result.error || "Unable to upload your profile photo.")
      }

      const { error } = await supabase.from("profiles").update({ profile_image_url: result.url }).eq("id", user.id)
      if (error) throw error

      setAdminProfile((current: any) => ({ ...current, profile_image_url: result.url }))
      await refreshProfile()
      setSaveMessage("Your profile photo has been updated.")
    } catch (error) {
      console.error("Failed to update admin profile photo:", error)
      setSaveError(error instanceof Error ? error.message : "Unable to update your profile photo.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handlePasswordUpdate = async () => {
    if (!user) return
    setSaveMessage("")
    setSaveError("")

    if (newPassword.length < 8) {
      setSaveError("Use a password with at least 8 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setSaveError("The new passwords do not match.")
      return
    }

    try {
      setSaving(true)
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setNewPassword("")
      setConfirmPassword("")
      setSaveMessage("Your password has been updated successfully.")
    } catch (error) {
      console.error("Failed to update password:", error)
      setSaveError(error instanceof Error ? error.message : "Unable to update your password.")
    } finally {
      setSaving(false)
    }
  }

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: ShieldCheck },
  ] as const

  if (!authorized || authLoading || !adminProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          Loading account settings…
        </div>
      </div>
    )
  }

  const renderBody = () => {
    if (section === "profile") {
      return (
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <div className="saas-card p-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-blue-100 dark:ring-blue-500/20">
                <img src={adminProfile.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"} alt="Profile" className="h-full w-full object-cover" />
              </div>
              <button onClick={() => imageInputRef.current?.click()} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500">
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {uploadingImage ? "Uploading…" : "Upload photo"}
              </button>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
          </div>

          <div className="saas-card p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="saas-section-title">Personal information</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Your public profile</h2>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Full name</label>
                <input value={formData.full_name} onChange={(event) => setFormData((current) => ({ ...current, full_name: event.target.value }))} className="saas-input" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <input value={formData.email} readOnly className="saas-input cursor-not-allowed opacity-70" />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Phone number</label>
                <input value={formData.phone_number} onChange={(event) => setFormData((current) => ({ ...current, phone_number: event.target.value }))} className="saas-input" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            {(saveMessage || saveError) && (
              <div className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${saveError ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"}`}>
                {saveError ? <LockKeyhole className="mt-0.5 h-4 w-4" /> : <CheckCircle2 className="mt-0.5 h-4 w-4" />}
                <span>{saveError || saveMessage}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button onClick={() => router.push(dashboardPath)} className="saas-button saas-button-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="saas-button saas-button-primary">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )
    }

    if (section === "security") {
      return (
        <div className="saas-card p-5 sm:p-6">
          <div className="mb-5">
            <p className="saas-section-title">Security</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Update your password</h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">New password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} className="saas-input pr-10" />
                <button type="button" onClick={() => setShowPassword((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm password</label>
              <div className="relative">
                <input type={showPasswordConfirm ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="saas-input pr-10" />
                <button type="button" onClick={() => setShowPasswordConfirm((current) => !current)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">
            Passwords should include at least 8 characters and a mix of letters and numbers.
          </div>

          {(saveMessage || saveError) && (
            <div className={`mt-5 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${saveError ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300" : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300"}`}>
              {saveError ? <LockKeyhole className="mt-0.5 h-4 w-4" /> : <CheckCircle2 className="mt-0.5 h-4 w-4" />}
              <span>{saveError || saveMessage}</span>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button onClick={handlePasswordUpdate} disabled={saving} className="saas-button saas-button-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {saving ? "Updating…" : "Update password"}
            </button>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className={embedded ? "min-h-full" : "saas-shell relative overflow-hidden"}>
      {!embedded && (
        <>
          <div className="saas-bg-orb left-[-120px] top-[-50px] h-72 w-72 bg-blue-300/30" />
          <div className="saas-bg-orb right-[-80px] top-24 h-72 w-72 bg-violet-300/20" />
        </>
      )}

      <div className={`relative z-10 flex ${embedded ? "min-h-full" : "min-h-screen"}`}>
        {!embedded && <AdminSidebar isOpen={false} onClose={() => {}} adminProfile={adminProfile} isDesktop />}

        <div className={`flex min-w-0 flex-1 flex-col ${embedded ? "min-h-full" : "min-h-screen"}`}>
          {!embedded && <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
              <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Open navigation">
                  <Fingerprint className="h-4 w-4" />
                </button>
                <button onClick={() => router.push(dashboardPath)} className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300" aria-label="Back to dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Pennywise / admin</p>
                  <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Account settings</h1>
                </div>
              </div>
            </div>
          </header>}

          {!embedded && <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} adminProfile={adminProfile} />}

          <main className="mx-auto w-full max-w-[1200px] flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[1.4rem] border border-blue-100 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-[var(--shadow-lg)] sm:rounded-[1.8rem] sm:p-8">
              <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(96,165,250,0.24),transparent_30%)]" />
              <div className="relative z-10 max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-100">Workspace preferences</p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-4xl">Your account, shaped for focus.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-300">Manage your admin profile and account security.</p>
              </div>
            </motion.section>

            <div className="mt-5 grid gap-5 lg:mt-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-6">
              <aside className="saas-card p-2.5 sm:p-3">
                <div className="grid grid-cols-3 gap-1 lg:block lg:space-y-1">
                  {sections.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setSection(id)} className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2.5 text-center text-xs font-medium transition sm:flex-row sm:gap-2 sm:text-sm lg:justify-start lg:rounded-2xl lg:px-3 lg:py-3 lg:text-left ${section === id ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200" : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/80"}`}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white shadow-sm dark:bg-slate-800">
                        <Icon className="h-4 w-4" />
                      </div>
                      {label}
                    </button>
                  ))}
                </div>
              </aside>

              <div>{renderBody()}</div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
