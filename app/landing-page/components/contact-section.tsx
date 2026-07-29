"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", country: "+1", phone: "", reason: "general", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    // No backend here — simulate success
    setTimeout(() => {
      setStatus("sent")
    }, 800)
  }

  return (
    <section id="contact" className="bg-white text-gray-900 py-20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-black mb-4"
        >
          Get in touch
        </motion.h2>
        <p className="text-gray-600 mb-8 max-w-2xl">Have questions or feedback? Send us a message and we’ll get back to you shortly.</p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="text-sm text-gray-300">Your name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className="mt-2 w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#AFFF00]/30"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              className="mt-2 w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#AFFF00]/30"
              required
            />
          </div>

          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="text-sm text-gray-300">Country</label>
              <select
                name="country"
                value={form.country}
                onChange={handleChange}
                className="mt-2 w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#AFFF00]/30"
              >
                <option value="+1">+1 (US)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+234">+234 (NG)</option>
                <option value="+91">+91 (IN)</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-300">Phone number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(555) 555-5555"
                className="mt-2 w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#AFFF00]/30"
              />
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-sm text-gray-300">Reason</label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="mt-2 w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#AFFF00]/30"
            >
              <option value="general">General inquiry</option>
              <option value="support">Support</option>
              <option value="partnership">Partnership</option>
              <option value="press">Press</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="text-sm text-gray-300">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Tell us more..."
              rows={5}
              className="mt-2 w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-[#AFFF00]/30"
            />
          </div>

          <div className="col-span-1 md:col-span-2 flex items-center gap-4 mt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 bg-[#0B3D2E] border border-[#AFFF00]/70 px-6 py-3 rounded-full font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-[#AFFF00] hover:text-[#0B3D2E]"
            >
              {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : "Send message"}
            </button>

            {status === "sent" && <span className="text-sm text-green-400">Thanks — we’ll reply soon.</span>}
          </div>
        </form>
      </div>
    </section>
  )
}
