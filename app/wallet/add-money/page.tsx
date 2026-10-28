"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Headphones, Mail, MessageCircle, Shield } from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { WalletPageHeader } from "@/components/wallet/page-header"

export default function WalletAddMoneyPage() {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  }

  const iconVariants = {
    hidden: { scale: 0, opacity: 0, rotate: -180 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
        mass: 1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut" as const,
      },
    },
  }

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col pb-15 bg-slate-50 text-slate-900 lg:pl-64">
      <WalletPageHeader title="Add money" onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-8"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center text-center"
          >
            {/* Icon with sophisticated animation */}
            <motion.div
              variants={iconVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100 sm:h-[4.5rem] sm:w-[4.5rem]"
            >
              <Headphones className="h-8 w-8" />
            </motion.div>

            {/* Main message with elegant typography */}
            <motion.div variants={itemVariants} className="mt-8 space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Add funds with support
              </h2>
              <p className="max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                Contact our team to arrange a wallet deposit. We’ll confirm the available funding steps with you.
              </p>
            </motion.div>

            {/* Support options with refined animations */}
            <motion.div
              variants={containerVariants}
              className="mt-8 grid w-full max-w-3xl gap-3 sm:grid-cols-2"
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:bg-slate-50 sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"
                  >
                    <Mail className="h-6 w-6" />
                  </motion.div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">Email Support</p>
                    <a href="mailto:support@pennyiseltd@gmail.com" className="text-sm text-slate-500 hover:text-blue-700">support@pennyiseltd@gmail.com</a>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:bg-slate-50 sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </motion.div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">Live Chat</p>
                    <p className="text-sm text-slate-500">Start a conversation with our support team</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:border-blue-200 hover:bg-slate-50 sm:p-5"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"
                  >
                    <Shield className="h-6 w-6" />
                  </motion.div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">Secure & Verified</p>
                    <p className="text-sm text-slate-500">Your transactions are fully protected</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Additional information */}
            <motion.div
              variants={itemVariants}
              className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left sm:p-5"
            >
              <p className="text-sm text-slate-600 leading-relaxed">
                For your safety, please only follow deposit instructions confirmed by Pennywise support. Never share your password or one-time verification codes.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}