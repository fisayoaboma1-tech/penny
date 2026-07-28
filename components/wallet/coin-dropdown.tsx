"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { payments } from "./data"
import { CoinIcon } from "./coin-icons"

export const coinOptions = payments.map((p) => ({ name: p.name, ticker: p.category, bg: p.bg }))

export function CoinDropdown({
  selected,
  onSelect,
  isOpen,
  setIsOpen,
  onOpen,
}: {
  selected: string
  onSelect: (name: string) => void
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  onOpen?: () => void
}) {
  const handleClick = () => {
    if (!isOpen && onOpen) {
      onOpen() // Close other dropdowns before opening this one
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl px-4 py-3 text-left"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
          <CoinIcon name={selected} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{selected}</p>
          <p className="text-xs text-gray-500">{payments.find((p) => p.name === selected)?.category}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-10 mt-2 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-2 shadow-2xl shadow-black/60 max-h-64 overflow-y-auto"
          >
            {coinOptions.map((coin) => (
              <button
                key={coin.name}
                type="button"
                onClick={() => {
                  onSelect(coin.name)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  selected === coin.name ? "bg-emerald-500/10" : "hover:bg-[#222]"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <CoinIcon name={coin.name} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-200">{coin.name}</p>
                  <p className="text-xs text-gray-500">{coin.ticker}</p>
                </div>
                {selected === coin.name && <div className="w-2 h-2 rounded-full bg-emerald-400 ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
