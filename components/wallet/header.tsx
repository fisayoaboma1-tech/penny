"use client"

import { Bell } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserAvatar } from "@/components/wallet/user-avatar"

export function WalletHeader({
  userName,
  profileImageUrl,
  onNotificationClick,
}: {
  userName: string
  profileImageUrl?: string
  onNotificationClick?: () => void
}) {
  const router = useRouter()

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/profile")} aria-label="Open your profile" className="rounded-full ring-1 ring-gray-200 transition hover:ring-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:ring-gray-700">
            <UserAvatar imageUrl={profileImageUrl} name={userName} className="h-9 w-9" />
          </button>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-none mb-1">Welcome back</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-none">{userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNotificationClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
