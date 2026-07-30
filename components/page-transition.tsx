"use client"

import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [pageKey, setPageKey] = useState(pathname)
  const prevHistoryIndexRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const currentHistoryIndex = window.history.state?.idx ?? 0
    prevHistoryIndexRef.current = currentHistoryIndex
    setPageKey(pathname)
  }, [pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 10, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.995 }}
        transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        className="relative min-h-screen overflow-hidden"
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
