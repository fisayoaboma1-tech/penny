"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"
import { Eye, EyeOff, Search, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { countries } from "@/lib/countries"

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
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
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
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative flex items-center justify-center">
      {/* Ambient glow background, matching wallet hero card */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a2e24] via-[#111814] to-[#0a0a0a]" />
      <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-24 right-24 text-emerald-200/40 text-2xl">✦</div>
      <div className="pointer-events-none absolute top-40 right-40 text-emerald-200/20 text-lg">✦</div>

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
          className="mb-6"
        >
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </motion.div>

        <form onSubmit={handleSignup} autoComplete="off" className="space-y-6">
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={1}
          >
            <h1 className="text-4xl font-medium text-white tracking-tight mb-2">
              Open an account
            </h1>
            <p className="text-gray-400 text-sm font-light mb-6">
              Open an account with us and start your journey to financial freedom.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            custom={2}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => handleFullNameChange(e.target.value)}
                placeholder="Enter your full name"
                autoComplete="off"
                className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="off"
                data-lpignore="true"
                data-form-type="other"
                className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Phone Number</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCountryOpen(!isCountryOpen)}
                  className="flex items-center gap-2 px-3 py-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white text-sm font-normal hover:bg-emerald-500/10 transition-all min-w-[100px]"
                >
                  <span>{selectedCountry.flag}</span>
                  <span className="text-gray-300">{selectedCountry.dialCode}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-auto" />
                </button>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="(123) 456-7890"
                  autoComplete="off"
                  className="w-40 px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all"
                />
              </div>

              {/* Country Selector Dropdown */}
              {isCountryOpen && (
                <div className="relative mt-2">
                  <div className="bg-[#111111] border border-emerald-500/20 rounded-xl shadow-xl max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-emerald-500/10">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search countries..."
                          className="w-full pl-9 pr-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-emerald-500/30 transition-all"
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto max-h-48">
                      {countries
                        .filter((country) => 
                          country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                          country.code.toLowerCase().includes(countrySearch.toLowerCase())
                        )
                        .map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry({
                                code: country.code,
                                name: country.name,
                                flag: country.flag || "🌍",
                                dialCode: country.dialCode || "+1"
                              })
                              setIsCountryOpen(false)
                              setCountrySearch("")
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-emerald-500/10 transition-colors text-left"
                          >
                            <span className="text-lg">{country.flag || "🌍"}</span>
                            <span className="text-sm text-gray-300 flex-1">{country.name}</span>
                            <span className="text-sm text-gray-500">{country.dialCode || "+1"}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Password</label>
              <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="other"
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

            <div className="space-y-2">
              <label className="text-gray-300 text-sm font-medium block">Repeat Password</label>
              <div className="relative">
                  <input
                    type={showRepeatPassword ? "text" : "password"}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-form-type="other"
                    className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all pr-12"
                  />
                <button
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showRepeatPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/40 relative overflow-hidden flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">{loading ? "Creating Account..." : "Register"}</span>
            </motion.button>
          </motion.div>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          custom={3}
          className="mt-6 text-center"
        >
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-emerald-400 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
