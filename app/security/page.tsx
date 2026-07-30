"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Shield, Lock, ChevronRight } from "lucide-react"
import { ProtectedRoute } from "../../components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { ForgotPasswordModal } from "../../components/forgot-password-modal"
import WalletBottomNav from "@/components/wallet-bottom-nav"

export default function SecurityPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm font-semibold text-[#0f6cff]">Loading…</div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 sm:h-20">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors mr-3 sm:mr-4"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Security</h1>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 pb-24 sm:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f6cff]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">Password & Security</h2>
                <p className="text-xs sm:text-sm text-slate-500">Manage your account security</p>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => setResetPasswordOpen(true)}
                className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-slate-50 transition-colors rounded-xl gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f6cff]" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm sm:text-base font-medium text-slate-900">Change Password</p>
                    <p className="text-xs text-slate-500 truncate">Last changed</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              </button>
            </div>
          </motion.div>
        </div>
        <WalletBottomNav />
      </div>

      <ForgotPasswordModal
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
      />
    </ProtectedRoute>
  )
}