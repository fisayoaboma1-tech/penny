"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, HelpCircle, Mail, Phone } from "lucide-react"

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const tagLabel = "Online Banking"

  return (
    <>
      {/* Floating Chat Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0f6cff] text-white shadow-lg shadow-[#0f6cff]/30 transition-all hover:bg-[#0a5ad9] hover:shadow-[#0f6cff]/40 hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8"
        aria-label="Live chat support"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-24 right-4 z-50 w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 sm:bottom-28 sm:right-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#0f6cff] to-[#0a5ad9] px-5 py-4">
                <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Chat</h3>
                  <p className="text-[10px] text-blue-100">We typically reply in minutes</p>
                </div>
              </div>
              <div className="mt-2 rounded-2xl bg-white/10 px-4 py-2 text-[10px] font-medium text-white shadow-inner shadow-white/5">
                Tag: {tagLabel}
              </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <HelpCircle className="h-4 w-4 text-[#0f6cff]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Hi! How can we help you today?</p>
                      <p className="text-xs text-slate-500 mt-1">
                        Our support team is ready to assist you with any questions or issues.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      router.push("/help")
                      setIsOpen(false)
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-[#0f6cff]/30 hover:bg-blue-50"
                  >
                    <HelpCircle className="h-5 w-5 text-[#0f6cff]" />
                    <span className="text-[10px] font-medium text-slate-700">Help Center</span>
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = "mailto:support@pennyiseltd@gmail.com"
                      setIsOpen(false)
                    }}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center transition hover:border-[#0f6cff]/30 hover:bg-blue-50"
                  >
                    <Mail className="h-5 w-5 text-[#0f6cff]" />
                    <span className="text-[10px] font-medium text-slate-700">Email Us</span>
                  </button>
                </div>

                {/* Chat input */}
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 bg-transparent px-2 py-1.5 text-sm text-slate-900 placeholder-slate-400 outline-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && message.trim()) {
                        const subject = encodeURIComponent("Live Chat Support")
                        const body = encodeURIComponent(message.trim())
                        window.open(`mailto:support@pennyiseltd@gmail.com?subject=${subject}&body=${body}`, "_blank")
                        setMessage("")
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (message.trim()) {
                        const subject = encodeURIComponent("Live Chat Support")
                        const body = encodeURIComponent(message.trim())
                        window.open(`mailto:support@pennyiseltd@gmail.com?subject=${subject}&body=${body}`, "_blank")
                        setMessage("")
                      }
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0f6cff] text-white transition hover:bg-[#0a5ad9]"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}