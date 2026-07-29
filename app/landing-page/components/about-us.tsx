"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"

const DARK_GREEN = "#0B3D2E"
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
    <section id="about" className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,250,240,0.8))] py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(175,255,0,0.14),transparent_48%)]" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/6 via-black/5 to-transparent blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 rounded-[1.75rem] border border-white/70 bg-white/55 p-8 shadow-[0_22px_64px_rgba(11,61,46,0.08)] backdrop-blur-xl md:order-none md:p-10 text-center md:text-center mx-auto max-w-lg"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em]"
              style={{ color: DARK_GREEN, backgroundColor: `${DARK_GREEN}14` }}
            >
              About us
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, x: 32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-2xl font-semibold leading-tight text-gray-900 md:text-3xl lg:text-4xl"
            >
              Trusted <span style={{ color: "#4f6b12" }}>digital banking</span> since 2013
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-gray-700"
            >
              Since 2013, Pennywise has focused on building a modern banking platform that makes money management simple, fast, and secure.
              We combine smart savings, instant transfers, and intuitive tools tailored for both everyday users and growing businesses.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="mt-4 max-w-xl text-base leading-relaxed text-gray-700"
            >
              Our products deliver transparent pricing, industry grade security, and 24/7 support, empowering customers to reach their financial goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 mt-6 flex justify-center md:order-none md:mt-0"
            >
              <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white/50 p-2 shadow-[0_20px_60px_rgba(11,61,46,0.08)] backdrop-blur-xl">
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

          </motion.div>
        </div>
      </div>
    </section>
  )
}
