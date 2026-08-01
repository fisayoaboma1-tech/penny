'use client'

import { useEffect, useState } from 'react'

export default function SmartSuppSupportBadge() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const pathname = window.location.pathname
    setShow(!pathname.startsWith('/dashboard') && !pathname.startsWith('/admin'))
  }, [])

  if (!show) {
    return null
  }

  return (
    <div className="pointer-events-none fixed bottom-28 right-4 z-50 hidden flex-col gap-1 rounded-2xl bg-slate-950/90 px-3 py-2 text-[11px] text-slate-100 shadow-2xl shadow-slate-950/40 sm:flex">
      <span className="font-semibold">Online Banking</span>
      <span className="text-slate-300">Support session tag active</span>
    </div>
  )
}
