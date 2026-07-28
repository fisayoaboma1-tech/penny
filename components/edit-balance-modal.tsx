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

  useEffect(() => {
    if (user) {
      setBalance(user.balance.toFixed(2))
    }
  }, [user?.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return

    const newBalance = parseFloat(balance)
    if (isNaN(newBalance) || newBalance < 0) {
      alert("Please enter a valid balance amount")
      return
    }

    onSave(newBalance)
    onClose()
  }

  const getPreviewBalance = () => {
    if (!user || !balance) return user?.balance.toFixed(2) || "0.00"
    
    const amount = parseFloat(balance)
    if (isNaN(amount)) return user.balance.toFixed(2)

    return amount.toFixed(2)
  }

  return (
    <AnimatePresence>
      {isOpen && user && (
        <>
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed top-[50%] left-[50%] z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative mx-4 rounded-2xl border border-[#1a1a1a] bg-[#111111]/95 backdrop-blur-xl p-8 shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>

                {/* Title and description */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-medium text-white tracking-tight">
                    Edit Balance
                  </h2>
                  <p className="text-gray-400 text-sm font-light">
                    Update balance for {user.full_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Current balance: <span className="text-emerald-400 font-semibold">${user.balance.toFixed(2)}</span>
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm font-medium">
                      New Balance
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 appearance-none bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-white placeholder:text-gray-500 text-sm font-normal focus:outline-none focus:border-emerald-500/30 transition-all"
                    />
                  </div>

                  {/* Preview */}
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Preview</p>
                    <p className="text-lg font-semibold text-emerald-400">
                      ${getPreviewBalance()}
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-950/40 hover:shadow-emerald-950/60 transition-all"
                  >
                    Save Changes
                  </Button>
                </form>

                {/* Cancel button */}
                <div className="text-center">
                  <button
                    onClick={onClose}
                    className="text-gray-400 text-sm font-medium hover:text-white transition-colors"
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
