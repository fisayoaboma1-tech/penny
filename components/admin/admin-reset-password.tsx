"use client"

import { FormEvent, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Eye, EyeOff, Fingerprint, Loader2, LockKeyhole } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminResetPasswordPage() {
  const router = useRouter()
  const [supabase] = useState(() => createClient("admin"))
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [ready, setReady] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [complete, setComplete] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    const initializeRecoverySession = async () => {
      try {
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) throw error
        } else {
          const hash = new URLSearchParams(url.hash.slice(1))
          const accessToken = hash.get("access_token")
          const refreshToken = hash.get("refresh_token")
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
            if (error) throw error
          }
        }

        const { data, error } = await supabase.auth.getSession()
        if (error) throw error
        if (!data.session) {
          setError("This reset link is invalid or has expired. Please request a new reset link to continue.")
          return
        }
        setReady(true)
      } catch (sessionError) {
        console.error("Failed to initialize password reset session:", sessionError)
        setError(sessionError instanceof Error ? sessionError.message : "Unable to validate this reset link.")
      }
    }

    void initializeRecoverySession()
  }, [supabase])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Use a password with at least 8 characters.")
      return
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.")
      return
    }

    setSaving(true)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setComplete(true)
    } catch (updateError) {
      console.error("Failed to update admin password:", updateError)
      setError(updateError instanceof Error ? updateError.message : "Unable to update your password.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 scale-105 bg-cover bg-center blur-[4px]" style={{ backgroundImage: "url('/entrepreneur-startup-office-meeting.jpg')" }} />
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/75 via-blue-950/40 to-slate-950/80" />
      </div>

      <Link href="/admin-template/login" aria-label="Back to admin sign in" className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 sm:top-6">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <section className="w-full max-w-[480px] rounded-[1.8rem] border border-white/15 bg-white/[0.96] px-5 py-7 shadow-[0_32px_100px_rgba(2,12,30,0.5)] backdrop-blur-xl sm:px-9 sm:py-9">
        <Link href="/admin-template/login" className="mb-8 inline-flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
            <Fingerprint className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-900">Pennywise</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Admin workspace</span>
          </span>
        </Link>

        {complete ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Password updated</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Your new password is ready. Sign in again to continue to the admin workspace.</p>
            <button onClick={() => router.replace("/admin-template/login")} className="saas-button saas-button-primary mt-6 w-full">Return to sign in</button>
          </div>
        ) : (
          <>
            <div className="mb-7">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">Account recovery</p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Create a new password</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">Choose a strong password with at least 8 characters.</p>
            </div>

            {!ready ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Validating reset link…
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="new-password" className="mb-2 block text-sm font-medium text-slate-700">New password</label>
                  <div className="relative">
                    <input id="new-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="saas-input pr-10" />
                    <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="mb-2 block text-sm font-medium text-slate-700">Confirm new password</label>
                  <input id="confirm-password" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="saas-input" />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <button type="submit" disabled={saving} className="saas-button saas-button-primary w-full">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <LockKeyhole className="h-4 w-4" />}
                  {saving ? "Updating password…" : "Update password"}
                </button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  )
}
