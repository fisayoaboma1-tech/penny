"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { NetworkIcon } from "./network-icons"

interface Network {
  id: string
  name: string
  icon: string
}

interface NetworkDropdownProps {
  selected: string
  onSelect: (id: string) => void
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  networks: Network[]
}

export function NetworkDropdown({
  selected,
  onSelect,
  isOpen,
  setIsOpen,
  networks,
}: NetworkDropdownProps) {
  const selectedNetwork = networks.find(n => n.id === selected)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl px-4 py-3 text-left"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          {selectedNetwork && <NetworkIcon id={selectedNetwork.id} />}
        </div>
        <div className="flex-1">
          <p className="text-xs text-gray-400">{selectedNetwork?.name || "Select Network"}</p>
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
            {networks.map((network) => (
              <button
                key={network.id}
                type="button"
                onClick={() => {
                  onSelect(network.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  selected === network.id ? "bg-emerald-500/10" : "hover:bg-[#222]"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
                  <NetworkIcon id={network.id} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400">{network.name}</p>
                </div>
                {selected === network.id && <div className="w-2 h-2 rounded-full bg-emerald-400 ml-auto" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
