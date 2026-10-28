"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import {
  User,
  LogOut,
  X,
  ChevronRight,
  Settings,
  Shield,
  Bell,
  Globe,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  ArrowUpRight,
  Camera,
} from "lucide-react"
import { UserAvatar } from "@/components/wallet/user-avatar"

export function SideMenu({
  isOpen,
  onClose,
  userName,
  balance,
  onLogout,
  profileImageUrl,
  onImageClick,
}: {
  isOpen: boolean
  onClose: () => void
  userName: string
  balance: number
  onLogout: () => void
  profileImageUrl?: string
  onImageClick?: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  const menuSections = [
    {
      label: "Account Settings",
      items: [
        { label: "Security", sub: "Password & 2FA", icon: Shield, path: "/security" },
        { label: "Notifications", sub: "Push, email & SMS", icon: Bell, path: "/notifications" },
        { label: "Language", sub: "English (US)", icon: Globe, path: "/language" },
      ],
    },
    {
      label: "Support",
      items: [
        { label: "Help Center", sub: "FAQs & support", icon: HelpCircle, path: "/help" },
      ],
    },
  ]
  

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 300 }}
            className="fixed top-0 right-0 z-40 h-screen w-80 bg-[#0a0a0a] border-l border-[#1a1a1a] shadow-2xl shadow-black/60 flex flex-col"
          >
            {/* Decorative elements */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute top-32 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />

            {/* Close button */}
            <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4">
              <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">Profile</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors border border-[#252525]"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 space-y-6 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1a1a1a] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#333]">
              {/* Profile header */}
              <div className="flex flex-col items-center text-center pt-2">
                <div className="relative mb-3">
                  <UserAvatar imageUrl={profileImageUrl} name={userName} className="h-20 w-20 shadow-lg ring-2 ring-emerald-500/30" />
                  <button
                    onClick={onImageClick}
                    className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0a0a0a] flex items-center justify-center hover:bg-emerald-400 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <h2 className="text-lg font-bold text-white">{userName}</h2>
                <p className="mt-1 text-xs text-gray-500">{userName}</p>
              </div>

              {/* Menu sections */}
              {menuSections.map((section) => (
                <div key={section.label}>
                  <p className="text-[10px] font-semibold text-gray-600 tracking-wider uppercase mb-2 px-1">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon
                        return (
                        <button
                          key={item.label}
                          onClick={() => handleNavigate(item.path)}
                          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] transition-all text-left group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
                            <Icon className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-gray-600">{item.sub}</p>
                          </div>
                          <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Log Out */}
              <div className="pt-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
                    <LogOut className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                    Log Out
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-1.5 pt-2">
                <span className="text-[10px] text-gray-600">Pennywise LTD</span>
                <span className="text-[10px] text-gray-700">•</span>
                <span className="text-[10px] text-gray-600">Secured</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}