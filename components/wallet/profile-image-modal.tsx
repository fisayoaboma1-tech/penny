"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Upload, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

interface ProfileImageModalProps {
  isOpen: boolean
  onClose: () => void
  currentImageUrl: string | null
  onImageUpdate: (url: string) => void
}

export function ProfileImageModal({
  isOpen,
  onClose,
  currentImageUrl,
  onImageUpdate,
}: ProfileImageModalProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const supabase = createClient()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if (!preview || !user) return

    setUploading(true)
    try {
      const response = await fetch(preview)
      const blob = await response.blob()
      const file = new File([blob], "profile-image.jpg", { type: "image/jpeg" })

      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const data = await uploadResponse.json()
      const imageUrl = data.url

      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: imageUrl })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      onImageUpdate(imageUrl)
      onClose()
      setPreview(null)
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const defaultImageUrl = "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"

  const handleDelete = async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: defaultImageUrl })
        .eq("id", user.id)

      if (error) {
        throw error
      }

      onImageUpdate(defaultImageUrl)
      onClose()
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Failed to delete image. Please try again.")
    }
  }

  const handleClose = () => {
    setPreview(null)
    onClose()
  }

  const showImage = preview || (currentImageUrl && currentImageUrl !== defaultImageUrl)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm"
          >
            <div className="relative bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              {/* Decorative glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />

              {/* Header */}
              <div className="relative px-5 pt-5 pb-3 border-b border-[#1a1a1a]">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-200">Profile photo</h3>
                  <button
                    onClick={handleClose}
                    className="w-7 h-7 rounded-lg bg-[#1a1a1a] flex items-center justify-center hover:bg-[#252525] transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Image area */}
              <div className="relative px-5 py-6 flex flex-col items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-[#111111] border border-[#1a1a1a] ring-1 ring-white/[0.02]">
                  {showImage ? (
                    <img
                      src={preview || currentImageUrl || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* File input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Choose button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-4 text-sm text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  {preview ? "Change photo" : "Choose photo"}
                </button>
              </div>

              {/* Actions */}
              <div className="relative px-5 pb-5 pt-0 flex gap-2">
                <button
                  onClick={handleUpload}
                  disabled={!preview || uploading}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  {uploading ? "Uploading..." : "Save"}
                </button>

                {currentImageUrl && currentImageUrl !== defaultImageUrl && (
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium bg-[#1a1a1a] text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
