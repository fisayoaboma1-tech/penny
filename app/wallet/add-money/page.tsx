"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, Copy, Share2, Wallet } from "lucide-react"

export default function WalletAddMoneyPage() {
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
            <h1 className="text-lg font-semibold">Add money</h1>
            <p className="text-sm text-slate-500">Share bank details to add funds to your wallet.</p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-4 rounded-3xl bg-slate-50 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Share bank details to add money to this account</p>
              <p className="text-sm text-slate-500">Send these details to anyone who wants to fund your wallet.</p>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_40px_rgba(15,23,42,0.15)]">
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Account number</p>
            <p className="mt-3 text-3xl font-semibold">9162919586</p>
            <p className="mt-2 text-sm text-slate-400">CHUKWUDI ENOCH</p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                <Copy className="w-4 h-4" /> Copy
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">How it works</p>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li>1. Copy or share your account details.</li>
              <li>2. Ask your sender to transfer to your wallet account.</li>
              <li>3. Once the deposit clears, your wallet balance updates instantly.</li>
            </ol>
          </div>
        </motion.section>
      </main>
    </div>
  )
}
