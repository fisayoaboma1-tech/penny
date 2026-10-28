import { redirect } from "next/navigation"

export default function LegacyDashboardPasswordResetRedirect() {
  redirect("/admin-template/reset-password")
}
