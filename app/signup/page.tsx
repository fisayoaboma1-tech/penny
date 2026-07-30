"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { countries } from "@/lib/countries"
import { CountrySelector } from "@/components/ui/country-selector"

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: "easeInOut" as const,
    },
  }),
}

export default function SignupPage() {
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
  const router = useRouter()

  const handleFullNameChange = (value: string) => {
    // Reject if contains any numbers
    if (/\d/.test(value)) {
      return
    }
    setFullName(value)
  }

  const handlePhoneChange = (value: string) => {
    // Only allow numbers and spaces
    const cleaned = value.replace(/[^0-9\s]/g, "")
    setPhone(cleaned)
  }

  const validatePassword = (password: string): boolean => {
    // Minimum 8 characters, at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/
    return passwordRegex.test(password)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validation
      if (!fullName || !email || !phone || !password || !repeatPassword) {
        throw new Error("Please fill in all fields")
      }

      if (password !== repeatPassword) {
        throw new Error("Passwords do not match")
      }

      if (!validatePassword(password)) {
        throw new Error("Password must be at least 8 characters with at least one letter and one number")
      }

      const supabase = createClient()

      // Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone_number: phone,
            country_code: selectedCountry.dialCode,
          },
        },
      })

      if (error) {
        throw error
      }

      if (data.user) {
        // Redirect to login page (or wallet if email confirmation is disabled)
        router.push("/login?message=Account created successfully! Please log in.")
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#eff7ff] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[28vh] bg-[radial-gradient(circle_at_top,_rgba(15,99,255,0.14),transparent_45%)]" />
      <div className="relative z-10">
        <div className="fixed inset-x-0 top-0 z-20 flex items-center justify-start px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Go back"
          >
            <span className="text-xl leading-none">‹</span>
          </button>
        </div>

        <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-12">
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_80px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div className="px-8 py-10 sm:px-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
                <img
                  src="https://res.cloudinary.com/qz5m8bhg/image/upload/v1785353346/Pngtree_letter_p_icon_8622509_grhaye.png"
                  alt="Pennywise logo"
                  className="h-10 w-10 object-contain"
                />
              </div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
                PENNY<span className="text-[#0f6cff]">WISE</span>
              </p>
              <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-slate-900">Create your account</h1>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Use your details to register and secure your wallet access.
              </p>
            </div>

            <form onSubmit={handleSignup} autoComplete="off" className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => handleFullNameChange(e.target.value)}
                    placeholder="Enter your full name"
                    autoComplete="off"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="off"
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <div className="relative flex items-stretch rounded-2xl border border-slate-200 bg-white">
                    <CountrySelector
                      value={selectedCountry.code}
                      onValueChange={(countryCode) => {
                        const pickedCountry = countries.find((country) => country.code === countryCode) ?? countries[0]
                        setSelectedCountry(pickedCountry)
                      }}
                      className="flex-none w-[100px] overflow-visible"
                      triggerClassName="h-full w-full rounded-none border-none bg-transparent px-3 text-left text-sm font-medium text-slate-900 shadow-none hover:bg-slate-100"
                      panelClassName="w-full"
                    />
                    <div className="h-full w-px bg-slate-200" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="(123) 456-7890"
                      autoComplete="off"
                      className="flex-1 border-none bg-transparent px-4 py-3 text-sm text-slate-900 outline-none focus:ring-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Repeat Password</label>
                  <div className="relative">
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      data-lpignore="true"
                      data-form-type="other"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showRepeatPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-full bg-[#0f6cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:bg-[#0b57d3] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs leading-5 text-slate-500">
                Already have an account? <Link href="/login" className="font-medium text-[#0f6cff] hover:text-[#0b57d3]">Log in</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </div>
  )
}
