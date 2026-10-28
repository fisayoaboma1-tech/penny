'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const pathname = usePathname()
  const forcedTheme = pathname.startsWith('/admin-template') ? 'light' : undefined

  return (
    <NextThemesProvider
      {...props}
      attribute={["class", "data-theme"]}
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  )
}
