import { redirect } from "next/navigation"

export default function LegacyDashboardLoginRedirect() {
  redirect("/admin-template/login")
}
