"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Search, ArrowRight, Send, BadgeCheck, CircleDollarSign, Wallet, Banknote, Home, Grid, CreditCard, Sparkles } from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"

const recentRecipients = [
  { name: "Chukwudi Thankgod Enoch", method: "OPay • 916 291 9586" },
  { name: "Samuel Timothy Ozibo", method: "OPay • 802 543 1315" },
  { name: "Agwu Paul Apostle", method: "Moniepoint MFB • 514 500 4347" },
]

export default function WalletTransferPage() {
  const router = useRouter()

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col bg-slate-50 text-slate-900">
      <div className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-3 py-3 sm:px-4 lg:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-semibold sm:text-lg">Start your transfer</h1>
            <p className="text-sm text-slate-500">Fast transfers are free and instant with Moniepoint.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl space-y-4 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="rounded-[20px] border border-slate-100 bg-slate-50 p-3 text-sm font-semibold text-slate-900">
            Moniepoint to Moniepoint transfers are free & instant
          </div>

          <div className="mt-4 rounded-[28px] bg-slate-950 p-4 text-white shadow-[0_15px_40px_rgba(15,23,42,0.2)] sm:p-5">
            <div className="mb-4 rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Wallet className="h-4 w-4" /> Paying from
              </div>
              <p className="mt-3 text-base font-semibold sm:text-lg">Chukwudi Enoch • 916 291 9586</p>
              <p className="mt-2 text-sm text-slate-400">₦13,079.16</p>
            </div>

            <div className="rounded-[24px] bg-slate-900 p-4">
              <div className="mb-3 text-sm text-slate-300">Enter recipient’s account number</div>
              <div className="rounded-[20px] bg-slate-800 p-4 text-[clamp(1.1rem,3vw,1.6rem)] font-semibold tracking-[0.12em] text-white">
                000 000 0000
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Send className="h-4 w-4 text-[#0f6cff]" />
              <p className="text-sm font-semibold text-slate-900">Select recipient</p>
            </div>
            <div className="relative rounded-[18px] border border-slate-200 bg-white px-4 py-3">
              <Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search accounts"
                className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="mt-4 grid gap-3">
              {recentRecipients.map((recipient) => (
                <button
                  key={recipient.name}
                  type="button"
                  className="flex items-center justify-between gap-3 rounded-[18px] border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{recipient.name}</p>
                    <p className="text-sm text-slate-500">{recipient.method}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">Recent</p>
                <p className="mt-1 text-sm text-slate-500">Your latest transfer recipients</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </button>
            <button className="flex items-center justify-between rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">Saved</p>
                <p className="mt-1 text-sm text-slate-500">Quickly access saved accounts</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Transfer rewards</p>
              <p className="text-sm text-slate-500">You’ve made 2 of 3 interbank transfers today.</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <CircleDollarSign className="h-4 w-4" /> ₦10 cashback
            </span>
          </div>
        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}
