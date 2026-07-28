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

interface AdminUsersTableProps {
  loading: boolean
  users: User[]
  currentPage: number
  itemsPerPage: number
  onEditBalance: (user: User) => void
  onDeleteUser: (user: User) => void
}

export function AdminUsersTable({ 
  loading, 
  users, 
  currentPage, 
  itemsPerPage, 
  onEditBalance, 
  onDeleteUser 
}: AdminUsersTableProps) {
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentUsers = users.slice(startIndex, endIndex)

  if (loading) {
    return (
      <div className="hidden md:flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="hidden md:block text-center py-12">
        <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-sm">No regular users found</p>
        <p className="text-gray-500 text-xs mt-2">Users need to sign up at /signup to appear here</p>
      </div>
    )
  }

  return (
    <div className="hidden md:block overflow-x-auto">
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
                    onClick={() => onEditBalance(user)}
                    className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"
                    title="Edit Balance"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteUser(user)}
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
    </div>
  )
}
