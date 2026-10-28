import { redirect } from "next/navigation"

export default function LegacyDashboardSettingsRedirect() {
  redirect("/admin-template/settings")
}
