"use client"

import { motion } from "framer-motion"
import { Plus, ArrowUpRight, Eye, EyeOff } from "lucide-react"
import { useUserPreferences } from "@/hooks/use-user-preferences"
import { useAuth } from "@/contexts/auth-context"

export function BalanceCard({
  balance,
  onAction,
}: {
  balance: number
  onAction: (action: string) => void
}) {
  const { preferences, isLoading, updatePreference } = useUserPreferences()
  const { user, profile } = useAuth()
  const accountName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Wallet account"
  
  // If preferences are still loading, show loading state
  if (isLoading || !preferences) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-700 p-6 text-white shadow-lg"
      >
        <div className="relative mb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-300">{accountName}</p>
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-semibold tracking-tight text-white">
              ₦{balance.toLocaleString("en-US")}
            </h2>
          </div>
          <p className="mt-2 text-xs text-slate-300">Available wallet balance</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => onAction("fundwallet")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <Plus className="w-4 h-4" />
            Add money
          </button>
          <button
            onClick={() => onAction("history")}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <ArrowUpRight className="w-4 h-4" />
            History
          </button>
        </div>
      </motion.div>
    )
  }
  
  const showBalance = !preferences.hide_balance

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-sm"
    >
      <div className="relative mb-6">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">{accountName}</p>
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
            {showBalance ? `₦${balance.toLocaleString("en-US")}` : "••••••"}
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-2">Available wallet balance</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          onClick={() => onAction("fundwallet")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-800 text-white px-5 py-3 text-sm font-semibold shadow-[0_10px_30px_rgba(15,99,255,0.12)] transition hover:bg-[#0b57d3]"
        >
          <Plus className="w-4 h-4" />
          Add money
        </button>
        <button
          onClick={() => onAction("history")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
        >
          <ArrowUpRight className="w-4 h-4" />
          History
        </button>
      </div>
    </motion.div>
  )
}
