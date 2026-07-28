"use client"

import { motion } from "framer-motion"
import { Users, Edit2, Trash2, Loader2 } from "lucide-react"

interface User {
  id: string
  full_name: string
  email: string
  phone_number?: string
  balance: number
  created_at: string
  profile_image_url?: string
}

interface AdminMobileUsersProps {
  loading: boolean
  users: User[]
  currentPage: number
  itemsPerPage: number
  onEditBalance: (user: User) => void
  onDeleteUser: (user: User) => void
}

export function AdminMobileUsers({ 
  loading, 
  users, 
  currentPage, 
  itemsPerPage, 
  onEditBalance, 
  onDeleteUser 
}: AdminMobileUsersProps) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="md:hidden flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="md:hidden text-center py-12">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">No regular users found</p>
        <p className="text-gray-500 text-xs mt-2">Users need to sign up at /signup to appear here</p>
      </div>
    )
  }

  return (
    <div className="md:hidden divide-y divide-[#1a1a1a]">
      {currentUsers.map((user, index) => (
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
                  onClick={() => onEditBalance(user)}
                  className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/20 transition-all"
                  title="Edit Balance"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteUser(user)}
                  className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md hover:bg-red-500/20 transition-all"
                  title="Delete User"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
