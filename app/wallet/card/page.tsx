"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Plus } from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { WalletPageHeader } from "@/components/wallet/page-header"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Card = {
  id: string
  name: string
  number: string
  expiry: string
  cvc: string
}

export default function WalletCardPage() {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [cardName, setCardName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")

  const handleAddCard = () => {
    if (!cardName || !cardNumber || !expiry || !cvc) {
      return
    }

    setCards((prev) => [
      ...prev,
      {
        id: crypto?.randomUUID?.() ?? Date.now().toString(),
        name: cardName,
        number: cardNumber,
        expiry,
        cvc,
      },
    ])

    setIsDialogOpen(false)
    setCardName("")
    setCardNumber("")
    setExpiry("")
    setCvc("")
  }

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col pb-15 bg-slate-50 text-slate-900">
      <WalletPageHeader onBack={() => router.back()} />

      <main className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl space-y-3 px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[28px] border border-[#0f6cff]/20 bg-white/90 p-4 shadow-sm sm:p-6"
        >
          <div className="flex flex-col gap-4 rounded-[24px] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Cards</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">Add your card</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-500">
                Store your card securely and start using it for payments in the Wallet.
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  size="lg"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(37,99,235,0.24)] transition hover:bg-[#1d4ed8] sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  Add card
                </Button>
              </DialogTrigger>
              <DialogContent className="overflow-hidden rounded-[2rem] border border-[#0f6cff]/20 p-0 shadow-[0_40px_80px_rgba(15,23,42,0.18)] sm:max-w-md">
                <div className="relative bg-white">
                  <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#eff7ff] to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(15,99,255,0.14),transparent_45%)]" />
                  <div className="relative px-6 py-6 sm:px-8 sm:py-8">
                    <DialogHeader className="text-left">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-[0_16px_40px_rgba(15,23,42,0.12)]">
                        <CreditCard className="h-5 w-5 text-[#0f6cff]" />
                      </div>
                      <DialogTitle className="text-xl font-semibold text-slate-900">Add new card</DialogTitle>
                      <DialogDescription className="mt-2 text-sm leading-6 text-slate-500">
                        Enter the card details to add a card to your Wallet.
                      </DialogDescription>
                    </DialogHeader>
                    <form autoComplete="off" className="mt-6 grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="demo-name" className="text-sm font-medium text-slate-700">Cardholder name</Label>
                        <Input
                          id="demo-name"
                          name="demo-name"
                          autoComplete="off"
                          value={cardName}
                          onChange={(event) => setCardName(event.target.value)}
                          placeholder="John Doe"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus-visible:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10 focus-visible:ring-[#0f6cff]/10"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="demo-number" className="text-sm font-medium text-slate-700">Card number</Label>
                        <Input
                          id="demo-number"
                          name="demo-number"
                          autoComplete="off"
                          inputMode="numeric"
                          value={cardNumber}
                          onChange={(event) => setCardNumber(event.target.value)}
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus-visible:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10 focus-visible:ring-[#0f6cff]/10"
                        />
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-2">
                          <Label htmlFor="demo-expiry" className="text-sm font-medium text-slate-700">Expiry</Label>
                          <Input
                            id="demo-expiry"
                            name="demo-expiry"
                            autoComplete="off"
                            inputMode="numeric"
                            value={expiry}
                            onChange={(event) => setExpiry(event.target.value)}
                            placeholder="MM/YY"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus-visible:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10 focus-visible:ring-[#0f6cff]/10"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="demo-cvc" className="text-sm font-medium text-slate-700">CVC</Label>
                          <Input
                            id="demo-cvc"
                            name="demo-cvc"
                            autoComplete="off"
                            inputMode="numeric"
                            value={cvc}
                            onChange={(event) => setCvc(event.target.value)}
                            placeholder="123"
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f6cff] focus-visible:border-[#0f6cff] focus:ring-2 focus:ring-[#0f6cff]/10 focus-visible:ring-[#0f6cff]/10"
                          />
                        </div>
                      </div>
                    </form>
                    <DialogFooter className="mt-6 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <DialogClose asChild>
                        <Button variant="outline" className="w-full rounded-full border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:w-auto">Cancel</Button>
                      </DialogClose>
                      <Button onClick={handleAddCard} className="w-full rounded-full bg-[#0f6cff] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition hover:bg-[#0b57d3] sm:w-auto">Save card</Button>
                    </DialogFooter>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
        >
          {cards.length > 0 ? (
            <div className="space-y-4">
              {cards.map((card) => (
                <div key={card.id} className="rounded-[20px] border border-[#0f6cff]/30 bg-slate-50 p-4 shadow-[0_10px_24px_rgba(15,99,255,0.08)]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Cardholder</p>
                      <p className="mt-1 font-semibold text-slate-900">{card.name}</p>
                    </div>
                    <CreditCard className="h-5 w-5 text-slate-500" />
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Card number</p>
                      <p className="mt-1 font-semibold text-slate-900">**** **** **** {card.number.slice(-4)}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Expiry</p>
                      <p className="mt-1 font-semibold text-slate-900">{card.expiry}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[20px] border border-dashed border-slate-200 bg-slate-50 p-6 sm:p-8 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <CreditCard className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-900">No cards added yet</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Add a card to start paying from your Wallet.
              </p>
            </div>
          )}
        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}
