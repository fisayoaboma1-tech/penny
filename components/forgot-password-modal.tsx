"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, Mail, CheckCircle } from "lucide-react"
import { createClient } from "../lib/supabase/client"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email) {
        throw new Error("Please enter your email address")
      }

      const supabase = createClient()

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login?reset=true`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Failed to send reset email")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed top-[50%] left-[50%] z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative mx-4 rounded-2xl border border-[#1a1a1a] bg-[#111111]/95 backdrop-blur-xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>

                {/* Title and description */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-medium text-white tracking-tight">
                    Reset your password
                  </h2>
                  <p className="text-gray-400 text-sm font-light">
                    Enter your email address and we'll send you a reset code
                  </p>
                </div>

                 {/* Form */}
                 {!success ? (
                   <form onSubmit={handleSubmit} className="space-y-5">
                     <div className="space-y-2">
                       <Label className="text-gray-300 text-sm font-medium">
                         Email
                       </Label>
                       <Input
                         type="email"
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         placeholder="mail@gmail.com"
                         className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all"
                       />
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

                     <Button
                       type="submit"
                       disabled={loading}
                       className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/60 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       {loading ? "Sending..." : "Send Reset Link"}
                     </Button>
                   </form>
                 ) : (
                   <motion.div
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="text-center space-y-4"
                   >
                     <div className="flex justify-center">
                       <CheckCircle className="w-16 h-16 text-emerald-400" />
                     </div>
                     <h3 className="text-xl font-medium text-white">Check your email</h3>
                     <p className="text-gray-400 text-sm">
                       We've sent a password reset link to <span className="text-emerald-400">{email}</span>
                     </p>
                   </motion.div>
                 )}

                {/* Back to login */}
                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="text-emerald-400 text-sm font-medium hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
