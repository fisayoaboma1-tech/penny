"use client"

import { motion } from "framer-motion"
import { Payment } from "./data"
import { CoinIcon } from "./coin-icons"

export function AssetsList({ payments }: { payments: Payment[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="text-lg font-bold text-white mb-4 px-1">Assets</h3>
      <div className="bg-[#111111] border border-[#1a1a1a] rounded-3xl divide-y divide-[#1a1a1a]">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 hover:bg-[#0a0a0a] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-full ${p.bg} border border-white/5 flex items-center justify-center`}>
                <CoinIcon name={p.name} />
              </div>
              <div>
                <p className="font-medium text-gray-200">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-white">
                ${p.amount.toLocaleString("en-US", { minimumFractionDigits: p.amount % 1 !== 0 ? 2 : 0 })}
              </p>
              <p className={`text-xs ${p.time.startsWith("▲") ? "text-emerald-400" : p.time.startsWith("▼") ? "text-red-400" : "text-gray-500"}`}>{p.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
