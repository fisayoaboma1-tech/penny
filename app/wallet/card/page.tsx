"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, CreditCard, ShieldCheck, BadgeCheck, Sparkles, ArrowRight, Lock, ReceiptText, Home, Grid } from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"

export default function WalletCardPage() {
  const router = useRouter()

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col bg-[#f4f7ff] text-slate-900">
      <div className="sticky top-0 z-30 border-b border-blue-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-2.5 px-3 py-3 sm:px-4 lg:px-6">
          <button
            onClick={() => router.back()}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#0f6cff] transition hover:bg-[#e2eeff]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-sm font-semibold sm:text-base">Cards</h1>
            <p className="text-xs text-slate-500 sm:text-sm">Manage your virtual and physical cards.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl space-y-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-[#0f6cff] via-[#0d5fe4] to-[#0a54cc] p-4 text-white sm:p-5">
            <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-20 w-20 rounded-full bg-sky-300/20 blur-3xl" />
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.24em] text-sky-200">Virtual Card</p>
                <h2 className="mt-2 text-[clamp(1.2rem,3vw,1.7rem)] font-semibold">Meet your virtual card</h2>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.24em] text-sky-100">
                Active
              </div>
            </div>

            <div className="mt-5 rounded-[22px] border border-white/10 bg-white/10 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-sky-200">Card number</p>
                  <p className="mt-2 text-base font-semibold">****  ****  ****  6821</p>
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-sky-200">Expires</p>
                  <p className="text-sm font-semibold">09/29</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 p-3 sm:p-4">
            <div className="flex items-center gap-3 rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f6cff] text-white">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Ready in under 1 minute</p>
                <p className="text-xs text-slate-500">Start spending immediately.</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                <p className="text-sm font-semibold text-slate-900">Accepted everywhere</p>
                <p className="mt-1 text-xs text-slate-500">For shopping and subscriptions online and in-store.</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                <p className="text-sm font-semibold text-slate-900">No hidden fees</p>
                <p className="mt-1 text-xs text-slate-500">No monthly fees or recurring charges.</p>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                <p className="text-sm font-semibold text-slate-900">Stay in control</p>
                <p className="mt-1 text-xs text-slate-500">Freeze or unfreeze your card anytime.</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
                <p className="text-sm font-semibold text-slate-900">Secure payments</p>
                <p className="mt-1 text-xs text-slate-500">Protected with 3D Secure and fraud monitoring.</p>
              </div>
            </div>

            <button
              onClick={() => router.push("/wallet/card")}
              className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0f6cff] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5be2]"
            >
              <Sparkles className="h-4 w-4" />
              Get Virtual Card
            </button>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Card limits</p>
              <p className="text-xs text-slate-500">Manage how much you spend online.</p>
            </div>
            <button className="text-sm font-semibold text-[#0f6cff]">Manage</button>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
              <p className="text-xs text-slate-500">Daily limit</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">₦80,000</p>
            </div>
            <div className="rounded-[20px] border border-slate-200 bg-[#f7faff] p-3">
              <p className="text-xs text-slate-500">Available balance</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">₦13,079.16</p>
            </div>
          </div>
        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}
