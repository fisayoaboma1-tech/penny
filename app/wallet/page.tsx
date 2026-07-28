"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { payments } from "@/components/wallet/data"
import { WalletHeader } from "@/components/wallet/header"
import { BalanceCard } from "@/components/wallet/balance-card"
import { AssetsList } from "@/components/wallet/assets-list"
import { SideMenu } from "@/components/wallet/side-menu"
import { AddMoneyModal, WithdrawModal } from "@/components/wallet/modals"
import { SignOutModal } from "@/components/wallet/signout-modal"
import { ProfileImageModal } from "@/components/wallet/profile-image-modal"
import { ProtectedRoute } from "@/components/route-protection"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

export default function WalletPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [balance, setBalance] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false)
  const [addAmount, setAddAmount] = useState("")
  const [addCoin, setAddCoin] = useState("Bitcoin")
  const [addCoinOpen, setAddCoinOpen] = useState(false)
  const [sendCoin, setSendCoin] = useState("Bitcoin")
  const [sendCoinOpen, setSendCoinOpen] = useState(false)
  const [networkOpen, setNetworkOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [signOutOpen, setSignOutOpen] = useState(false)
  const [userName, setUserName] = useState("User")
  const [profileImageUrl, setProfileImageUrl] = useState("")
  const [profileImageModalOpen, setProfileImageModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Get user name, balance, and profile image from database
  useEffect(() => {
    if (user) {
      // Get user name from metadata
      if (user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name)
      }

      // Fetch profile data from profiles table
      const fetchProfileData = async () => {
        const supabase = createClient()
        const { data, error } = await supabase
          .from("profiles")
          .select("balance, profile_image_url")
          .eq("id", user.id)
          .single()

        if (error) {
          console.error("Error fetching profile data:", error)
        } else if (data) {
          setBalance(data.balance || 0)
          if (data.profile_image_url) {
            setProfileImageUrl(data.profile_image_url)
          }
        }
      }

      fetchProfileData()
    }
  }, [user])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    setSignOutOpen(true)
  }

  const confirmLogout = async () => {
    await signOut()
    router.push("/login")
  }


  const handleAction = (action: string) => {
    switch (action) {
      case "fundwallet":
        setAddModalOpen(true)
        break
      case "withdrawfunds":
        setWithdrawModalOpen(true)
        break
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] pt-10 pb-10">
        <WalletHeader 
          userName={userName} 
          menuOpen={menuOpen} 
          onMenuToggle={() => setMenuOpen((v) => !v)}
          profileImageUrl={profileImageUrl}
        />

        <SideMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          userName={userName}
          balance={balance}
          onLogout={handleLogout}
          profileImageUrl={profileImageUrl}
          onImageClick={() => setProfileImageModalOpen(true)}
        />

        <SignOutModal
          isOpen={signOutOpen}
          onClose={() => setSignOutOpen(false)}
          onConfirm={confirmLogout}
        />

        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <BalanceCard balance={balance} onAction={handleAction} />
          <AssetsList payments={payments} />
        </div>

      <AddMoneyModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        addAmount={addAmount}
        setAddAmount={setAddAmount}
        addCoin={addCoin}
        setAddCoin={setAddCoin}
        addCoinOpen={addCoinOpen}
        setAddCoinOpen={setAddCoinOpen}
      />

      <WithdrawModal
        isOpen={withdrawModalOpen}
        onClose={() => setWithdrawModalOpen(false)}
        withdrawAmount={withdrawAmount}
        setWithdrawAmount={setWithdrawAmount}
        sendCoin={sendCoin}
        setSendCoin={setSendCoin}
        sendCoinOpen={sendCoinOpen}
        setSendCoinOpen={setSendCoinOpen}
        networkOpen={networkOpen}
        setNetworkOpen={setNetworkOpen}
      />

      <ProfileImageModal
        isOpen={profileImageModalOpen}
        onClose={() => setProfileImageModalOpen(false)}
        currentImageUrl={profileImageUrl}
        onImageUpdate={setProfileImageUrl}
      />
      </div>
    </ProtectedRoute>
  )
}
