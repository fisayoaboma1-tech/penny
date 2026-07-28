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
            <div className="relative mx-4 rounded-2xl border border-red-500/20 bg-[#111111]/95 backdrop-blur-xl p-8 shadow-2xl">
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
                  <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <UserX className="w-8 h-8 text-red-400" />
                  </div>
                </div>

                {/* Title and description */}
                <div className="text-center space-y-2">
                  <h2 className="text-3xl font-medium text-white tracking-tight">
                    Delete User
                  </h2>
                  <p className="text-gray-400 text-sm font-light">
                    Are you sure you want to delete this user?
                  </p>
                  <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-3 mt-4">
                    <p className="text-sm text-gray-300">
                      User: <span className="text-white font-medium">{userName}</span>
                    </p>
                  </div>
                  <div className="flex items-start gap-2 bg-yellow-500/5 border border-yellow-500/10 rounded-lg p-3 mt-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-400 text-left">
                      This action cannot be undone. All user data will be permanently removed from the system.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={onConfirm}
                    className="w-full bg-gradient-to-br from-red-500 to-red-700 text-white py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-red-950/40 hover:shadow-red-950/60 transition-all"
                  >
                    Yes, Delete User
                  </Button>
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="w-full bg-transparent border border-[#1a1a1a] text-gray-300 hover:bg-[#1a1a1a] hover:text-white py-3.5 rounded-xl font-medium text-sm transition-all"
                  >
                    Cancel
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
