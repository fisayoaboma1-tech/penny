"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Bell, Smartphone, Mail, MessageSquare, Check } from "lucide-react"
import { ProtectedRoute } from "./route-protection"
import { useAuth } from "@/contexts/auth-context"
import { useUserPreferences } from "../hooks/use-user-preferences"

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { preferences, isLoading, updatePreference } = useUserPreferences()
  
  const pushEnabled = preferences?.push_notifications ?? true
  const emailEnabled = preferences?.email_notifications ?? true
  const smsEnabled = preferences?.sms_notifications ?? false

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
                <h1 className="text-xl font-bold text-white">Notifications</h1>
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
            <h1 className="text-xl font-bold text-white">Notifications</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* No Notifications Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-12 text-center"
        >
          <div className="w-16 h-16 bg-gray-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No notifications</h2>
          <p className="text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Notification Preferences</h2>
              <p className="text-sm text-gray-500">Manage how you receive notifications</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Push Notifications */}
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-200">Push Notifications</p>
                  <p className="text-xs text-gray-500">Receive notifications on your device</p>
                </div>
              </div>
              <button
                onClick={() => updatePreference("push_notifications", !pushEnabled)}
                disabled={isLoading}
                className="relative w-12 h-6 rounded-full transition-colors disabled:opacity-50"
                style={{ backgroundColor: pushEnabled ? "#10b981" : "#374151" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{ left: pushEnabled ? "26px" : "6px" }}
                />
              </button>
            </div>

            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-200">Email Notifications</p>
                  <p className="text-xs text-gray-500">Receive updates via email</p>
                </div>
              </div>
              <button
                onClick={() => updatePreference("email_notifications", !emailEnabled)}
                disabled={isLoading}
                className="relative w-12 h-6 rounded-full transition-colors disabled:opacity-50"
                style={{ backgroundColor: emailEnabled ? "#10b981" : "#374151" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{ left: emailEnabled ? "26px" : "6px" }}
                />
              </button>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-200">SMS Notifications</p>
                  <p className="text-xs text-gray-500">Receive text message alerts</p>
                </div>
              </div>
              <button
                onClick={() => updatePreference("sms_notifications", !smsEnabled)}
                disabled={isLoading}
                className="relative w-12 h-6 rounded-full transition-colors disabled:opacity-50"
                style={{ backgroundColor: smsEnabled ? "#10b981" : "#374151" }}
              >
                <div
                  className="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform"
                  style={{ left: smsEnabled ? "26px" : "6px" }}
                />
              </button>
            </div>
          </div>
        </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
