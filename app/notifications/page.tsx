"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, Bell, Clock3, RefreshCw, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { formatWalletAmount, getTransactionTimeLabel, type WalletTransactionType } from "@/lib/wallet/transactions"
import { toast } from "@/hooks/use-toast"

interface WalletActivity {
  id: string
  type: WalletTransactionType
  title: string
  subtitle: string
  amount: number
  status: string
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [supabase] = useState(() => createClient())
  const [activity, setActivity] = useState<WalletActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (loading) return
    if (!user) {
      setIsLoading(false)
      return
    }

    let active = true
    const loadActivity = async () => {
      setError("")
      const { data, error: queryError } = await supabase
        .from("wallet_transactions")
        .select("id, type, title, subtitle, amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30)

      if (!active) return
      if (queryError) {
        console.error("Failed to load wallet notifications:", queryError)
        setError("We couldn’t load your wallet activity. Please try again.")
      } else {
        setActivity((data ?? []).map((item) => ({
          ...item,
          type: item.type as WalletTransactionType,
          amount: Number(item.amount) || 0,
          status: item.status || "processing",
          subtitle: item.subtitle || "Wallet activity",
        })))
      }
      setIsLoading(false)
    }

    void loadActivity()
    const channel = supabase
      .channel(`wallet-notifications-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wallet_transactions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const transaction = payload.new as Partial<WalletActivity>
            toast({
              title: "Wallet activity updated",
              description: transaction.title || "A new update is available in your activity.",
            })
          }
          void loadActivity()
        },
      )
      .subscribe((status, channelError) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Wallet notification subscription failed:", channelError || status)
        }
      })

    return () => {
      active = false
      void supabase.removeChannel(channel)
    }
  }, [loading, supabase, user])

  const formatActivityTime = (value: string) => {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Just now"
    return `${getTransactionTimeLabel(value)} · ${date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900 lg:pl-64">
        <PageHeader variant="sub" title="Wallet activity" onBack={() => router.back()} />
        <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28 sm:px-6 sm:py-9">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-7">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Bell className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">Account updates</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Wallet activity</h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Transaction updates appear here as your wallet changes.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-xs leading-5 text-emerald-800">
              <ShieldCheck className="h-4 w-4 flex-none" />
              Activity is private to your account and updates in real time.
            </div>
          </div>

          <section aria-label="Recent wallet activity" className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.05)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Recent updates</h2>
                <p className="mt-1 text-xs text-slate-500">The latest activity on your wallet</p>
              </div>
              <button
                type="button"
                onClick={() => router.push("/wallet/history")}
                className="text-xs font-semibold text-blue-700 transition hover:text-blue-900"
              >
                View history
              </button>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center gap-2 px-5 py-14 text-sm text-slate-500">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                Loading wallet activity…
              </div>
            ) : error ? (
              <div role="alert" className="px-5 py-12 text-center">
                <p className="text-sm font-medium text-slate-700">{error}</p>
                <button type="button" onClick={() => window.location.reload()} className="mt-3 text-sm font-semibold text-blue-700 hover:text-blue-900">
                  Try again
                </button>
              </div>
            ) : activity.length === 0 ? (
              <div className="px-5 py-14 text-center sm:px-8">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <Clock3 className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-slate-900">Nothing new just yet</h3>
                <p className="mx-auto mt-1 max-w-xs text-sm leading-6 text-slate-500">
                  When there’s activity on your wallet, you’ll find the updates here.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {activity.map((item, index) => {
                  const isCredit = item.type === "credit"
                  const Icon = isCredit ? ArrowDownLeft : ArrowUpRight
                  const amountColor = isCredit ? "text-emerald-700" : item.type === "debit" ? "text-rose-700" : "text-slate-800"

                  return (
                    <motion.li
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.025, 0.2) }}
                    >
                      <button
                        type="button"
                        onClick={() => router.push("/wallet/history")}
                        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-slate-50 sm:gap-4 sm:px-6"
                      >
                        <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-2xl ${isCredit ? "bg-emerald-50 text-emerald-700" : item.type === "debit" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-slate-900">{item.title}</span>
                          <span className="mt-1 block truncate text-xs text-slate-500">{item.subtitle}</span>
                          <span className="mt-1.5 block text-[11px] text-slate-400">{formatActivityTime(item.created_at)}</span>
                        </span>
                        <span className="flex flex-none flex-col items-end gap-1">
                          <span className={`text-sm font-semibold ${amountColor}`}>{formatWalletAmount(item.type, item.amount)}</span>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${item.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {item.status}
                          </span>
                        </span>
                      </button>
                    </motion.li>
                  )
                })}
              </ul>
            )}
          </section>
          <p className="text-center text-xs leading-5 text-slate-400">
            Email and text alerts aren’t enabled for this account yet. Important wallet activity is available here.
          </p>
        </main>
        <WalletBottomNav />
      </div>
    </ProtectedRoute>
  )
}
