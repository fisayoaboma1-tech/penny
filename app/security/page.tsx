"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Shield, Lock, ChevronRight } from "lucide-react"
import { ProtectedRoute } from "../../components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { ForgotPasswordModal } from "../../components/forgot-password-modal"

export default function SecurityPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors mr-4"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-white">Security</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-800/50 rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Password & Security</h2>
              <p className="text-sm text-gray-500">Manage your account security</p>
            </div>
          </div>

          <div className="space-y-2">
            <button 
              onClick={() => setResetPasswordOpen(true)}
              className="w-full p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors px-5"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-200">Change Password</p>
                  <p className="text-xs text-gray-500">Last changed</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        </div>
      </div>

      <ForgotPasswordModal
        isOpen={resetPasswordOpen}
        onClose={() => setResetPasswordOpen(false)}
      />
    </ProtectedRoute>
  )
}
