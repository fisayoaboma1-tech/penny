"use client"

import { motion } from "framer-motion"
import { 
  Fingerprint,
  Menu
} from "lucide-react"

interface AdminDashboardHeaderProps {
  onMenuClick: () => void
}

export function AdminDashboardHeader({ onMenuClick }: AdminDashboardHeaderProps) {
  return (
    <header className="relative z-10 border-b border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Fingerprint className="w-5 h-5 text-emerald-400" />
          <div>
            <h1 className="text-xl font-semibold text-white tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-[11px] text-gray-400 font-medium">Pennywise Management</p>
            </div>
          </div>
        </div>

        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </header>
  )
}
