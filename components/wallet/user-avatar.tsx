"use client"

import { useState } from "react"
import { UserRound } from "lucide-react"

const placeholderAvatarUrls = [
  "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png",
  "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785155266/profilr_n29abb.jpg",
  "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg",
]

export function getUserAvatarUrl(...urls: Array<string | null | undefined>) {
  return urls.find((url) => url && !placeholderAvatarUrls.includes(url)) || null
}

export function UserAvatar({
  imageUrl,
  name,
  className = "h-10 w-10",
}: {
  imageUrl?: string | null
  name: string
  className?: string
}) {
  const actualImageUrl = getUserAvatarUrl(imageUrl)
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null)
  if (actualImageUrl && failedImageUrl !== actualImageUrl) {
    return (
      <img
        src={actualImageUrl}
        alt={`${name}'s profile`}
        className={`${className} rounded-full object-cover`}
        onError={() => setFailedImageUrl(actualImageUrl)}
      />
    )
  }

  return (
    <span
      aria-label={`${name}'s profile photo not set`}
      role="img"
      className={`inline-flex items-center justify-center rounded-full bg-slate-100 text-slate-400 ring-1 ring-inset ring-slate-200 ${className}`}
    >
      <UserRound aria-hidden="true" className="h-1/2 w-1/2" strokeWidth={1.6} />
    </span>
  )
}
