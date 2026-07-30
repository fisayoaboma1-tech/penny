"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import {
  ArrowLeft,
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
  const addressValue = user.user_metadata?.address || "01 29 Umuola road ogbor hill abia state"
  const dobValue = user.user_metadata?.dob || "18 October 1999"

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

  const quickLinks = [
    { label: "Refer & Earn", icon: Wallet, path: "/refer" },
    { label: "Next of Kin", icon: User, path: "/next-of-kin" },
    { label: "Update Source of Income", icon: CreditCard, path: "/source-of-income" },
    { label: "Notifications", icon: Bell, path: "/notifications" },
    { label: "Help & Support", icon: HelpCircle, path: "/help" },
    { label: "Settings", icon: Lock, path: "/settings" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center gap-4">
            <button
              onClick={() => router.back()}
              className="rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Profile Details</h1>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profileImageUrl}
                alt={user.user_metadata?.full_name || user.email || "User"}
                className="h-24 w-24 rounded-full border-2 border-slate-200 object-cover"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-slate-900 p-2 text-white shadow-lg">
                <Camera className="h-4 w-4" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Good Evening!</p>
              <h2 className="text-xl font-semibold text-slate-900">
                {user.user_metadata?.full_name || user.email || "User"}
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Verify your email</p>
                <p className="text-sm text-slate-500">
                  Your email is not verified. Please verify it to secure your account and receive updates from Moniepoint.
                </p>
              </div>
            </div>
            {!emailVerified ? (
              <button
                onClick={handleSendVerification}
                className="mt-4 inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50"
              >
                Send verification email
              </button>
            ) : (
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                Your email is verified
              </div>
            )}
          </div>

          <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">KYC Level</p>
                <p className="text-xs text-slate-500">View Details</p>
              </div>
              <button
                onClick={() => router.push("/settings")}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Details
              </button>
            </div>
            <div className="mt-4 rounded-3xl bg-slate-100 p-4">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-slate-500">
                <span>Lvl 1</span>
                <span>Lvl 2</span>
                <span>Lvl 3</span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="h-3 w-full rounded-full bg-slate-200" />
                <span className="h-3 w-full rounded-full bg-slate-200" />
                <span className="h-3 w-full rounded-full bg-blue-600" />
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm text-slate-600">
              Your Account Is Fully Upgraded
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
            <button
              onClick={() => router.push("/profile/edit")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <Pen className="h-4 w-4" />
              Edit
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Phone Number</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{phoneValue}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">Verified</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Email</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{user.email}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${emailVerified ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                {emailVerified ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Address</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{addressValue}</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">Verified</span>
            </div>
            <div className="flex items-start justify-between gap-3 rounded-3xl bg-slate-50 p-4">
              <div>
                <p className="text-xs text-slate-500">Date of Birth</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{dobValue}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm"
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-medium text-slate-900">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
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
    </div>
  )
}
