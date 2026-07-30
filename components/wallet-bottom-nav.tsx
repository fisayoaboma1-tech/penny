"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Home, User } from "lucide-react"
import { useEffect, useState } from "react"

const items = [
  { label: "Home", icon: Home, path: "/wallet" },
  { label: "Card", icon: CreditCard, path: "/wallet/card" },
  { label: "Profile", icon: User, path: "/profile" },
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
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)] lg:hidden"
        style={{
          visibility: keyboardVisible ? "hidden" : "visible",
          opacity: keyboardVisible ? 0 : 1,
          pointerEvents: keyboardVisible ? "none" : "auto",
          transform: keyboardVisible ? "translateY(120%)" : "translateY(0)",
          paddingBottom: "env(safe-area-inset-bottom, 0.5rem)",
          transition: "opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease",
        }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1 px-2 py-1.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`inline-flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[10px] font-semibold transition ${
                  isActive
                    ? "bg-[#eef5ff] text-[#0f6cff]"
                    : "text-slate-500 hover:bg-[#f8faff]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-28 flex-col border-r border-slate-200/80 bg-white/95 px-3 py-6 shadow-[10px_0_30px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:flex">
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
            <img
              src="https://res.cloudinary.com/qz5m8bhg/image/upload/v1785353346/Pngtree_letter_p_icon_8622509_grhaye.png"
              alt="Pennywise logo"
              className="h-8 w-8 object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.path

            return (
              <Link
                key={item.label}
                href={item.path}
                className={`flex flex-col items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-semibold transition ${isActive ? "bg-[#eef5ff] text-[#0f6cff]" : "text-slate-500 hover:bg-[#f8faff] hover:text-slate-900"}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </aside>
    </>
  )
}