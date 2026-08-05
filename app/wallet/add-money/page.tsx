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
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col pb-15 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 text-slate-900">
      <WalletPageHeader onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const }}
          className="rounded-[28px] border border-slate-200 bg-white/80 backdrop-blur-sm p-6 shadow-lg sm:p-8"
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
              className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-2xl ring-4 ring-slate-900/10"
            >
              <Headphones className="h-12 w-12" />
            </motion.div>

            {/* Main message with elegant typography */}
            <motion.div variants={itemVariants} className="mt-8 space-y-3">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl tracking-tight">
                Please Contact Support
              </h2>
              <p className="max-w-lg text-base text-slate-600 sm:text-lg leading-relaxed">
                Our dedicated support team is ready to assist you with adding money to your wallet securely and efficiently.
              </p>
            </motion.div>

            {/* Support options with refined animations */}
            <motion.div
              variants={containerVariants}
              className="mt-10 w-full max-w-lg space-y-4"
            >
              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-slate-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg"
                  >
                    <Mail className="h-6 w-6" />
                  </motion.div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">Email Support</p>
                    <p className="text-sm text-slate-500">support@pennywise.com</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-slate-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg"
                  >
                    <MessageCircle className="h-6 w-6" />
                  </motion.div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-slate-900">Live Chat</p>
                    <p className="text-sm text-slate-500">Available 24/7 for instant assistance</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={cardVariants}
                whileHover="hover"
                className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 transition-all hover:border-slate-300 hover:shadow-xl"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 10 }}
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-lg"
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
              className="mt-10 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 backdrop-blur-sm"
            >
              <p className="text-sm text-slate-600 leading-relaxed">
                For security purposes, all funding requests are processed through our verified support channels. 
                Please reach out using any of the methods above, and our team will guide you through the process.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}