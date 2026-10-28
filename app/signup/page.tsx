"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, CircleCheck, Eye, EyeOff, Fingerprint, Loader2, LockKeyhole, Mail, Phone, UserRound } from "lucide-react"
import { AuthLayout, AuthProgress, AuthSuccess } from "@/components/auth/auth-layout"
import { CountrySelector } from "@/components/ui/country-selector"
import { useAuth } from "@/contexts/auth-context"
import { countries } from "@/lib/countries"
import { createClient } from "@/lib/supabase/client"

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [selectedCountry, setSelectedCountry] = useState(countries[0])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { refreshSession } = useAuth()

  const handleFullNameChange = (value: string) => {
    if (/\d/.test(value)) return
    setFullName(value)
  }

  const handlePhoneChange = (value: string) => {
    setPhone(value.replace(/[^0-9\s]/g, ""))
  }

  const validatePassword = (value: string) => (
    value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)
  )

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (step === 1) {
      setStep(2)
      return
    }

    if (password !== repeatPassword) {
      setError("Those passwords don’t match yet.")
      return
    }

    if (!validatePassword(password)) {
      setError("Choose a password with at least 8 characters, including a letter and a number.")
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_number: phone,
            country_code: selectedCountry.dialCode,
          },
        },
      })

      if (signupError) throw signupError
      if (!data.user) throw new Error("We couldn’t create your account. Please try again.")

      if (!data.session) {
        const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

        if (loginError) {
          throw new Error("Your account was created, but automatic sign-in failed. Please try signing in.")
        }

        if (!loginData.session) {
          throw new Error("Your account was created, but no sign-in session was returned. Please try signing in.")
        }
      }

      await refreshSession()
      setIsSuccess(true)
      await new Promise((resolve) => window.setTimeout(resolve, 900))
      router.replace("/wallet")
      router.refresh()
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "Something went wrong creating your account.")
      setLoading(false)
    }
  }

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One letter and one number", met: /[A-Za-z]/.test(password) && /\d/.test(password) },
  ]

  return (
    <AuthLayout
      eyebrow="A fresh start, made simple"
      sideTitle="Make more room for what matters."
      sideDescription="Create your Pennywise account and bring a little more intention to your everyday money."
    >
      {isSuccess ? (
        <AuthSuccess title="Your account is ready" description="Welcome to Pennywise. Taking you to your wallet…" />
      ) : (
        <>
          <div className="mb-7">
            <div className="mb-6 hidden h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 lg:flex">
              <Fingerprint className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-blue-600">Let’s get you started</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Create your account</h1>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {step === 1 ? "A few details to make your wallet yours." : "Set a password to keep your account secure."}
            </p>
          </div>

          <AuthProgress currentStep={step} steps={["Your details", "Secure your account"]} />

          <form onSubmit={handleSignup} className="space-y-5">
            {step === 1 ? (
              <motion.div
                key="details-step"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <label htmlFor="signup-name" className="text-sm font-medium text-slate-700">Full name</label>
                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="signup-name"
                      type="text"
                      value={fullName}
                      onChange={(event) => handleFullNameChange(event.target.value)}
                      placeholder="e.g. Alex Morgan"
                      autoComplete="name"
                      required
                      autoFocus
                      className="saas-input !bg-white !text-slate-900 !pl-11 min-h-12 rounded-xl border-slate-200 pr-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium text-slate-700">Email address</label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@domain.com"
                      autoComplete="email"
                      autoCapitalize="none"
                      required
                      className="saas-input !bg-white !text-slate-900 !pl-11 min-h-12 rounded-xl border-slate-200 pr-4"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="signup-phone" className="text-sm font-medium text-slate-700">Phone number</label>
                  <div className="flex min-h-12 items-stretch rounded-xl border border-slate-200 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                    <CountrySelector
                      value={selectedCountry.code}
                      onValueChange={(countryCode) => {
                        const country = countries.find((item) => item.code === countryCode)
                        if (country) setSelectedCountry(country)
                      }}
                      className="w-[105px] flex-none overflow-visible"
                      triggerClassName="h-full w-full rounded-l-xl border-none bg-transparent px-3 text-left text-sm font-medium text-slate-900 shadow-none hover:bg-slate-50"
                      panelClassName="w-full"
                    />
                    <div className="my-2 w-px bg-slate-200" />
                    <Phone className="ml-3 h-4 w-4 flex-none self-center text-slate-400" />
                    <input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                      placeholder="e.g. 555 123 4567"
                      autoComplete="tel-national"
                      required
                      className="min-w-0 flex-1 border-none bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="security-step"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-700">{email}</p>
                      <p className="text-xs text-slate-400">{fullName}</p>
                    </div>
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
                  <label htmlFor="signup-password" className="text-sm font-medium text-slate-700">Create a password</label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Create a secure password"
                      autoComplete="new-password"
                      required
                      className="saas-input !bg-white !text-slate-900 !pl-11 min-h-12 rounded-xl border-slate-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      aria-controls="signup-password"
                      className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <ul className="space-y-2 rounded-xl bg-slate-50 px-4 py-3" aria-label="Password requirements">
                  {passwordRequirements.map(({ label, met }) => (
                    <li key={label} className={`flex items-center gap-2 text-xs ${met ? "text-emerald-700" : "text-slate-500"}`}>
                      <CircleCheck className={`h-4 w-4 ${met ? "text-emerald-500" : "text-slate-300"}`} />
                      {label}
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <label htmlFor="signup-confirm-password" className="text-sm font-medium text-slate-700">Confirm password</label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="signup-confirm-password"
                      type={showRepeatPassword ? "text" : "password"}
                      value={repeatPassword}
                      onChange={(event) => setRepeatPassword(event.target.value)}
                      placeholder="Re-enter your password"
                      autoComplete="new-password"
                      required
                      className="saas-input !bg-white !text-slate-900 !pl-11 min-h-12 rounded-xl border-slate-200 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword((current) => !current)}
                      aria-label={showRepeatPassword ? "Hide password" : "Show password"}
                      aria-controls="signup-confirm-password"
                      className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {repeatPassword && password === repeatPassword ? (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <Check className="h-3.5 w-3.5" /> Passwords match
                    </p>
                  ) : null}
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
                {loading ? "Setting up your wallet…" : step === 1 ? "Continue" : "Create account"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </div>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-blue-600 transition hover:text-blue-800">Sign in</Link>
          </p>

          <p className="mt-8 border-t border-slate-200/80 pt-6 text-center text-xs leading-5 text-slate-400">
            By creating an account, you agree to keep your sign-in details safe.
          </p>
        </>
      )}
    </AuthLayout>
  )
}
