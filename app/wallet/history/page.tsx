"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ArrowUpRight, ArrowDown, Download, SlidersHorizontal } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import WalletBottomNav from "@/components/wallet-bottom-nav"

type TransactionType = "debit" | "credit" | "transfer"

interface Transaction {
  id: string
  title: string
  subtitle: string
  amount: string
  type: TransactionType
  time: string
  icon: "up" | "down"
}

const transactions: Transaction[] = [
  {
    id: "1",
    title: "Stamp Duty",
    subtitle: "Debit",
    amount: "-$50.00",
    type: "debit",
    time: "Today",
    icon: "up",
  },
  {
    id: "2",
    title: "Value Added Tax",
    subtitle: "Debit",
    amount: "-$0.75",
    type: "debit",
    time: "Today",
    icon: "up",
  },
  {
    id: "3",
    title: "to CHUKWUDI THANKG...",
    subtitle: "Transfer",
    amount: "-$10,000.00",
    type: "transfer",
    time: "Today",
    icon: "up",
  },
  {
    id: "4",
    title: "from ACTIVITY CONTINUI...",
    subtitle: "Credit",
    amount: "+$5,000.00",
    type: "credit",
    time: "Today",
    icon: "down",
  },
  {
    id: "5",
    title: "Value Added Tax",
    subtitle: "Debit",
    amount: "-$0.75",
    type: "debit",
    time: "Today",
    icon: "up",
  },
  {
    id: "6",
    title: "to SAMUEL TIMOTHY OZI...",
    subtitle: "Transfer",
    amount: "-$2,500.00",
    type: "transfer",
    time: "Today",
    icon: "up",
  },
  {
    id: "7",
    title: "to AGWU PAUL APOSTLE",
    subtitle: "Transfer",
    amount: "-$3,100.00",
    type: "transfer",
    time: "Today",
    icon: "up",
  },
  {
    id: "8",
    title: "from EZINNE GLADYS EN...",
    subtitle: "Credit",
    amount: "+$1,800.00",
    type: "credit",
    time: "Today",
    icon: "down",
  },
  {
    id: "9",
    title: "to CHUKWUDI THANKGO...",
    subtitle: "Transfer",
    amount: "-$3,000.00",
    type: "transfer",
    time: "Yesterday",
    icon: "up",
  },
]

const typeColors: Record<TransactionType, string> = {
  debit: "bg-rose-100 text-rose-700",
  credit: "bg-emerald-100 text-emerald-700",
  transfer: "bg-blue-100 text-blue-700",
}

export default function TransactionHistoryPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"past" | "upcoming">("past")

  const todayTransactions = transactions.filter((tx) => tx.time === "Today")
  const yesterdayTransactions = transactions.filter((tx) => tx.time === "Yesterday")

  const renderTransaction = (tx: Transaction) => {
    const Icon = tx.icon === "up" ? ArrowUpRight : ArrowDown
    const iconColor = tx.icon === "up" ? "text-slate-700" : "text-emerald-600"

    return (
      <motion.div
        key={tx.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 rounded-2xl bg-white p-4 transition-shadow hover:shadow-sm"
      >
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tx.icon === "up" ? "bg-slate-100" : "bg-emerald-50"}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{tx.title}</p>
          <p className="text-xs text-slate-500">{tx.subtitle}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <p className={`text-sm font-bold ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-slate-900"}`}>
            {tx.amount}
          </p>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${typeColors[tx.type]}`}>
            {tx.subtitle}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col bg-slate-50 text-slate-900">
      <PageHeader variant="sub" title="Transactions" onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28">
        <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
          {/* Tabs */}
          <div className="mb-4 flex items-center gap-1 rounded-xl bg-slate-200/60 p-1">
            <button
              onClick={() => setActiveTab("past")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === "past" ? "bg-white text-[#0f6cff] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === "upcoming" ? "bg-white text-[#0f6cff] shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Upcoming
            </button>
          </div>

          {activeTab === "past" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Today Section */}
              {todayTransactions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Today</h3>
                  <div className="space-y-2.5">
                    {todayTransactions.map(renderTransaction)}
                  </div>
                </div>
              )}

              {/* Yesterday Section */}
              {yesterdayTransactions.length > 0 && (
                <div>
                  <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Yesterday</h3>
                  <div className="space-y-2.5">
                    {yesterdayTransactions.map(renderTransaction)}
                  </div>
                </div>
              )}

              {todayTransactions.length === 0 && yesterdayTransactions.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <p className="text-sm text-slate-500">No transactions yet</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "upcoming" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <p className="text-sm text-slate-500">No upcoming transactions</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <WalletBottomNav />
    </div>
  )
}