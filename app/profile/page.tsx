"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { ChevronLeft, LogOut, Camera } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, signOut, isAdmin, profile: authProfile } = useAuth()
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
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
          const maxSize = 800 // Reduced from 1400 for faster processing
          const canvas = document.createElement("canvas")
          let { width, height } = img

          // Skip compression if image is already small enough
          if (width <= maxSize && height <= maxSize) {
            resolve(file)
            return
          }

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
          const quality = 0.75 // Reduced from 0.82 for faster compression

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
      // Use setTimeout to allow UI to update before heavy processing
      await new Promise(resolve => setTimeout(resolve, 50))
      
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

      // Update profile image in database and user metadata in parallel
      const [profileUpdate, authUpdate] = await Promise.all([
        supabase
          .from("profiles")
          .update({ profile_image_url: imageUrl })
          .eq("id", user.id),
        supabase.auth.updateUser({
          data: {
            avatar_url: imageUrl,
            profile_image: imageUrl,
          }
        })
      ])

      if (profileUpdate.error) {
        throw new Error(profileUpdate.error.message || profileUpdate.error.details || "Failed to update profile image")
      }

      if (authUpdate.error) {
        console.error("Error updating user metadata:", authUpdate.error)
      }

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

  // Show signing out overlay
  if (isSigningOut) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-6">
          <div className="loader" />
          <p className="text-sm font-medium text-slate-600">Signing out...</p>
        </div>
      </div>
    )
  }

  // Use authProfile data when available, fallback to user metadata
  const phoneValue = authProfile?.phone_number || user.user_metadata?.phone || "8827727727288"
  const displayName = authProfile?.full_name || user.user_metadata?.full_name || "Clinto peter"
  const memberSince = new Date(authProfile?.created_at || user.created_at || "2025-01-01").toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })

  const handleLogout = async () => {
    setIsSigningOut(true)
    // Show spinner for 4 seconds before logging out
    await new Promise(resolve => setTimeout(resolve, 4000))
    await signOut()
    router.push("/login")
  }

  const confirmLogout = async () => {
    setIsLogoutDialogOpen(false)
    await handleLogout()
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
    <div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#eff7ff] to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[28vh] bg-[radial-gradient(circle_at_top,_rgba(15,99,255,0.14),transparent_45%)]" />

      <div className="relative z-10 flex">
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="flex h-14 items-center justify-between px-4 sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.push("/wallet")}
                  className="-ml-2 rounded-2xl p-2 text-slate-700 transition hover:bg-slate-100"
                  title="Back to wallet"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-2xl"
            >
              <motion.div variants={itemVariants} className="mb-5">
                <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
                  <div className="bg-gradient-to-r from-[#eff7ff] via-white to-[#f8fbff] p-5 sm:p-6">
                    <div className="flex flex-col items-center gap-4 text-center">
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
                              stroke="#0f6cff"
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
                            className="relative z-10 h-full w-full rounded-full border-2 border-white object-cover shadow-[0_18px_35px_rgba(15,23,42,0.12)]"
                          />

                          <button
                            onClick={handleCameraClick}
                            disabled={uploading}
                            className="absolute -bottom-0.5 -right-0.5 z-20 rounded-full border border-slate-200 bg-white p-2 shadow-md transition hover:bg-slate-100 disabled:opacity-50"
                            title="Change profile photo"
                          >
                            <Camera className="h-4 w-4 text-slate-600" />
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
                        <h2 className="text-xl font-semibold text-slate-900">
                          {displayName}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                          {user.email}
                        </p>
                        <div className="mt-3">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                            Member since {memberSince}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-5">
                <div className="rounded-[1.75rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_45px_rgba(15,23,42,0.06)]">
                  <h3 className="mb-1 text-sm font-semibold text-slate-900">
                    Personal Information
                  </h3>
                  <p className="mb-5 text-xs text-slate-500">
                    Update your profile details
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                        Full Name
                      </label>
                      <p className="text-sm font-medium text-slate-900">
                        {displayName}
                      </p>
                      <div className="mt-1.5 h-px bg-slate-100" />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                        Email Address
                      </label>
                      <p className="text-sm font-medium text-slate-900">
                        {user.email}
                      </p>
                      <div className="mt-1.5 h-px bg-slate-100" />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
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
                <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                  <button
                    onClick={() => setIsLogoutDialogOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-[1.5rem] border border-slate-200 bg-white px-5 py-3.5 text-sm font-medium text-rose-600 shadow-[0_16px_35px_rgba(15,23,42,0.06)] transition hover:border-rose-200 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>

                  <AlertDialogContent className="w-[calc(100%-1.5rem)] max-w-sm max-h-[calc(100dvh-1.5rem)] overflow-y-auto rounded-[1.75rem] border border-slate-200/80 bg-white p-0 shadow-[0_32px_80px_rgba(15,23,42,0.22)] sm:w-full">
                    {/* Header */}
                    <div className="relative bg-gradient-to-b from-[#fff1f2] via-white to-white px-6 pb-5 pt-7 text-center">
                      <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.10),transparent_60%)]" />
                      <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 ring-1 ring-rose-100 shadow-[0_8px_20px_rgba(244,63,94,0.12)]">
                        <LogOut className="h-6 w-6 text-rose-500" />
                      </div>
                      <AlertDialogHeader className="relative text-center">
                        <AlertDialogTitle className="text-lg font-semibold tracking-tight text-slate-900">
                          Log out of your account?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="max-w-[260px] text-left text-sm leading-6 text-slate-500">
                          You’ll need to sign in again to access your wallet and profile.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                    </div>

                    {/* Footer */}
                    <AlertDialogFooter className="flex flex-col gap-2.5 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:gap-2.5">
                      <AlertDialogCancel className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 sm:flex-1">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={confirmLogout}
                        className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(244,63,94,0.22)] transition hover:bg-rose-600 sm:flex-1"
                      >
                        Yes, log out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </motion.div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}