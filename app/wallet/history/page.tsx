"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDown, X, ChevronDown } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { createClient } from "@/lib/supabase/client"
import { formatWalletAmount, getTransactionTimeLabel, getWalletTransactionBadge, getWalletTransactionIcon, type WalletTransaction, type WalletTransactionType } from "@/lib/wallet/transactions"

type TransactionType = WalletTransactionType

const typeColors: Record<TransactionType, string> = {
  debit: "bg-rose-50 text-rose-700",
  credit: "bg-emerald-50 text-emerald-700",
  transfer: "bg-[#eef5ff] text-[#0f6cff]",
}

export default function TransactionHistoryPage() {
  const router = useRouter()
  const supabase = createClient()
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)
  const [sortBy, setSortBy] = useState<"day" | "week" | "month">("day")

  useEffect(() => {
    const fetchTransactions = async () => {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      if (authError || !authUser?.id) return

      const { data, error } = await supabase
        .from("wallet_transactions")
        .select("id, user_id, type, amount, title, subtitle, detail_title, detail_description, detail_footer, created_at")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Failed to load wallet transactions:", error)
        return
      }

      const mapped = (data ?? []).map((tx: any) => {
        const type = tx.type as WalletTransactionType
        const amount = Number(tx.amount) || 0

        return {
          id: tx.id,
          title: tx.title,
          subtitle: tx.subtitle || "Transaction processing",
          amount: formatWalletAmount(type, amount),
          type,
          time: getTransactionTimeLabel(tx.created_at),
          icon: getWalletTransactionIcon(type),
          badgeLabel: getWalletTransactionBadge(type),
          detailTitle: tx.detail_title,
          detailDescription: tx.detail_description,
          detailFooter: tx.detail_footer,
          createdAt: tx.created_at,
        } as WalletTransaction
      })

      setTransactions(mapped)
    }

    void fetchTransactions()
  }, [supabase])

  const todayTransactions = transactions.filter((tx) => tx.time === "Today")
  const yesterdayTransactions = transactions.filter((tx) => tx.time === "Yesterday")

  const renderTransaction = (tx: WalletTransaction) => {
    const Icon = tx.icon === "up" ? ArrowUpRight : ArrowDown
    const iconColor = tx.type === "credit" ? "text-emerald-600" : tx.type === "debit" ? "text-rose-600" : "text-[#0f6cff]"
    const iconBg = tx.type === "credit" ? "bg-emerald-50" : tx.type === "debit" ? "bg-rose-50" : "bg-[#eef5ff]"
    const amountColor = tx.type === "credit" ? "text-emerald-600" : tx.type === "debit" ? "text-rose-600" : "text-slate-900"

    return (
      <motion.button
        type="button"
        key={tx.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setSelectedTransaction(tx)}
        className="group flex w-full items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:shadow-[0_4px_12px_rgba(15,23,42,0.08)]"
      >
        {/* Icon */}
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>

        {/* Text Content */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 uppercase tracking-wide">{tx.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{tx.subtitle}</p>
        </div>

        {/* Amount */}
        <div className="flex shrink-0 flex-col items-end gap-1">
          <p className={`text-sm font-bold ${amountColor}`}>
            {tx.amount}
          </p>
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeColors[tx.type]}`}>
            {tx.badgeLabel}
          </span>
        </div>
      </motion.button>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#eff7ff] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[28vh] bg-[radial-gradient(circle_at_top,_rgba(15,99,255,0.14),transparent_45%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <PageHeader variant="sub" title="Transactions" onBack={() => router.back()} />

        <main className="flex-1 min-h-0 overflow-y-auto pb-28">
          <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
            <div className="mb-5 overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
              <div className="bg-gradient-to-r from-[#eff7ff] via-white to-[#f8fbff] p-4 sm:p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">Wallet activity</p>
                <h2 className="mt-2 text-lg font-semibold text-slate-900">Transaction history</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">A calm, easy-to-scan view of your recent money movement.</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="relative w-fit">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "day" | "week" | "month")}
                  className="appearance-none rounded-full border border-slate-200 bg-white/90 pl-4 pr-11 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_6px_18px_rgba(15,23,42,0.06)] outline-none transition-all duration-200 focus:border-[#0f6cff] focus:bg-white focus:ring-2 focus:ring-[#0f6cff]/10"
                >
                  <option value="day">By Day</option>
                  <option value="week">By Week</option>
                  <option value="month">By Month</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center justify-center rounded-full p-1.5 text-slate-500">
                  <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                </div>
              </div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {todayTransactions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Today</h3>
                  <div className="space-y-2.5">
                    {todayTransactions.map(renderTransaction)}
                  </div>
                </div>
              )}

              {yesterdayTransactions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Yesterday</h3>
                  <div className="space-y-2.5">
                    {yesterdayTransactions.map(renderTransaction)}
                  </div>
                </div>
              )}

              {todayTransactions.length === 0 && yesterdayTransactions.length === 0 && (
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/90 p-8 text-center shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-medium text-slate-600">No transactions yet</p>
                  <p className="mt-2 text-sm text-slate-400">Your recent wallet movement will show up here.</p>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 sm:px-4 backdrop-blur-[2px]">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.24)] sm:p-6">
              {/* Receipt Header */}
              <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-6 text-center">
                <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#0f6cff]/10">
                  <svg className="h-8 w-8 text-[#0f6cff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Transaction Receipt</p>
                <h3 className="mt-2 break-words text-xl font-bold text-slate-900">{selectedTransaction.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{selectedTransaction.subtitle}</p>
              </div>

              {/* Amount Section */}
              <div className="border-b border-slate-200 bg-slate-50/50 p-6 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Amount</p>
                <p className={`mt-2 text-4xl font-bold ${selectedTransaction.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>
                  {selectedTransaction.amount}
                </p>
                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${typeColors[selectedTransaction.type]}`}>
                  {selectedTransaction.badgeLabel}
                </span>
              </div>

              {/* Transaction Details */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Transaction ID</span>
                    <span className="text-xs font-mono text-slate-700">{selectedTransaction.id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</span>
                    <span className="text-xs font-medium text-slate-700">{new Date(selectedTransaction.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</span>
                    <span className="text-xs font-medium text-emerald-600">Completed</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Type</span>
                    <span className="text-xs font-medium text-slate-700 capitalize">{selectedTransaction.type}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-700">{selectedTransaction.detailDescription}</p>
                </div>

                {/* Footer */}
                <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-900">Note</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-blue-800">{selectedTransaction.detailFooter}</p>
                </div>
              </div>

              {/* Close Button */}
              <div className="border-t border-slate-200 bg-slate-50 p-4">
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="w-full rounded-xl bg-[#0f6cff] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b57d3]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <WalletBottomNav />
      </div>
    </div>
  )
}