"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Camera, Mail, Phone, Calendar, User, Fingerprint, Save, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default function AccountSettings() {
  const router = useRouter()
  const supabase = createClient("admin")
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  })

  const fetchAdminProfile = async () => {
    try {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        if (data) {
          setAdminProfile(data)
          setFormData({
            full_name: data.full_name || "",
            email: data.email || user.email || "",
            phone_number: data.phone_number || "",
          })
        } else {
          router.replace("/dashboard/login")
          return
        }
      } else {
        router.replace("/dashboard/login")
        return
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error)
      router.replace("/dashboard/login")
      return
    } finally {
      setLoading(false)
    }
  }

  const checkAdminAccess = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      const userId = session?.user?.id

      if (sessionError || !session?.access_token || !userId) {
        router.replace("/dashboard/login")
        setAuthorized(false)
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single()

      if (error || !profile?.is_admin) {
        setAuthorized(false)
        router.replace("/dashboard/login")
        return
      }

      setAuthorized(true)
    } catch (error) {
      console.error("Admin auth check failed:", error)
      setAuthorized(false)
      router.replace("/dashboard/login")
    }
  }

  useEffect(() => {
    checkAdminAccess()
  }, [supabase])

  useEffect(() => {
    if (authorized) {
      fetchAdminProfile()
    }
  }, [authorized, supabase])

  if (authorized === null) {
    return null
  }

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const inputClasses = "w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:focus:border-blue-400"

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
      <div className="pointer-events-none fixed -top-24 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl dark:bg-blue-500/5" />
      <div className="pointer-events-none fixed -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl dark:bg-indigo-500/5" />

      <div className="relative z-10 flex">
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
                  <Fingerprint className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
                <div>
                  <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">Manage your admin profile</p>
                </div>
              </div>
            </div>
          </header>

          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            adminProfile={adminProfile}
            isDesktop={false}
          />

          <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-[minmax(280px,320px)_1fr]">
                  <div className="space-y-4">
                    {/* Profile Photo Section */}
                    <div className="rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm p-4 sm:p-5">
                      <div className="flex items-center gap-4 sm:gap-5">
                        <div className="relative">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-blue-500/20 dark:ring-blue-400/20">
                            <img
                              src={adminProfile?.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"}
                              alt="Admin"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg transition-colors border-2 border-white dark:border-slate-900">
                            <Camera className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Profile Photo</h3>
                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click the camera icon to update your photo</p>
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-700/50">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Account Information</h2>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Your account details</p>
                      </div>
                      <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-slate-50 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Member Since</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-slate-900 dark:text-white">January 2025</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <Fingerprint className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Role</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Administrator</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Verification</span>
                          </div>
                          <span className="text-xs sm:text-sm font-medium text-emerald-600 dark:text-emerald-400">Verified</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Personal Information */}
                    <div className="rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-700/50">
                        <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Update your admin profile details</p>
                      </div>
                      <div className="p-4 sm:p-5 space-y-3 sm:space-y-4">
                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                            <User className="w-3 h-3" />
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className={inputClasses}
                            placeholder="Enter your full name"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                            <Mail className="w-3 h-3" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={inputClasses}
                            placeholder="Enter your email"
                            autoComplete="off"
                            autoCapitalize="none"
                            autoCorrect="off"
                            spellCheck={false}
                            data-lpignore="true"
                            data-form-type="other"
                          />
                        </div>

                        <div>
                          <label className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
                            <Phone className="w-3 h-3" />
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            className={inputClasses}
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => router.push("/dashboard")}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                      >
                        {saving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        {saving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}