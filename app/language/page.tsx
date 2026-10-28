"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Globe, Check } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
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
        <div className="min-h-screen bg-slate-50 lg:pl-64">
          <PageHeader variant="sub" title="Language" onBack={() => router.back()} />
          <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 pb-28 sm:space-y-6 sm:px-6 sm:py-8 lg:px-10">
            <div className="rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-12">
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
      <div className="min-h-screen bg-slate-50 text-slate-900 lg:pl-64">
        {/* Header */}
        <PageHeader variant="sub" title="Language" onBack={() => router.back()} />

        <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 pb-28 sm:space-y-6 sm:px-6 sm:py-8 lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-7"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 sm:h-12 sm:w-12">
                <Globe className="h-5 w-5 text-blue-700 sm:h-6 sm:w-6" />
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
                      ? "border border-blue-200 bg-blue-50"
                      : "border border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm sm:text-base font-medium text-slate-900">{language.name}</span>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="h-4 w-4 shrink-0 text-blue-700 sm:h-5 sm:w-5" />
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
