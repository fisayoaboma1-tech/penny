"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import {
  Camera,
  Bell,
  Menu,
  Sun,
  Moon,
  Mail,
  Phone,
  Calendar,
  Shield,
  BadgeCheck,
  Fingerprint,
  User,
  LogOut,
} from "lucide-react"
import { useTheme } from "next-themes"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AdminProfilePage() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [adminProfile, setAdminProfile] = useState<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      setAdminProfile({
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin",
        email: user.email,
        profile_image_url:
          user.user_metadata?.avatar_url ||
          user.user_metadata?.profile_image ||
          "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png",
      })
    }
  }, [user])

  if (loading || !user) {
    return null
  }

  const phoneValue = user.user_metadata?.phone || "8827727727288"
  const displayName = user.user_metadata?.full_name || "Hello chuzzy"
  const memberSince = new Date(user.created_at || "2025-01-01").toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })
  const isVerified = Boolean(user.email_confirmed_at)

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
      <div className="pointer-events-none fixed -top-24 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl dark:bg-blue-500/5" />
      <div className="pointer-events-none fixed -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl dark:bg-indigo-500/5" />

      <div className="relative z-10 flex">
        {/* Desktop Sidebar */}
        <AdminSidebar
          isOpen={false}
          onClose={() => {}}
          adminProfile={adminProfile}
          isDesktop={true}
        />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 -ml-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Menu className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
                <div>
                  <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                    Admin Profile
                  </h1>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Manage your account settings
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => router.push("/notifications")}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Toggle theme"
                >
                  {mounted && theme === "dark" ? (
                    <Sun className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Fingerprint className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Sidebar Drawer */}
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            adminProfile={adminProfile}
            isDesktop={false}
          />

          {/* Main Content */}
          <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-5 lg:py-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-5xl"
            >
              {/* Profile Photo Section */}
              <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
                <div className="rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-5 sm:p-6 lg:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="relative">
                        <img
                          src={adminProfile?.profile_image_url}
                          alt={displayName}
                          className="h-24 w-24 sm:h-28 sm:w-28 lg:h-32 lg:w-32 rounded-2xl border-2 border-slate-200 dark:border-slate-700 object-cover shadow-sm"
                        />
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-slate-900 dark:bg-slate-700 p-2 sm:p-2.5 text-white shadow-lg border-2 border-white dark:border-slate-900 cursor-pointer hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors">
                          <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {displayName}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
                        {user.email}
                      </p>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] sm:text-xs font-medium border border-blue-100 dark:border-blue-500/20">
                          <Shield className="w-3 h-3" />
                          Administrator
                        </span>
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-xs font-medium border border-emerald-100 dark:border-emerald-500/20">
                            <BadgeCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-medium border border-slate-200 dark:border-slate-700">
                          <Calendar className="w-3 h-3" />
                          Since {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                {/* Personal Information */}
                <motion.div variants={itemVariants}>
                  <div className="h-full rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                      <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          Personal Information
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                          Update your admin profile details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Full Name */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Full Name
                            </p>
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mt-0.5 truncate">
                              {displayName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Email Address */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                            <Mail className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Email Address
                            </p>
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mt-0.5 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Phone Number */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                            <Phone className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Phone Number
                            </p>
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mt-0.5 truncate">
                              {phoneValue}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Account Information */}
                <motion.div variants={itemVariants}>
                  <div className="h-full rounded-2xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                      <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
                        <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                          Account Information
                        </h3>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                          Your account details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* Member Since */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Member Since
                            </p>
                            <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-white mt-0.5">
                              {memberSince}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Role */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                            <Shield className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Role
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium border border-blue-100 dark:border-blue-500/20">
                                <Shield className="w-3 h-3" />
                                Administrator
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Verification */}
                      <div className="rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/30 p-3.5 sm:p-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex-shrink-0">
                            <BadgeCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                              Verification
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isVerified ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-100 dark:border-emerald-500/20">
                                  <BadgeCheck className="w-3 h-3" />
                                  Verified
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium border border-amber-100 dark:border-amber-500/20">
                                  Unverified
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Logout Button */}
              <motion.div variants={itemVariants} className="mt-4 sm:mt-5 lg:mt-6">
                <button
                  onClick={handleLogout}
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3.5 sm:py-4 text-sm font-semibold text-rose-600 dark:text-rose-400 shadow-sm transition-all hover:bg-rose-50 dark:hover:bg-rose-500/5 hover:border-rose-200 dark:hover:border-rose-500/20 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}