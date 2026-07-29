"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useLenis } from "lenis/react"
import { Menu, X } from "lucide-react"

const DARK_GREEN = "#0B3D2E"
const DARK_GREEN_LIGHT = "#145C43"
const LEMON_GREEN = "#AFFF00"

const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const mobileMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.4, 0.25, 1],
    },
  },
}

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const lenis = useLenis()
  const menuRef = useRef<HTMLDivElement | null>(null)
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const handleNativeScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleNativeScroll, { passive: true })

    // If Lenis is active, listen to its scroll events too so state stays in sync
    let lenisListener: any = null
    if (lenis && typeof (lenis as any).on === "function") {
      lenisListener = (e: any) => {
        const pos = typeof e === "object" && e?.scroll != null ? e.scroll : (lenis as any).scroll || 0
        setScrolled(pos > 50)
      }
      ;(lenis as any).on("scroll", lenisListener)
      // set initial state from Lenis if available
      try {
        const current = (lenis as any).scroll
        if (typeof current === "number") setScrolled(current > 50)
      } catch (err) {
        /* ignore */
      }
    }

    return () => {
      window.removeEventListener("scroll", handleNativeScroll)
      if (lenisListener && lenis && typeof (lenis as any).off === "function") {
        ;(lenis as any).off("scroll", lenisListener)
      }
    }
  }, [])

  const [activeSection, setActiveSection] = useState<string>("#hero")
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id) as HTMLElement | null
    if (id === "#hero") {
      if (lenis) lenis.scrollTo(0)
      else window.scrollTo({ top: 0, behavior: "smooth" })
      setMobileMenuOpen(false)
      return
    }

    if (element && lenis) {
      lenis.scrollTo(element, { offset: -100 })
    } else if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Accounts", href: "#accounts" },
    { label: "Services", href: "#what-we-offer" },
    { label: "Contact", href: "#contact" },
  ]

  useEffect(() => {
    const ids = ["#hero", "#about", "#accounts", "#what-we-offer", "#contact"]
    const options = { root: null, rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${(entry.target as HTMLElement).id}`)
        }
      })
    }, options)

    ids.forEach((selector) => {
      const el = document.querySelector(selector)
      if (el) obs.observe(el)
    })

    observerRef.current = obs
    return () => observerRef.current?.disconnect()
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (toggleButtonRef.current?.contains(target)) return
      setMobileMenuOpen(false)
    }

    const handleScroll = () => {
      setMobileMenuOpen(false)
    }

    document.addEventListener("mousedown", handlePointerDown)
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Also listen to Lenis scroll events to close menu when using smooth-scroller
    let lenisClose: any = null
    if (lenis && typeof (lenis as any).on === "function") {
      lenisClose = () => setMobileMenuOpen(false)
      ;(lenis as any).on("scroll", lenisClose)
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      window.removeEventListener("scroll", handleScroll)
      if (lenisClose && lenis && typeof (lenis as any).off === "function") {
        ;(lenis as any).off("scroll", lenisClose)
      }
    }
  }, [mobileMenuOpen])

  const effectiveScrolled = mobileMenuOpen ? false : scrolled

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          effectiveScrolled
            ? "bg-white/80 backdrop-blur-md border-b border-white/25 text-gray-900 shadow-sm"
            : "bg-transparent"
      }`}
    >
      <div className={`max-w-7xl mx-auto px-6 ${effectiveScrolled ? 'py-2' : 'py-4'} flex items-center justify-between`}>
        <Link href="/" className={`flex items-center gap-2 ${mobileMenuOpen ? "md:hidden" : ""}`}>
          <motion.span
            className={`text-2xl font-normal tracking-tighter ${mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className={effectiveScrolled ? "text-gray-900" : "text-white"}>
              <span className={effectiveScrolled ? "text-gray-900" : "text-white"}>Penny</span>
              <span style={{ color: LEMON_GREEN }}>wise</span>
            </span>
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => {
            const isActive = activeSection === item.href
            const baseText = effectiveScrolled ? "text-gray-800/90 hover:text-gray-900" : "text-white/80 hover:text-white"
            const activeRect = effectiveScrolled
              ? "bg-gray-100/60 text-gray-900 rounded-md px-3 py-1"
              : "bg-white/20 text-white rounded-md px-3 py-1"

            return (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-normal tracking-wide transition-colors relative cursor-pointer ${baseText} ${isActive ? activeRect : ""}`}
                style={{ color: undefined }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 origin-left md:hidden"
                  style={{ backgroundColor: LEMON_GREEN }}
                  initial={{ scaleX: isActive ? 1 : 0 }}
                  animate={{ scaleX: isActive ? 1 : 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
                />
              </motion.button>
            )
          })}
        </div>

        <motion.button
          ref={toggleButtonRef}
          className={`md:hidden p-2.5 cursor-pointer rounded-full ${effectiveScrolled ? 'text-gray-900 bg-white/10' : 'text-white'}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {mobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className={effectiveScrolled ? "text-gray-900" : "text-white"} />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className={effectiveScrolled ? "text-gray-900" : "text-white"} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative z-60 md:hidden mx-3 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((item, i) => {
                const isActive = activeSection === item.href
                const mobileActive = isActive ? (effectiveScrolled ? 'bg-gray-100/30 text-gray-900 rounded-lg px-3 py-2' : 'bg-white/10 text-white rounded-lg px-3 py-2') : ''

                return (
                  <motion.button
                    key={item.label}
                    onClick={() => scrollToSection(item.href)}
                    className={`block w-full text-left ${effectiveScrolled ? 'text-gray-800/80' : 'text-white/70'} hover:text-white text-lg font-light py-2 cursor-pointer ${mobileActive}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {item.label}
                  </motion.button>
                )
              })}
              <div className="flex flex-col gap-3 pt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link href="/signup" className="w-full text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide inline-flex items-center justify-center border border-white/20" style={{ backgroundColor: DARK_GREEN }}>
                  Open an Account
                </Link>
                <Link href="/login" className="w-full px-6 py-3 rounded-full font-bold text-sm tracking-wide inline-flex items-center justify-center border border-white/20 bg-transparent text-white">
                  Login
                </Link>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}