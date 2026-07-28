"use client"

export function WalletHeader({
  userName,
  menuOpen,
  onMenuToggle,
  profileImageUrl,
}: {
  userName: string
  menuOpen: boolean
  onMenuToggle: () => void
  profileImageUrl?: string
}) {
  const defaultImage = "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"
  const imageUrl = profileImageUrl || defaultImage

  return (
    <div className="sticky top-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#1a1a1a]">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full overflow-hidden shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-500/30">
            <img
              src={imageUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-xs text-gray-500 leading-none mb-1">Welcome back</p>
            <p className="text-sm font-medium text-white leading-none">{userName}</p>
          </div>
        </div>

        <div>
          <button
            onClick={onMenuToggle}
            className="w-10 h-10 rounded-full bg-[#111111] border border-[#1a1a1a] flex items-center justify-center hover:bg-[#1a1a1a] transition-colors overflow-hidden"
          >
            <img
              src={
                menuOpen
                  ? "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785151088/close_m5gphm.png"
                  : "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785151088/app_fpk3mj.png"
              }
              alt={menuOpen ? "close" : "menu"}
              className="w-5 h-5 object-contain brightness-0 invert"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
