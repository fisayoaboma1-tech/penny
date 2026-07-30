"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Bell,
  ArrowUpRight,
  Eye,
  EyeOff,
  RefreshCw,
  Clock3,
  Headphones,
  Repeat,
  Plus,
  ArrowDown,
  Banknote,
  Send,
} from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { toast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"

const services = [
  { label: "Transfer", icon: Send, path: "/wallet/transfer" },
  { label: "Add money", icon: Banknote, path: "/wallet/add-money" },
  { label: "Convert", icon: Repeat, path: "/wallet/card", comingSoon: true },
]

const transactions = [
  {
    id: "1",
    title: "Stamp Duty",
    subtitle: "DEBIT",
    amount: "-$50.00",
    time: "29 Jul, 08:12 PM",
    icon: ArrowDown,
  },
  {
    id: "2",
    title: "Value Added Tax",
    subtitle: "DEBIT",
    amount: "-$0.75",
    time: "29 Jul, 08:12 PM",
    icon: ArrowDown,
  },
  {
    id: "3",
    title: "Transfer to CHUKWUDI THANKG...",
    subtitle: "TRANSFER",
    amount: "-$10,000.00",
    time: "Today",
    icon: ArrowDown,
  },
  {
    id: "4",
    title: "from ACTIVITY CONTINUITY...",
    subtitle: "CREDIT",
    amount: "+$5,000.00",
    time: "Today",
    icon: ArrowUpRight,
  },
]

export default function WalletPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [trend, setTrend] = useState<"week" | "month">("week")
  const [balance, setBalance] = useState(657000)
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now())
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("Last updated just now")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showBalance, setShowBalance] = useState(true)

  const userName = useMemo(() => {
    if (!user) return "Chukwudi Enoch"
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "Chukwudi Enoch"
  }, [user])

  const profileImageUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.profile_image ||
    "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"

  const currentHour = new Date().getHours()
  const greeting =
    currentHour >= 12 && currentHour <= 15
      ? "Good Afternoon"
      : currentHour >= 17 && currentHour <= 23
        ? "Good Evening"
        : "Good Morning"

  const formatLastUpdated = (timestamp: number) => {
    const diffMinutes = Math.floor((Date.now() - timestamp) / 60000)

    if (diffMinutes < 1) return "Last updated just now"
    if (diffMinutes < 60) return `Last updated ${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `Last updated ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`

    const diffDays = Math.floor(diffHours / 24)
    return `Last updated ${diffDays} day${diffDays === 1 ? "" : "s"} ago`
  }

  const refreshBalance = () => {
    setIsRefreshing(true)
    setBalance(657000)
    setLastUpdatedAt(Date.now())
    setLastUpdatedLabel("Last updated just now")

    window.setTimeout(() => {
      setIsRefreshing(false)
    }, 900)
  }

  useEffect(() => {
    if (!loading && user) {
      refreshBalance()
    }
  }, [loading, user])

  useEffect(() => {
    setLastUpdatedLabel(formatLastUpdated(lastUpdatedAt))

    const interval = window.setInterval(() => {
      setLastUpdatedLabel(formatLastUpdated(lastUpdatedAt))
    }, 30000)

    return () => window.clearInterval(interval)
  }, [lastUpdatedAt])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-sm font-semibold text-[#0f6cff]">Loading wallet…</div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* ─── HEADER ─── */}
        <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:pl-28 lg:pr-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="h-10 w-10 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-100 sm:h-11 sm:w-11"
              >
                <img src={profileImageUrl} alt={userName} className="h-full w-full object-cover" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{greeting}!</p>
                <h1 className="truncate text-sm font-medium text-slate-900">{userName},</h1>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 sm:h-10 sm:w-10"
                onClick={() => router.push("/help")}
              >
                <Headphones className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 sm:h-10 sm:w-10"
                onClick={() => router.push("/notifications")}
              >
                <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
              </button>
            </div>
          </div>
        </header>

        {/* ─── MAIN CONTENT ─── */}
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-28 pt-20 sm:px-6 md:gap-5 md:pt-24 lg:pl-28 lg:pr-6 lg:pt-6 xl:px-8">
          {/* ── BALANCE CARD ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-[#0f6cff] p-1 shadow-lg shadow-slate-900/20">
              <div className="relative rounded-2xl p-5 sm:p-6 md:p-7 md:pb-8">
                {/* Decorative blurs */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-10 left-10 h-24 w-24 rounded-full bg-sky-300/15 blur-3xl" />

                <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
                  {/* Balance info */}
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Available balance</p>
                    <div className="flex min-w-0 items-center gap-1.5 sm:gap-2">
                      <p className="truncate text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
                        {showBalance ? `$${balance.toLocaleString("en-US")}` : "••••••"}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">
                          USD
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowBalance((prev) => !prev)}
                          className="p-1 text-slate-300 transition hover:text-white"
                          aria-label={showBalance ? "Hide balance" : "Show balance"}
                        >
                          {showBalance ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400 sm:gap-2">
                      <span>{lastUpdatedLabel}</span>
                      <button
                        type="button"
                        onClick={refreshBalance}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-1.5 text-slate-300 transition hover:bg-white/20"
                        aria-label="Refresh balance"
                      >
                        <RefreshCw className={`h-3 w-3 ${isRefreshing ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 md:items-end">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <button
                        onClick={() => router.push("/wallet/add-money")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-white/20 sm:px-4 sm:py-2 sm:text-xs"
                      >
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Add money
                      </button>
                      <button
                        onClick={() => router.push("/wallet/transfer")}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-white/20 sm:px-4 sm:py-2 sm:text-xs"
                      >
                        <Clock3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> History
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── SERVICES + TRANSACTIONS GRID ── */}
          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {/* SERVICES */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
                <div className="mb-4">
                  <h2 className="text-sm font-semibold text-slate-900">Services</h2>
                  <p className="text-xs text-slate-500">Popular actions and shortcuts</p>
                </div>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {services.map((service) => {
                    const Icon = service.icon
                    return (
                      <button
                        key={service.label}
                        type="button"
                        onClick={() => {
                          if (service.comingSoon) {
                            toast({
                              title: "Feature available soon",
                              description: "Convert will be available soon.",
                            })
                            return
                          }
                          router.push(service.path)
                        }}
                        aria-disabled={service.comingSoon}
                        className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-2 text-center transition sm:p-4 sm:gap-2.5 ${
                          service.comingSoon
                            ? "cursor-not-allowed opacity-70"
                            : "hover:-translate-y-0.5 hover:border-[#0f6cff]/20 hover:bg-blue-50/60 hover:shadow-md"
                        }`}
                      >
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60 sm:h-11 sm:w-11">
                          <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                        </span>
                        <span className="text-[9px] font-semibold leading-tight text-slate-900 sm:text-[11px]">
                          {service.label}
                        </span>
                        {service.comingSoon && (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-amber-700">
                            Soon
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </motion.section>

            {/* TRANSACTIONS */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 md:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Recent transactions</h2>
                    <p className="text-xs text-slate-500">Latest activity on your wallet.</p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 text-xs font-semibold text-[#0f6cff] hover:underline"
                    onClick={() => router.push("/wallet/transfer")}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {transactions.map((tx) => {
                    const Icon = tx.icon
                    const isCredit = tx.amount.startsWith("+")
                    return (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 p-2.5 transition hover:border-slate-300/80 hover:bg-slate-50 sm:gap-3 sm:p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#0f6cff] shadow-sm ring-1 ring-slate-200/60 sm:h-10 sm:w-10">
                            <Icon className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                          </span>
                          <div className="min-w-0 max-w-[140px] sm:max-w-none">
                            <p className="truncate text-[13px] font-medium text-slate-900 sm:text-sm">{tx.title}</p>
                            <p className="text-[9px] uppercase tracking-wider text-slate-500 sm:text-[10px]">{tx.subtitle}</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end text-right">
                          <p className={`text-[13px] font-semibold sm:text-sm ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>
                            {tx.amount}
                          </p>
                          <p className="text-[9px] text-slate-500 sm:text-[10px]">{tx.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.section>
          </div>

          {/* ── SPENDING TRENDS ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 md:p-6">
                <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Spending trends</h2>
                  <p className="text-xs text-slate-500">Analyze your weekly and monthly flow.</p>
                </div>
                <div className="inline-flex w-full rounded-xl bg-slate-100 p-1 sm:w-auto">
                  <button
                    type="button"
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-none sm:px-4 ${
                      trend === "week" ? "bg-white text-[#0f6cff] shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                    onClick={() => setTrend("week")}
                  >
                    Week
                  </button>
                  <button
                    type="button"
                    className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition sm:flex-none sm:px-4 ${
                      trend === "month" ? "bg-white text-[#0f6cff] shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                    onClick={() => setTrend("month")}
                  >
                    Month
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                  <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Money in</p>
                  <p className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">$6,800.00</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                  <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Money out</p>
                  <p className="mt-1 text-lg font-bold text-rose-600 sm:text-xl">$21,693.00</p>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <WalletBottomNav />
      </div>
    </ProtectedRoute>
  )
}