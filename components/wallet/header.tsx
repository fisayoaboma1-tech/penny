"use client"

import { Bell } from "lucide-react"
import { useEffect } from "react"

export function WalletHeader({
  userName,
  profileImageUrl,
  onNotificationClick,
}: {
  userName: string
  profileImageUrl?: string
  onNotificationClick?: () => void
}) {
  const defaultImage = "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"
  const imageUrl = profileImageUrl || defaultImage

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 dark:bg-gray-950 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm ring-1 ring-gray-100 dark:ring-gray-800">
            <img
              src={imageUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
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
