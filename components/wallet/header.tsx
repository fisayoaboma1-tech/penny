"use client"

import { Bell, Headphones } from "lucide-react"

export function WalletHeader({
  userName,
  profileImageUrl,
  onNotificationClick,
  onSupportClick,
}: {
  userName: string
  profileImageUrl?: string
  onNotificationClick?: () => void
  onSupportClick?: () => void
}) {
  const defaultImage = "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"
  const imageUrl = profileImageUrl || defaultImage

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shadow-sm ring-1 ring-gray-100">
            <img
              src={imageUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 leading-none mb-1">Welcome back</p>
            <p className="text-sm font-medium text-gray-900 leading-none">{userName}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSupportClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            aria-label="Support"
          >
            <Headphones className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onNotificationClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
