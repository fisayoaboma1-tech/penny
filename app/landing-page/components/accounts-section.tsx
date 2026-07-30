"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { useRef, useState } from "react"
import { ArrowRight, Check, Sparkles, CreditCard, Shield, Zap, TrendingUp } from "lucide-react"

const DARK_BLUE = "#1e40af"
const DARK_BLUE_LIGHT = "#3d4d82"
const BUTTON_BLUE = "#0f6cff"

  const accounts = [
  {
    id: "smart-savings",
    name: "Smart Savings",
    tagline: "High-Yield Growth",
    apy: "4.5%",
    apyLabel: "APY on Savings",
    description: "Earn up to 4.5% APY with zero fees and instant access to your funds anytime.",
    features: ["No Monthly Fees", "FDIC Insured", "Instant Transfers", "Cashback Rewards"],
    icon: TrendingUp,
    buttonColor: BUTTON_BLUE,
  },
  {
    id: "business-pro",
    name: "Business Pro",
    tagline: "Built For Builders",
    apy: "3.8%",
    apyLabel: "APY on Business",
    description: "Powerful tools for entrepreneurs — invoicing, payroll, and instant transfers.",
    features: ["Team Accounts", "Invoice Tools", "Payroll", "API Access"],
    icon: CreditCard,
    buttonColor: BUTTON_BLUE,
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 20,
    },
  },
} as const

function AccountCard({
  account,
  index,
}: {
  account: (typeof accounts)[0]
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
      <motion.div
        variants={cardVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative ${index === 2 ? "col-span-2 md:col-span-1" : ""}`}
      >
      {/* Card wrapper with 3D hover effect */}
      <motion.div
        className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 h-full flex flex-col"
        animate={{
          y: isHovered ? -4 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >

        {/* Card content */}
        <div className="p-2 md:p-6 flex flex-col flex-1">
          {/* Header row */}
          <div className="flex items-start justify-between mb-1 md:mb-4">
            <div className="flex-1">
              <motion.span
                className="inline-block text-[9px] md:text-[10px] font-medium tracking-[0.15em] uppercase px-1.5 py-0.5 md:px-2 md:py-1 rounded-full mb-1 md:mb-2"
                style={{
                  color: DARK_BLUE_LIGHT,
                  backgroundColor: `${DARK_BLUE_LIGHT}10`,
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {account.tagline}
              </motion.span>
              <h3 className="text-sm md:text-lg font-semibold text-gray-900 tracking-tight">{account.name}</h3>
            </div>
            <div
              className="w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${DARK_BLUE_LIGHT}10` }}
            >
              <account.icon className="w-3 h-3 md:w-4 md:h-4" style={{ color: DARK_BLUE_LIGHT }} />
            </div>
          </div>

          {/* APY Display */}
            <div className="mb-2 md:mb-4 p-2 rounded-md md:p-4 rounded-lg md:rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-baseline gap-1 md:gap-2">
              <span
                className="text-xl md:text-2xl font-semibold tracking-tight"
              style={{ color: DARK_BLUE_LIGHT }}
              >
                {account.apy}
              </span>
              <span className="text-[10px] md:text-xs font-normal text-gray-500 uppercase tracking-wide">{account.apyLabel}</span>
            </div>
            <p className="text-[11px] md:text-sm text-gray-600 mt-1 md:mt-1.5 leading-relaxed line-clamp-2 md:line-clamp-none">{account.description}</p>
          </div>

          {/* Features list */}
          <div className="space-y-1 md:space-y-2 mb-2 md:mb-6 flex-1">
            {account.features.map((feature) => (
              <div key={feature} className="flex items-center gap-1.5 md:gap-2">
                <div
                  className="w-3 h-3 md:w-4 md:h-4 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${DARK_BLUE_LIGHT}15` }}
                >
                  <Check className="w-2 h-2 md:w-2.5 md:h-2.5" style={{ color: DARK_BLUE_LIGHT }} />
                </div>
                <span className="text-xs md:text-sm text-gray-600 font-normal">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/signup" className="relative w-full py-2 md:py-3 px-3 md:px-6 rounded-lg md:rounded-xl font-semibold text-xs md:text-sm tracking-wide overflow-hidden group/btn inline-flex items-center justify-center" style={{ backgroundColor: account.buttonColor || BUTTON_BLUE }}>
            <span className="relative z-10 text-white flex items-center justify-center gap-1 md:gap-2">
              Open Account
              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </motion.div>
            </span>
          </Link>
        </div>

      </motion.div>
    </motion.div>
  )
}

export function AccountsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section id="accounts" className="relative py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-white/80 to-transparent blur-2xl" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-amber-100/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div ref={ref} className="mb-14 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <motion.span
              className="inline-flex items-center rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: DARK_BLUE_LIGHT, backgroundColor: `${DARK_BLUE_LIGHT}10`, border: `1px solid rgba(30, 64, 175, 0.3)` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ delay: 0.1 }}
            >
              Our accounts
            </motion.span>
          </motion.div>

          <div className="mt-4 overflow-hidden">
            <motion.h2
              className="text-3xl font-semibold leading-tight tracking-tighter text-gray-900 md:text-5xl"
              initial={{ y: 60 }}
              animate={isInView ? { y: 0 } : { y: 60 }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.15 }}
            >
              Choose your <span style={{ color: DARK_BLUE_LIGHT }}>account</span>
            </motion.h2>
          </div>

          <motion.p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
          >
            Find the perfect account for your financial goals. Each account comes with powerful features.
          </motion.p>
        </div>

        {/* Account Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {accounts.map((account, index) => (
            <AccountCard key={account.id} account={account} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}