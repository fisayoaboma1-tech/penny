"use client"

import { motion } from "framer-motion"
import { Plus, ArrowUpRight, Eye, EyeOff } from "lucide-react"
import { useUserPreferences } from "@/hooks/use-user-preferences"

const actions = [
  { label: "Fund Wallet", icon: Plus },
  { label: "Withdraw Funds", icon: ArrowUpRight },
]

export function BalanceCard({
  balance,
  onAction,
}: {
  balance: number
  onAction: (action: string) => void
}) {
  const { preferences, isLoading, updatePreference } = useUserPreferences()
  
  // If preferences are still loading, show loading state
  if (isLoading || !preferences) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#1a2e24] via-[#111814] to-[#0a0a0a] border border-[#1a1a1a]"
      >
        <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="relative mb-6">
          <p className="text-xs text-white/40 mb-1">Current balance</p>
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-bold text-white tracking-tight">
              {balance.toLocaleString("en-US")} USD
            </h2>
          </div>
          <p className="text-xs text-emerald-400/70 mt-2">Available balance</p>
        </div>
      </motion.div>
    )
  }
  
  const showBalance = !preferences.hide_balance

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-[#1a2e24] via-[#111814] to-[#0a0a0a] border border-[#1a1a1a]"
    >
      <div className="pointer-events-none absolute -top-16 -right-10 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl" />
      
      <div className="relative mb-6">
        <p className="text-xs text-white/40 mb-1">Current balance</p>
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            {showBalance ? `${balance.toLocaleString("en-US")} USD` : "••••••"}
          </h2>
          <button
            onClick={() => updatePreference("hide_balance", !preferences.hide_balance)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {showBalance ? (
              <EyeOff className="w-5 h-5 text-white/60" />
            ) : (
              <Eye className="w-5 h-5 text-white/60" />
            )}
          </button>
        </div>
        <p className="text-xs text-emerald-400/70 mt-2">Available balance</p>
      </div>

      <div className="relative flex gap-3">
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => onAction(label.toLowerCase().replace(" ", ""))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 hover:border-emerald-500/30 transition-all group"
          >
            <Icon className="w-4 h-4 text-white" />
            <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">{label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  )
}
