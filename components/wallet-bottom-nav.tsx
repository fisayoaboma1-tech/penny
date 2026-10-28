"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeftRight,
  Bell,
  CircleHelp,
  CreditCard,
  Globe2,
  Home,
  LayoutGrid,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { useEffect, useState } from "react"

const primaryItems = [
  { label: "Home", icon: Home, path: "/wallet" },
  { label: "Activity", icon: Bell, path: "/notifications" },
  { label: "Cards", icon: CreditCard, path: "/wallet/card" },
  { label: "Transfer", icon: ArrowLeftRight, path: "/wallet/transfer" },
  { label: "Services", icon: LayoutGrid, path: "/wallet/services" },
]

const accountItems = [
  { label: "Profile", icon: UserRound, path: "/profile" },
  { label: "Security", icon: ShieldCheck, path: "/security" },
  { label: "Language", icon: Globe2, path: "/language" },
  { label: "Help center", icon: CircleHelp, path: "/help" },
]

const isItemActive = (pathname: string, path: string) => {
  if (path === "/wallet") {
    return pathname === path || ["/wallet/history", "/wallet/add-money"].includes(pathname)
  }
  if (path === "/profile") return pathname === path
  if (path === "/security") return pathname === path
  if (path === "/language") return pathname === path
  if (path === "/help") return pathname === path
  return pathname === path || pathname.startsWith(`${path}/`)
}

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
        <div className="mx-auto flex max-w-lg items-center justify-around gap-1 px-3 py-2">
          {[
            primaryItems[0],
            primaryItems[2],
            primaryItems[1],
            accountItems[0],
          ].map((item) => {
            const Icon = item.icon
            const isActive = isItemActive(pathname, item.path) ||
              (item.path === "/profile" && ["/security", "/language"].includes(pathname))

            return (
              <Link
                key={item.label}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-semibold transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-[19px] w-[19px]" strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-200/80 bg-white px-4 py-6 shadow-[8px_0_30px_rgba(15,23,42,0.035)] lg:flex">
        <Link href="/wallet" className="mb-9 flex items-center gap-3 px-2" aria-label="Pennywise home">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <span className="text-xl font-bold tracking-tight">p</span>
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-slate-900">pennywise</span>
        </Link>

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Workspace
        </p>
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {primaryItems.map((item) => {
            const Icon = item.icon
            const isActive = isItemActive(pathname, item.path)

            return (
              <Link
                key={item.label}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 1.8} />
                {item.label}
                {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-600" />}
              </Link>
            )
          })}
        </nav>

        <div className="mb-2 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Account
        </div>
        <nav aria-label="Account navigation" className="flex flex-col gap-1">
          {accountItems.map((item) => {
            const Icon = item.icon
            const isActive = isItemActive(pathname, item.path)

            return (
              <Link
                key={item.label}
                href={item.path}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.25 : 1.8} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="text-xs font-semibold text-slate-800">Need a hand?</p>
          <p className="mt-1 text-[11px] leading-5 text-slate-500">Visit the help center for account support.</p>
          <Link href="/help" className="mt-2 inline-flex text-xs font-semibold text-blue-700 hover:text-blue-800">
            Get support
          </Link>
        </div>
      </aside>
    </>
  )
}