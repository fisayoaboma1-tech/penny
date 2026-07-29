"use client"

import { motion, useInView } from "framer-motion"
import { useState, useRef, useEffect } from "react"
// next/link not needed here
import { useLenis } from "lenis/react"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
} as const

export function Footer() {
  const [email, setEmail] = useState("")
  const [isHovering, setIsHovering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const footerRef = useRef(null)
  const isInView = useInView(footerRef, { once: true, margin: "-100px" })

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => setIsSubmitting(false), 2000)
  }

  const footerLinks = [
    {
      title: "Accounts",
      links: ["Smart Savings", "Business Pro"],
    },
    {
      title: "Quick Links",
      links: ["Home", "Accounts", "What We Offer"],
    },
    {
      title: "Company",
      links: ["About", "Contact"],
    },
    {
      title: "Legal",
      links: ["Privacy Policy", "Terms of Service"],
    },
  ]

  const lenis = useLenis()
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showTerms, setShowTerms] = useState(false)

  useEffect(() => {
    const locked = showPrivacy || showTerms
    if (typeof document !== "undefined") {
      document.body.style.overflow = locked ? "hidden" : ""
    }
    return () => {
      if (typeof document !== "undefined") document.body.style.overflow = ""
    }
  }, [showPrivacy, showTerms])

  const handleFooterClick = (item: string) => {
    // map footer items to targets or actions
    if (item === "Smart Savings" || item === "Business Pro" || item === "Accounts") {
      // scroll to accounts section
      if (lenis) lenis.scrollTo(document.querySelector("#accounts") as HTMLElement, { offset: -100 })
      else document.querySelector("#accounts")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    if (item === "Home") {
      if (lenis) lenis.scrollTo(0)
      else window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    if (item === "What We Offer") {
      if (lenis) lenis.scrollTo(document.querySelector("#what-we-offer") as HTMLElement, { offset: -100 })
      else document.querySelector("#what-we-offer")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    if (item === "Contact") {
      if (lenis) lenis.scrollTo(document.querySelector("#contact") as HTMLElement, { offset: -100 })
      else document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
      return
    }

    if (item === "Privacy Policy") {
      setShowPrivacy(true)
      return
    }

    if (item === "Terms of Service") {
      setShowTerms(true)
      return
    }
  }

  return (
    <footer ref={footerRef} id="careers" className="relative bg-[#121212] pt-1 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-12"
        >
       
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-t border-white/10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {footerLinks.map((section, sectionIndex) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h4 className="font-bold text-white text-sm mb-3">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((item) => (
                  <li key={item}>
                    <motion.div whileHover={{ x: 4 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                      <button
                        onClick={() => handleFooterClick(item)}
                        className="text-white/60 hover:text-[#AFFF00] font-mono text-xs transition-colors inline-block"
                      >
                        {item}
                      </button>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/10 gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <span className="text-xl font-normal tracking-tighter">
              <span className="text-white">Penny</span>
              <span className="text-[#AFFF00]">wise</span>
            </span>
          </motion.div>

          <p className="text-white/40 font-mono text-xs">© 2026 Pennywise. All rights reserved.</p>

          {/* removed decorative text per request */}
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[15rem] md:text-[30rem] font-black text-white/[0.02] pointer-events-none select-none leading-none"
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        Pennywise
      </motion.div>

      {(showPrivacy || showTerms) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setShowPrivacy(false); setShowTerms(false); }} />

          <motion.div
            className="relative z-10 w-[90%] md:w-3/4 lg:w-1/2 max-h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{showPrivacy ? "Privacy Policy" : "Terms of Service"}</h3>
              <button className="text-gray-600" onClick={() => { setShowPrivacy(false); setShowTerms(false); }}>Close</button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[70vh] text-sm text-gray-700">
              {/* Placeholder policy content — replace with real text as needed */}
              <p className="mb-2">{showPrivacy ? (
                <>This is the privacy policy. Your privacy is important to us. We collect minimal data and store it securely. Replace this placeholder with your full privacy policy content.</>
              ) : (
                <>These are the terms of service. By using Pennywise you agree to the terms described here. Replace this placeholder with your full terms of service content.</>
              )}</p>

              <p className="mt-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</p>
              <p className="mt-4">Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.</p>
              <p className="mt-4">Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat.</p>
            </div>
          </motion.div>
        </div>
      )}
    </footer>
  )
}
