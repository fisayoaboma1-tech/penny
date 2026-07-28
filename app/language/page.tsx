"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Globe, Check } from "lucide-react"
import { ProtectedRoute } from "./route-protection"
import { useAuth } from "@/contexts/auth-context"
import { useUserPreferences } from "../hooks/use-user-preferences"

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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  // Show loading state while preferences are being fetched
  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#0a0a0a]">
          <div className="bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center h-20">
                <button
                  onClick={() => router.back()}
                  className="p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors mr-4"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </button>
                <h1 className="text-xl font-bold text-white">Language</h1>
              </div>
            </div>
          </div>
          <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            <div className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-12 text-center">
              <div className="text-white text-lg">Loading preferences...</div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
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
            <h1 className="text-xl font-bold text-white">Language</h1>
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
            <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Select Language</h2>
              <p className="text-sm text-gray-500">Choose your preferred language</p>
            </div>
          </div>

          <div className="space-y-2">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => updatePreference("preferred_language", language.code)}
                disabled={isLoading}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-colors disabled:opacity-50 ${
                  selectedLanguage === language.code
                    ? "bg-teal-500/10 border border-teal-500/30"
                    : "bg-[#0a0a0a] border border-[#1a1a1a] hover:bg-[#1a1a1a]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-200">{language.name}</span>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="w-5 h-5 text-teal-400" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
