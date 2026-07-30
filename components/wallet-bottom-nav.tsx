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
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const viewport = window.visualViewport

    const updateKeyboardState = () => {
      const keyboardOpen = viewport
        ? window.innerHeight - viewport.height - viewport.offsetTop > 120
        : false

      setKeyboardVisible(keyboardOpen)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setKeyboardVisible(false)
      }
    }

    const handleFocusChange = () => {
      const activeElement = document.activeElement as HTMLElement | null
      const isTextInput = activeElement?.tagName && ["INPUT", "TEXTAREA", "SELECT"].includes(activeElement.tagName)

      if (isTextInput) {
        updateKeyboardState()
      } else {
        setKeyboardVisible(false)
      }
    }

    updateKeyboardState()

    viewport?.addEventListener("resize", updateKeyboardState)
    window.addEventListener("resize", updateKeyboardState)
    window.addEventListener("orientationchange", updateKeyboardState)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("focusin", handleFocusChange)
    document.addEventListener("focusout", handleFocusChange)

    return () => {
      viewport?.removeEventListener("resize", updateKeyboardState)
      window.removeEventListener("resize", updateKeyboardState)
      window.removeEventListener("orientationchange", updateKeyboardState)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      document.removeEventListener("focusin", handleFocusChange)
      document.removeEventListener("focusout", handleFocusChange)
    }
  }, [])

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)] pb-5"
      style={{
        visibility: keyboardVisible ? "hidden" : "visible",
        opacity: keyboardVisible ? 0 : 1,
        pointerEvents: keyboardVisible ? "none" : "auto",
        transform: keyboardVisible ? "translateY(120%)" : "translateY(0)",
        bottom: 0,
        paddingBottom: "1.25rem",
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
