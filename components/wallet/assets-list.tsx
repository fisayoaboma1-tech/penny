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
      <h3 className="text-lg font-bold text-gray-900 mb-4 px-1">Assets</h3>
      <div className="bg-white border border-gray-200 rounded-3xl divide-y divide-gray-100">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-11 h-11 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm`}>
                <CoinIcon name={p.name} />
              </div>
              <div>
                <p className="font-medium text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500">{p.category}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ${p.amount.toLocaleString("en-US", { minimumFractionDigits: p.amount % 1 !== 0 ? 2 : 0 })}
              </p>
              <p className={`text-xs ${p.time.startsWith("▲") ? "text-teal-600" : p.time.startsWith("▼") ? "text-red-500" : "text-gray-500"}`}>{p.time}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
