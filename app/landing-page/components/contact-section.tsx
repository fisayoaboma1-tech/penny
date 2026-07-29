"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { countries } from "@/lib/countries"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const reasonOptions = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
  { value: "press", label: "Press" },
]

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", country: "US", phone: "", reason: "general", message: "" })
  const [countrySearch, setCountrySearch] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setForm(prev => ({ ...prev, country: value }))
    setCountrySearch("")
  }

  const handleReasonChange = (value: string) => {
    setForm(prev => ({ ...prev, reason: value }))
  }

  const sortedCountries = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [],
  )

  const filteredCountries = useMemo(
    () =>
      sortedCountries.filter(country =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
        country.code.toLowerCase().includes(countrySearch.toLowerCase()) ||
        country.dialCode.includes(countrySearch),
      ),
    [countrySearch, sortedCountries],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    // No backend here — simulate success
    setTimeout(() => {
      setStatus("sent")
    }, 800)
  }

  return (
    <section id="contact" className="relative overflow-hidden bg-[#f8fbf7] text-gray-900 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,92,67,0.14),transparent_24%)] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-white via-white/60 to-transparent blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-semibold leading-tight tracking-tighter text-gray-900 md:text-5xl mb-4"
        >
          Get in <span style={{ color: "#145C43" }}>touch</span>
        </motion.h2>
        <p className="text-gray-600 mb-10 max-w-2xl text-base md:text-lg">
          Have questions or feedback? Submit your details and our secure team will respond fast with modern, personalized support.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1.4fr_0.85fr]">
          <div className="rounded-[2rem] border border-[#d7e9d4] bg-white/90 backdrop-blur-xl p-8 shadow-[0_40px_80px_rgba(11,61,46,0.08)]">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-slate-800">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="mt-2 w-full bg-white/95 border border-[#d7e9d4] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
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
                  className="mt-2 w-full bg-white/95 border border-[#d7e9d4] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                  required
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] mt-6">
              <div>
                <label className="text-sm font-semibold text-slate-800">Country</label>
                <Select value={form.country} onValueChange={handleCountryChange}>
                  <SelectTrigger className="mt-2 w-full rounded-[1rem] border border-slate-200 bg-white/95 px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20">
                    <SelectValue placeholder="Search countries" />
                  </SelectTrigger>
                  <SelectContent
                    header={
                      <div className="px-3 py-3 bg-white/95">
                        <input
                          type="search"
                          autoFocus
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          placeholder="Search countries..."
                          className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-base text-slate-900 outline-none ring-1 ring-transparent transition duration-150 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                        />
                        <div className="mt-3 h-px bg-slate-200" />
                      </div>
                    }
                    className="w-full max-w-[24rem] rounded-[1.25rem] border border-slate-200 bg-slate-50 shadow-[0_30px_80px_rgba(15,23,42,0.12)]"
                  >
                    {filteredCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex w-full items-center justify-between gap-3">
                          <span>{country.name}</span>
                          <span className="text-sm text-slate-500">{country.dialCode}</span>
                        </span>
                      </SelectItem>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="py-3 px-3 text-sm text-slate-500">No countries found.</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-800">Phone number</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(555) 555-5555"
                  className="mt-2 w-full bg-white/95 border border-[#d7e9d4] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-800">Reason</label>
              <Select value={form.reason} onValueChange={handleReasonChange}>
                <SelectTrigger className="mt-2 w-full rounded-[1rem] border border-slate-200 bg-white/95 px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-[24rem] border border-slate-200 bg-white">
                  {reasonOptions.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-6">
              <label className="text-sm font-semibold text-slate-800">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell us more..."
                rows={5}
                className="mt-2 w-full bg-white/95 border border-[#d7e9d4] rounded-[1rem] px-4 py-3 text-base text-gray-900 outline-none shadow-sm transition duration-200 focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
              />
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 bg-[#0B3D2E] border border-green-700/40 px-6 py-3 rounded-full font-bold text-sm text-white cursor-pointer transition-all duration-200 hover:bg-green-700 hover:text-white"
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
