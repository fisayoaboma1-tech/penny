"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
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
  User,
  Wallet,
  Award
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn")
    if (!loggedIn) {
      router.push("/login")
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  if (!isLoggedIn) {
    return null
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-white">Profile</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-8"
        >
          <div className="flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-5">
              <img
                src="https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"
                alt="Ali Husni"
                className="w-28 h-28 rounded-full object-cover border-2 border-emerald-500/30 shadow-xl shadow-emerald-950/40"
              />
              <button className="absolute bottom-1 right-1 bg-emerald-500 text-white p-2.5 rounded-full hover:bg-emerald-600 transition-colors shadow-lg">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h2 className="text-2xl font-bold text-white">Ali Husni</h2>
            <div className="flex items-center gap-2 mt-1">
              <Award className="w-4 h-4 text-emerald-400" />
              <p className="text-sm text-emerald-400 font-medium">Premium Member</p>
            </div>
            
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 mt-4 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Verified Account</span>
            </div>
          </div>

          {/* Account Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">$82.7k</p>
              <p className="text-xs text-gray-500 mt-1">Balance</p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-xs text-gray-500 mt-1">Cards</p>
            </div>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-white">24</p>
              <p className="text-xs text-gray-500 mt-1">Transactions</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-4 p-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-300">admin@gmail.com</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-300">+1 (555) 123-4567</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium text-gray-300">New York, USA</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl">
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Member Since</p>
                <p className="font-medium text-gray-300">January 2024</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl divide-y divide-[#1a1a1a]"
        >
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
