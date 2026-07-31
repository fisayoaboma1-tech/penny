"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  X,
  LayoutDashboard,
  Settings,
  Shield,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  Fingerprint,
} from "lucide-react"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  adminProfile: any
  isDesktop?: boolean
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Settings, label: "Account Settings", href: "/dashboard/settings" },
]

export function AdminSidebar({ isOpen, onClose, adminProfile, isDesktop = false }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push("/dashboard/login")
  }

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full relative">
      {!collapsed && (
        <>
          <div className="pointer-events-none absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="pointer-events-none absolute top-60 -left-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl" />
        </>
      )}

      {/* Logo / Brand */}
      <div className={`relative z-10 flex items-center justify-between ${collapsed ? 'px-3' : 'px-4'} pt-5 pb-3`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <Fingerprint className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden transition-all duration-300">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">Pennywise</h2>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5 whitespace-nowrap">Admin Panel</p>
            </div>
          )}
        </div>
        {isDesktop && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 flex-shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-3 h-3 text-slate-500 dark:text-slate-400 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        )}
      </div>
      {!isDesktop && (
        <div className="relative z-10 flex justify-end px-4 -mt-10">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>
        </div>
      )}

      {/* Admin Profile */}
      <div className="relative z-10 px-4 mb-3">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} p-2 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50`}>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-blue-500/20 dark:ring-blue-400/20 flex-shrink-0">
            <img
              src={adminProfile?.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"}
              alt="Admin"
              className="w-full h-full object-cover"
            />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                {adminProfile?.full_name || "Admin User"}
              </p>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                {adminProfile?.email || "admin@example.com"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 space-y-0.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {!collapsed && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-3 pb-1.5 pt-1">
            Main Menu
          </p>
        )}
        {navItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => {
                router.push(item.href)
                if (!isDesktop) onClose()
              }}
              className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 text-blue-700 dark:text-blue-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
              title={collapsed ? item.label : undefined}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className={`relative z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                active
                  ? "bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-300"
                  : "bg-transparent text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              {!collapsed && (
                <span className="relative z-10">{item.label}</span>
              )}
              {active && !collapsed && (
                <span className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
              )}
            </button>
          )
        })}

        <div className="border-t border-slate-200 dark:border-slate-700/50 my-2" />

        {!collapsed && (
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-3 pb-1.5 pt-1">
            Preferences
          </p>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 transition-all duration-200 group`}
          title={collapsed ? (mounted && theme === "dark" ? "Light Mode" : "Dark Mode") : undefined}
        >
          <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
            {mounted && theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </div>
          {!collapsed && (
            <span className="whitespace-nowrap">{mounted && theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>
      </div>

      {/* Logout & Footer */}
      <div className="relative z-10 px-3 pb-4 space-y-2">
        <div className="border-t border-slate-200 dark:border-slate-700/50 pt-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-2.5'} px-3 py-2 rounded-xl text-sm font-medium text-slate-500 dark:text-slate-500 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 group`}
            title={collapsed ? "Log Out" : undefined}
          >
            <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            {!collapsed && (
              <span>Log Out</span>
            )}
          </button>
        </div>
        {!collapsed && (
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[9px] text-slate-400 dark:text-slate-600">Pennywise LTD</span>
            <span className="text-[9px] text-slate-300 dark:text-slate-600">•</span>
            <span className="text-[9px] text-slate-400 dark:text-slate-600">Secured</span>
          </div>
        )}
      </div>
    </div>
  )

  // Desktop sidebar - always visible on left
  if (isDesktop) {
    return (
      <aside className={`hidden lg:flex flex-col h-screen sticky top-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${collapsed ? 'w-[72px] min-w-[72px]' : 'w-60 min-w-[15rem]'}`}>
        {sidebarContent}
      </aside>
    )
  }

  // Mobile sidebar - drawer from LEFT
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 z-40 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/60 dark:shadow-black/60 flex flex-col"
          >
            {sidebarContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}