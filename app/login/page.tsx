"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Eye, EyeOff, Fingerprint, Loader2, Mail, ShieldCheck } from "lucide-react"
import { AuthLayout, AuthProgress, AuthSuccess } from "@/components/auth/auth-layout"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"
import { createClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (step === 1) {
      setStep(2)
      window.setTimeout(() => passwordInputRef.current?.focus(), 100)
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: loginError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (loginError) throw loginError
      if (!data.user) throw new Error("We couldn't sign you in. Please try again.")

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .single()

      if (profileError || profileData?.is_admin) {
        await supabase.auth.signOut()
        throw new Error("Admins are not permitted to sign in here. Use the admin portal instead.")
      }

      setIsSuccess(true)
      await new Promise((resolve) => window.setTimeout(resolve, 900))
      router.replace("/wallet")
      router.refresh()
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Invalid email or password")
      setLoading(false)
    }
  }

  return (
    <>
      <AuthLayout
        eyebrow="A better way to manage money"
        sideTitle="Your money, with a little more clarity."
        sideDescription="Sign in to pick up where you left off and keep your wallet moving with you."
      >
        {isSuccess ? (
          <AuthSuccess title="You’re signed in" description="Your wallet is ready. Taking you there now…" />
        ) : (
          <>
            <div className="mb-8">
              <div className="mb-6 hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 lg:flex">
                <Fingerprint className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-blue-600">Welcome back</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Login to your wallet</h1>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step === 1 ? "First, let’s find your account." : "One more step and you’re back in."}
              </p>
            </div>

            <AuthProgress currentStep={step} steps={["Your email", "Your password"]} />

            <form onSubmit={handleLogin} className="space-y-5">
              {step === 1 ? (
                <motion.div
                  key="email-step"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-2"
                >
                  <label htmlFor="login-email" className="text-sm font-medium text-slate-700">Email address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@domain.com"
                      autoComplete="email"
                      autoCapitalize="none"
                      required
                      autoFocus
                      className="saas-input !bg-white !text-slate-900 !pl-11 min-h-12 rounded-xl border-slate-200 pr-4"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="password-step"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Mail className="h-4 w-4" />
                      </span>
                      <span className="truncate text-sm font-medium text-slate-700">{email}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setError(""); setStep(1) }}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <label htmlFor="login-password" className="text-sm font-medium text-slate-700">Password</label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-sm font-medium text-blue-600 transition hover:text-blue-800"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        ref={passwordInputRef}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Your password"
                        autoComplete="current-password"
                        required
                        className="saas-input !bg-white !text-slate-900 min-h-12 rounded-xl border-slate-200 px-4 pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        aria-controls="login-password"
                        className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {error ? (
                <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="flex gap-3">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => { setError(""); setStep(1) }}
                    disabled={loading}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="saas-button saas-button-primary min-h-12 flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {loading ? "Checking your details…" : step === 1 ? "Continue" : "Sign in"}
                  {!loading ? <ArrowRight className="h-4 w-4" /> : null}
                </button>
              </div>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              New to Pennywise?{" "}
              <Link href="/signup" className="font-semibold text-blue-600 transition hover:text-blue-800">
                Create an account
              </Link>
            </p>

            <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-200/80 pt-6 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Your account details are protected
            </div>
          </>
        )}
      </AuthLayout>
      <ForgotPasswordModal isOpen={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} />
    </>
  )
}
