"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Users, 
  Landmark,
  Menu,
  X,
  Settings,
  Shield,
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Fingerprint,
  TrendingUp,
  Activity,
  Link,
  Loader2,
  Mail,
  Phone,
  Calendar,
  User
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { EditBalanceModal } from "../../components/edit-balance-modal"
import { DeleteUserModal } from "../../components/delete-user-modal"
import { ProtectedRoute } from "../../components/route-protection"

interface User {
  id: string
  full_name: string
  email: string
  phone_number?: string
  balance: number
  created_at: string
  profile_image_url?: string
}

const ITEMS_PER_PAGE = 10

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [adminProfile, setAdminProfile] = useState<any>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Fetch users from Supabase (only non-admin users)
  const fetchUsers = async () => {
    try {
      setLoading(true)
      console.log("Fetching users from Supabase...")
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("is_admin", false)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching users:", error)
        return
      }

      // Fetch emails from auth.users for each profile
      if (data && data.length > 0) {
        const usersWithEmails = await Promise.all(
          data.map(async (user) => {
            const { data: authUser } = await supabase.auth.admin.getUserById(user.id)
            return {
              ...user,
              email: authUser?.user?.email || 'No email'
            }
          })
        )
        console.log("Fetched users with emails:", usersWithEmails)
        setUsers(usersWithEmails)
      } else {
        setUsers([])
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single()

        setAdminProfile(data)
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error)
    }
  }

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log("Checking admin status...")
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.user) {
          console.log("No session found, redirecting to login")
          router.push("/dashboard/login")
          return
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Error checking admin status:", profileError)
          router.push("/dashboard/login")
          return
        }

        console.log("Admin profile:", profile)

        if (!profile?.is_admin) {
          // Not an admin, redirect to login
          console.log("Not an admin, redirecting to login")
          router.push("/dashboard/login")
          return
        }

        // Admin is logged in, fetch data
        console.log("Admin verified, fetching data...")
        fetchAdminProfile()
        fetchUsers()
      } catch (error) {
        console.error("Error in checkAdminStatus:", error)
        router.push("/dashboard/login")
      }
    }

    checkAdminStatus()
  }, [router, supabase])

  const handleLogout = async () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    await supabase.auth.signOut()
    router.push("/dashboard/login")
  }

  const handleEditBalance = async (user: User) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("id", userToDelete.id)

        if (error) {
          console.error("Error deleting user:", error)
          return
        }

        // Also delete from auth.users
        await supabase.auth.admin.deleteUser(userToDelete.id)

        // Update local state
        setUsers(users.filter(u => u.id !== userToDelete.id))
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
      } catch (error) {
        console.error("Error deleting user:", error)
      }
    }
  }

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentUsers = users.slice(startIndex, endIndex)

  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0)
  const avgBalance = users.length > 0 ? totalBalance / users.length : 0

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0a0a0a] overflow-hidden relative">
        {/* Ambient glow background */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1a2e24] via-[#111814] to-[#0a0a0a]" />
        <div className="pointer-events-none absolute -top-24 -right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 -left-20 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl" />

        {/* Header */}
        <header className="relative z-10 border-b border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-5 h-5 text-emerald-400" />
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">Admin Dashboard</h1>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <p className="text-[11px] text-gray-400 font-medium">Pennywise Management</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-30 bg-black/70 backdrop-blur-md"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 35, stiffness: 300 }}
                className="fixed top-0 right-0 z-40 h-screen w-80 bg-[#0a0a0a] border-l border-[#1a1a1a] shadow-2xl shadow-black/60 flex flex-col"
              >
                {/* Decorative elements */}
                <div className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
                <div className="pointer-events-none absolute top-32 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-2xl" />

                {/* Close button */}
                <div className="relative z-10 flex items-center justify-between px-6 pt-6 pb-4">
                  <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">Menu</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-[#222] transition-colors border border-[#252525]"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="relative z-10 flex-1 overflow-y-auto overscroll-contain px-5 space-y-6 pb-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#1a1a1a] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#333]">
                  {/* Admin Profile */}
                  <div className="flex flex-col items-center text-center pt-2">
                    <div className="relative mb-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
                        <img
                          src={adminProfile?.profile_image_url || "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785215266/profilr_n29abb.jpg"}
                          alt="Admin Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h2 className="text-lg font-bold text-white">
                      {adminProfile?.full_name || "Admin User"}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">
                      {adminProfile?.email || "admin@example.com"}
                    </p>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-0.5">
                    <button
                      onClick={() => {
                        setSidebarOpen(false)
                        router.push("/")
                      }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-[#1a1a1a] transition-all text-left group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-transparent flex items-center justify-center">
                        <Link className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                        Back to Site
                      </span>
                    </button>
                  </div>

                  {/* Log Out */}
                  <div className="pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-500/10 transition-all text-left group"
                    >
                      <span className="text-sm font-medium text-gray-400 group-hover:text-red-400 transition-colors">
                        Log Out
                      </span>
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    <span className="text-[10px] text-gray-600">Pennywise LTD</span>
                    <span className="text-[10px] text-gray-700">•</span>
                    <span className="text-[10px] text-gray-600">Secured</span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="rounded-xl border border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl p-6 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">+12%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Users</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-400" /> : users.length}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl p-6 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                  <Landmark className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">Total Assets</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {loading ? <Loader2 className="w-8 h-8 animate-spin text-emerald-400" /> : `$${totalBalance.toFixed(2)}`}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="rounded-xl border border-[#1a1a1a] bg-[#111111]/60 backdrop-blur-xl overflow-hidden"
          >
            {/* Table Header */}
            <div className="px-6 py-5 border-b border-[#1a1a1a]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-white">User Management</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage and monitor all registered users</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-xs font-medium text-emerald-400">{users.length} Total</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">No regular users found</p>
                  <p className="text-gray-500 text-xs mt-2">Users need to sign up at /signup to appear here</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a1a1a] bg-[#0a0a0a]/50">
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a1a1a]">
                    {currentUsers.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                        className="hover:bg-emerald-500/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                              {user.profile_image_url ? (
                                <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-xs font-semibold text-emerald-400">
                                  {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white">{user.full_name}</p>
                              <p className="text-[11px] text-gray-500">ID: #{user.id.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-300">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-emerald-400">${user.balance.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEditBalance(user)}
                              className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"
                              title="Edit Balance"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
                              className="p-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"
                              title="Delete User"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
            <div className="md:hidden divide-y divide-[#1a1a1a]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">No regular users found</p>
                  <p className="text-gray-500 text-xs mt-2">Users need to sign up at /signup to appear here</p>
                </div>
              ) : (
                currentUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.05, duration: 0.3 }}
                    className="p-4 hover:bg-emerald-500/5 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user.profile_image_url ? (
                          <img src={user.profile_image_url} alt={user.full_name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-emerald-400">
                            {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{user.full_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 break-all">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">ID: #{user.id.slice(0, 8)}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-emerald-400">${user.balance.toFixed(2)}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditBalance(user)}
                            className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/20 transition-all"
                            title="Edit Balance"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(user)}
                            className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md hover:bg-red-500/20 transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
              <div className="px-6 py-4 border-t border-[#1a1a1a] flex items-center justify-between bg-[#0a0a0a]/30">
                <div className="text-xs text-gray-400">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </main>

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
                // Update in Supabase
                const { error } = await supabase
                  .from("profiles")
                  .update({ balance: newBalance })
                  .eq("id", selectedUser.id)

                if (error) {
                  console.error("Error updating balance:", error)
                  return
                }

                // Update local state
                setUsers(users.map(u => 
                  u.id === selectedUser.id ? { ...u, balance: newBalance } : u
                ))
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
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
                onClick={() => setShowLogoutModal(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="fixed top-[50%] left-[50%] z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2"
              >
                <div className="relative mx-4 rounded-2xl border border-[#1a1a1a] bg-[#111111]/95 backdrop-blur-xl p-6 shadow-2xl">
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">Confirm Logout</h3>
                      <p className="text-sm text-gray-400">Are you sure you want to log out of the admin dashboard?</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setShowLogoutModal(false)}
                        className="flex-1 px-4 py-2.5 bg-[#1a1a1a] border border-[#252525] text-gray-300 rounded-xl font-medium text-sm hover:bg-[#222] transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmLogout}
                        className="flex-1 px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-medium text-sm hover:bg-red-500/20 transition-all"
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
    </ProtectedRoute>
  )
}
