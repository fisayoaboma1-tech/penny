"use client"

import { ReactNode } from "react"
import { ProtectedRoute } from "@/components/route-protection"

export default function WalletLayout({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>
}
