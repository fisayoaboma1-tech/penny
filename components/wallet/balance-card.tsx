"use client"

import { motion } from "framer-motion"
import { Plus, ArrowUpRight, Eye, EyeOff } from "lucide-react"
import { useUserPreferences } from "@/hooks/use-user-preferences"

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
        className="relative overflow-hidden rounded-3xl p-6 bg-white shadow-sm"
      >
        <div className="relative mb-6">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">9162919586 | Chukwudi Enoch</p>
          <div className="flex items-center gap-2">
            <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
              ₦{balance.toLocaleString("en-US")}
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-2">Last updated just now</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
          >
            <Plus className="w-4 h-4" />
            Add money
          </button>
          <button
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
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-2">9162919586 | Chukwudi Enoch</p>
        <div className="flex items-center gap-2">
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tight">
            {showBalance ? `₦${balance.toLocaleString("en-US")}` : "••••••"}
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-2">Last updated just now</p>
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
