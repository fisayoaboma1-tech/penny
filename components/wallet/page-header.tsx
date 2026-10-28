"use client"

import { useRouter } from "next/navigation"
import { ChevronLeft, Bell } from "lucide-react"
import { UserAvatar } from "@/components/wallet/user-avatar"

interface PageHeaderProps {
  /** "main" = profile + greeting + actions (wallet home), "sub" = back button + title */
  variant?: "main" | "sub"

  // ── Main variant props ──
  userName?: string
  profileImageUrl?: string | null
  greeting?: string

  // ── Sub variant props ──
  title?: string
  onBack?: () => void
}

function PageHeaderComponent({
  variant = "sub",
  userName = "User",
  profileImageUrl,
  greeting = "Hello",
  title,
  onBack,
}: PageHeaderProps) {
  const router = useRouter()

  if (variant === "main") {
    return (
      <header className="fixed inset-x-0 top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => router.push("/profile")}
              aria-label="Open your profile"
              className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition hover:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:h-11 sm:w-11"
            >
              <UserAvatar imageUrl={profileImageUrl} name={userName} className="h-full w-full" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">
                {greeting}!
              </p>
              <h1 className="truncate text-sm font-medium text-slate-900">
                {userName}
              </h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="View wallet activity"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:h-10 sm:w-10"
              onClick={() => router.push("/notifications")}
            >
              <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            </button>
          </div>
        </div>
      </header>
    )
  }

  return (
    <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 w-full items-center sm:h-20">
          {onBack && (
            <button
              onClick={onBack}
              aria-label="Go back"
              className="mr-3 -ml-2 rounded-xl p-2 text-slate-500 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:mr-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <div className="min-w-0">
            <p className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 sm:block">Pennywise</p>
            <h1 className="truncate text-base font-semibold tracking-tight text-slate-900 sm:text-lg">
              {title || ""}
            </h1>
          </div>
        </div>
      </div>
    </div>
  )
}

export { PageHeaderComponent as PageHeader, PageHeaderComponent as WalletPageHeader }