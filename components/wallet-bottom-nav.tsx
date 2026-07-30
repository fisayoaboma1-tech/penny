"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CreditCard, Grid, Home, Sparkles } from "lucide-react"

const items = [
  { label: "Home", icon: Home, path: "/wallet" },
  { label: "Card", icon: CreditCard, path: "/wallet/card" },
  { label: "Services", icon: Grid, path: "/wallet/services" },
  { label: "Rewards", icon: Sparkles, path: "/wallet/rewards" },
]

export default function WalletBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.08)] pb-10">
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
