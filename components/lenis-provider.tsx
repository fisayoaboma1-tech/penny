"use client"

import { ReactLenis } from "lenis/react"
import type { ReactNode } from "react"

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        // tuned for smoother, more responsive scrolling
        lerp: 0.08,
        duration: 0.8,
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.6,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
