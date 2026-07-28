import type React from "react"
import type { Metadata, Viewport } from "next"
import { LenisProvider } from "./components/lenis-provider"
import ClickSpark from "./components/click-spark"
import "./globals.css"

export const metadata: Metadata = {
  title: "Pennywise Bank | Smart Banking for Everyone",
  description: "High-yield savings, zero fees, and cashback rewards. The modern bank for dreamers and doers.",
  keywords: ["banking", "savings", "high-yield", "Pennywise", "digital bank", "no fees"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#AFFF00",
}

export default function LandingPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClickSpark
      sparkColor="#AFFF00"
      sparkSize={12}
      sparkRadius={20}
      sparkCount={8}
      duration={400}
      easing="ease-out"
    >
      <LenisProvider>{children}</LenisProvider>
    </ClickSpark>
  )
}