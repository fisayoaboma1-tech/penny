"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { X, Check, Copy } from "lucide-react"
import { coinAddresses, quickAmounts } from "./data"
import { CoinDropdown } from "./coin-dropdown"
import { NetworkDropdown } from "./network-dropdown"

interface ModalBaseProps {
  isOpen: boolean
  onClose: () => void
}

export function AddMoneyModal({
  isOpen,
  onClose,
  addAmount,
  setAddAmount,
  addCoin,
  setAddCoin,
  addCoinOpen,
  setAddCoinOpen,
}: ModalBaseProps & {
  addAmount: string
  setAddAmount: (v: string) => void
  addCoin: string
  setAddCoin: (v: string) => void
  addCoinOpen: boolean
  setAddCoinOpen: (v: boolean) => void
}) {
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [networkOpen, setNetworkOpen] = useState(false)

  // Networks supported by each coin for adding money
  const coinNetworks: Record<string, Array<{id: string, name: string, icon: string}>> = {
    "Bitcoin": [
      { id: "bitcoin", name: "Bitcoin Network", icon: "₿" },
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
    ],
    "Ethereum": [
      { id: "ethereum", name: "Ethereum Network", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
    ],
    "BNB": [
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
    ],
    "USDT": [
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
      { id: "solana", name: "Solana (SPL)", icon: "◎" },
      { id: "tron", name: "TRON (TRC-20)", icon: "⚡" },
    ],
    "Solana": [
      { id: "solana", name: "Solana Network", icon: "◎" },
    ],
    "Tether": [
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
      { id: "tron", name: "TRON (TRC-20)", icon: "⚡" },
    ],
    "TRON": [
      { id: "tron", name: "TRON Network", icon: "⚡" },
    ],
    "XRP": [
      { id: "xrp", name: "XRP Ledger", icon: "✕" },
    ],
    "Cardano": [
      { id: "cardano", name: "Cardano Network", icon: "◆" },
    ],
    "Dogecoin": [
      { id: "dogecoin", name: "Dogecoin Network", icon: "Ð" },
    ],
  }

  const networks = coinNetworks[addCoin] || []

  // Update selected network when coin changes
  if (networks.length > 0 && !networks.find(n => n.id === selectedNetwork)) {
    setSelectedNetwork(networks[0].id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111111] border border-[#1a1a1a] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Add Money</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Select coin</p>
              <CoinDropdown 
                selected={addCoin} 
                onSelect={(coin) => {
                  setAddCoin(coin)
                  setNetworkOpen(false) // Close network dropdown when coin changes
                }} 
                isOpen={addCoinOpen} 
                setIsOpen={setAddCoinOpen}
                onOpen={() => setNetworkOpen(false)} // Close network dropdown when coin dropdown opens
              />
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Select Network</p>
              <NetworkDropdown
                selected={selectedNetwork}
                onSelect={setSelectedNetwork}
                isOpen={networkOpen}
                setIsOpen={setNetworkOpen}
                networks={networks}
              />
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">Enter amount</p>
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl px-4 py-3">
                <span className="text-xl text-gray-400">$</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAddAmount(amt)}
                  className={`py-2 rounded-xl text-sm font-medium border transition-colors ${
                    addAmount === amt
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-[#0a0a0a] border-[#1a1a1a] text-gray-400 hover:border-gray-700"
                  }`}
                >
                  ${Number(amt).toLocaleString()}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                if (addAmount && Number(addAmount) > 0) {
                  onClose()
                  setAddAmount("")
                }
              }}
              disabled={!addAmount || Number(addAmount) <= 0}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Fund Wallet
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function WithdrawModal({
  isOpen,
  onClose,
  withdrawAmount,
  setWithdrawAmount,
  sendCoin,
  setSendCoin,
  sendCoinOpen,
  setSendCoinOpen,
  networkOpen,
  setNetworkOpen,
}: ModalBaseProps & {
  withdrawAmount: string
  setWithdrawAmount: (v: string) => void
  sendCoin: string
  setSendCoin: (v: string) => void
  sendCoinOpen: boolean
  setSendCoinOpen: (v: boolean) => void
  networkOpen: boolean
  setNetworkOpen: (v: boolean) => void
}) {
  const [selectedNetwork, setSelectedNetwork] = useState("")
  const [withdrawAddress, setWithdrawAddress] = useState("")

  // Networks supported by each coin
  const coinNetworks: Record<string, Array<{id: string, name: string, icon: string}>> = {
    "Bitcoin": [
      { id: "bitcoin", name: "Bitcoin Network", icon: "₿" },
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
    ],
    "Ethereum": [
      { id: "ethereum", name: "Ethereum Network", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
    ],
    "BNB": [
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
    ],
    "USDT": [
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
      { id: "solana", name: "Solana (SPL)", icon: "◎" },
      { id: "tron", name: "TRON (TRC-20)", icon: "⚡" },
    ],
    "Solana": [
      { id: "solana", name: "Solana Network", icon: "◎" },
    ],
    "Tether": [
      { id: "ethereum", name: "Ethereum (ERC-20)", icon: "⟠" },
      { id: "bsc", name: "BNB Smart Chain (BEP-20)", icon: "◆" },
      { id: "polygon", name: "Polygon (MATIC)", icon: "⬡" },
      { id: "tron", name: "TRON (TRC-20)", icon: "⚡" },
    ],
    "TRON": [
      { id: "tron", name: "TRON Network", icon: "⚡" },
    ],
    "XRP": [
      { id: "xrp", name: "XRP Ledger", icon: "✕" },
    ],
    "Cardano": [
      { id: "cardano", name: "Cardano Network", icon: "◆" },
    ],
    "Dogecoin": [
      { id: "dogecoin", name: "Dogecoin Network", icon: "Ð" },
    ],
  }

  const networks = coinNetworks[sendCoin] || []

  // Update selected network when coin changes
  if (networks.length > 0 && !networks.find(n => n.id === selectedNetwork)) {
    setSelectedNetwork(networks[0].id)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#111111] border border-[#1a1a1a] rounded-3xl p-6 shadow-2xl shadow-black/60"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Withdraw</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* Coin Selection */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Select Coin</p>
              <CoinDropdown 
                selected={sendCoin} 
                onSelect={(coin) => {
                  setSendCoin(coin)
                  setNetworkOpen(false) // Close network dropdown when coin changes
                }} 
                isOpen={sendCoinOpen} 
                setIsOpen={setSendCoinOpen}
                onOpen={() => setNetworkOpen(false)} // Close network dropdown when coin dropdown opens
              />
            </div>

            {/* Network Selection */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Select Network</p>
              <NetworkDropdown
                selected={selectedNetwork}
                onSelect={setSelectedNetwork}
                isOpen={networkOpen}
                setIsOpen={setNetworkOpen}
                networks={networks}
              />
            </div>

            {/* Withdraw Address */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Withdraw Address</p>
              <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl px-4 py-3">
                <input
                  type="text"
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  placeholder="Enter wallet address"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Amount */}
            <div className="mb-6">
              <p className="text-xs text-gray-500 mb-2">Amount</p>
              <div className="flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl px-4 py-3">
                <span className="text-xl text-gray-400">$</span>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <button
              disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || !withdrawAddress}
              className="w-full py-3 rounded-2xl font-semibold text-sm transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Withdraw
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
