"use client"

export interface Payment {
  id: string
  name: string
  category: string
  amount: number
  time: string
  bg: string
  icon: string
}

export const payments: Payment[] = [
  { id: "1", name: "Bitcoin", category: "BTC", amount: 42150, time: "▲ 2.4%", bg: "bg-[#1e1e1e]", icon: "₿" },
  { id: "2", name: "Ethereum", category: "ETH", amount: 2240, time: "▲ 1.8%", bg: "bg-[#1e1e2e]", icon: "◆" },
  { id: "3", name: "Tether", category: "USDT", amount: 3500, time: "▬ 0.01%", bg: "bg-[#0f2e1c]", icon: "₮" },
  { id: "4", name: "BNB", category: "BNB", amount: 312, time: "▲ 3.2%", bg: "bg-[#2e0f1c]", icon: "◈" },
  { id: "5", name: "Solana", category: "SOL", amount: 145, time: "▲ 5.7%", bg: "bg-[#0f1a2e]", icon: "◎" },
  { id: "6", name: "XRP", category: "XRP", amount: 87, time: "▲ 1.2%", bg: "bg-[#1a0f2e]", icon: "✕" },
]

export const coinAddresses: Record<string, string> = {
  "Bitcoin": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  "Ethereum": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "Tether": "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
  "BNB": "bnb1grpf0955h0pzr6r3h9sk8f4l8q8k3x6c7v3d8t",
  "Solana": "7EcDhSYGxXyscszYEp35KHN8vvw3svAuLKTzXwCFL",
  "XRP": "rLHzPsX5oXvJG8PjXxLxJx5xJx5xJx5xJx5xJx5x",
}

export const coinOptions = payments.map((p) => ({ name: p.name, ticker: p.category, bg: p.bg }))

export const actions = [
  { label: "Add", id: "add" as const },
  { label: "Send", id: "send" as const },
  { label: "Request", id: "request" as const },
  { label: "Bill", id: "bill" as const },
]

export const quickAmounts = ["100", "500", "1000", "2500", "5000", "10000"]