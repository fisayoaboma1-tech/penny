"use client"

import { motion } from "framer-motion"
import { Users, Landmark, TrendingUp, Loader2 } from "lucide-react"

interface AdminStatsCardsProps {
  loading: boolean
  totalUsers: number
  totalBalance: number
}

export function AdminStatsCards({ loading, totalUsers, totalBalance }: AdminStatsCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
    >
      <div className="rounded-xl border border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl p-6 hover:border-emerald-500/20 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-1 text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">+12%</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Users</p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-400" /> : totalUsers}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl p-6 hover:border-emerald-500/20 transition-all">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Assets</p>
          <p className="text-3xl font-bold text-white tracking-tight">
            {loading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-400" /> : `$${totalBalance.toFixed(2)}`}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
