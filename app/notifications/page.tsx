"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, Smartphone, Mail, MessageSquare, Check } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import { ProtectedRoute } from "../../components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { useUserPreferences } from "../../hooks/use-user-preferences"
import WalletBottomNav from "@/components/wallet-bottom-nav"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { preferences, isLoading, updatePreference } = useUserPreferences()
  
  const pushEnabled = preferences?.push_notifications ?? true
  const emailEnabled = preferences?.email_notifications ?? true
  const smsEnabled = preferences?.sms_notifications ?? false

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm font-semibold text-[#0f6cff]">Loading…</div>
      </div>
    )
  }

  // Show loading state while preferences are being fetched
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-slate-50">
          <PageHeader variant="sub" title="Notifications" onBack={() => router.back()} />
          <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 pb-24 sm:pb-8">
            <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm">
              <div className="text-slate-500 text-base sm:text-lg">Loading preferences...</div>
            </div>
        </div>
        <WalletBottomNav />
      </div>
    </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <PageHeader variant="sub" title="Notifications" onBack={() => router.back()} />

        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 pb-24 sm:pb-8">
          {/* No Notifications Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-sm"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Bell className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1 sm:mb-2">No notifications</h2>
            <p className="text-xs sm:text-sm text-slate-500">You're all caught up! Check back later for updates.</p>
          </motion.div>

          {/* Notification Preferences */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f6cff]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">Notification Preferences</h2>
                <p className="text-xs sm:text-sm text-slate-500">Manage how you receive notifications</p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f6cff]" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm sm:text-base font-medium text-slate-900 truncate">Push Notifications</p>
                    <p className="text-xs text-slate-500 truncate">Receive notifications on your device</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference("push_notifications", !pushEnabled)}
                  disabled={isLoading}
                  className="relative w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-colors disabled:opacity-50 shrink-0"
                  style={{ backgroundColor: pushEnabled ? "#10b981" : "#cbd5e1" }}
                >
                  <div
                    className="absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                    style={{ left: pushEnabled ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f6cff]" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm sm:text-base font-medium text-slate-900 truncate">Email Notifications</p>
                    <p className="text-xs text-slate-500 truncate">Receive updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference("email_notifications", !emailEnabled)}
                  disabled={isLoading}
                  className="relative w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-colors disabled:opacity-50 shrink-0"
                  style={{ backgroundColor: emailEnabled ? "#10b981" : "#cbd5e1" }}
                >
                  <div
                    className="absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                    style={{ left: emailEnabled ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm sm:text-base font-medium text-slate-900 truncate">SMS Notifications</p>
                    <p className="text-xs text-slate-500 truncate">Receive text message alerts</p>
                  </div>
                </div>
                <button
                  onClick={() => updatePreference("sms_notifications", !smsEnabled)}
                  disabled={isLoading}
                  className="relative w-11 h-5 sm:w-12 sm:h-6 rounded-full transition-colors disabled:opacity-50 shrink-0"
                  style={{ backgroundColor: smsEnabled ? "#10b981" : "#cbd5e1" }}
                >
                  <div
                    className="absolute top-0.5 sm:top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm"
                    style={{ left: smsEnabled ? "calc(100% - 18px)" : "2px" }}
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        <WalletBottomNav />
      </div>
    </ProtectedRoute>
  )
}
