"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, DollarSign } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface EditBalanceModalProps {
  isOpen: boolean
  onClose: () => void
  user: { id: string; full_name: string; email: string; balance: number } | null
  onSave: (newBalance: number) => void
}

export function EditBalanceModal({ isOpen, onClose, user, onSave }: EditBalanceModalProps) {
  const [balance, setBalance] = useState("")

  const formatCurrencyValue = (value: string) => {
    const sanitized = value.replace(/[^\d.]/g, "")
    if (!sanitized) return ""

    const [wholePart, decimalPart] = sanitized.split(".")
    const cleanedWhole = wholePart.replace(/^0+(?=\d)/, "") || "0"
    const formattedWhole = cleanedWhole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    if (decimalPart === undefined) return formattedWhole
    return `${formattedWhole}.${decimalPart.slice(0, 2)}`
  }

  const parseCurrencyValue = (value: string) => {
    const sanitized = value.replace(/,/g, "")
    const parsed = Number.parseFloat(sanitized)
    return Number.isFinite(parsed) ? parsed : NaN
  }

  const formatCurrencyDisplay = (value: number | string) => {
    const amount = typeof value === "number" ? value : parseCurrencyValue(value)
    if (Number.isNaN(amount)) return "0.00"

    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  useEffect(() => {
    if (user) {
      setBalance(formatCurrencyValue(user.balance.toFixed(2)))
    }
  }, [user?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const newBalance = parseCurrencyValue(balance)
    if (Number.isNaN(newBalance) || newBalance < 0) {
      alert("Please enter a valid balance amount")
      return
    }

    onSave(newBalance)
    onClose()
  }

  const getPreviewBalance = () => {
    if (!user || !balance) return formatCurrencyDisplay(user.balance)
    return formatCurrencyDisplay(balance)
  }

  return (
    <AnimatePresence>
      {isOpen && user && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed top-[50%] left-[50%] z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative mx-4 rounded-3xl border border-slate-300 bg-white p-7 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.4)]">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-slate-50">
                    <DollarSign className="h-8 w-8 text-[#0f6cff]" />
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Edit Balance
                  </h2>
                  <p className="text-sm font-medium text-slate-500">
                    Update balance for {user.full_name}
                  </p>
                  <p className="text-sm text-slate-500">
                    Current balance: <span className="font-semibold text-[#0f6cff]">${formatCurrencyDisplay(user.balance)}</span>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-slate-700">
                      New Balance
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </span>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={balance}
                        onChange={(e) => setBalance(formatCurrencyValue(e.target.value))}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Preview
                    </p>
                    <p className="text-xl font-semibold text-[#0f6cff]">
                      ${getPreviewBalance()}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-br from-[#0f6cff] to-[#4da3ff] py-3.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300"
                  >
                    Save Changes
                  </Button>
                </form>

                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="text-sm font-medium text-slate-500 transition hover:text-slate-900"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
