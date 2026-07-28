 "use client"

import {o motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Instagram } from "lucide-react"
import Image from "next/image"

const DARK_GREEN = "#0B3D2E"
const DARK_GREEN_LIGHT = "#145C43"

const instagramPosts = [
  { image: "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785254367/WhatsApp_Image_2026-07-28_at_4.57.02_PM_nhc6qe.jpg", likes: "2.4k" },
  { image: "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785254367/WhatsApp_Image_2026-07-28_at_4.57.02_PM_2_gyqqur.jpg", likes: "1.8k" },
  { image: "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785254367/WhatsApp_Image_2026-07-28_at_4.57.03_PM_2_pkur27.jpg", likes: "3.2k" },
  { image: "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785254367/WhatsApp_Image_2026-07-28_at_4.57.02_PM_nhc6qe.jpg", likes: "956" },
  { image: "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785254367/WhatsApp_Image_2026-07-28_at_4.57.03_PM_n9b0p2.jpg", likes: "1.5k" },
  { image: "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785254367/WhatsApp_Image_2026-07-28_at_4.57.02_PM_1_dtmt5i.jpg", likes: "2.1k" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
} as const

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 20,
    },
  },
} as const

export function SocialSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  return (
    <section id="creators" className="relative py-16 bg-[#121212] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-10"
        >
          <motion.span
            className="font-mono text-xs tracking-widest inline-block"
            style={{ color: "#ffffff" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            JOIN THE MOVEMENT
          </motion.span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mt-2 overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.2 }}
            >
              @PENNYWISE
            </motion.span>
            <motion.span
              className="inline-block relative"
              initial={{ y: 100 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1], delay: 0.3 }}
            >
              <span style={{ color: DARK_GREEN_LIGHT }}>.APP</span>
              <motion.div
                className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ backgroundColor: DARK_GREEN_LIGHT }}
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
              />
            </motion.span>
          </h2>
        </motion.div>

        <motion.div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {instagramPosts.map((post, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                zIndex: 10,
                transition: { type: "spring", stiffness: 300, damping: 20 },
              }}
              className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
            >
              <Image
                src={post.image || "/placeholder.svg"}
                alt={`Community post ${index + 1}`}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: "transparent" }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1, backgroundColor: `${DARK_GREEN}33` }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={{ y: 10 }}
                  whileHover={{ y: 0 }}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span className="font-mono text-xs">{post.likes}</span>
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a
            href="https://instagram.com/pennywise.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-bold text-sm tracking-wide relative overflow-hidden group"
            style={{ backgroundColor: DARK_GREEN }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              whileHover={{ x: "200%" }}
              transition={{ duration: 0.6 }}
            />
            <Instagram className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Follow @pennywise.app</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}