"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Eye, EyeOff } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ForgotPasswordModal } from "@/components/forgot-password-modal"

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

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      const supabase = createClient()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      if (data.user) {
        router.push("/wallet")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
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
            <ChevronLeft className="h-5 w-5" />
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
              <h1 className="mt-4 text-2xl sm:text-3xl font-semibold text-slate-900">Login to your wallet</h1>
              <p className="mt-3 text-xs leading-5 text-slate-400">
                Use your email address and password to access your wallet.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">Password</label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-sm font-medium text-[#0f6cff] hover:text-[#0b57d3]"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
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

              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-full bg-[#0f6cff] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:bg-[#0b57d3] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-8 py-6 text-center">
            <div className="mb-4">
              <Link href="/signup" className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50">
                Create an account
              </Link>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              By clicking on “Create Profile”, you agree to Moniepoint’s{' '}
              <Link href="/terms" className="font-medium text-[#0f6cff] hover:text-[#0b57d3]">Terms and Conditions</Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-[#0f6cff] hover:text-[#0b57d3]">Privacy Policy</Link>.
            </p>
          </div>
        </motion.div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  </div>
  )
}
