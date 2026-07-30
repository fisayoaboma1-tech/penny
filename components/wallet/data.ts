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
  { id: "1", name: "Salary", category: "Income", amount: 1500000, time: "Today", bg: "bg-white", icon: "S" },
  { id: "2", name: "Transfer to Adebayo", category: "Transfer", amount: -5000, time: "Yesterday", bg: "bg-white", icon: "T" },
  { id: "3", name: "Electricity Bill", category: "Bills", amount: -12000, time: "2 days ago", bg: "bg-white", icon: "⚡" },
  { id: "4", name: "Airtime Top-up", category: "Top-Up", amount: -1500, time: "3 days ago", bg: "bg-white", icon: "📱" },
  { id: "5", name: "Groceries", category: "Shopping", amount: -4200, time: "4 days ago", bg: "bg-white", icon: "🛒" },
  { id: "6", name: "Rent", category: "Bills", amount: -250000, time: "Jun 1", bg: "bg-white", icon: "🏠" },
]

// Legacy crypto fields removed — using generic transaction data now
export const coinAddresses: Record<string, string> = {}

export const coinOptions = [
  { name: "Naira", ticker: "NGN", bg: "bg-white" },
  { name: "Bank Transfer", ticker: "BANK", bg: "bg-white" },
  { name: "Card", ticker: "CARD", bg: "bg-white" },
]

export const actions = [
  { label: "Add", id: "add" as const },
  { label: "Send", id: "send" as const },
  { label: "Request", id: "request" as const },
  { label: "Bill", id: "bill" as const },
]

export const quickAmounts = ["100", "500", "1000", "2500", "5000", "10000"]