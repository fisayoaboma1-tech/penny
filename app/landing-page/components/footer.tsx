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

    if (item === "About") {
      if (lenis) lenis.scrollTo(document.querySelector("#about") as HTMLElement, { offset: -100 })
      else document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" })
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
                        className="text-white/60 hover:text-[#AFFF00] font-mono text-xs transition-colors inline-block cursor-pointer"
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
              <button className="text-gray-600 hover:text-[#AFFF00] cursor-pointer" onClick={() => { setShowPrivacy(false); setShowTerms(false); }}>Close</button>
            </div>

            <div className="px-6 py-4 overflow-y-auto max-h-[70vh] text-sm text-gray-700 space-y-4">
              {showPrivacy ? (
                <>
                  <p className="font-semibold text-gray-900">Privacy Policy</p>
                  <p>At Pennywise, protecting your personal information is critical to how we operate. We collect only the information required to deliver banking services, maintain regulatory compliance, and protect your account from fraud and unauthorized access.</p>
                  <p>Information collected may include identity verification data, contact details, transaction history, device metadata, and any documents required for anti-money laundering (AML) and know-your-customer (KYC) checks. We do not sell or trade your personal data to third parties.</p>
                  <p>We use industry-standard encryption to secure data at rest and in transit, and we limit access to sensitive information to authorized personnel only. Your information may be shared with service providers, regulatory authorities, or auditors when necessary to fulfill our legal obligations or to process payments and service requests.</p>
                  <p>Cookies and similar technologies are used to enable secure sign-in, analyze site performance, and improve the customer experience. You may opt out of non-essential cookies, but critical functionality may require them to remain enabled.</p>
                  <p>By using Pennywise, you consent to the collection and processing of your information as described in this policy. You may request access, correction, or deletion of your data where permitted by applicable law, and we will respond to such requests in a timely and compliant manner.</p>
                  <p className="font-semibold text-gray-900">Data retention and security</p>
                  <p>We retain your information for as long as necessary to provide services, satisfy legal requirements, and resolve disputes. Archived records may be retained for audit and compliance purposes even after an account is closed.</p>
                  <p>Your continued use of our platform confirms acceptance of this policy and any future updates. We recommend reviewing this policy periodically for changes.</p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-gray-900">Terms of Service</p>
                  <p>These Terms of Service govern your access to and use of Pennywise, a digital banking platform designed for institutional-grade workflows and modern investment banking clients. By using our service, you agree to comply with applicable laws, provide accurate information, and maintain the confidentiality of your account credentials.</p>
                  <p>Pennywise provides electronic payment services, deposit accounts, secure reporting, and advisory tools. All services are subject to applicable regulatory requirements, and your access may be restricted or suspended if we believe your activity poses a risk to financial integrity, security, or compliance.</p>
                  <p>Account holders are responsible for all transactions initiated through their accounts, including those authorized by delegated users. You must notify us immediately of any unauthorized access, suspicious activity, or breaches of your account controls.</p>
                  <p>We may update or modify these terms as needed to reflect changes in law, business practices, or platform functionality. Continued use after notice of changes constitutes acceptance of the revised terms.</p>
                  <p className="font-semibold text-gray-900">Service limitations and liability</p>
                  <p>Pennywise is provided on an "as available" basis. We do not guarantee uninterrupted access, and we are not liable for losses resulting from service outages, transmission delays, market fluctuations, or the actions of third-party providers.</p>
                  <p>We reserve the right to suspend, terminate, or limit access to services for any user who violates these terms, engages in fraudulent behavior, or fails to comply with legal or regulatory requirements.</p>
                  <p>By registering for Pennywise, you agree to resolve disputes through arbitration where permitted by law and to abide by applicable jurisdictional terms in your agreement.</p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </footer>
  )
}
