"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, LogOut } from "lucide-react"

export function SignOutModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-[#0a0a0a] border border-[#1a1a1a] rounded-3xl p-6 shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Sign Out</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors border border-[#252525]"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                Are you sure you want to sign out? You'll need to log in again to access your wallet.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-[#111111] text-gray-300 hover:bg-[#1a1a1a] transition-colors border border-[#1a1a1a]"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3.5 rounded-2xl font-semibold text-sm bg-[#111111] text-red-400 hover:bg-red-500/10 transition-colors border border-red-500/20 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
