"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowUpDown,
  CalendarDays,
  CircleDollarSign,
  Download,
  Eye,
  Fingerprint,
  Loader2,
  Menu,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRoundPlus,
  Users,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAdminAuth } from "@/contexts/admin-auth-context"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { EditBalanceModal } from "@/components/edit-balance-modal"
import { DeleteUserModal } from "@/components/delete-user-modal"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"
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

const ITEM_COUNT = 10

export default function AdminDashboard({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const { user, loading: authLoading, profile, isAdmin, signOut } = useAdminAuth()
  const [supabase] = useState(() => createClient("admin"))
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("name")
  const [filterBy, setFilterBy] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      setAuthorized(false)
      router.replace("/admin-template/login")
      return
    }

    if (!authLoading && user && isAdmin) {
      setAuthorized(true)
      setAdminProfile(profile)
      void fetchUsers()
    }
  }, [user, isAdmin, authLoading, profile])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false)
        .order("created_at", { ascending: false })

      if (error) throw error
      setUsers((data ?? []).map((item) => normalizeUser(item)))
    } catch (error) {
      console.error("Failed to load users", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authorized) return

    const channel = supabase
      .channel("profiles-admin-overview")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: "is_admin=eq.false",
        },
        (payload) => {
          void fetchUsers()
        }
      )
      .subscribe((status, error) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Admin user updates subscription failed:", error || status)
        }
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [authorized, supabase])

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    let result = [...users]

    if (query) {
      result = result.filter((entry) => {
        const matchesName = entry.full_name.toLowerCase().includes(query)
        const matchesEmail = entry.email.toLowerCase().includes(query)
        const matchesPhone = (entry.phone_number ?? "").toLowerCase().includes(query)
        return matchesName || matchesEmail || matchesPhone
      })
    }

    if (filterBy === "high-balance") {
      result = result.filter((entry) => entry.balance >= 10000)
    }

    if (filterBy === "low-balance") {
      result = result.filter((entry) => entry.balance < 10000)
    }

    result.sort((a, b) => {
      if (sortBy === "balance") return b.balance - a.balance
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      return a.full_name.localeCompare(b.full_name)
    })

    return result
  }, [users, searchQuery, filterBy, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEM_COUNT))
  const currentUsers = filteredUsers.slice((currentPage - 1) * ITEM_COUNT, currentPage * ITEM_COUNT)
  useEffect(() => setCurrentPage(1), [searchQuery, filterBy, sortBy])

  const totalBalance = useMemo(
    () => users.reduce((sum, userItem) => sum + userItem.balance, 0),
    [users]
  )

  const newUsersToday = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return users.filter((entry) => new Date(entry.created_at).getTime() >= today.getTime()).length
  }, [users])

  const activeUsers = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return users.filter((entry) => new Date(entry.created_at).getTime() >= weekAgo).length
  }, [users])

  const restrictedUsers = useMemo(
    () => users.filter((entry) => Boolean(entry.restricted)).length,
    [users]
  )

  const stats = [
    { label: "Total customers", value: users.length.toString(), icon: Users, note: "Registered accounts", tone: "blue" },
    { label: "Joined this week", value: activeUsers.toString(), icon: UserRoundPlus, note: "Accounts registered in last 7 days", tone: "violet" },
    { label: "New today", value: newUsersToday.toString(), icon: CalendarDays, note: "Accounts created since midnight", tone: "amber" },
    { label: "Portfolio value", value: `$${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: CircleDollarSign, note: "Total account balances", tone: "green" },
  ]

  const formatDate = (value: string) => new Date(value).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })

  const handleDeleteUser = (entry: User) => {
    setUserToDelete(entry)
    setIsDeleteModalOpen(true)
  }

  const handleEditBalance = (entry: User) => {
    setSelectedUser(entry)
    setIsEditModalOpen(true)
  }

  const handleToggleRestriction = async (entry: User) => {
    try {
      const nextValue = !entry.restricted
      const { error } = await supabase.from("profiles").update({ restricted: nextValue }).eq("id", entry.id)
      if (error) throw error
      setUsers((current) => current.map((item) => item.id === entry.id ? { ...item, restricted: nextValue } : item))
      setSelectedUserDetails((current) =>
        current?.id === entry.id ? { ...current, restricted: nextValue } : current
      )
    } catch (error) {
      console.error("Unable to update restriction", error)
    }
  }

  const handleSaveBalance = async (newBalance: number) => {
    if (!selectedUser) return

    const previousBalance = selectedUser.balance
    const { error } = await supabase
      .from("profiles")
      .update({ balance: newBalance })
      .eq("id", selectedUser.id)

    if (error) {
      console.error("Unable to update user balance", error)
      window.alert("The balance could not be updated. Please try again.")
      return
    }

    const { error: transactionError } = await recordBalanceAdjustmentTransaction({
      supabase,
      userId: selectedUser.id,
      previousBalance,
      newBalance,
      actorLabel: "Admin",
    })

    setUsers((current) =>
      current.map((entry) =>
        entry.id === selectedUser.id ? { ...entry, balance: newBalance } : entry
      )
    )
    setSelectedUser((current) =>
      current?.id === selectedUser.id ? { ...current, balance: newBalance } : current
    )
    setSelectedUserDetails((current) =>
      current?.id === selectedUser.id ? { ...current, balance: newBalance } : current
    )
    setIsEditModalOpen(false)

    if (transactionError) {
      console.error("Balance updated, but its transaction history could not be recorded", transactionError)
      window.alert("The balance was updated, but its transaction history could not be recorded.")
    }
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userToDelete.id)}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || "The account could not be deleted.")
      }

      setUsers((current) => current.filter((entry) => entry.id !== userToDelete.id))
      setIsDeleteModalOpen(false)
      setUserToDelete(null)
    } catch (error) {
      console.error("Failed to delete user", error)
      window.alert(error instanceof Error ? error.message : "The account could not be deleted.")
    }
  }

  const exportUsers = () => {
    const escapeCsv = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`
    const rows = [
      ["Name", "Email", "Phone", "Joined", "Balance", "Status"],
      ...filteredUsers.map((entry) => [
        entry.full_name,
        entry.email,
        `${entry.country_code ?? ""}${entry.phone_number ?? ""}`,
        entry.created_at,
        entry.balance.toFixed(2),
        entry.restricted ? "Restricted" : "Active",
      ]),
    ]
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")
    const downloadUrl = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }))
    const anchor = document.createElement("a")
    anchor.href = downloadUrl
    anchor.download = `promoter-users-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 0)
  }

  const handleLogout = async () => {
    await signOut()
    router.push("/admin-template/login")
  }

  if (authLoading || !authorized || !adminProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="h-7 w-7 animate-spin text-blue-600" />
          <span className="text-sm font-medium">Loading admin workspace…</span>
        </div>
      </div>
    )
  }

  return (
    <div className={embedded ? "min-h-full" : "saas-shell relative overflow-hidden"}>
      {!embedded && (
        <>
          <div className="saas-bg-orb left-[-120px] top-[-50px] h-72 w-72 bg-blue-300/30" />
          <div className="saas-bg-orb right-[-80px] top-24 h-72 w-72 bg-violet-300/20" />
        </>
      )}

      <div className={`relative z-10 flex ${embedded ? "min-h-full" : "min-h-screen"}`}>
        {!embedded && <AdminSidebar isOpen={false} onClose={() => {}} adminProfile={adminProfile} isDesktop />}

        <div className={`flex min-w-0 flex-1 flex-col ${embedded ? "min-h-full" : "min-h-screen"}`}>
          {!embedded && <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
            <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 lg:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  aria-label="Open navigation"
                >
                  <Menu className="h-4 w-4" />
                </button>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Pennywise / admin</p>
                  <h1 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">Overview</h1>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLogout}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 sm:px-3 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Log out</span>
                </button>
              </div>
            </div>
          </header>}

          {!embedded && <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} adminProfile={adminProfile} />}

          <main className="mx-auto w-full max-w-[1600px] flex-1 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-5 overflow-hidden rounded-[1.4rem] border border-blue-100 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-[var(--shadow-lg)] sm:mb-6 sm:rounded-[1.7rem] sm:p-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                    <Sparkles className="h-3.5 w-3.5" />
                    Admin overview
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:mt-4 sm:text-4xl">Operational pulse, all in one workspace.</h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Monitor customer growth, account health, and platform activity across the Pennywise network.</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 sm:w-auto">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-slate-300">Live status</p>
                    <div className="mt-1 flex items-center gap-2 text-sm font-medium text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400" />
                      All systems healthy
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-5 grid gap-3 sm:mb-6 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
              {stats.map(({ label, value, icon: Icon, note, tone }) => (
                <div key={label} className="saas-kpi p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{label}</p>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">{value}</p>
                    </div>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      tone === "blue" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300" :
                      tone === "violet" ? "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300" :
                      tone === "amber" ? "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300" :
                      "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{note}</p>
                </div>
              ))}
            </section>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.8fr)_320px] 2xl:gap-6">
              <section className="saas-card overflow-hidden">
                <div className="flex flex-col gap-3 border-b border-slate-200/70 px-4 py-4 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <p className="saas-section-title">Customer roster</p>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">User accounts</h3>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:w-auto">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search users"
                        className="saas-input w-full pl-9 sm:min-w-[200px]"
                      />
                    </div>
                    <select
                      value={filterBy}
                      onChange={(event) => setFilterBy(event.target.value)}
                      className="saas-input w-full sm:min-w-[160px]"
                    >
                      <option value="all">All balances</option>
                      <option value="high-balance">High balance</option>
                      <option value="low-balance">Low balance</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="saas-table">
                    <thead>
                      <tr>
                        <th>Customer</th>
                        <th>Joined</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th className="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="py-10 text-center text-slate-500">
                            <div className="flex items-center justify-center gap-3">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Loading users…
                            </div>
                          </td>
                        </tr>
                      ) : currentUsers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-500">
                            No users match this search.
                          </td>
                        </tr>
                      ) : (
                        currentUsers.map((entry) => (
                          <tr key={entry.id}>
                            <td data-label="Customer">
                              <div className="flex items-center gap-3">
                                <div className="saas-avatar h-10 w-10 ring-2 ring-blue-100 dark:ring-blue-500/20">
                                  <img src={entry.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"} alt={entry.full_name} />
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white">{entry.full_name}</p>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">{entry.email}</p>
                                </div>
                              </div>
                            </td>
                            <td data-label="Joined">{formatDate(entry.created_at)}</td>
                            <td data-label="Balance">
                              <span className="font-medium text-slate-900 dark:text-white">${entry.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </td>
                            <td data-label="Status">
                              <span className={`saas-badge ${entry.restricted ? "badge-muted" : "badge-success"}`}>
                                {entry.restricted ? "Restricted" : "Active"}
                              </span>
                            </td>
                            <td data-label="Actions" className="text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setSelectedUserDetails(entry)} className="saas-button saas-button-secondary px-3 py-2">View</button>
                                <button onClick={() => handleEditBalance(entry)} className="saas-button saas-button-secondary px-3 py-2">Adjust</button>
                                <button onClick={() => handleDeleteUser(entry)} className="saas-button saas-button-danger px-3 py-2">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200/70 px-4 py-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row sm:px-5">
                  <div className="flex items-center gap-2">
                    <span>Showing</span>
                    <span className="font-medium text-slate-900 dark:text-white">{filteredUsers.length}</span>
                    <span>users</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="saas-button saas-button-secondary px-2.5 py-2 text-xs disabled:opacity-50 sm:px-3">Previous</button>
                    <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">Page {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage >= totalPages} className="saas-button saas-button-secondary px-2.5 py-2 text-xs disabled:opacity-50 sm:px-3">Next</button>
                  </div>
                </div>
              </section>

              <aside className="space-y-6">
                <div className="saas-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="saas-section-title">Customer insights</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Portfolio snapshot</h3>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-2 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Active accounts</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{users.length - restrictedUsers}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: `${users.length ? ((users.length - restrictedUsers) / users.length) * 100 : 0}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-slate-500 dark:text-slate-400">Restricted users</span>
                        <span className="font-semibold text-slate-900 dark:text-white">{restrictedUsers}</span>
                      </div>
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-400" style={{ width: `${users.length ? (restrictedUsers / users.length) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="saas-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="saas-section-title">Quick actions</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Operations</h3>
                    </div>
                    <button onClick={exportUsers} className="saas-button saas-button-secondary px-3 py-2">
                      <Download className="h-4 w-4" />
                      Export
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    <button onClick={() => setSortBy("balance")} className="saas-button saas-button-secondary w-full justify-between">
                      <span>Sort by largest balance</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                    <button onClick={() => setFilterBy("high-balance")} className="saas-button saas-button-secondary w-full justify-between">
                      <span>Focus high-value accounts</span>
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>

              </aside>
            </div>
          </main>
        </div>
      </div>

      <Sheet
        open={Boolean(selectedUserDetails)}
        onOpenChange={(open) => {
          if (!open) setSelectedUserDetails(null)
        }}
      >
        {selectedUserDetails && (
          <SheetContent
            side="right"
            className="h-dvh w-full max-w-lg gap-0 overflow-y-auto border-slate-200 bg-white p-0 text-slate-900 shadow-2xl sm:max-w-lg"
          >
            <div className="border-b border-slate-200 p-5 pr-14 sm:p-6 sm:pr-14">
              <SheetTitle className="text-xl font-semibold text-slate-900">
                User details
              </SheetTitle>
              <SheetDescription className="mt-1 text-sm text-slate-500">
                Account information and available actions.
              </SheetDescription>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="saas-avatar h-14 w-14 ring-2 ring-blue-100">
                  <img
                    src={selectedUserDetails.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"}
                    alt={selectedUserDetails.full_name}
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-semibold text-slate-900">
                    {selectedUserDetails.full_name}
                  </h3>
                  <p className="truncate text-sm text-slate-500">{selectedUserDetails.email}</p>
                </div>
              </div>

              <dl className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200 px-4">
                <div className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">Phone</dt>
                  <dd className="text-right font-medium text-slate-900">
                    {selectedUserDetails.country_code} {selectedUserDetails.phone_number || "Not provided"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">Joined</dt>
                  <dd className="text-right font-medium text-slate-900">{formatDate(selectedUserDetails.created_at)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">Balance</dt>
                  <dd className="text-right font-medium text-slate-900">
                    ${selectedUserDetails.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">Status</dt>
                  <dd>
                    <span className={`saas-badge ${selectedUserDetails.restricted ? "badge-muted" : "badge-success"}`}>
                      {selectedUserDetails.restricted ? "Restricted" : "Active"}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3 text-sm">
                  <dt className="text-slate-500">User ID</dt>
                  <dd className="max-w-[65%] break-all text-right font-mono text-xs text-slate-700">
                    {selectedUserDetails.id}
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => void handleToggleRestriction(selectedUserDetails)}
                  className="saas-button saas-button-secondary"
                >
                  {selectedUserDetails.restricted ? "Enable account" : "Restrict account"}
                </button>
                <button
                  onClick={() => handleEditBalance(selectedUserDetails)}
                  className="saas-button saas-button-primary"
                >
                  Adjust balance
                </button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {selectedUser && (
        <EditBalanceModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={selectedUser}
          onSave={handleSaveBalance}
        />
      )}

      {userToDelete && (
        <DeleteUserModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false)
            setUserToDelete(null)
          }}
          userName={userToDelete.full_name}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  )
}
