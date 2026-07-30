"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CountrySelector } from "@/components/ui/country-selector"

const reasonOptions = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press" },
]

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", country: "US", phone: "", reason: "general", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setForm(prev => ({ ...prev, country: value }))
  }

  const handleReasonChange = (value: string) => {
    setForm(prev => ({ ...prev, reason: value }))
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
    <section id="contact" className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(240,245,255,0.8))] text-gray-900 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(61,77,130,0.12),transparent_24%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/60 to-transparent blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold leading-tight tracking-tighter text-gray-900 md:text-5xl mb-4"
        >
          Get in <span style={{ color: "#3d4d82" }}>touch</span>
        </motion.h2>
        <p className="text-gray-600 mb-10 max-w-2xl text-base md:text-lg">
          Have questions or feedback? Submit your details and our secure team will respond fast with modern, personalized support.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.4fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#c7d5f0] bg-white/90 backdrop-blur-xl p-8 shadow-[0_40px_80px_rgba(30,64,175,0.08)]">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-800">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-2 w-full bg-white/95 border border-[#c7d5f0] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  type="email"
                  className="mt-2 w-full bg-white/95 border border-[#c7d5f0] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] mt-6">
              <div>
                <label className="text-sm font-semibold text-slate-800">Country</label>
                <div className="mt-2">
                  <CountrySelector
                    value={form.country}
                    onValueChange={handleCountryChange}
                    placeholder="Search countries"
                    triggerClassName="min-h-[48px] px-4 py-3 text-base"
                    panelClassName="w-full max-w-[24rem]"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Phone number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 555-5555"
                  className="mt-2 w-full bg-white/95 border border-[#c7d5f0] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-800">Reason</label>
              <select
                value={form.reason}
                onChange={(e) => handleReasonChange(e.target.value)}
                className="mt-2 w-full rounded-[1rem] border border-[#c7d5f0] bg-white/95 px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              >
                {reasonOptions.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-800">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us more..."
                rows={5}
                className="mt-2 w-full bg-white/95 border border-[#c7d5f0] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-700/20"
              />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 bg-[#0f6cff] border border-[#0f6cff]/20 px-6 py-3 rounded-full font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-[#0b57d3] hover:text-white"
              >
                {status === "sending" ? "Sending..." : status === "sent" ? "Sent" : "Send message"}
              </button>
              {status === "sent" && <span className="text-sm text-emerald-600">Thanks — we’ll reply soon.</span>}
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}
