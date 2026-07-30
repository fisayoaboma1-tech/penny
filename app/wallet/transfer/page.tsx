"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Search, Clock3, Plus, ArrowRight, ArrowUpRight, ArrowDownRight } from "lucide-react"

const recentRecipients = [
  { name: "Chukwudi Thankgod Enoch", method: "OPay • 916 291 9586" },
  { name: "Samuel Timothy Ozibo", method: "OPay • 802 543 1315" },
  { name: "Agwu Paul Apostle", method: "Moniepoint MFB • 514 500 4347" },
]

export default function WalletTransferPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-28">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold">Start your transfer</h1>
            <p className="text-sm text-slate-500">Fast transfers are free and instant with Moniepoint.</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Moniepoint to Moniepoint transfers are free & instant</p>
          </div>

          <div className="mt-5 rounded-[32px] bg-slate-950 p-5 text-white shadow-[0_15px_40px_rgba(15,23,42,0.2)]">
            <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Paying from</p>
              <p className="mt-3 font-semibold text-xl">Chukwudi Enoch • 916 291 9586</p>
              <p className="mt-2 text-sm text-slate-400">₦13,079.16</p>
            </div>

            <div className="rounded-3xl bg-slate-900 p-4">
              <div className="mb-4 text-sm text-slate-300">Enter recipient’s account number</div>
              <div className="rounded-3xl bg-slate-800 p-4 text-2xl font-semibold text-white tracking-[0.12em]">
                000 000 0000
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[32px] border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900 mb-3">Select recipient</p>
            <div className="relative rounded-3xl border border-slate-200 bg-white px-4 py-3">
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
                  className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
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
          className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <button className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-900">Recent</p>
                <p className="mt-1 text-sm text-slate-500">Your latest transfer recipients</p>
              </div>
              <ArrowRight className="h-5 w-5 text-slate-400" />
            </button>
            <button className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-100">
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
          className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Transfer rewards</p>
              <p className="text-sm text-slate-500">You’ve made 2 of 3 interbank transfers today.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              ₦10 cashback
            </span>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
