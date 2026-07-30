"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Bell,
  CreditCard,
  ArrowUpRight,
  Eye,
  EyeOff,
  RefreshCw,
  Clock3,
  Headphones,
  Repeat,
  Plus,
  ShieldCheck,
  Sparkles,
  ArrowDown,
  Home,
  Grid,
  Sparkles as SparkleIcon,
  Banknote,
  Send,
  CircleDollarSign,
  ReceiptText,
  UserRound,
  LifeBuoy,
  Gift,
} from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"

const services = [
  { label: "Transfer", icon: Send, path: "/wallet/transfer" },
  { label: "Add money", icon: Banknote, path: "/wallet/add-money" },
  { label: "Convert", icon: Repeat, path: "/wallet/card" },
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
      <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-5 lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="h-11 w-11 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img src={profileImageUrl} alt={userName} className="h-full w-full object-cover" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">{greeting}!</p>
                <h1 className="truncate text-sm font-medium text-slate-900">{userName},</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                onClick={() => router.push("/help")}
              >
                <Headphones className="h-4.5 w-4.5" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50"
                onClick={() => router.push("/notifications")}
              >
                <Bell className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-6xl px-3 py-3 sm:px-5 sm:py-5 lg:px-6">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 overflow-hidden rounded-[30px] bg-slate-900 p-2 shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:p-3"
          >
            <div className="relative overflow-hidden rounded-[24px] bg-slate-900 p-4 text-white sm:p-5 lg:p-6">
              <div className="pointer-events-none absolute -right-12 top-6 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute left-0 top-10 h-20 w-20 rounded-full bg-sky-300/15 blur-3xl" />
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300/75">Available balance</p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-[clamp(1.8rem,4vw,2.7rem)] font-semibold tracking-tight text-white">
                        {showBalance ? `$${balance.toLocaleString("en-US")}` : "••••••"}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                          USD
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowBalance((prev) => !prev)}
                          className="rounded-full border border-white/20 bg-white/10 p-1 text-slate-200 transition hover:bg-white/15"
                          aria-label={showBalance ? "Hide balance" : "Show balance"}
                        >
                          {showBalance ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-300 sm:text-sm">
                      <span>{lastUpdatedLabel}</span>
                      <button
                        type="button"
                        onClick={refreshBalance}
                        className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-slate-200 transition hover:bg-white/15"
                        aria-label="Refresh balance"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push("/wallet/add-money")}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add money
                    </button>
                    <button
                      onClick={() => router.push("/wallet/transfer")}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
                    >
                      <Clock3 className="mr-1.5 h-3.5 w-3.5" /> History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Services</h2>
                <p className="text-xs text-slate-500">Popular actions and shortcuts</p>
              </div>
            </div>
            <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(90px,1fr))] sm:gap-3">
              {services.slice(0, 8).map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.label}
                    type="button"
                    onClick={() => router.push(service.path)}
                    className="group flex min-h-[96px] w-full flex-col items-center justify-center gap-2 rounded-[20px] bg-[#f7faff] p-2 text-center transition hover:bg-[#eef5ff] sm:min-h-[110px] sm:p-3"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-transparent text-slate-700 shadow-sm sm:h-11 sm:w-11">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] font-semibold leading-tight text-slate-900 sm:text-[11px]">
                      {service.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="rounded-[24px] bg-white p-2 sm:p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recent transactions</p>
                  <p className="text-xs text-slate-500">Latest activity on your wallet.</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 text-sm font-semibold text-slate-900"
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
                      className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-[#f7faff] p-3"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0f6cff] shadow-sm">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">{tx.title}</p>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{tx.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex min-w-[100px] flex-col items-end text-right">
                        <p className={`text-sm font-semibold ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>{tx.amount}</p>
                        <p className="text-[10px] text-slate-500">{tx.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-3 space-y-3">
              <div className="rounded-[24px] bg-white p-3 shadow-sm sm:p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Spending trends</p>
                    <p className="text-xs text-slate-500">Analyze your weekly and monthly flow.</p>
                  </div>
                  <div className="inline-flex w-full rounded-full bg-[#eef5ff] p-1 sm:w-auto">
                    <button
                      type="button"
                      className={`flex-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:flex-none ${trend === "week" ? "bg-[#0f6cff] text-white" : "text-[#4f63a1]"}`}
                      onClick={() => setTrend("week")}
                    >
                      Week
                    </button>
                    <button
                      type="button"
                      className={`flex-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition sm:flex-none ${trend === "month" ? "bg-[#0f6cff] text-white" : "text-[#4f63a1]"}`}
                      onClick={() => setTrend("month")}
                    >
                      Month
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                    <p className="text-sm font-semibold text-slate-900">Money in</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">$6,800.00</p>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                    <p className="text-sm font-semibold text-slate-900">Money out</p>
                    <p className="mt-1 text-xl font-semibold text-rose-600">$21,693.00</p>
                  </div>
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
