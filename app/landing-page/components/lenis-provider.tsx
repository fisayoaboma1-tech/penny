"use client"

import { ReactLenis } from "lenis/react"
import type { Lenis } from "lenis"
import { useEffect, useRef, type ReactNode } from "react"

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    window.history.scrollRestoration = "manual"
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })

    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }

    return () => {
      window.history.scrollRestoration = "auto"
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  )
}
