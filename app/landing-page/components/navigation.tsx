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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
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
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [mobileMenuOpen])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-[#121212]/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className={`flex items-center gap-2 ${mobileMenuOpen ? "md:hidden" : ""}`}>
          <motion.span
            className={`text-2xl font-normal tracking-tighter ${mobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className={scrolled ? "text-white" : "text-white"}>
              <span className={scrolled ? "text-white" : "text-white"}>Penny</span>
              <span style={{ color: LEMON_GREEN }}>wise</span>
            </span>
          </motion.span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item, i) => {
            const isActive = activeSection === item.href
            return (
              <motion.button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-normal tracking-wide transition-colors relative cursor-pointer ${
                  scrolled ? "text-white/80 hover:text-white" : "text-white/80 hover:text-white"
                }`}
                style={{ color: undefined }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-0.5 origin-left"
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
          className="md:hidden p-2.5 cursor-pointer rounded-full text-white"
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
                <X className="text-white" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="text-white" />
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
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-md md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="relative z-50 md:hidden mx-3 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
            >
            <div className="px-6 py-4 space-y-4">
              {navLinks.map((item, i) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left text-white/70 hover:text-white text-lg font-light py-2 cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {item.label}
                </motion.button>
              ))}
              <div className="flex flex-col gap-3 pt-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <motion.button
                  className="w-full text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide cursor-pointer border border-white/20"
                  style={{ backgroundColor: DARK_GREEN }}
                  whileHover={{ scale: 1.01, backgroundColor: "#AFFF00", color: "#0B3D2E" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Open an Account
                </motion.button>
                <motion.button
                  className="w-full px-6 py-3 rounded-full font-bold text-sm tracking-wide cursor-pointer border border-white/20 bg-transparent text-white"
                  whileHover={{ scale: 1.01, color: "#AFFF00" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Login
                </motion.button>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}