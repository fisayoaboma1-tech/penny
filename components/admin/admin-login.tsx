"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, Eye, EyeOff, Fingerprint, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [recoveryMode, setRecoveryMode] = useState(false)
  const [recoverySent, setRecoverySent] = useState(false)
  const router = useRouter()
  const [supabase] = useState(() => createClient("admin"))

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) throw new Error("Please enter both email and password.")
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.user) throw error || new Error("Login failed.")

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile?.is_admin) {
        await supabase.auth.signOut()
        throw new Error("Only admin accounts can sign in here.")
      }

      window.location.href = "/admin-template"
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordRecovery = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email.trim()) throw new Error("Enter your admin email address first.")
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin-template/reset-password`,
      })
      if (error) throw error
      setRecoverySent(true)
    } catch (recoveryError) {
      setError(recoveryError instanceof Error ? recoveryError.message : "Unable to send a password reset email.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 sm:px-6">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 scale-105 bg-cover bg-center blur-[4px]" style={{ backgroundImage: "url('/entrepreneur-startup-office-meeting.jpg')" }} />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-blue-950/35 to-slate-950/80" />
      </div>

      <Link href="/" aria-label="Back to Pennywise" className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 sm:left-6 sm:top-6">
        <ArrowLeft className="h-4 w-4" />
      </Link>

      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="w-full max-w-[480px] overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/[0.96] shadow-[0_32px_100px_rgba(2,12,30,0.5)] backdrop-blur-xl">
        <div className="px-5 py-7 sm:px-9 sm:py-9">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25">
                <Fingerprint className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-lg font-bold tracking-tight text-slate-900">Pennywise</span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Admin workspace</span>
              </span>
            </Link>
          </div>

          <div className="mb-7">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
              {recoveryMode ? <LockKeyhole className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-700">
              {recoveryMode ? "Account recovery" : "Secure sign in"}
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {recoveryMode ? "Reset your password" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {recoveryMode ? "We’ll send a secure reset link to your admin email." : "Sign in with your administrator account to continue."}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {recoveryMode && recoverySent ? (
              <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <p>If an account matches <strong className="break-all">{email}</strong>, a password reset link has been sent.</p>
                </div>
                <button type="button" onClick={() => { setRecoveryMode(false); setRecoverySent(false) }} className="mt-5 font-semibold text-emerald-800 underline underline-offset-4">
                  Back to sign in
                </button>
              </motion.div>
            ) : (
              <motion.form key={recoveryMode ? "recovery" : "login"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} onSubmit={recoveryMode ? handlePasswordRecovery : handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="admin-login-email" className="mb-2 block text-sm font-medium text-slate-700">Admin email</label>
                  <input id="admin-login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@pennywise.com" autoComplete="email" required className="saas-input" />
                </div>

                {!recoveryMode && (
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label htmlFor="admin-login-password" className="text-sm font-medium text-slate-700">Password</label>
                      <button type="button" onClick={() => { setError(""); setRecoveryMode(true) }} className="text-xs font-semibold text-blue-700 transition hover:text-blue-900">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <input id="admin-login-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" autoComplete="current-password" className="saas-input pr-10" />
                      <button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading} className="saas-button saas-button-primary w-full">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : recoveryMode ? <LockKeyhole className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                  {loading ? (recoveryMode ? "Sending reset link…" : "Signing in…") : (recoveryMode ? "Send reset link" : "Sign in")}
                </button>

                {recoveryMode && (
                  <button type="button" onClick={() => { setRecoveryMode(false); setRecoverySent(false); setError("") }} className="w-full text-center text-sm font-medium text-slate-600 hover:text-slate-900">
                    Back to sign in
                  </button>
                )}
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.section>
    </main>
  )
}
