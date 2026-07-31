export type WalletTransactionType = "debit" | "credit" | "transfer"

export interface WalletTransaction {
  id: string
  title: string
  subtitle: string
  amount: string
  type: WalletTransactionType
  time: string
  icon: "up" | "down"
  badgeLabel: string
  detailTitle: string
  detailDescription: string
  detailFooter: string
  createdAt?: string
}

export const getWalletTransactionBadge = (type: WalletTransactionType) => {
  switch (type) {
    case "credit":
      return "Credit"
    case "debit":
      return "Debit"
    case "transfer":
    default:
      return "Transfer"
  }
}

export const getWalletTransactionIcon = (type: WalletTransactionType) => {
  return type === "credit" ? "up" : "down"
}

export const formatWalletAmount = (type: WalletTransactionType, amount: number) => {
  const absolute = Math.abs(amount)
  const formatted = `$${absolute.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return type === "credit" ? `+${formatted}` : `-${formatted}`
}

export const getTransactionTimeLabel = (createdAt?: string) => {
  if (!createdAt) return "Today"

  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return "Today"

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterdayStart = new Date(todayStart)
  yesterdayStart.setDate(todayStart.getDate() - 1)

  if (date >= todayStart) return "Today"
  if (date >= yesterdayStart) return "Yesterday"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export const recordBalanceAdjustmentTransaction = async ({
  supabase,
  userId,
  previousBalance,
  newBalance,
  actorLabel = "System",
}: {
  supabase: any
  userId: string
  previousBalance: number
  newBalance: number
  actorLabel?: string
}) => {
  const delta = newBalance - previousBalance
  if (delta === 0) {
    return { error: null }
  }

  const type: WalletTransactionType = delta > 0 ? "credit" : "debit"
  const amount = Math.abs(delta)
  const title = delta > 0 ? "Balance added" : "Balance removed"
  const subtitle = delta > 0
    ? `${actorLabel} added funds to your wallet`
    : `${actorLabel} removed funds from your wallet`
  const detailTitle = delta > 0 ? "Wallet balance updated" : "Wallet balance adjusted"
  const detailDescription = delta > 0
    ? `Your wallet balance was increased by $${amount.toFixed(2)}.`
    : `Your wallet balance was decreased by $${amount.toFixed(2)}.`
  const detailFooter = "This entry was added automatically to your transaction history."

  const { error } = await supabase
    .from("wallet_transactions")
    .insert({
      user_id: userId,
      type,
      amount,
      title,
      subtitle,
      detail_title: detailTitle,
      detail_description: detailDescription,
      detail_footer: detailFooter,
      status: "completed",
    })

  return { error }
}

export const walletTransactions: WalletTransaction[] = []
