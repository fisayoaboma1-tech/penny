"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, HelpCircle, Search, MessageCircle, BookOpen, Phone, Mail } from "lucide-react"
import { PageHeader } from "@/components/wallet/page-header"
import { ProtectedRoute } from "../../components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import WalletBottomNav from "@/components/wallet-bottom-nav"

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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-sm font-semibold text-[#0f6cff]">Loading…</div>
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
      <div className="min-h-screen bg-slate-50 text-slate-900">
        {/* Header */}
        <PageHeader variant="sub" title="Help Center" onBack={() => router.back()} />

        <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5 sm:space-y-6 pb-24 sm:pb-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f6cff]" />
              </div>
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">How can we help?</h2>
                <p className="text-xs sm:text-sm text-slate-500">Search our knowledge base</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 sm:py-3 pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0f6cff] transition-colors"
              />
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-slate-100 transition-colors gap-2"
                  >
                    <span className="text-sm sm:text-base font-medium text-slate-900 text-left leading-snug">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform shrink-0 ${
                        expandedFaq === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4 pt-0">
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
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
            className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm"
          >
            <h3 className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Contact Support</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f6cff]" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-slate-900">Live Chat</p>
                  <p className="text-xs text-slate-500 truncate">Chat with our support team</p>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              </button>

              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f6cff]" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-slate-900">Email Support</p>
                  <p className="text-xs text-slate-500 truncate">support@pennyiseltd@gmail.com</p>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              </button>

              <button className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 hover:bg-slate-50 transition-colors rounded-xl">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-[#0f6cff]" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-medium text-slate-900">Phone Support</p>
                  <p className="text-xs text-slate-500 truncate">+4552727772416</p>
                </div>
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              </button>
            </div>
          </motion.div>
        </div>
        <WalletBottomNav />
      </div>
    </ProtectedRoute>
  )
}