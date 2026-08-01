"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDown, X } from "lucide-react"
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
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past")
  const [selectedTransaction, setSelectedTransaction] = useState<WalletTransaction | null>(null)

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
        className="flex flex-col gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white p-4 text-left shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center"
      >
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="break-words text-sm font-semibold leading-snug text-slate-900">{tx.title}</p>
          <p className="mt-1 text-xs text-slate-500">{tx.subtitle}</p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:ml-auto sm:items-end">
          <p className={`text-sm font-bold ${amountColor}`}>
            {tx.amount}
          </p>
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${typeColors[tx.type]}`}>
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

            <div className="mb-4 flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1 shadow-sm">
              <button
                onClick={() => setActiveTab("past")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                  activeTab === "past" ? "bg-white text-[#0f6cff] shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Past
              </button>
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                  activeTab === "upcoming" ? "bg-white text-[#0f6cff] shadow-sm" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Upcoming
              </button>
            </div>

            {activeTab === "past" && (
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
            )}

            {activeTab === "upcoming" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-white/90 p-8 text-center shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                  <p className="text-sm font-medium text-slate-600">No upcoming transactions</p>
                  <p className="mt-2 text-sm text-slate-400">Scheduled transfers will appear here.</p>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-3 py-4 sm:px-4 backdrop-blur-[2px]">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-[0_30px_90px_rgba(15,23,42,0.24)] sm:p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Transaction details</p>
                  <h3 className="mt-1 break-words text-lg font-semibold text-slate-900">{selectedTransaction.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
                  className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                  aria-label="Close transaction details"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-br from-[#f8fbff] to-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{selectedTransaction.subtitle}</p>
                    <p className="mt-1 text-sm text-slate-500">{selectedTransaction.detailTitle}</p>
                  </div>
                  <p className={`text-lg font-semibold ${selectedTransaction.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>
                    {selectedTransaction.amount}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 rounded-[1.5rem] border border-slate-200 p-4 text-sm text-slate-600">
                <p className="leading-6">{selectedTransaction.detailDescription}</p>
                <p className="font-medium text-slate-900">{selectedTransaction.detailFooter}</p>
              </div>
            </div>
          </div>
        )}

        <WalletBottomNav />
      </div>
    </div>
  )
}