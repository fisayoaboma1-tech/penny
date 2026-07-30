"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [direction, setDirection] = useState(1)
  const [historyIndex, setHistoryIndex] = useState<number | null>(null)
  const [pageKey, setPageKey] = useState(pathname)

  useEffect(() => {
    if (typeof window === "undefined") return
    const idx = window.history.state?.idx ?? 0
    setHistoryIndex(idx)
    setPageKey(pathname)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return
    const idx = window.history.state?.idx ?? 0
    if (historyIndex !== null) {
      setDirection(idx >= historyIndex ? 1 : -1)
    }
    setHistoryIndex(idx)
    setPageKey(pathname)
  }, [pathname, historyIndex])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, x: direction * 30 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -direction * 30 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
