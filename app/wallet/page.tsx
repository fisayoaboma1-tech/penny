"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Bell,
  CreditCard,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Headphones,
  Repeat,
  Plus,
  ShieldCheck,
  Sparkles,
  Wallet,
  ArrowDown,
  ChevronRight,
  Home,
  Grid,
  Sparkles as SparkleIcon,
} from "lucide-react"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"

const services = [
  { label: "Transfer", icon: Repeat, path: "/wallet/transfer" },
  { label: "Card", icon: CreditCard, path: "/wallet/card" },
  { label: "Add money", icon: Plus, path: "/wallet/add-money" },
  { label: "Services", icon: Grid, path: "/wallet/services" },
  { label: "Notifications", icon: Bell, path: "/notifications" },
  { label: "Profile", icon: ShieldCheck, path: "/profile" },
  { label: "Help", icon: SparkleIcon, path: "/help" },
  { label: "Rewards", icon: Sparkles, path: "/wallet/rewards" },
]

const transactions = [
  {
    id: "1",
    title: "Stamp Duty",
    subtitle: "DEBIT",
    amount: "-₦50.00",
    time: "29 Jul, 08:12 PM",
    icon: ArrowDown,
  },
  {
    id: "2",
    title: "Value Added Tax",
    subtitle: "DEBIT",
    amount: "-₦0.75",
    time: "29 Jul, 08:12 PM",
    icon: ArrowDown,
  },
  {
    id: "3",
    title: "Transfer to CHUKWUDI THANKG...",
    subtitle: "TRANSFER",
    amount: "-₦10,000.00",
    time: "Today",
    icon: ArrowDown,
  },
  {
    id: "4",
    title: "from ACTIVITY CONTINUITY...",
    subtitle: "CREDIT",
    amount: "+₦5,000.00",
    time: "Today",
    icon: ArrowUpRight,
  },
]

export default function WalletPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [trend, setTrend] = useState<"week" | "month">("week")

  const userName = useMemo(() => {
    if (!user) return "Chukwudi Enoch"
    return (
      user.user_metadata?.full_name || user.email?.split("@")[0] || "Chukwudi Enoch"
    )
  }, [user])

  const initials = useMemo(() => {
    const parts = userName.split(" ")
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : userName.slice(0, 2).toUpperCase()
  }, [userName])

  const profileImageUrl =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.profile_image ||
    "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-[#0f6cff]">Loading wallet…</div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white pb-28 text-slate-900">
        <header className="sticky top-0 z-30 border-b border-blue-100 bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="h-10 w-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <img
                  src={profileImageUrl}
                  alt={userName}
                  className="h-full w-full object-cover"
                />
              </button>
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Good Evening!</p>
                <h1 className="text-sm font-semibold text-slate-900">{userName}</h1>
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

        <main className="mx-auto max-w-6xl px-3 py-3 sm:px-6 sm:py-5">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-3 overflow-hidden rounded-[28px] bg-slate-900 p-3 shadow-none"
          >
            <div className="relative overflow-hidden rounded-[24px] bg-slate-900 p-4 text-white sm:p-5">
              <div className="pointer-events-none absolute -right-12 top-6 h-28 w-28 rounded-full bg-white/10 blur-3xl" />
              <div className="pointer-events-none absolute left-0 top-10 h-20 w-20 rounded-full bg-sky-300/15 blur-3xl" />
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-slate-300/75">9162919586 | Chukwudi Enoch</p>
                    <p className="mt-2 text-[2.25rem] font-semibold tracking-tight text-white">₦13,079.16</p>
                    <p className="mt-1 text-sm text-slate-300">Last updated just now</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => router.push("/wallet/add-money")}
                      className="inline-flex items-center justify-center rounded-full bg-white px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f6cff] shadow-sm shadow-slate-950/5 transition hover:bg-slate-100"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add money
                    </button>
                    <button
                      onClick={() => router.push("/wallet/transfer")}
                      className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/15"
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
            className="mt-3 rounded-[24px] bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Services</h2>
              </div>
              <button
                type="button"
                className="text-xs font-semibold text-[#0f6cff]"
                onClick={() => router.push("/wallet/services")}
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {services.slice(0, 8).map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.label}
                    type="button"
                    onClick={() => router.push(service.path)}
                    className="group flex flex-col items-center gap-2 rounded-[20px] bg-[#f7faff] p-2 text-center transition hover:bg-[#eef5ff]"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#0f6cff] shadow-sm">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-[11px] font-semibold text-slate-900">{service.label}</span>
                  </button>
                )
              })}
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="mt-3 grid gap-2 sm:grid-cols-2"
          >
            <div className="rounded-[24px] border border-[#dfe6ff] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-[#eef5ff] p-3 text-[#0f6cff]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Cashback</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">₦640.00</p>
                </div>
              </div>
            </div>
            <div className="rounded-[24px] border border-[#dfe6ff] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="rounded-2xl bg-[#eef5ff] p-3 text-[#0f6cff]">
                  <SparkleIcon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Referrals</p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">₦0.00</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-3 rounded-[24px] bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="rounded-[24px] bg-white p-3 shadow-sm sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Recent transactions</p>
                  <p className="text-xs text-slate-500">Latest activity on your wallet.</p>
                </div>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#0f6cff]"
                  onClick={() => router.push("/wallet/transfer")}
                >
                  View All
                </button>
              </div>
              <div className="space-y-2">
                {transactions.map((tx) => {
                  const Icon = tx.icon
                  const isCredit = tx.amount.startsWith("+")
                  return (
                    <div key={tx.id} className="flex items-center justify-between gap-3 rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#0f6cff] shadow-sm">
                          <Icon className="h-4.5 w-4.5" />
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{tx.title}</p>
                          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{tx.subtitle}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${isCredit ? "text-emerald-600" : "text-rose-600"}`}>{tx.amount}</p>
                        <p className="text-[11px] text-slate-500">{tx.time}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-[24px] bg-white p-3 shadow-sm sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Finances</p>
                    <p className="text-xs text-slate-500">Create savings plans and earn more.</p>
                  </div>
                </div>
                <div className="mt-3 rounded-[20px] border border-[#cfe0ff] bg-[#eef5ff] p-3">
                  <p className="text-sm font-semibold text-slate-900">Savings</p>
                  <p className="mt-1 text-xs text-slate-500">Create a savings plan and get up to 20.0% interest per annum.</p>
                </div>
              </div>

              <div className="rounded-[24px] bg-white p-3 shadow-sm sm:p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Spending trends</p>
                    <p className="text-xs text-slate-500">Analyze your weekly and monthly flow.</p>
                  </div>
                  <div className="inline-flex rounded-full bg-[#eef5ff] p-1">
                    <button
                      type="button"
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${trend === "week" ? "bg-[#0f6cff] text-white" : "text-[#4f63a1]"}`}
                      onClick={() => setTrend("week")}
                    >
                      Week
                    </button>
                    <button
                      type="button"
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${trend === "month" ? "bg-[#0f6cff] text-white" : "text-[#4f63a1]"}`}
                      onClick={() => setTrend("month")}
                    >
                      Month
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid gap-2">
                  <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                    <p className="text-sm font-semibold text-slate-900">Money in</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">₦6,800.00</p>
                  </div>
                  <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                    <p className="text-sm font-semibold text-slate-900">Money out</p>
                    <p className="mt-1 text-xl font-semibold text-rose-600">₦21,693.00</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white px-3 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)]">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-1">
            {[
              { label: "Home", icon: Home, path: "/wallet" },
              { label: "Card", icon: CreditCard, path: "/wallet/card" },
              { label: "Services", icon: Grid, path: "/wallet/services" },
              { label: "Rewards", icon: Sparkles, path: "/wallet/rewards" },
            ].map((item, index) => {
              const Icon = item.icon
              const isActive = item.path === "/wallet"
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => router.push(item.path)}
                  className={`inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-semibold transition ${isActive ? "bg-[#eef5ff] text-[#0f6cff]" : "text-slate-500 hover:bg-[#f8faff]"}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </ProtectedRoute>
  )
}
