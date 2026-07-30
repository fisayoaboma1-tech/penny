"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Grid, Home, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

const items = [
  { label: "Home", icon: Home, path: "/wallet" },
  { label: "Card", icon: CreditCard, path: "/wallet/card" },
  { label: "Services", icon: Grid, path: "/wallet/services" },
  { label: "Rewards", icon: Sparkles, path: "/wallet/rewards" },
]

export default function WalletBottomNav() {
  const pathname = usePathname()
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const viewport = window.visualViewport

    const updateKeyboardOffset = () => {
      const nextOffset = viewport
        ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)
        : 0

      setKeyboardOffset(nextOffset > 120 ? nextOffset : 0)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setKeyboardOffset(0)
      }
    }

    const handleFocusChange = () => {
      const activeElement = document.activeElement as HTMLElement | null
      const isTextInput = activeElement?.tagName && ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName)

      if (isTextInput) {
        updateKeyboardOffset()
      } else {
        setKeyboardOffset(0)
      }
    }

    updateKeyboardOffset()

    viewport?.addEventListener("resize", updateKeyboardOffset)
    viewport?.addEventListener("scroll", updateKeyboardOffset)
    window.addEventListener("resize", updateKeyboardOffset)
    window.addEventListener("orientationchange", updateKeyboardOffset)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("focusin", handleFocusChange)
    document.addEventListener("focusout", handleFocusChange)

    return () => {
      viewport?.removeEventListener("resize", updateKeyboardOffset)
      viewport?.removeEventListener("scroll", updateKeyboardOffset)
      window.removeEventListener("resize", updateKeyboardOffset)
      window.removeEventListener("orientationchange", updateKeyboardOffset)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("focusin", handleFocusChange)
      document.removeEventListener("focusout", handleFocusChange)
    }
  }, [])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)] pb-3"
      style={{
        visibility: keyboardOffset > 0 ? "hidden" : "visible",
        opacity: keyboardOffset > 0 ? 0 : 1,
        pointerEvents: keyboardOffset > 0 ? "none" : "auto",
        transform: keyboardOffset > 0 ? "translateY(120%)" : "translateY(0)",
        bottom: 0,
        paddingBottom: "0.75rem",
        transition: "opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-3 py-2 sm:px-4">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 text-[10px] font-semibold transition ${isActive ? "bg-[#eef5ff] text-[#0f6cff]" : "text-slate-500 hover:bg-[#f8faff]"}`}
            >
              <Icon className="h-4.5 w-4.5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
