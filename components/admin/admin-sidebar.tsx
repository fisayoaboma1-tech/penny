"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Link, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  adminProfile: any
}

export function AdminSidebar({ isOpen, onClose, adminProfile }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push("/dashboard/login")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
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
              <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">Menu</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors border border-[#252525]"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 space-y-6 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1a1a1a] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#333]">
              {/* Admin Profile */}
              <div className="flex flex-col items-center text-center pt-2">
                <div className="relative mb-3">
                  <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                    <img
                      src={adminProfile?.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"}
                      alt="Admin Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h2 className="text-lg font-bold text-white">
                  {adminProfile?.full_name || "Admin User"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {adminProfile?.email || ""}
                </p>
              </div>

              {/* Menu Items */}
              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onClose()
                    router.push("/")
                  }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] transition-all text-left group"
                >
                  <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
                    <Link className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    Back to Site
                  </span>
                </button>
              </div>

              {/* Log Out */}
              <div className="pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 transition-all text-left group"
                >
                  <span className="text-sm font-medium text-gray-400 group-hover:text-red-400 transition-colors">
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
        </>
      )}
    </AnimatePresence>
  )
}
