"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Copy, Share2, Banknote, BadgeCheck, ArrowRight } from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { WalletPageHeader } from "@/components/wallet/page-header"

export default function WalletAddMoneyPage() {
  const router = useRouter()

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col pb-15 bg-slate-50 text-slate-900">
      <WalletPageHeader onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4 rounded-[24px] bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Share your account details to add money to this wallet</p>
              <p className="mt-1 text-sm text-slate-500">Send these details to anyone who wants to fund your account.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_40px_rgba(15,23,42,0.15)] sm:p-6">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              Secure receiving account
            </div>
            <p className="mt-3 text-xs uppercase tracking-[0.32em] text-slate-400">Account number</p>
            <p className="mt-2 text-[clamp(1.4rem,3vw,2rem)] font-semibold">021 000 021 123</p>
            <p className="mt-2 text-sm text-slate-400">Pennywise LTD Bank</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">
                <Copy className="h-4 w-4" /> Copy
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                <Share2 className="h-4 w-4" /> Share
              </button>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <p className="text-sm font-semibold text-slate-900">How it works</p>
            <ol className="mt-4 space-y-3 text-sm text-slate-600">
              <li className="flex gap-2"><span className="mt-0.5 text-[#0f6cff]"><ArrowRight className="h-4 w-4" /></span>Copy or share your account details with your sender.</li>
              <li className="flex gap-2"><span className="mt-0.5 text-[#0f6cff]"><ArrowRight className="h-4 w-4" /></span>Ask your sender to transfer the payment to your wallet account.</li>
              <li className="flex gap-2"><span className="mt-0.5 text-[#0f6cff]"><ArrowRight className="h-4 w-4" /></span>Your balance will update within 5–15 minutes after payment is received.</li>
            </ol>
          </div>
        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}
