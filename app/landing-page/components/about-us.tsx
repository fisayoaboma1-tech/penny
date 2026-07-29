"use client"

import { motion } from "framer-motion"

const DARK_GREEN = "#0B3D2E"
const LEMON_GREEN = "#AFFF00"

export function AboutUs() {
  return (
    <section id="about" className="relative py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block font-mono text-sm tracking-widest" style={{ color: DARK_GREEN, backgroundColor: `${DARK_GREEN}10` }}>
              ABOUT US
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">Trusted digital banking since 2013</h2>

            <p className="text-gray-700 mt-4 leading-relaxed max-w-xl">
              Since 2013, Pennywise has focused on building a modern banking platform that makes money management simple, fast, and secure.
              We combine smart savings, instant transfers, and intuitive tools tailored for both everyday users and growing businesses.
            </p>

            <p className="text-gray-700 mt-4 leading-relaxed max-w-xl">
              Our products deliver transparent pricing, industry-grade security, and 24/7 support — empowering customers to reach their financial goals.
            </p>

            <div className="mt-6">
              <button className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white" style={{ backgroundColor: LEMON_GREEN, color: "#081" }}>
                Learn more
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="w-full h-64 md:h-80 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center">
              {/* Image placeholder — replace with your image or <Image /> component */}
              <span className="text-gray-400">Your image here</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
