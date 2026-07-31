"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Search,
  Send,
  CreditCard,
  Globe,
  Clock3,
  Phone,
  BookOpen,
  Zap,
  Shield,
  Monitor,
  Users,
  CircleDollarSign,
  Gift,
  ArrowRight,
  Radio,
  ReceiptText,
  Home,
  Grid,
  Sparkles,
  X,
} from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { WalletPageHeader } from "@/components/wallet/page-header"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

const serviceGroups = [
  {
    title: "Send and receive",
    items: [
      { label: "Transfer", icon: Send },
      { label: "Card", icon: CreditCard },
      { label: "Network", icon: Globe },
      { label: "Recurring", icon: Clock3 },
      { label: "USSD", icon: Phone },
    ],
  },
  {
    title: "Bills and recharges",
    items: [
      { label: "Airtime", icon: Radio },
      { label: "Data", icon: ReceiptText },
      { label: "Education", icon: BookOpen },
      { label: "Electricity", icon: Zap },
      { label: "Government", icon: Shield },
      { label: "TV", icon: Monitor },
      { label: "Association", icon: Users },
      { label: "Taxes", icon: CircleDollarSign },
    ],
  },
  {
    title: "Lifestyle",
    items: [
      { label: "Betting", icon: Gift },
      { label: "Gaming", icon: Gift },
      { label: "Utilities", icon: Shield },
      { label: "Health", icon: CircleDollarSign },
    ],
  },
]

export default function WalletServicesPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const [showRestrictedModal, setShowRestrictedModal] = useState(false)

  const handleTransferClick = () => {
    if (profile?.restricted) {
      setShowRestrictedModal(true)
      return
    }

    router.push("/wallet/transfer")
  }

  // Real-time subscription for restriction updates
  useEffect(() => {
    if (!profile?.id) return

    const supabaseClient = createClient()
    const channel = supabaseClient
      .channel('services-page-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${profile.id}`,
        },
        (payload) => {
          console.log('Profile update received:', payload)
          // This will trigger a re-render via the auth context
          // The useAuth hook will automatically refresh the profile
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [profile?.id])

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col pb-15 bg-[#f4f7ff] text-slate-900">
      <WalletPageHeader onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl space-y-3 px-3 py-3 sm:px-4 sm:py-4 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="relative rounded-[20px] border border-slate-200 bg-[#f7faff] p-3 pr-12">
            <Search className="absolute right-3 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-slate-900">Search services or settings</p>
              <p className="text-xs text-slate-500">Find the action you need quickly.</p>
            </div>
          </div>
        </motion.section>

        {serviceGroups.map((group) => (
          <motion.section
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{group.title}</h2>
              </div>
              <button className="text-xs font-semibold text-[#0f6cff]">View all</button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.label === "Transfer") {
                      handleTransferClick()
                      return
                    }

                    router.push("/wallet/transfer")
                  }}
                  className="group rounded-[18px] border border-slate-200 bg-[#f7faff] p-2.5 text-left transition hover:border-[#cfe0ff] hover:bg-[#eef5ff]"
                >
                  <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white text-[#0f6cff] shadow-sm">
                    <item.icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="text-xs font-medium text-slate-900">{item.label}</p>
                </button>
              ))}
            </div>
          </motion.section>
        ))}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm"
        >
          <div className="flex flex-col gap-3 rounded-[20px] border border-[#cfe0ff] bg-[#eef5ff] p-3 sm:flex-row sm:items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0f6cff]/10 text-[#0f6cff]">
              <ArrowRight className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Secure every transaction</p>
              <p className="text-xs text-slate-500">All services are protected with smart encryption and monitoring.</p>
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
                <p className="mt-1 text-xs leading-5 text-slate-500">This account cannot access transfers right now. Contact support to restore access.</p>
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
    </div>
  )
}
