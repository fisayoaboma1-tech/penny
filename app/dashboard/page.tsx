"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Users,
  Landmark,
  Menu,
  X,
  Edit2,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  TrendingUp,
  Activity,
  Loader2,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Sun,
  Moon,
  UserPlus,
  Eye,
  Lock,
  Unlock,
} from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts'
import { createClient } from "@/lib/supabase/client"
import { EditBalanceModal } from "../../components/edit-balance-modal"
import { DeleteUserModal } from "../../components/delete-user-modal"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { recordBalanceAdjustmentTransaction } from "@/lib/wallet/transactions"

interface User {
  id: string
  full_name: string
  email: string
  phone_number?: string
  country_code?: string
  balance: number
  created_at: string
  profile_image_url?: string
  restricted?: boolean
}

const normalizeUser = (user: any): User => ({
  id: user.id,
  full_name: user.full_name ?? "Unknown User",
  email: user.email ?? "No email",
  phone_number: user.phone_number ?? "",
  country_code: user.country_code ?? "",
  balance: typeof user.balance === "number" ? user.balance : Number(user.balance) || 0,
  created_at: user.created_at ?? new Date().toISOString(),
  profile_image_url: user.profile_image_url ?? "",
  restricted: user.restricted ?? false,
})

const getBalance = (user: User) => (typeof user.balance === "number" ? user.balance : 0)

const formatPhoneNumber = (user: User) => {
  const phone = user.phone_number?.trim() || ""
  const countryCode = user.country_code?.trim() || ""
  if (!phone) return "—"
  if (phone.startsWith("+")) return phone
  return countryCode ? `${countryCode} ${phone}` : phone
}

const ITEMS_PER_PAGE = 10

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterBy, setFilterBy] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [chartType, setChartType] = useState<"area" | "bar">("area")
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient("admin")
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const checkAdminAccess = async () => {
    try {
      setAuthLoading(true)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError || !session?.access_token) {
        setAuthorized(false)
        router.replace("/dashboard/login")
        return
      }

      const userId = session.user?.id
      if (!userId) {
        setAuthorized(false)
        router.replace("/dashboard/login")
        return
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", userId)
        .single()

      if (error || !profile?.is_admin) {
        setAuthorized(false)
        router.replace("/dashboard/login")
        return
      }

      // Admin is authenticated - set authorized to true
      setAuthorized(true)
    } catch (error) {
      console.error("Admin auth check failed:", error)
      setAuthorized(false)
      router.replace("/dashboard/login")
    } finally {
      setAuthLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error)
        setUsers([])
        return
      }

      const normalizedUsers = (data ?? []).map((user) => normalizeUser(user))
      setUsers(normalizedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user

      if (!user) {
        router.replace("/dashboard/login")
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (!data) {
        router.replace("/dashboard/login")
        return
      }

      setAdminProfile(data)
    } catch (error) {
      console.error("Error fetching admin profile:", error)
      router.replace("/dashboard/login")
    }
  }

  useEffect(() => {
    checkAdminAccess()
  }, [supabase])

  useEffect(() => {
    if (authorized) {
      fetchAdminProfile()
      fetchUsers()
    }
  }, [authorized, supabase])

  // Real-time subscription for profile updates (non-admin users only)
  useEffect(() => {
    if (!authorized) return

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: 'is_admin=eq.false',
        },
        (payload) => {
          console.log('Profile change received:', payload)
          
          if (payload.eventType === 'UPDATE') {
            const updatedProfile = payload.new as any
            const normalizedProfile = normalizeUser(updatedProfile)
            
            // Update users list
            setUsers(users.map(u => 
              u.id === normalizedProfile.id ? normalizedProfile : u
            ))
            
            // Update selected user details if it's the same user
            if (selectedUserDetails?.id === normalizedProfile.id) {
              setSelectedUserDetails(normalizedProfile)
            }
            
            // Update selected user for edit modal if it's the same user
            if (selectedUser?.id === normalizedProfile.id) {
              setSelectedUser(normalizedProfile)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [authorized, supabase, users, selectedUserDetails, selectedUser])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterBy, sortBy])

  const handleLogout = async () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    await supabase.auth.signOut()
    router.push("/dashboard/login")
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error || !data) {
        console.error("Error fetching user details:", error)
        return
      }

      const { data: authUser } = await supabase.auth.admin.getUserById(userId)
      setSelectedUserDetails(normalizeUser({
        ...data,
        email: authUser?.user?.email || data.email || "No email",
      }))
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const handleEditBalance = async (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleToggleRestrict = async (user: User) => {
    const newRestricted = !user.restricted
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ restricted: newRestricted })
        .eq("id", user.id)

      if (error) {
        console.error("Error updating restriction:", error)
        return
      }

      setUsers(users.map(u => u.id === user.id ? { ...u, restricted: newRestricted } : u))
      if (selectedUserDetails && selectedUserDetails.id === user.id) {
        setSelectedUserDetails({ ...selectedUserDetails, restricted: newRestricted })
      }
    } catch (error) {
      console.error("Error toggling restriction:", error)
    }
  }

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userToDelete.id)

        if (error) {
          console.error("Error deleting user:", error)
          return
        }

        await supabase.auth.admin.deleteUser(userToDelete.id)

        setUsers(users.filter(u => u.id !== userToDelete.id))
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    let result = [...users]

    if (normalizedQuery) {
      result = result.filter((user) => {
        const matchesName = user.full_name.toLowerCase().includes(normalizedQuery)
        const matchesEmail = user.email.toLowerCase().includes(normalizedQuery)
        const matchesPhone = (user.phone_number || "").toLowerCase().includes(normalizedQuery)
        return matchesName || matchesEmail || matchesPhone
      })
    }

    if (filterBy === "high-balance") {
      result = result.filter((user) => getBalance(user) >= 10000)
    }

    if (filterBy === "low-balance") {
      result = result.filter((user) => getBalance(user) < 10000)
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "balance":
          return getBalance(b) - getBalance(a)
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case "name":
        default:
          return a.full_name.localeCompare(b.full_name)
      }
    })

    return result
  }, [users, searchQuery, filterBy, sortBy])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

  const totalBalance = users.reduce((sum, user) => sum + getBalance(user), 0)

  const activeUsers = useMemo(() => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return users.filter(u => new Date(u.created_at).getTime() >= sevenDaysAgo.getTime()).length
  }, [users])

  const newUsersToday = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return users.filter(u => new Date(u.created_at).getTime() >= today.getTime()).length
  }, [users])

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })

  const chartData = useMemo(() => {
    if (!users || users.length === 0) return []
    const DAYS = 14
    const dates: Date[] = Array.from({ length: DAYS }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (DAYS - 1 - i))
      d.setHours(0, 0, 0, 0)
      return d
    })

    return dates.map((d) => {
      const upto = d.getTime() + 24 * 60 * 60 * 1000 - 1
      const usersUpTo = users.filter((u) => new Date(u.created_at).getTime() <= upto)
      const dayStart = d.getTime()
      const dayEnd = d.getTime() + 24 * 60 * 60 * 1000 - 1
      const newUsersDay = users.filter((u) => {
        const t = new Date(u.created_at).getTime()
        return t >= dayStart && t <= dayEnd
      })
      return {
        date: d.toLocaleDateString("en", { month: "short", day: "numeric" }),
        users: usersUpTo.length,
        balance: usersUpTo.reduce((s, u) => s + u.balance, 0),
        newUsers: newUsersDay.length,
      }
    })
  }, [users])

  const statsCards = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      change: "+12%",
      changePositive: true,
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-300",
    },
    {
      label: "Total Assets",
      value: `$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Landmark,
      change: "+8.3%",
      changePositive: true,
      gradient: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-300",
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 shadow-lg">
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mb-0.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-medium" style={{ color: entry.color }}>
              {entry.name}: {entry.name === "Balance" ? `$${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (authLoading || !authorized || !adminProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-sm font-medium">Loading admin dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden mb-15">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-blue-50/50 via-white to-slate-50/50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
      <div className="pointer-events-none fixed -top-24 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl dark:bg-blue-500/5" />
      <div className="pointer-events-none fixed -bottom-20 -left-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl dark:bg-indigo-500/5" />

      <div className="relative z-10 flex">
        {/* Desktop Sidebar */}
        <AdminSidebar
          isOpen={false}
          onClose={() => {}}
          adminProfile={adminProfile}
          isDesktop={true}
        />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 -ml-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <Menu className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </button>
                <div>
                  <h1 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Welcome back, {adminProfile?.full_name?.split(" ")[0] || "Admin"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                  title="Toggle theme"
                >
                  {mounted && theme === "dark" ? (
                    <Sun className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  )}
                </button>
                <div className="h-7 w-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  <Fingerprint className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Sidebar Drawer */}
          <AdminSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            adminProfile={adminProfile}
            isDesktop={false}
          />

          {/* Main Content */}
          <main className="flex-1 px-3 sm:px-4 lg:px-6 py-4 sm:py-5">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="grid grid-cols-2 gap-2.5 sm:gap-3 mb-4 sm:mb-5"
            >
              {statsCards.map((card, index) => {
                const Icon = card.icon
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08, duration: 0.5 }}
                    className="group relative rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200/50 dark:hover:border-blue-500/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-1.5 sm:p-2 rounded-lg ${card.lightBg} border border-slate-200/50 dark:border-slate-700/50`}>
                        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${card.iconColor}`} />
                      </div>
                      <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium ${
                        card.changePositive
                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                      }`}>
                        <TrendingUp className="w-2.5 h-2.5" />
                        {card.change}
                      </span>
                    </div>
                    <div>
                      <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-0.5">
                        {card.label}
                      </p>
                      <p className="text-base sm:text-lg lg:text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
                        {loading ? (
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-blue-500" />
                        ) : (
                          card.value
                        )}
                      </p>
                    </div>
                    <div className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Users Table */}
            <motion.div
              id="user-management"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-xl border border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
            >
              {/* Table Header */}
              <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-700/50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">User Management</h2>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage registered users</p>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                    <span className="text-[10px] sm:text-xs font-medium text-blue-600 dark:text-blue-300">{users.length} Total</span>
                  </div>
                </div>
              </div>

              {/* Search & Filters */}
              <div className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 px-4 sm:px-5 py-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    <input
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search users..."
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 py-1.5 pl-8 pr-2.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500/10 dark:focus:border-blue-400"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                      <SlidersHorizontal className="h-3 w-3 text-slate-400" />
                      <select
                        value={filterBy}
                        onChange={(event) => setFilterBy(event.target.value)}
                        className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
                      >
                        <option value="all">All</option>
                        <option value="high-balance">High balance</option>
                        <option value="low-balance">Low balance</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 shadow-sm">
                      <ArrowUpDown className="h-3 w-3 text-slate-400" />
                      <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className="bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
                      >
                        <option value="name">Name</option>
                        <option value="balance">Balance</option>
                        <option value="newest">Newest</option>
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm">No users match your search</p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Try another name, email, or phone number</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50">
                        <th className="px-4 sm:px-5 py-2.5 text-left text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">User</th>
                        <th className="px-4 sm:px-5 py-2.5 text-left text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</th>
                        <th className="px-4 sm:px-5 py-2.5 text-left text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance</th>
                        <th className="px-4 sm:px-5 py-2.5 text-left text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
                        <th className="px-4 sm:px-5 py-2.5 text-right text-[9px] sm:text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                      {currentUsers.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                          className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-4 sm:px-5 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                {user.profile_image_url ? (
                                  <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                    {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.full_name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-5 py-3">
                            <p className="text-sm text-slate-700 dark:text-slate-300">{formatPhoneNumber(user)}</p>
                          </td>
                          <td className="px-4 sm:px-5 py-3">
                            <span className="text-sm font-medium text-slate-900 dark:text-white">${getBalance(user).toFixed(2)}</span>
                          </td>
                          <td className="px-4 sm:px-5 py-3">
                            <button
                              onClick={() => fetchUserDetails(user.id)}
                              className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2 py-1 text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </button>
                          </td>
                          <td className="px-4 sm:px-5 py-3">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEditBalance(user)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 transition-all"
                                title="Edit Balance"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(user)}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-red-500 hover:text-red-600 dark:hover:border-red-400 dark:hover:text-red-300 transition-all"
                                title="Delete User"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-700/50">
                {loading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-10">
                    <Users className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400 text-sm">No users match your search</p>
                    <p className="text-slate-500 dark:text-slate-500 text-xs mt-1">Try another name, email, or phone number</p>
                  </div>
                ) : (
                  currentUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                      className="px-4 sm:px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {user.profile_image_url ? (
                            <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                              {user.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.full_name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {user.restricted && (
                                <span className="rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[9px] font-semibold border border-amber-200 dark:border-amber-500/20">
                                  Restricted
                                </span>
                              )}
                              <span className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap">${getBalance(user).toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">{user.phone_number || "—"}</p>
                            <button
                              onClick={() => fetchUserDetails(user.id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300"
                            >
                              <Eye className="w-3 h-3" />
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {!loading && totalPages > 1 && (
                <div className="border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/50 px-4 sm:px-5 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                      Showing <span className="font-medium text-slate-700 dark:text-slate-300">{startIndex + 1}</span> to <span className="font-medium text-slate-700 dark:text-slate-300">{Math.min(endIndex, filteredUsers.length)}</span> of <span className="font-medium text-slate-700 dark:text-slate-300">{filteredUsers.length}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.max(1, prev - 1))
                          setTimeout(() => document.getElementById('user-management')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                        }}
                        disabled={currentPage === 1}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium text-slate-700 dark:text-slate-300">
                        Page {currentPage} of {totalPages}
                      </div>
                      <button
                        onClick={() => {
                          setCurrentPage(prev => Math.min(totalPages, prev + 1))
                          setTimeout(() => document.getElementById('user-management')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
                        }}
                        disabled={currentPage === totalPages}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-600 dark:text-slate-400 transition hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>

      {/* User Details Drawer */}
      <AnimatePresence>
        {selectedUserDetails && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/25 dark:bg-slate-950/50 backdrop-blur-[2px]"
              onClick={() => setSelectedUserDetails(null)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 z-50 h-full w-80 border-l border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-black/40"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-blue-500">Account Details</p>
                  <h3 className="mt-0.5 text-sm font-medium text-slate-900 dark:text-white">User Profile</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUserDetails(null)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-400 dark:text-slate-500"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-3 px-4 py-4">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 p-3">
                  <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                    {selectedUserDetails.profile_image_url ? (
                      <img src={selectedUserDetails.profile_image_url} alt={selectedUserDetails.full_name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400">
                        {selectedUserDetails.full_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{selectedUserDetails.full_name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{selectedUserDetails.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="rounded-lg bg-slate-50/50 dark:bg-slate-800/20 p-3">
                    <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Phone</p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{formatPhoneNumber(selectedUserDetails)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 dark:bg-slate-800/20 p-3">
                    <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Account ID</p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">#{selectedUserDetails.id.slice(0, 8)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 dark:bg-slate-800/20 p-3">
                    <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Balance</p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">${getBalance(selectedUserDetails).toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 dark:bg-slate-800/20 p-3 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Withdrawals</p>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{selectedUserDetails.restricted ? 'Restricted' : 'Allowed'}</p>
                    </div>
                    <button
                      onClick={() => {
                        handleToggleRestrict(selectedUserDetails)
                        setSelectedUserDetails({ ...selectedUserDetails, restricted: !selectedUserDetails.restricted })
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${selectedUserDetails.restricted ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-700 border border-slate-200'}`}
                    >
                      {selectedUserDetails.restricted ? 'Unrestrict' : 'Restrict'}
                    </button>
                  </div>
                  <div className="rounded-lg bg-slate-50/50 dark:bg-slate-800/20 p-3">
                    <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">Joined</p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{formatDate(selectedUserDetails.created_at)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2">Actions</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        handleEditBalance(selectedUserDetails)
                        setSelectedUserDetails(null)
                      }}
                      className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-[10px] font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-300 transition"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Balance
                    </button>
                    <button
                      onClick={() => {
                        handleToggleRestrict(selectedUserDetails)
                      }}
                      className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[10px] font-semibold transition ${selectedUserDetails.restricted ? 'border-amber-500 bg-amber-50 text-amber-700 hover:bg-amber-100' : 'border-slate-200 bg-white text-slate-700 hover:border-amber-500 hover:text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
                    >
                      <Fingerprint className="w-3 h-3" />
                      {selectedUserDetails.restricted ? 'Unrestrict' : 'Restrict'} W/D
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteClick(selectedUserDetails)
                        setSelectedUserDetails(null)
                      }}
                      className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-[10px] font-semibold text-red-600 dark:text-red-400 hover:border-red-500 hover:bg-red-50 dark:hover:border-red-400 dark:hover:bg-slate-800 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete User
                    </button>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Edit Balance Modal */}
      <EditBalanceModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedUser(null)
        }}
        user={selectedUser}
        onSave={async (newBalance) => {
          if (selectedUser) {
            try {
              const previousBalance = selectedUser.balance
              const { error } = await supabase
                .from("profiles")
                .update({ balance: newBalance })
                .eq("id", selectedUser.id)

              if (error) {
                console.error("Error updating balance:", error)
                return
              }

              const { error: transactionError } = await recordBalanceAdjustmentTransaction({
                supabase,
                userId: selectedUser.id,
                previousBalance,
                newBalance,
                actorLabel: "Admin",
              })

              if (transactionError) {
                console.error("Error recording balance adjustment:", transactionError)
              }

              setUsers(users.map(u => 
                u.id === selectedUser.id ? { ...u, balance: newBalance } : u
              ))
              if (selectedUserDetails?.id === selectedUser.id) {
                setSelectedUserDetails({ ...selectedUserDetails, balance: newBalance })
              }
              setIsEditModalOpen(false)
              setSelectedUser(null)
            } catch (error) {
              console.error("Error updating balance:", error)
            }
          }
        }}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        userName={userToDelete?.full_name || ""}
      />

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[50%] left-[50%] z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative mx-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-[0_24px_80px_-24px_rgba(15,23,42,0.35)] dark:shadow-black/50">
                <div className="text-center space-y-3">
                  <div className="flex justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10">
                      <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">Confirm Logout</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Are you sure you want to log out?</p>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowLogoutModal(false)}
                      className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmLogout}
                      className="flex-1 rounded-lg border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 transition-all hover:bg-red-100 dark:hover:bg-red-500/20"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}