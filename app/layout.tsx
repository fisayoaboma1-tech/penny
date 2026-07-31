import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LenisProvider } from "@/components/lenis-provider"
import { Toaster } from "@/components/ui/toaster"
import ClickSpark from "@/components/click-spark"
import { AuthProvider } from "@/contexts/auth-context"
import { QueryProvider } from "@/components/query-provider"
import { PageTransition } from "@/components/page-transition"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Pennywise | Next-Gen Digital Banking & Smart Savings",
  description: "Experience next-generation digital banking with Pennywise. Zero fees, instant transfers, smart savings, and 24/7 support. Start your journey to financial freedom today.",
  keywords: ["digital banking", "online banking", "savings account", "investment", "financial freedom", "money management", "Pennywise", "smart banking"],
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="pennywise-theme"
        >
          <ClickSpark
            sparkColor="#091738"
            sparkSize={12}
            sparkRadius={20}
            sparkCount={8}
            duration={400}
            easing="ease-out"
          >
            <QueryProvider>
              <AuthProvider>
                <LenisProvider>
                  <PageTransition>{children}</PageTransition>
                  <Toaster />
                </LenisProvider>
              </AuthProvider>
            </QueryProvider>
          </ClickSpark>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}