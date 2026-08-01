"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAdminAuth } from "@/contexts/admin-auth-context"

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

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { signOut } = useAdminAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password")
      }

      const supabase = createClient("admin")
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error || !data.user) {
        throw error || new Error("Login failed")
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.user.id)
        .single()

      if (profileError || !profile?.is_admin) {
        await supabase.auth.signOut()
        throw new Error("Only admin accounts can log in here. Use the normal user login page.")
      }

      // Force a hard refresh to ensure clean state
      window.location.href = "/dashboard"
    } catch (err: any) {
      setError(err.message || "Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden relative flex items-center justify-center px-4 py-10">
      {/* Ambient glow background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-slate-100" />
      <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 bg-[#0f6cff]/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#0f6cff]">Admin Access</p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 sm:text-left">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your admin account to access the protected dashboard.
          </p>
        </div>

        <motion.div
          className="w-full mx-auto px-6 py-8 sm:px-8 sm:py-10 rounded-3xl border border-slate-200 bg-white/90 shadow-[0_20px_60px_-24px_rgba(15,108,255,0.35)] backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={0}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-slate-900">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0f6cff] ring-1 ring-blue-100">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <span className="text-2xl font-semibold tracking-tighter text-slate-900">
                Pennywise
              </span>
            </Link>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <p className="text-sm text-slate-500">Enter your admin credentials to continue.</p>
            </motion.div>

            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="space-y-5"
            >
              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium block">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pennywise.com"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  className="w-full px-4 py-3 appearance-none bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-normal focus:outline-none focus:border-[#0f6cff]/30 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-700 text-sm font-medium block">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 appearance-none bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm font-normal focus:outline-none focus:border-[#0f6cff]/30 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-100 text-red-500 px-4 py-3 rounded-xl text-sm"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#0f6cff] to-[#4da3ff] text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-blue-200 relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Opening dashboard..." : "Open Admin Dashboard"}
                </span>
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={3}
            className="mt-6 text-center"
          >
            <p className="text-slate-500 text-sm">
              <Link href="/" className="text-[#0f6cff] font-medium hover:underline">
                Back to main site
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
