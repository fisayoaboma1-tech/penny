"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Globe, Check } from "lucide-react"
import { ProtectedRoute } from "../../components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { useUserPreferences } from "../../hooks/use-user-preferences"
import WalletBottomNav from "@/components/wallet-bottom-nav"

const languages = [
  { code: "en", name: "English (US)" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "zh", name: "Chinese (Simplified)" },
]

export default function LanguagePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { preferences, isLoading, updatePreference } = useUserPreferences()
  const selectedLanguage = preferences?.preferred_language ?? "en"

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
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-16 sm:h-20">
                <button
                  onClick={() => router.back()}
                  className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors mr-3 sm:mr-4"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-500" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">Language</h1>
              </div>
            </div>
          </div>
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
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16 sm:h-20">
              <button
                onClick={() => router.back()}
                className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors mr-3 sm:mr-4"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Language</h1>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-teal-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">Select Language</h2>
                <p className="text-xs sm:text-sm text-slate-500">Choose your preferred language</p>
              </div>
            </div>

            <div className="space-y-2">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => updatePreference("preferred_language", language.code)}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors disabled:opacity-50 ${
                    selectedLanguage === language.code
                      ? "bg-teal-500/10 border border-teal-500/30"
                      : "bg-slate-50 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm sm:text-base font-medium text-slate-900">{language.name}</span>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
        <WalletBottomNav />
      </div>
    </ProtectedRoute>
  )
}
