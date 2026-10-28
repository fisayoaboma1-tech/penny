"use client"

import { motion } from "framer-motion"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"
import { ChevronLeft, Fingerprint, LayoutDashboard, LogOut, Settings, X } from "lucide-react"
import { useAdminAuth } from "@/contexts/admin-auth-context"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  adminProfile: any
  isDesktop?: boolean
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin-template", hint: "Overview" },
  { icon: Settings, label: "Account Settings", href: "/admin-template/settings", hint: "Security" },
]

export function AdminSidebar({ isOpen, onClose, adminProfile, isDesktop = false }: AdminSidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { signOut } = useAdminAuth()
  const [collapsed, setCollapsed] = useState(false)

  const isActive = (href: string) => {
    if (href === "/admin-template") return pathname === "/admin-template"
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/admin-template/login")
  }

  const sidebarBody = (
    <div className="relative flex h-full flex-col bg-[radial-gradient(circle_at_top_left,rgba(96,165,250,0.14),transparent_28%),linear-gradient(180deg,#0f172a_0%,#0b1120_100%)] text-slate-100">
      <div className="absolute left-6 top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute right-4 top-40 h-28 w-28 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between px-4 pb-3 pt-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-cyan-400 shadow-[0_12px_30px_rgba(59,130,246,0.35)]">
            <Fingerprint className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">Pennywise</h2>
              <p className="-mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Admin panel</p>
            </div>
          )}
        </div>

        {isDesktop && (
          <button onClick={() => setCollapsed((current) => !current)} className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/80 text-slate-300 transition hover:border-blue-400/40 hover:text-white" title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {!isDesktop && (
        <div className="relative z-10 flex justify-end px-4 -mt-8">
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/90 text-slate-300">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <div className="relative z-10 px-4 pb-4">
        <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} rounded-2xl border border-slate-700/80 bg-white/[0.04] p-2.5`}>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-blue-400/30">
            <img src={adminProfile?.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"} alt="Admin" className="h-full w-full object-cover" />
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold text-white">{adminProfile?.full_name || "Admin User"}</p>
                <span className="saas-badge badge-live">Live</span>
              </div>
              <p className="truncate text-[10px] text-slate-400">{adminProfile?.email || "admin@example.com"}</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto px-3 pb-4">
        {!collapsed && <p className="px-3 pb-2 pt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Main menu</p>}
        <div className="space-y-1.5">
          {navItems.map((item) => {
            const active = isActive(item.href)
            const Icon = item.icon
            return (
              <button key={item.href} onClick={() => { router.push(item.href); if (!isDesktop) onClose() }} className={`group relative flex w-full items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-2xl px-3 py-2.5 text-sm font-medium transition-all ${active ? "bg-gradient-to-r from-blue-500/18 to-indigo-500/18 text-white" : "text-slate-300 hover:bg-white/[0.04] hover:text-white"}`}>
                {active && <motion.div layoutId="admin-sidebar-active" className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/18 to-indigo-500/18" transition={{ type: "spring", stiffness: 320, damping: 30 }} />}
                <div className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-xl border ${active ? "border-blue-400/30 bg-blue-500/10 text-blue-200" : "border-slate-700 bg-slate-900/50 text-slate-400 group-hover:border-slate-600 group-hover:text-slate-200"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {!collapsed && (
                  <div className="relative z-10 flex flex-1 items-center justify-between gap-2">
                    <span className="truncate">{item.label}</span>
                    <span className="rounded-full border border-slate-700 bg-slate-900/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-slate-400">{item.hint}</span>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="my-3 border-t border-slate-700/60" />

        <button onClick={handleLogout} className={`mt-2 group flex w-full items-center ${collapsed ? "justify-center" : "gap-2.5"} rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white`}>
          <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/50 text-slate-300">
            <LogOut className="h-4 w-4" />
          </div>
          {!collapsed && <span className="relative z-10">Log out</span>}
        </button>
      </div>
    </div>
  )

  if (!isDesktop) {
    return (
      <>
        {isOpen && <div className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm" onClick={onClose} />}
        <div className={`fixed left-0 top-0 z-40 h-screen w-[min(88vw,320px)] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
          {sidebarBody}
        </div>
      </>
    )
  }

  return (
    <aside className={`hidden shrink-0 border-r border-slate-200/80 bg-slate-950 lg:block dark:border-slate-800 ${collapsed ? "w-[88px]" : "w-[280px]"}`}>
      {sidebarBody}
    </aside>
  )
}
