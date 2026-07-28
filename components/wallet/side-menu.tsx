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
  const defaultImage = "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"
  const imageUrl = profileImageUrl || defaultImage
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
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                    <img
                      src={imageUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={onImageClick}
                    className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0a0a0a] flex items-center justify-center hover:bg-emerald-400 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </button>
                </div>
                <h2 className="text-lg font-bold text-white">{userName}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
                    Premium Member
                  </span>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-[10px] font-medium text-blue-400 border border-blue-500/20">
                    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-blue-400" aria-hidden="true">
                      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.67-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.54-3.54 1.06-1.06 2.48 2.48 5.48-5.48 1.06 1.06-6.54 6.54z"/>
                    </svg>
                    Verified Account
                  </div>
                </div>
              </div>

              {/* Menu sections */}
              {menuSections.map((section) => (
                <div key={section.label}>
                  <p className="text-[10px] font-semibold text-gray-600 tracking-wider uppercase mb-2 px-1">
                    {section.label}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleNavigate(item.path)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] transition-all text-left group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
                          <item.icon className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-gray-600">{item.sub}</p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-400 transition-colors shrink-0" />
                      </button>
                    ))}
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
