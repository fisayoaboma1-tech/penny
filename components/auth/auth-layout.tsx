"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowUpRight, Fingerprint, ShieldCheck, WalletCards } from "lucide-react"
import Link from "next/link"

interface AuthLayoutProps {
  eyebrow: string
  sideTitle: string
  sideDescription: string
  children: ReactNode
}

export function AuthLayout({ eyebrow, sideTitle, sideDescription, children }: AuthLayoutProps) {
  const router = useRouter()

  return (
    <div className="min-h-svh bg-[#f7f9fc] lg:grid lg:grid-cols-2">
      <aside className="relative hidden min-h-svh overflow-hidden bg-[#081a35] px-12 py-10 text-white lg:flex lg:flex-col xl:px-16">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-36 -top-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-[100px]" />
          <div className="absolute -bottom-48 right-[-8rem] h-[34rem] w-[34rem] rounded-full bg-cyan-400/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:26px_26px] opacity-30" />
        </div>

        <Link href="/" className="relative flex w-fit items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <Fingerprint className="h-6 w-6 text-blue-200" />
          </span>
          <span className="text-sm font-semibold tracking-[0.22em]">PENNY<span className="text-blue-300">WISE</span></span>
        </Link>

        <div className="relative my-auto max-w-xl py-16">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-blue-200">{eyebrow}</p>
          <h2 className="max-w-lg text-4xl font-semibold leading-[1.13] tracking-tight xl:text-5xl">{sideTitle}</h2>
          <p className="mt-5 max-w-md text-base leading-7 text-slate-300">{sideDescription}</p>

          <div className="mt-12 max-w-md rounded-3xl border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-400/15 text-blue-200">
                  <WalletCards className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Your Pennywise wallet</p>
                  <p className="mt-1 text-xs text-slate-300">Money moves better with a plan</p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-slate-400" />
            </div>
            <div className="my-5 h-px bg-white/10" />
            <div className="flex items-center gap-2 text-sm text-slate-200">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              A secure space for your everyday money
            </div>
          </div>
        </div>

        <p className="relative text-xs text-slate-400">A little more confidence in every day.</p>
      </aside>

      <main className="flex min-h-svh flex-col px-5 py-5 sm:px-10 lg:px-14 xl:px-20">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Fingerprint className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold tracking-[0.16em] text-slate-800">PENNY<span className="text-blue-600">WISE</span></span>
          </Link>
          <span className="hidden lg:block" />
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </header>

        <div className="mx-auto flex w-full max-w-[420px] flex-1 items-center py-8 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export function AuthProgress({ currentStep, steps }: { currentStep: number; steps: string[] }) {
  return (
    <ol aria-label="Form progress" className="mb-8 grid grid-cols-2 gap-3">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isComplete = stepNumber < currentStep
        const isCurrent = stepNumber === currentStep

        return (
          <li key={step} aria-current={isCurrent ? "step" : undefined} className="min-w-0">
            <div className={`mb-2 h-1 rounded-full ${stepNumber <= currentStep ? "bg-blue-600" : "bg-slate-200"}`} />
            <span className={`text-xs font-medium ${isCurrent ? "text-blue-700" : isComplete ? "text-slate-600" : "text-slate-400"}`}>
              <span className="mr-1.5">{String(stepNumber).padStart(2, "0")}</span>{step}
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export function AuthSuccess({ title, description }: { title: string; description: string }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-[300px] flex-col items-center justify-center py-10 text-center"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.1 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60"
      >
        <motion.svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden="true">
          <motion.path
            d="m5 12 4 4L19 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.45, delay: 0.25 }}
          />
        </motion.svg>
      </motion.div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-7 flex items-center gap-2 text-xs font-medium text-emerald-700">
        <ShieldCheck className="h-4 w-4" />
        Your account is ready
      </div>
    </motion.div>
  )
}
