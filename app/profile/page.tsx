"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import {
  Camera,
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Pen,
  User,
  Wallet,
} from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { WalletPageHeader } from "@/components/wallet/page-header"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading || !user) {
    return null
  }

  const emailVerified = Boolean(user.email && user.email_confirmed_at)
  const phoneValue = user.user_metadata?.phone || "+2349162919586"

  const handleSendVerification = () => {
    router.push("/help")
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const profileImageUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.profile_image ||
    "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"

  const currentHour = new Date().getHours()
  const greeting =
    currentHour >= 12 && currentHour <= 15
      ? "Good Afternoon"
      : currentHour >= 17 && currentHour <= 23
        ? "Good Evening"
        : "Good Morning"
  const displayName = user.user_metadata?.full_name || user.email || "User"

  const quickLinks = [
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Help & Support", icon: HelpCircle, path: "/help" },
  ]

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col bg-slate-50 text-slate-900">
      <WalletPageHeader onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28">
        <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[32px] bg-slate-50 p-5 sm:p-6"
          >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profileImageUrl}
                alt={user.user_metadata?.full_name || user.email || "User"}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-full border-2 border-slate-200 object-cover"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-slate-900 p-1.5 sm:p-2 text-white shadow-lg">
                <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs sm:text-sm uppercase tracking-[0.24em] text-slate-400">{greeting}!</p>
              <h2 className="text-lg sm:text-xl font-medium text-slate-900">
                {displayName},
              </h2>
            </div>
          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-none"
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{phoneValue}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{user.email}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[32px] border border-slate-100 bg-white p-5 shadow-none"
        >
          <div className="space-y-3">
            {quickLinks.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className="flex w-full items-center justify-between rounded-3xl bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 shrink-0" />
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleLogout}
            className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-rose-600 shadow-sm transition hover:bg-slate-50"
          >
            Log Out
          </button>
        </motion.div>
      </div>
    </main>
      <WalletBottomNav />
    </div>
  )
}