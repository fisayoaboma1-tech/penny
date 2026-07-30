"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { 
  ArrowLeft, 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CreditCard,
  Bell,
  LogOut,
  ChevronRight,
  Lock,
  Globe,
  HelpCircle,
  Info,
  Pen,
  Wallet,
  Award
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

  const profileImageUrl =
    user.user_metadata?.avatar_url ||
    user.user_metadata?.profile_image ||
    "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-20">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Profile Details</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] border border-slate-200 p-6 shadow-sm"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={profileImageUrl}
                alt={user.user_metadata?.full_name || user.email || "User"}
                className="h-24 w-24 rounded-full object-cover border-2 border-slate-200"
              />
              <div className="absolute bottom-0 right-0 rounded-full bg-slate-900 p-2 text-white shadow-lg">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Good Evening!</p>
              <h2 className="text-xl font-semibold text-slate-900">
                {user.user_metadata?.full_name || user.email || "User"}
              </h2>
            </div>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-100 p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Verify your email</p>
                <p className="text-sm text-slate-500">Your email is not verified. Please verify it to secure your account and receive updates from Moniepoint</p>
              </div>
            </div>
            {!emailVerified ? (
              <button
                onClick={handleSendVerification}
                className="mt-4 inline-flex items-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm ring-1 ring-blue-100 hover:bg-blue-50 transition"
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
                <span className="h-3 w-full rounded-full bg-slate-200"></span>
                <span className="h-3 w-full rounded-full bg-slate-200"></span>
                <span className="h-3 w-full rounded-full bg-blue-600"></span>
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
          className="bg-white rounded-[32px] border border-slate-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Personal Information</h3>
            <button
              onClick={() => router.push("/profile/edit")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              <Pen className="w-4 h-4" />
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
          className="bg-white rounded-[32px] border border-slate-200 p-5 shadow-sm"
        >
          <div className="space-y-3">
            {[
              { label: "Refer & Earn", icon: Wallet, path: "/refer" },
              { label: "Next of Kin", icon: User, path: "/next-of-kin" },
              { label: "Update Source of Income", icon: CreditCard, path: "/source-of-income" },
              { label: "Notifications", icon: Bell, path: "/notifications" },
              { label: "Help & Support", icon: HelpCircle, path: "/help" },
              { label: "Settings", icon: Lock, path: "/settings" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className="flex w-full items-center justify-between rounded-3xl bg-slate-50 px-4 py-4 text-left transition hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-slate-900">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleLogout}
            className="w-full rounded-3xl bg-white border border-slate-200 px-5 py-4 text-sm font-semibold text-rose-600 shadow-sm hover:bg-slate-50 transition"
          >
            Log Out
          </button>
        </motion.div>
      </div>
    </div>
  )
}
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Account Settings</h3>
          </div>

          <button
            onClick={() => router.push("/security")}
            className="w-full p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors px-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200">Security</p>
                <p className="text-xs text-gray-500">Password & 2FA</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <button className="w-full p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors px-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200">Linked Cards</p>
                <p className="text-xs text-gray-500">Manage your cards</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => router.push("/notifications")}
            className="w-full p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors px-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200">Notifications</p>
                <p className="text-xs text-gray-500">Push, email & SMS</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={() => router.push("/language")}
            className="w-full p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors px-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-teal-500/10 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200">Language</p>
                <p className="text-xs text-gray-500">English (US)</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl divide-y divide-[#1a1a1a]"
        >
          <div className="p-5">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Support</h3>
          </div>

          <button
            onClick={() => router.push("/help")}
            className="w-full p-4 flex items-center justify-between hover:bg-[#0a0a0a] transition-colors px-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-left">
                <p className="font-medium text-gray-200">Help Center</p>
                <p className="text-xs text-gray-500">FAQs & support</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleLogout}
            className="w-full bg-[#111111] border border-[#1a1a1a] rounded-3xl p-4 flex items-center justify-center gap-3 text-red-400 font-semibold hover:bg-[#1a1a1a] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </motion.div>
      </div>
    </div>
  )
}
