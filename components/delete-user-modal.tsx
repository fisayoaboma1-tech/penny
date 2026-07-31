"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, AlertTriangle, UserX } from "lucide-react"
import { Button } from "./ui/button"

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName: string
}

export function DeleteUserModal({ isOpen, onClose, onConfirm, userName }: DeleteUserModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
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
            <div className="relative mx-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/70">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="space-y-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                    <UserX className="w-8 h-8 text-red-500" />
                  </div>
                </div>

                {/* Title and description */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-medium text-slate-900 tracking-tight">
                    Remove User
                  </h2>
                  <p className="text-slate-500 text-sm font-light">
                    This will permanently remove the selected account from the system.
                  </p>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mt-4 text-left">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400">Selected Account</p>
                    <p className="mt-2 text-sm text-slate-900 font-medium">{userName}</p>
                  </div>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg p-3 mt-3 text-left">
                    <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      This action is irreversible. The user profile and associated access will be removed permanently.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={onConfirm}
                    className="w-full bg-gradient-to-br from-red-500 to-red-600 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-red-100 transition-all"
                  >
                    Confirm Removal
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 py-3.5 rounded-xl font-medium text-sm transition-all"
                  >
                    Keep Account
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
