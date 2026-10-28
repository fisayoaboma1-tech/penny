"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Bell, Camera, Check, ChevronLeft, ChevronRight, Loader2, LogOut, Mail, ShieldCheck } from "lucide-react"
import { getUserAvatarUrl, UserAvatar } from "@/components/wallet/user-avatar"
import { toast } from "@/hooks/use-toast"
import WalletBottomNav from "@/components/wallet-bottom-nav"
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
import { clearProfileImage, saveProfileImage } from "@/lib/supabase/profile-images"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading, signOut, isAdmin, profile: authProfile } = useAuth()
  const supabase = createClient()
  const [uploading, setUploading] = useState(false)
  const [profileImageOverride, setProfileImageOverride] = useState<string | null | undefined>(undefined)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [signOutStage, setSignOutStage] = useState<"idle" | "saving" | "complete" | "error">("idle")
  const [signOutError, setSignOutError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Use authProfile if available, otherwise fallback to user metadata
  const profileImageUrl = profileImageOverride === undefined
    ? getUserAvatarUrl(authProfile?.profile_image_url, user?.user_metadata?.avatar_url, user?.user_metadata?.profile_image)
    : profileImageOverride

  useEffect(() => {
    if (signOutStage !== "idle") return

    if (!loading) {
      if (!user) {
        router.push("/login")
        return
      }

      if (isAdmin) {
        router.push("/admin-template")
      }
    }
  }, [loading, user, isAdmin, router, signOutStage])

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
    if (!file.type.startsWith("image/")) {
      toast({ title: "Choose an image", description: "Select a JPG, PNG, or another supported image file.", variant: "destructive" })
      e.target.value = ""
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Image is too large", description: "Choose an image smaller than 10 MB.", variant: "destructive" })
      e.target.value = ""
      return
    }

    setUploading(true)

    try {
      // Use setTimeout to allow UI to update before heavy processing
      await new Promise(resolve => setTimeout(resolve, 50))
      
      const optimizedFile = await compressImage(file)
      const imageUrl = await saveProfileImage(
        supabase,
        user.id,
        optimizedFile,
        profileImageUrl,
      )
      setProfileImageOverride(imageUrl)

      toast({ title: "Profile photo updated", description: "Your new photo is now on your Pennywise profile." })
    } catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error)
      console.error("Error uploading image:", message)
      toast({ title: "Photo upload failed", description: message, variant: "destructive" })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleRemovePhoto = async () => {
    if (!user || !profileImageUrl) return

    try {
      setUploading(true)
      await clearProfileImage(supabase, user.id, profileImageUrl)
      setProfileImageOverride(null)

      toast({ title: "Profile photo removed", description: "Your profile now uses an empty avatar." })
    } catch (error) {
      console.error("Failed to remove profile photo:", error)
      toast({
        title: "Couldn’t remove photo",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleLogout = async () => {
    setSignOutError("")
    setSignOutStage("saving")
    await new Promise((resolve) => window.setTimeout(resolve, 700))

    try {
      await signOut()
      setSignOutStage("complete")
      await new Promise((resolve) => window.setTimeout(resolve, 1000))
      router.replace("/login")
    } catch (error) {
      console.error("Failed to sign out:", error)
      setSignOutError(error instanceof Error ? error.message : "Please try signing out again.")
      setSignOutStage("error")
    }
  }

  const confirmLogout = async () => {
    setIsLogoutDialogOpen(false)
    await handleLogout()
  }

  if (signOutStage !== "idle") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f9fc] px-5">
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          role="status"
          aria-live="polite"
          className="w-full max-w-sm rounded-3xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_28px_80px_rgba(15,23,42,0.12)] sm:p-10"
        >
          <motion.div
            key={signOutStage}
            initial={{ scale: 0.65, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 17 }}
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              signOutStage === "complete" ? "bg-emerald-50 text-emerald-600" :
                signOutStage === "error" ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
            }`}
          >
            {signOutStage === "complete" ? (
              <motion.svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" aria-hidden="true">
                <motion.path
                  d="m5 12 4 4L19 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.45, delay: 0.15 }}
                />
              </motion.svg>
            ) : signOutStage === "error" ? (
              <LogOut className="h-8 w-8" />
            ) : (
              <Loader2 className="h-8 w-8 animate-spin" />
            )}
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {signOutStage === "complete" ? "You’re signed out" :
              signOutStage === "error" ? "We couldn’t sign you out" : "Securing your session"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {signOutStage === "complete" ? "Your wallet session has ended. See you next time." :
              signOutStage === "error" ? signOutError : "Finishing up and safely closing your wallet."}
          </p>

          {signOutStage === "saving" ? (
            <div className="mt-8 space-y-3 text-left">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Protecting your account
                <Check className="ml-auto h-4 w-4 text-emerald-600" />
              </div>
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                Closing your session
              </div>
            </div>
          ) : null}

          {signOutStage === "error" ? (
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={() => setSignOutStage("idle")}
                className="min-h-11 flex-1 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleLogout()}
                className="min-h-11 flex-1 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          ) : null}
        </motion.div>
      </div>
    )
  }

  if (loading || !user) {
    return null
  }

  // Use authProfile data when available, fallback to user metadata
  const phoneValue = authProfile?.phone_number || user.user_metadata?.phone || ""
  const displayName = authProfile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Your profile"
  const memberSince = new Date(authProfile?.created_at || user.created_at).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  })

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
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 lg:pl-64">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.10),transparent_65%)]" />

      <div className="relative z-10 flex min-h-screen">
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
            <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
              <button
                onClick={() => router.push("/wallet")}
                className="-ml-2 inline-flex items-center gap-2 rounded-xl px-2 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                title="Back to wallet"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Wallet</span>
              </button>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400 sm:text-sm">
                <span>Account</span>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-slate-800">Profile</span>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 pb-28 sm:px-6 sm:py-9">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-3xl"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Account overview</p>
                  <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Profile & preferences</h1>
                  <p className="mt-2 text-sm leading-6 text-slate-500">Manage your personal details and keep your account up to date.</p>
                </div>
                <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                  <div className="h-24 bg-gradient-to-r from-[#e7f1ff] via-[#f5f8ff] to-[#e9f8ff] sm:h-28" />
                  <div className="px-5 pb-5 sm:px-7 sm:pb-7">
                    <div className="-mt-12 flex flex-col items-center gap-4 text-center sm:-mt-14 sm:flex-row sm:items-end sm:text-left">
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
                              strokeDashoffset={uploading ? 220 : 289.03}
                              style={{ transition: "stroke-dashoffset 0.3s ease-out, opacity 0.3s ease" }}
                              className={uploading ? "opacity-100" : "opacity-0"}
                            />
                          </svg>

                          <UserAvatar
                            imageUrl={profileImageUrl}
                            name={displayName}
                            className="relative z-10 h-full w-full border-4 border-white shadow-[0_18px_35px_rgba(15,23,42,0.12)]"
                          />

                          <button
                            onClick={handleCameraClick}
                            disabled={uploading}
                            aria-label={profileImageUrl ? "Change profile photo" : "Upload a profile photo"}
                            className="absolute -bottom-0.5 -right-0.5 z-20 rounded-full border border-white bg-blue-600 p-2.5 text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                            title={profileImageUrl ? "Change profile photo" : "Upload a profile photo"}
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
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
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                            Member since {memberSince}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-center gap-2 sm:ml-auto sm:justify-end">
                        <button
                          type="button"
                          onClick={handleCameraClick}
                          disabled={uploading}
                          className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-60"
                        >
                          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                          {uploading ? "Uploading…" : profileImageUrl ? "Change photo" : "Add a photo"}
                        </button>
                        {profileImageUrl ? (
                          <button
                            type="button"
                            onClick={() => void handleRemovePhoto()}
                            disabled={uploading}
                            className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-5">
                <div className="grid gap-5 md:grid-cols-[1.15fr_0.85fr]">
                  <section className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-6">
                    <div className="mb-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Personal details</p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">Your information</h2>
                    </div>

                    <dl className="divide-y divide-slate-100">
                      <div className="py-4 first:pt-0">
                        <dt className="text-xs font-medium text-slate-500">Full name</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{displayName}</dd>
                      </div>
                      <div className="py-4">
                        <dt className="text-xs font-medium text-slate-500">Email address</dt>
                        <dd className="mt-1 break-all text-sm font-semibold text-slate-800">{user.email}</dd>
                      </div>
                      <div className="py-4 last:pb-0">
                        <dt className="text-xs font-medium text-slate-500">Phone number</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{phoneValue || "Not added yet"}</dd>
                      </div>
                    </dl>

                    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                      <Mail className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                      <p className="text-xs leading-5 text-slate-600">
                        Need to update your email address?{" "}
                        <a
                          href={`mailto:support@pennyiseltd@gmail.com?subject=${encodeURIComponent("Update my Pennywise email address")}&body=${encodeURIComponent(`Hello,\n\nI would like to request an update to the email address on my Pennywise account (${user.email}).\n`)}`}
                          className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900"
                        >
                          Contact our support team
                        </a>
                        {" "}so they can help verify your account.
                      </p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <Link
                      href="/security"
                      className="group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:border-blue-200 hover:shadow-md"
                    >
                      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">Security</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Update your password and protect your account.</span>
                      </span>
                      <ChevronRight className="h-4 w-4 flex-none text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </Link>

                    <Link
                      href="/notifications"
                      className="group flex items-center gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] transition hover:border-blue-200 hover:shadow-md"
                    >
                      <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Bell className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-slate-900">Wallet activity</span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">Review recent account and transaction updates.</span>
                      </span>
                      <ChevronRight className="h-4 w-4 flex-none text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-blue-600" />
                    </Link>
                  </section>
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
      <WalletBottomNav />
    </div>
  )
}