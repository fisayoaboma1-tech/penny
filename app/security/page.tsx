"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, KeyRound, Loader2, Mail, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

export default function SecurityPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [visibleFields, setVisibleFields] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handlePasswordChange = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")

    if (!user?.email) {
      setError("We couldn’t verify your account. Please sign in again.")
      return
    }
    if (newPassword.length < 8 || !/[A-Za-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("Use at least 8 characters, including one letter and one number.")
      return
    }
    if (newPassword !== confirmPassword) {
      setError("Your new passwords don’t match.")
      return
    }
    if (currentPassword === newPassword) {
      setError("Choose a new password that’s different from your current one.")
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const { error: verifyError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      })
      if (verifyError) throw new Error("Your current password isn’t correct.")

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw updateError

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setMessage("Your password has been updated.")
    } catch (changeError) {
      console.error("Failed to update user password:", changeError)
      setError(changeError instanceof Error ? changeError.message : "Couldn’t update your password. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const toggleVisibility = (field: string) => {
    setVisibleFields((current) => ({ ...current, [field]: !current[field] }))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50 text-slate-900 lg:pl-64">
        <PageHeader variant="sub" title="Security" onBack={() => router.back()} />
        <main className="mx-auto max-w-3xl space-y-5 px-4 py-6 pb-28 sm:px-6 sm:py-9">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Account protection</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Security settings</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">Keep your sign-in details private and up to date.</p>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-7"
          >
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <KeyRound className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold">Change password</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">Confirm your current password before choosing a new one.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[
                { id: "current-password", label: "Current password", value: currentPassword, setValue: setCurrentPassword, autoComplete: "current-password" },
                { id: "new-password", label: "New password", value: newPassword, setValue: setNewPassword, autoComplete: "new-password" },
                { id: "confirm-password", label: "Confirm new password", value: confirmPassword, setValue: setConfirmPassword, autoComplete: "new-password" },
              ].map((field) => (
                <div key={field.id} className="space-y-2">
                  <label htmlFor={field.id} className="text-sm font-medium text-slate-700">{field.label}</label>
                  <div className="relative">
                    <input
                      id={field.id}
                      type={visibleFields[field.id] ? "text" : "password"}
                      value={field.value}
                      onChange={(event) => field.setValue(event.target.value)}
                      autoComplete={field.autoComplete}
                      required
                      minLength={field.id === "current-password" ? undefined : 8}
                      className="saas-input !bg-white !text-slate-900 min-h-12 rounded-xl border-slate-200 px-4 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility(field.id)}
                      aria-label={visibleFields[field.id] ? `Hide ${field.label.toLowerCase()}` : `Show ${field.label.toLowerCase()}`}
                      className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                      {visibleFields[field.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}

              <p className="text-xs leading-5 text-slate-500">Use at least 8 characters, with a letter and a number.</p>
              {error ? <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p> : null}
              {message ? <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p> : null}

              <button
                type="submit"
                disabled={saving}
                className="saas-button saas-button-primary min-h-12 w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-sm shadow-lg shadow-blue-600/20 disabled:opacity-60 sm:w-auto sm:px-8"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {saving ? "Verifying and updating…" : "Update password"}
              </button>
            </form>
          </motion.section>

          <section className="flex items-start gap-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.05)] sm:p-6">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900">Email address</h2>
              <p className="mt-1 break-all text-sm text-slate-600">{user?.email || "Your account email"}</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">
                For your protection, email changes are handled by our support team after they verify your account.
                {" "}<a href="mailto:support@pennyiseltd@gmail.com?subject=Update%20my%20Pennywise%20email" className="font-semibold text-blue-700 underline underline-offset-2">Contact support</a>
              </p>
            </div>
          </section>
        </main>
        <WalletBottomNav />
      </div>
    </ProtectedRoute>
  )
}
