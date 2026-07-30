"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ArrowRight, Star, Gift, Coins, BadgeCheck, Sparkles } from "lucide-react"

export default function WalletRewardsPage() {
  const router = useRouter()
  const [tab, setTab] = useState<"promos" | "referrals">("promos")

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 sm:px-4 lg:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold sm:text-lg">Rewards</h1>
            <p className="text-sm text-slate-500">Track your promos and referral earnings.</p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Available rewards balance</p>
              <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.7rem)] font-semibold text-slate-900">₦640.00</h2>
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              <ArrowRight className="h-4 w-4" /> Cashout
            </button>
          </div>
          <p className="mt-4 text-sm text-slate-500">No cashback earned today.</p>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">All-time total rewards</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">₦4,700.00</p>
            </div>
            <button onClick={() => router.push("/wallet/transfer")} className="text-sm font-semibold text-sky-600">
              View History
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-slate-900">Goals</p>
              <p className="text-sm text-slate-500">Keep earning and unlock rewards.</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
              <Star className="h-3.5 w-3.5" /> 2 of 3
            </span>
          </div>
          <div className="rounded-[22px] bg-slate-50 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">₦10 cashback after each of your first three transfers to other banks daily</p>
                <p className="mt-2 text-sm text-slate-500">Expires on Friday, September 4th</p>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                Go
              </button>
            </div>
            <div className="mt-4 h-3 rounded-full bg-slate-200">
              <div className="h-full w-2/3 rounded-full bg-emerald-500" />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="grid grid-cols-2 gap-3 rounded-[22px] bg-slate-50 p-3 sm:p-4">
            <button
              onClick={() => setTab("promos")}
              className={`rounded-[16px] px-4 py-3 text-sm font-semibold transition ${tab === "promos" ? "bg-slate-900 text-white" : "bg-transparent text-slate-600"}`}
            >
              Promos
            </button>
            <button
              onClick={() => setTab("referrals")}
              className={`rounded-[16px] px-4 py-3 text-sm font-semibold transition ${tab === "referrals" ? "bg-slate-900 text-white" : "bg-transparent text-slate-600"}`}
            >
              Referrals
            </button>
          </div>

          <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            {tab === "promos" ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Daily transfer cashback</p>
                    <p className="text-sm text-slate-500">Earn ₦10 for the first three interbank transfers.</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  <ArrowRight className="h-4 w-4" /> View eligible transfers
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Invite friends</p>
                    <p className="text-sm text-slate-500">Share your link and earn when they send money.</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  <ArrowRight className="h-4 w-4" /> Invite now
                </button>
              </div>
            )}
          </div>
        </motion.section>
      </main>
    </div>
  )
}
