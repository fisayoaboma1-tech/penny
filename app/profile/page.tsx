"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { ChevronLeft, LogOut, Camera } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, signOut, isAdmin, profile: authProfile } = useAuth()
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use authProfile if available, otherwise fallback to user metadata
  const profile = authProfile || {
    full_name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User",
    email: user?.email,
    profile_image_url:
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.profile_image ||
      "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785155266/profilr_n29abb.jpg",
  }

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (isAdmin) {
        router.push("/dashboard")
      }
    }
  }, [loading, user, isAdmin, router])

  const handleImageUpdate = (url: string) => {
    // Update the profile image in the database
    if (user) {
      supabase
        .from("profiles")
        .update({ profile_image_url: url })
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) {
            console.error("Error updating profile image:", error)
          }
        })
    }
  }

  const compressImage = (file: File): Promise<File> => {
    if (!file.type.startsWith("image/")) {
      return Promise.resolve(file)
    }

    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          const maxSize = 1400
          const canvas = document.createElement("canvas")
          let { width, height } = img

          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width)
              width = maxSize
            }
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d")
          ctx?.drawImage(img, 0, 0, width, height)

          const mimeType = "image/webp"
          const quality = 0.82

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file)
                return
              }

              const extension = ".webp"
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, extension), { type: mimeType }))
            },
            mimeType,
            quality
          )
        }
        img.onerror = () => resolve(file)
        img.src = reader.result as string
      }
      reader.onerror = () => resolve(file)
      reader.readAsDataURL(file)
    })
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const optimizedFile = await compressImage(file)
      const formData = new FormData()
      formData.append("file", optimizedFile)

      const uploadResponse = await new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/api/upload")

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percent)
          }
        }

        xhr.onload = () => {
          resolve(new Response(xhr.responseText || "", {
            status: xhr.status,
            headers: { "Content-Type": "application/json" },
          }))
        }

        xhr.onerror = () => reject(new Error("Upload failed"))
        xhr.send(formData)
      })

      const responseText = await uploadResponse.text()
      let data: any = {}

      if (responseText) {
        try {
          data = JSON.parse(responseText)
        } catch (parseError) {
          data = { error: responseText }
        }
      }

      if (!uploadResponse.ok) {
        throw new Error(data.error || data.message || `Upload failed (${uploadResponse.status})`)
      }

      const imageUrl = data.url
      if (!imageUrl) {
        throw new Error("Upload did not return an image URL")
      }

      // Update profile image in database
      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: imageUrl })
        .eq("id", user.id)

      if (error) {
        throw new Error(error.message || error.details || "Failed to update profile image")
      }

      // Update user metadata as well for immediate display
      await supabase.auth.updateUser({
        data: {
          avatar_url: imageUrl,
          profile_image: imageUrl,
        }
      })

      setUploadProgress(100)
    } catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error)
      console.error("Error uploading image:", message)
      setUploadProgress(0)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      window.setTimeout(() => setUploadProgress(0), 400)
    }
  }

  if (loading || !user) {
    return null
  }

  // Use authProfile data when available, fallback to user metadata
  const phoneValue = authProfile?.phone_number || user.user_metadata?.phone || "8827727727288"
  const displayName = authProfile?.full_name || user.user_metadata?.full_name || "Clinto peter"
  const memberSince = new Date(authProfile?.created_at || user.created_at || "2025-01-01").toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })

  const handleLogout = async () => {
    await signOut()
    router.push("/login")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="relative z-10 flex">
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-200">
            <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/wallet")}
                  className="p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Back to wallet"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 sm:px-6 py-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-2xl"
            >
              <motion.div variants={itemVariants} className="mb-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative flex items-center justify-center">
                      <div className="relative h-24 w-24 sm:h-28 sm:w-28">
                        <svg className="absolute -inset-1 h-[calc(100%+8px)] w-[calc(100%+8px)] -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="rgba(148, 163, 184, 0.15)"
                            strokeWidth="4"
                            fill="none"
                            className={uploading ? "opacity-100" : "opacity-0"}
                            style={{ transition: "opacity 0.3s ease" }}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="46"
                            stroke="#3b82f6"
                            strokeWidth="4"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={289.03}
                            strokeDashoffset={uploading ? 289.03 - (289.03 * uploadProgress) / 100 : 289.03}
                            style={{ transition: "stroke-dashoffset 0.3s ease-out, opacity 0.3s ease" }}
                            className={uploading ? "opacity-100" : "opacity-0"}
                          />
                        </svg>

                        <img
                          src={profile?.profile_image_url}
                          alt={displayName}
                          className="h-full w-full rounded-full border-2 border-slate-100 object-cover relative z-10"
                        />

                        <button
                          onClick={handleCameraClick}
                          disabled={uploading}
                          className="absolute -bottom-0.5 -right-0.5 z-20 bg-white rounded-full p-2 shadow-md border border-slate-200 hover:bg-slate-100 transition-colors disabled:opacity-50"
                          title="Change profile photo"
                        >
                          <Camera className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />

                    <div className="text-center">
                      <h2 className="text-xl font-bold text-slate-900">
                        {displayName}
                      </h2>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {user.email}
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                          Member since {memberSince}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-5">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">
                    Personal Information
                  </h3>
                  <p className="text-xs text-slate-500 mb-5">
                    Update your profile details
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <p className="text-sm font-medium text-slate-900">
                        {displayName}
                      </p>
                      <div className="mt-1.5 h-px bg-slate-100" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                        Email Address
                      </label>
                      <p className="text-sm font-medium text-slate-900">
                        {user.email}
                      </p>
                      <div className="mt-1.5 h-px bg-slate-100" />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <p className="text-sm font-medium text-slate-900">
                        {phoneValue}
                      </p>
                      <div className="mt-1.5 h-px bg-slate-100" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-rose-600 shadow-sm transition-all hover:bg-rose-50 hover:border-rose-200 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}