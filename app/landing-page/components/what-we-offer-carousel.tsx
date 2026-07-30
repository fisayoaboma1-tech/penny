"use client"

import type React from "react"

import { motion, AnimatePresence, useSpring } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const DARK_BLUE = "#1e40af"
const DARK_BLUE_LIGHT = "#3d4d82"

const offerings = [
  {
    id: 1,
    title: "Digital Banking",
    tagline: "What We Offer",
    description: "Experience fast, secure, and intuitive banking designed for everyday financial management across all your devices.",
    features: ["Secure Transactions", "Real-Time Transfers", "Smart Dashboard", "24/7 Access"],
    bgColor: "from-[#1e40af]/20 via-[#1e40af]/10 to-transparent",
    accentColor: DARK_BLUE,
    mediaType: "video",
    mediaSrc: "https://res.cloudinary.com/qz5m8bhg/video/upload/v1785255405/From_Klickpin.com-_Classic_sewing_room_tips_and_clever_inspiration_with_easy_charm_for_stylish_handmade_days-pin-id-69735494224036154_szbl9i.mp4",
  },
  {
    id: 2,
    title: "Payment Solutions",
    tagline: "What We Offer",
    description: "Accept payments, send money instantly, and automate your financial workflows with powerful payment tools.",
    features: ["Instant Payments", "Bulk Transfers", "Payment Links", "API Integration"],
    bgColor: "from-[#3d4d82]/20 via-[#3d4d82]/10 to-transparent",
    accentColor: DARK_BLUE_LIGHT,
    mediaType: "video",
    mediaSrc: "https://res.cloudinary.com/qz5m8bhg/video/upload/v1785255401/From_Klickpin.com-_614952524168155372-pin-id-614952524168155372_lrb2hp.mp4",
  },
  {
    id: 3,
    title: "Financial Intelligence",
    tagline: "What We Offer",
    description: "Gain deeper insights into your finances with analytics, budgeting tools, and AI-powered recommendations.",
    features: ["Spending Insights", "Budget Tracking", "Financial Reports", "AI Recommendations"],
    bgColor: "from-[#1e40af]/20 via-[#1e40af]/5 to-transparent",
    accentColor: DARK_BLUE,
    mediaType: "video",
    mediaSrc: "https://res.cloudinary.com/qz5m8bhg/video/upload/v1785255401/From_Klickpin.com-_Productivity_Hacks_Ideas_Youll_Keep_Coming_Back_To_6368-pin-id-1086563847592324571_jwkltq.mp4",
  },
]

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? 15 : -15,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    } as const,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    scale: 0.9,
    rotateY: direction > 0 ? -15 : 15,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    } as const,
  }),
}

export function WhatWeOfferCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [[page, direction], setPage] = useState([0, 0])
  const currentOffering = offerings[currentIndex]

  const rotateX = useSpring(0, { stiffness: 150, damping: 20 })
  const rotateY = useSpring(0, { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)
    rotateY.set(x * 5)
    rotateX.set(-y * 5)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + offerings.length) % offerings.length
    setCurrentIndex(newIndex)
    setPage([page + newDirection, newDirection])
  }

  const nextOffering = () => paginate(1)
  const prevOffering = () => paginate(-1)

  useEffect(() => {
    const interval = window.setInterval(() => {
      paginate(1)
    }, 6000)

    return () => {
      window.clearInterval(interval)
    }
  }, [currentIndex])

  return (
    <section id="what-we-offer" className="relative py-16 bg-gray-50 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10"
        >
          <motion.span
            className="inline-flex items-center rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em]"
            style={{ color: DARK_BLUE_LIGHT, backgroundColor: `${DARK_BLUE_LIGHT}10`, border: `1px solid rgba(30, 64, 175, 0.3)` }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            What We Offer
          </motion.span>


          <motion.h3
            className="mx-auto mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tighter text-gray-900 md:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            Discover <span style={{ color: DARK_BLUE_LIGHT }}>service options</span>
          </motion.h3>

          <motion.p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-600"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Find the perfect service for your financial goals. Each offering comes with powerful features.
          </motion.p>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          <div className="flex items-center justify-center gap-6">
            <motion.button
              onClick={prevOffering}
              className="hidden md:flex w-12 h-12 rounded-full border border-black bg-transparent text-black items-center justify-center hover:bg-black hover:text-white transition-colors"
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentOffering.id}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full max-w-3xl"
                style={{ perspective: 1000 }}
              >
                <motion.div
                  className={`bg-gradient-to-br from-white via-[#f7fdf3]/80 to-white rounded-3xl p-6 md:p-8 border border-[#cfe5ce]/80 shadow-xl ${currentOffering.mystery ? "relative overflow-hidden" : ""}`}
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {currentOffering.mystery && (
                    <motion.div
                      className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%270 0 100 100%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E')] opacity-10 pointer-events-none"
                      animate={{ opacity: [0.05, 0.15, 0.05] }}
                      transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                    />
                  )}

                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    <motion.div
                      className="relative aspect-[3/4] flex items-center justify-center overflow-hidden rounded-2xl bg-[#121212]"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      {currentOffering.mediaType === "video" && currentOffering.mediaSrc ? (
                        <video
                          src={currentOffering.mediaSrc}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="text-6xl md:text-8xl font-black text-gray-200">
                            {currentOffering.title.charAt(0)}
                          </div>
                          {currentOffering.mystery && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                            >
                              <span className="text-7xl font-black text-[#121212]/20">?</span>
                            </motion.div>
                          )}
                        </>
                      )}
                    </motion.div>

                    <div className="space-y-4">
                      <div>
                        <motion.span
                          className="font-mono text-xs tracking-widest"
                          style={{ color: currentOffering.accentColor }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          {currentOffering.tagline}
                        </motion.span>
                        <motion.h3
                          className="text-3xl md:text-4xl font-normal text-[#121212] tracking-tighter mt-1"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                        >
                          {currentOffering.title}
                        </motion.h3>
                      </div>

                      <motion.p
                        className="text-sm text-[#121212]/60 font-normal"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        {currentOffering.description}
                      </motion.p>

                      {!currentOffering.mystery && (
                        <motion.div
                          className="flex flex-wrap gap-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {currentOffering.features.map((feature) => (
                            <span
                              key={feature}
                              className="px-2 py-1 bg-[#121212]/5 rounded-full text-xs font-normal text-[#121212]/60"
                            >
                              {feature}
                            </span>
                          ))}
                        </motion.div>
                      )}


                      {currentOffering.mystery && (
                        <motion.div
                          className="flex items-center gap-3"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <motion.div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: DARK_GREEN }}
                            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          />
                          <span className="font-mono text-xs text-[#121212]/60">Coming soon...</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            <motion.button
              onClick={nextOffering}
              className="hidden md:flex w-12 h-12 rounded-full border border-black bg-transparent text-black items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>

          <div className="flex md:hidden justify-center gap-4 mt-6">
            <motion.button
              onClick={prevOffering}
              className="w-10 h-10 rounded-full border border-black bg-transparent text-black flex items-center justify-center cursor-pointer hover:bg-black hover:text-white"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={nextOffering}
              className="w-10 h-10 rounded-full border border-black bg-transparent text-black flex items-center justify-center cursor-pointer hover:bg-black hover:text-white"
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {offerings.map((offering, index) => (
              <motion.button
                key={offering.id}
                onClick={() => {
                  const newDirection = index > currentIndex ? 1 : -1
                  setCurrentIndex(index)
                  setPage([index, newDirection])
                }}
                className="h-2 rounded-full transition-all"
                style={{
                  backgroundColor: index === currentIndex ? offering.accentColor : "#12121220",
                }}
                animate={{
                  width: index === currentIndex ? 28 : 10,
                }}
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}