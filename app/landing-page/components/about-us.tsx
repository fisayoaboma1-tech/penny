"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

const DARK_BLUE = "#1e40af"
const DARK_BLUE_LIGHT = "#3d4d82"
const galleryImages = [
  "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785314707/download_8_ybz4ul.jpg",
  "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785314707/download_7_hmeqog.webp",
  "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785314378/download_7_xtllwh.jpg",
]

export function AboutUs() {
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveImage((prev) => (prev + 1) % galleryImages.length)
    }, 4000)

    return () => window.clearInterval(interval)
  }, [])
  return (
    <section id="about" className="relative overflow-hidden py-20 bg-gradient-to-b from-gray-50 via-white to-gray-50">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-white/80 to-transparent blur-2xl" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
        <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-emerald-100/30 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 h-96 w-96 rounded-full bg-amber-100/20 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 mx-auto max-w-2xl rounded-[2rem] border border-gray-200 bg-white/80 p-8 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl lg:order-none lg:mx-0 lg:p-10 lg:text-left"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: DARK_BLUE_LIGHT, backgroundColor: `${DARK_BLUE_LIGHT}10`, border: `1px solid rgba(30, 64, 175, 0.3)` }}
            >
              About us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-3xl font-semibold leading-tight tracking-tighter text-gray-900 md:text-4xl lg:text-5xl"
            >
              Trusted <span style={{ color: DARK_BLUE_LIGHT }}>digital banking</span> since 2013
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-gray-600"
            >
              Since 2013, Pennywise has focused on building a modern banking platform that makes money management simple, fast, and secure.
              We combine smart savings, instant transfers, and intuitive tools tailored for both everyday users and growing businesses.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-gray-600"
            >
              Our products deliver transparent pricing, industry-grade security, and 24/7 support, empowering customers to reach their financial goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              {[
                "Transparent pricing",
                "Industry-grade security",
                "24/7 support",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700"
                >
                  {item}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 flex justify-center lg:order-none"
          >
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-gray-200 bg-white/70 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="relative h-64 overflow-hidden rounded-[1.25rem] md:h-80">
                {galleryImages.map((image, index) => {
                  const isActive = index === activeImage

                  return (
                    <motion.img
                      key={image}
                      src={image}
                      alt={`About Pennywise view ${index + 1}`}
                      className="absolute inset-0 h-full w-full rounded-[1.25rem] object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  )
                })}
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/70 via-white/25 to-transparent blur-[10px]" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
