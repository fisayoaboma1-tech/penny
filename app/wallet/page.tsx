"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import type { WalletTransaction, WalletTransactionType } from "@/lib/wallet/transactions"
import {
  ArrowUpRight,
  Eye,
  EyeOff,
  RefreshCw,
  Clock3,
  Repeat,
  Plus,
  ArrowDown,
  Banknote,
  Send,
  X,
  MessageCircle,
} from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { toast } from "@/hooks/use-toast"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { formatWalletAmount, getTransactionTimeLabel, getWalletTransactionBadge, getWalletTransactionIcon } from "@/lib/wallet/transactions"

const services = [
  { label: "Transfer", icon: Send, path: "/wallet/transfer" },
  { label: "Add money", icon: Banknote, path: "/wallet/add-money" },
  { label: "Convert", icon: Repeat, path: "/wallet/card", comingSoon: true },
]

const typeColors: Record<WalletTransactionType, string> = {
  debit: "bg-rose-50 text-rose-700",
  credit: "bg-emerald-50 text-emerald-700",
  transfer: "bg-[#eef5ff] text-[#0f6cff]",
}

const buildRecentTransactions = (transactions: WalletTransaction[]) =>
  transactions.slice(0, 4).map((tx) => ({
    ...tx,
    icon: tx.icon === "up" ? ArrowUpRight : ArrowDown,
  }))

export default function WalletPage() {
  const router = useRouter()
  const { user, loading, profile, isAdmin } = useAuth()
  const [balance, setBalance] = useState(0)
  const [lastUpdatedAt, setLastUpdatedAt] = useState<number | null>(null)
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState("Last updated just now")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showBalance, setShowBalance] = useState<boolean | null>(null) // null = not loaded yet
  const [greeting, setGreeting] = useState("Good Morning")
  const [showRestrictedModal, setShowRestrictedModal] = useState(false)
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false)
  const [recentTransactions, setRecentTransactions] = useState<WalletTransaction[]>([])
  const [moneyFlow, setMoneyFlow] = useState({ moneyIn: 0, moneyOut: 0 })
  const supabase = createClient()

  // Load hide_balance preference from profile
  useEffect(() => {
    if (!loading && profile) {
      // Profile is loaded, set the preference
      if (profile.hide_balance !== undefined) {
        setShowBalance(!profile.hide_balance)
      } else {
        // Default to showing balance if no preference set
        setShowBalance(true)
      }
    }
  }, [profile?.hide_balance, loading, profile])

  const userName = useMemo(() => {
    if (!user) return "Chukwudi Enoch"
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "Chukwudi Enoch"
  }, [user])

  const profileImageUrl =
    profile?.profile_image_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.profile_image ||
    "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"

  const formatLastUpdated = (timestamp: number | null) => {
    if (timestamp === null) return "Last updated just now"

    const diffMinutes = Math.floor((Date.now() - timestamp) / 60000)

    if (diffMinutes < 1) return "Last updated just now"
    if (diffMinutes < 60) return `Last updated ${diffMinutes} min${diffMinutes === 1 ? "" : "s"} ago`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `Last updated ${diffHours} hour${diffHours === 1 ? "" : "s"} ago`

    const diffDays = Math.floor(diffHours / 24)
    return `Last updated ${diffDays} day${diffDays === 1 ? "" : "s"} ago`
  }

  const refreshBalance = async () => {
    setIsRefreshing(true)

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser?.id) {
        throw new Error("No authenticated user")
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", authUser.id)
        .single()

      if (error) {
        throw error
      }

      const nextBalance = typeof data?.balance === "number"
        ? data.balance
        : Number(data?.balance) || 0

      setBalance(nextBalance)
      setLastUpdatedAt(Date.now())
      setLastUpdatedLabel("Last updated just now")
    } catch (error) {
      console.error("Failed to refresh wallet balance:", error)
      setBalance(profile?.balance ?? 0)
    } finally {
      window.setTimeout(() => {
        setIsRefreshing(false)
      }, 900)
    }
  }

  const formatCurrency = (value: number) =>
    `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const fetchTransactions = async () => {
    if (!user?.id) return

    const { data, error } = await supabase
      .from("wallet_transactions")
      .select("id, user_id, type, amount, title, subtitle, detail_title, detail_description, detail_footer, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Failed to load wallet transactions:", error)
      return
    }

    const mapped = (data ?? []).map((tx: any) => {
      const type = tx.type as WalletTransactionType
      const amount = Number(tx.amount) || 0
      const formattedAmount = formatWalletAmount(type, amount)
      const badgeLabel = getWalletTransactionBadge(type)
      const icon = getWalletTransactionIcon(type)
      const status = type === "transfer" ? "processing" : (tx.status || "completed")

      return {
        id: tx.id,
        title: tx.title,
        subtitle: tx.subtitle || "Transaction processing",
        amount: formattedAmount,
        type,
        time: getTransactionTimeLabel(tx.created_at),
        icon,
        badgeLabel,
        status,
        detailTitle: tx.detail_title,
        detailDescription: tx.detail_description,
        detailFooter: tx.detail_footer,
        createdAt: tx.created_at,
      } as WalletTransaction
    })

    const totals = (data ?? []).reduce(
      (acc, tx) => {
        const amount = Number(tx.amount) || 0

        if (tx.type === "credit") {
          acc.moneyIn += amount
        } else {
          acc.moneyOut += amount
        }

        return acc
      },
      { moneyIn: 0, moneyOut: 0 },
    )

    setMoneyFlow(totals)
    setRecentTransactions(mapped.slice(0, 4))
  }

  useEffect(() => {
    if (!loading && user && !isAdmin) {
      setBalance(profile?.balance ?? 0)
      void refreshBalance()
      void fetchTransactions()
    }
  }, [loading, user, profile, isAdmin])

  useEffect(() => {
    setLastUpdatedLabel(formatLastUpdated(lastUpdatedAt))

    const interval = window.setInterval(() => {
      setLastUpdatedLabel(formatLastUpdated(lastUpdatedAt))
    }, 30000)

    return () => window.clearInterval(interval)
  }, [lastUpdatedAt])

  // Real-time subscription for balance updates
  useEffect(() => {
    if (!user || isAdmin) return

    const balanceChannel = supabase
      .channel('wallet-balance-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Balance update received:', payload)
          const newBalance = typeof payload.new.balance === "number"
            ? payload.new.balance
            : Number(payload.new.balance) || 0
          
          setBalance(newBalance)
          setLastUpdatedAt(Date.now())
          setLastUpdatedLabel("Last updated just now")
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(balanceChannel)
    }
  }, [user, isAdmin, supabase])

  // Real-time subscription for new transactions
  useEffect(() => {
    if (!user || isAdmin) return

    const transactionChannel = supabase
      .channel('wallet-transaction-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'wallet_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('New transaction received:', payload)
          const tx = payload.new as any
          const type = tx.type as WalletTransactionType
          const amount = Number(tx.amount) || 0
          const formattedAmount = formatWalletAmount(type, amount)
          const badgeLabel = getWalletTransactionBadge(type)
          const icon = getWalletTransactionIcon(type)

          const newTransaction: WalletTransaction = {
            id: tx.id,
            title: tx.title,
            subtitle: tx.subtitle || "Transaction processing",
            amount: formattedAmount,
            type,
            time: "Just now",
            icon,
            badgeLabel,
            detailTitle: tx.detail_title,
            detailDescription: tx.detail_description,
            detailFooter: tx.detail_footer,
            createdAt: tx.created_at,
          }

          // Add new transaction to the beginning of the list
          setRecentTransactions(prev => [newTransaction, ...prev].slice(0, 4))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(transactionChannel)
    }
  }, [user, isAdmin, supabase])

  const handleToggleBalanceVisibility = async () => {
    const newShowBalance = !showBalance
    setShowBalance(newShowBalance)
    
    // Save preference to database
    if (user) {
      await supabase
        .from("profiles")
        .update({ hide_balance: !newShowBalance })
        .eq("id", user.id)
    }
  }

  const handleTransferClick = () => {
    if (profile?.restricted) {
      setShowRestrictedModal(true)
      return
    }

    router.push("/wallet/transfer")
  }

  const handleAddMoneyClick = () => {
    setShowAddMoneyModal(true)
    toast({
      title: "Contact Support",
      description: "Please use live chat to add money to your wallet.",
      duration: 5000,
    })
  }

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
        <PageHeader
          variant="main"
          userName={userName}
          profileImageUrl={profileImageUrl}
          greeting={greeting}
        />

        {/* ─── MAIN CONTENT ─── */}
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-28 pt-20 sm:px-6 md:gap-5 md:pt-24 lg:pl-28 lg:pr-6 lg:pt-20 xl:px-8">
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
                        {showBalance === null ? "••••••" : showBalance ? `$${balance.toLocaleString("en-US")}` : "••••••"}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300">
                          USD
                        </span>
                        <button
                          type="button"
                          onClick={handleToggleBalanceVisibility}
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
                        onClick={handleAddMoneyClick}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-white/20 sm:px-4 sm:py-2 sm:text-xs"
                      >
                        <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Add money
                      </button>
                      <button
                        onClick={() => router.push("/wallet/history")}
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
                    const isDisabled = Boolean(service.comingSoon)

                    return (
                      <button
                        key={service.label}
                        type="button"
                        onClick={() => {
                          if (isDisabled) {
                            toast({
                              title: "Feature available soon",
                              description: "Convert will be available soon.",
                            })
                            return
                          }

                          if (service.label === "Transfer") {
                            handleTransferClick()
                            return
                          }

                          if (service.label === "Add money") {
                            handleAddMoneyClick()
                            return
                          }

                          router.push(service.path)
                        }}
                        aria-disabled={isDisabled}
                        className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/50 p-2 text-center transition sm:p-4 sm:gap-2.5 ${
                          isDisabled
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
                        {isDisabled ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-amber-700">
                            Soon
                          </span>
                        ) : null}
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
                    onClick={() => router.push("/wallet/history")}
                  >
                    View All
                  </button>
                </div>
                <div className="space-y-2.5">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => {
                      const Icon = tx.icon === "up" ? ArrowUpRight : ArrowDown
                      const iconColor = tx.type === "credit" ? "text-emerald-600" : tx.type === "debit" ? "text-rose-600" : "text-[#0f6cff]"
                      const iconBg = tx.type === "credit" ? "bg-emerald-50" : tx.type === "debit" ? "bg-rose-50" : "bg-[#eef5ff]"
                      const amountColor = tx.type === "credit" ? "text-emerald-600" : tx.type === "debit" ? "text-rose-600" : "text-slate-900"
                      const BadgeIcon = tx.type === "transfer" ? Clock3 : undefined
                      const badgeClasses = tx.type === "transfer" ? "bg-amber-100 text-amber-800" : typeColors[tx.type]

                      return (
                        <div
                          key={tx.id}
                          onClick={() => router.push("/wallet/history")}
                          className="group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left shadow-[0_1px_4px_rgba(15,23,42,0.03)] transition-all hover:border-slate-300 hover:shadow-[0_2px_8px_rgba(15,23,42,0.06)]"
                        >
                          {/* Icon */}
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
                            <Icon className={`h-4 w-4 ${iconColor}`} />
                          </div>

                          {/* Text Content */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[13px] font-semibold text-slate-900 uppercase tracking-wide">{tx.title}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">{tx.subtitle}</p>
                          </div>

                          {/* Amount */}
                          <div className="flex shrink-0 flex-col items-end gap-0.5">
                            <p className={`text-[13px] font-bold ${amountColor}`}>
                              {tx.amount}
                            </p>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${badgeClasses}`}>
                              {BadgeIcon ? <BadgeIcon className="h-3.5 w-3.5" /> : null}
                              {tx.badgeLabel}
                            </span>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-4 text-center text-sm text-slate-500">
                      No transactions yet.
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          </div>

          {/* ── MONEY FLOW ── */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-5 md:p-6">
              <div className="mb-3 sm:mb-4">
                <h2 className="text-sm font-semibold text-slate-900">Money flow</h2>
                <p className="text-xs text-slate-500">Totals pulled from your transaction history.</p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                  <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Money in</p>
                  <p className="mt-1 text-lg font-bold text-emerald-600 sm:text-xl">{formatCurrency(moneyFlow.moneyIn)}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4">
                  <p className="text-[11px] font-medium text-slate-500 sm:text-xs">Money out</p>
                  <p className="mt-1 text-lg font-bold text-rose-600 sm:text-xl">{formatCurrency(moneyFlow.moneyOut)}</p>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        <WalletBottomNav />

        {showRestrictedModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4"
            onClick={() => setShowRestrictedModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Transfer restricted</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Your account is currently restricted. Please contact support to enable transfers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRestrictedModal(false)}
                  className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close restricted transfer notice"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showAddMoneyModal && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 px-4"
            onClick={() => setShowAddMoneyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Please Contact Support</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      To add money to your wallet, please contact our support team via live chat. We're here to help you securely.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Close add money notice"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddMoneyModal(false)}
                  className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                >
                  Got it
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
