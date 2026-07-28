"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronDown, ChevronRight, HelpCircle, Search, MessageCircle, BookOpen, Phone, Mail } from "lucide-react"
import { ProtectedRoute } from "../../components/route-protection"
import { useAuth } from "@/contexts/auth-context"

const faqs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by going to Settings > Security > Change Password. Follow the prompts to create a new password."
  },
  {
    question: "How do I add a payment method?",
    answer: "Navigate to the Cards section in your wallet and click 'Add Card'. Follow the instructions to link your payment method."
  },
  {
    question: "Is my account secure?",
    answer: "Yes! We use industry-standard encryption and security measures. You can also enable two-factor authentication for extra protection."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team via email at support@bankii.com or through the in-app chat feature available 24/7."
  },
  {
    question: "What are the transaction limits?",
    answer: "Transaction limits vary based on your account type. Premium members enjoy higher limits. Check your account settings for details."
  },
]

export default function HelpCenterPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    )
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="bg-[#111111] border-b border-[#1a1a1a] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-20">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-[#1a1a1a] rounded-xl transition-colors mr-4"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <h1 className="text-xl font-bold text-white">Help Center</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-6"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gray-800/50 rounded-2xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">How can we help?</h2>
              <p className="text-sm text-gray-500">Search our knowledge base</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl py-3 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
            />
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-6"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
          <div className="space-y-2">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between hover:bg-[#1a1a1a] transition-colors"
                >
                  <span className="font-medium text-gray-200 text-left">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-600 transition-transform ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 pt-0">
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#111111] border border-[#1a1a1a] rounded-3xl p-6"
        >
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Support</h3>
          <div className="space-y-2">
            <button className="w-full p-4 flex items-center gap-4 px-5 hover:bg-[#0a0a0a] transition-colors">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-left flex-1">
                <p className="font-medium text-gray-200">Live Chat</p>
                <p className="text-xs text-gray-500">Chat with our support team</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button className="w-full p-4 flex items-center gap-4 px-5 hover:bg-[#0a0a0a] transition-colors">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
            <div className="text-left flex-1">
                <p className="font-medium text-gray-200">Email Support</p>
                <p className="text-xs text-gray-500">support@pennyiseltd@gmail.com</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            <button className="w-full p-4 flex items-center gap-4 px-5 hover:bg-[#0a0a0a] transition-colors">
              <div className="w-10 h-10 bg-gray-800/50 rounded-lg flex items-center justify-center">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
            <div className="text-left flex-1">
                <p className="font-medium text-gray-200">Phone Support</p>
                <p className="text-xs text-gray-500">+4552727772416</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </motion.div>

        </div>
      </div>
    </ProtectedRoute>
  )
}
