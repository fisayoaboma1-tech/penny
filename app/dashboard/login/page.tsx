"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

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
  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in as admin
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // Check if user is admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()

        if (profile?.is_admin) {
          router.push("/dashboard")
        }
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", data.user.id)
          .maybeSingle()

        console.log("Login profile check:", { profile, profileError })

        if (profileError) {
          console.error("Profile error:", profileError)
          await supabase.auth.signOut()
          setError("Error checking admin status. Please try again.")
          setLoading(false)
          return
        }

        if (!profile?.is_admin) {
          // Not an admin, sign out and show error
          await supabase.auth.signOut()
          setError("Access denied. You do not have admin privileges.")
          setLoading(false)
          return
        }

        // Admin login successful
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative flex items-center justify-center">
      {/* Ambient glow background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a2e24] via-[#111814] to-[#0a0a0a]" />
      <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl" />
      
      <motion.div
        className="relative z-10 w-full max-w-md mx-4 px-6 py-10 rounded-3xl border border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl"
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
          <Link href="/" className="inline-block">
            <span className="text-3xl font-semibold tracking-tighter text-emerald-400">
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
            <h1 className="text-4xl font-medium text-white tracking-tight mb-2">
              Admin Login
            </h1>
            <p className="text-gray-400 text-sm font-light">
              Enter your admin credentials to access the dashboard
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin1234@gmail.com"
                className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/40 relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Logging in..." : "Login as Admin"}
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
          <p className="text-gray-400 text-sm">
            <Link href="/" className="text-emerald-400 font-medium hover:underline">
              Back to main site
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
