"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { X, DollarSign, AlertTriangle } from "lucide-react"
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
  const [addAmount, setAddAmount] = useState("")
  const [subtractAmount, setSubtractAmount] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)

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
    setAddAmount("")
    setSubtractAmount("")
    setShowConfirmation(false)
  }, [user?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const add = parseCurrencyValue(addAmount)
    const subtract = parseCurrencyValue(subtractAmount)
    
    const newBalance = user.balance + (Number.isNaN(add) ? 0 : add) - (Number.isNaN(subtract) ? 0 : subtract)
    
    if (newBalance < 0) {
      alert("Balance cannot be negative")
      return
    }

    onSave(newBalance)
    onClose()
  }

  const getPreviewBalance = () => {
    if (!user) return 0
    
    const add = parseCurrencyValue(addAmount)
    const subtract = parseCurrencyValue(subtractAmount)
    
    return user.balance + (Number.isNaN(add) ? 0 : add) - (Number.isNaN(subtract) ? 0 : subtract)
  }

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowConfirmation(true)
  }

  const confirmSave = () => {
    setShowConfirmation(false)
    handleSubmit(new Event("submit") as any)
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

          {/* Main Modal */}
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
                  {/* Add Amount */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-emerald-700">
                      Add Amount
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </span>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={addAmount}
                        onChange={(e) => setAddAmount(formatCurrencyValue(e.target.value))}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-emerald-200 bg-white py-3 pl-9 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                      />
                    </div>
                  </div>

                  {/* Subtract Amount */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-rose-700">
                      Subtract Amount
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        $
                      </span>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={subtractAmount}
                        onChange={(e) => setSubtractAmount(formatCurrencyValue(e.target.value))}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-rose-200 bg-white py-3 pl-9 pr-4 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-100"
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  <div className="rounded-2xl border-2 border-[#0f6cff] bg-blue-50 p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">
                      Balance Preview
                    </p>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600">
                        Current: <span className="font-semibold">${formatCurrencyDisplay(user.balance)}</span>
                      </p>
                      {(addAmount || subtractAmount) && (
                        <>
                          {addAmount && (
                            <p className="text-xs text-emerald-600">
                              + Add: <span className="font-semibold">${formatCurrencyDisplay(addAmount)}</span>
                            </p>
                          )}
                          {subtractAmount && (
                            <p className="text-xs text-rose-600">
                              - Subtract: <span className="font-semibold">${formatCurrencyDisplay(subtractAmount)}</span>
                            </p>
                          )}
                          <div className="border-t border-blue-200 pt-2 mt-2">
                            <p className="text-2xl font-bold text-[#0f6cff]">
                              ${formatCurrencyDisplay(getPreviewBalance())}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleSaveClick}
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

          {/* Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm"
                  onClick={() => setShowConfirmation(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="fixed top-[50%] left-[50%] z-[60] w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="mx-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-50">
                        <AlertTriangle className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Confirm Changes
                        </h3>
                        <p className="text-sm text-slate-500">
                          Are you sure you want to save these changes?
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                        Summary
                      </p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Current Balance:</span>
                          <span className="font-semibold text-slate-900">${formatCurrencyDisplay(user.balance)}</span>
                        </div>
                        {(addAmount || subtractAmount) && (
                          <>
                            {addAmount && (
                              <div className="flex justify-between text-emerald-600">
                                <span>Add:</span>
                                <span className="font-semibold">+${formatCurrencyDisplay(addAmount)}</span>
                              </div>
                            )}
                            {subtractAmount && (
                              <div className="flex justify-between text-rose-600">
                                <span>Subtract:</span>
                                <span className="font-semibold">-${formatCurrencyDisplay(subtractAmount)}</span>
                              </div>
                            )}
                            <div className="flex justify-between border-t border-slate-200 pt-1 mt-1">
                              <span className="font-semibold text-slate-900">New Balance:</span>
                              <span className="font-bold text-[#0f6cff]">${formatCurrencyDisplay(getPreviewBalance())}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => setShowConfirmation(false)}
                        className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        No, Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={confirmSave}
                        className="flex-1 rounded-xl bg-gradient-to-br from-[#0f6cff] to-[#4da3ff] py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:shadow-blue-300"
                      >
                        Yes, Save
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
