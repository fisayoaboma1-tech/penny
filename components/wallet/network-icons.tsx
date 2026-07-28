"use client"

export function NetworkIcon({ id }: { id: string }) {
  switch (id) {
    case "bitcoin":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path d="M22.5 14.2c.3-2-.8-3-2.2-3.7l.5-1.8-1.2-.3-.4 1.6c-.3-.1-.6-.2-1-.3l.4-1.6-1.2-.3-.5 1.8c-.3-.1-.5-.1-.8-.2l.4-1.6-1.2-.3-.5 1.8-1.6-.4-.3 1.2 1.2.3-.8 3.2-1.2-.3-.3 1.2 1.6.4-.5 1.8 1.2.3.5-1.8c.3.1.6.2 1 .3l-.5 1.8 1.2.3.5-1.8c1.6.3 2.8.2 3.3-1.3.4-1.2 0-1.9-.8-2.4 1.2-.3 2-.8 2.2-2zm-3.9 2.7c-.3 1-2 1-2.6.9l.5-2 2.6.6c.6.1.7.5-.5.5zm.4-3.5c-.3.9-1.6.8-2 .7l.4-1.7c.4.1 1.7.3 1.6 1z" fill="white" />
        </svg>
      )
    case "ethereum":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#627EEA" />
          <path d="M16 4l-.3.9v15.5l.3.3 6.7-4-6.7-12.7z" fill="white" fillOpacity="0.6" />
          <path d="M16 4L9.3 16.7l6.7 4V4z" fill="white" />
          <path d="M16 22.2l-.2.2v4.1l.2.5 6.7-9.4-6.7 4.6z" fill="white" fillOpacity="0.6" />
          <path d="M16 27v-4.8L9.3 17.6 16 27z" fill="white" />
          <path d="M16 20.7l6.7-4-6.7-3v7z" fill="white" fillOpacity="0.2" />
          <path d="M9.3 16.7l6.7 4v-7l-6.7 3z" fill="white" fillOpacity="0.6" />
        </svg>
      )
    case "bsc":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
          <path d="M16 6l2.5 2.5-6.3 6.3-2.5-2.5L16 6z" fill="white" />
          <path d="M19.8 9.8l2.5 2.5-6.3 6.3-2.5-2.5 6.3-6.3z" fill="white" />
          <path d="M12.2 12.2l2.5 2.5-6.3 6.3-2.5-2.5 6.3-6.3z" fill="white" />
          <path d="M16 14.5l2.5 2.5-2.5 2.5-2.5-2.5 2.5-2.5z" fill="white" />
          <path d="M9.8 18.5l2.5 2.5-6.3 6.3-2.5-2.5 6.3-6.3z" fill="white" />
          <path d="M16 22.2l2.5 2.5-2.5 2.5-2.5-2.5 2.5-2.5z" fill="white" />
          <path d="M22.2 18.5l2.5 2.5-6.3 6.3-2.5-2.5 6.3-6.3z" fill="white" />
        </svg>
      )
    case "polygon":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#8247E5" />
          <path d="M16 6l2.5 6.3L25 16l-6.5 3.7L16 26l-2.5-6.3L7 16l6.5-3.7L16 6z" fill="white" fillOpacity="0.3" />
          <path d="M16 10l1.5 3.8L21.5 16l-4 2.2L16 22l-1.5-3.8L10.5 16l4-2.2L16 10z" fill="white" />
        </svg>
      )
    case "solana":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="url(#solana-gradient)" />
          <defs>
            <linearGradient id="solana-gradient" x1="0" y1="0" x2="32" y2="32">
              <stop stopColor="#9945FF" />
              <stop offset="1" stopColor="#14F195" />
            </linearGradient>
          </defs>
          <path d="M10.5 20.5c.2-.2.5-.4.8-.4h12.2c.5 0 .7.6.4.9l-2.4 2.4c-.2.2-.5.4-.8.4H8.5c-.5 0-.7-.6-.4-.9l2.4-2.4z" fill="white" />
          <path d="M10.5 8.6c.2-.2.5-.4.8-.4h12.2c.5 0 .7.6.4.9l-2.4 2.4c-.2.2-.5.4-.8.4H8.5c-.5 0-.7-.6-.4-.9l2.4-2.4z" fill="white" />
          <path d="M21.1 14.5c-.2-.2-.5-.4-.8-.4H8.1c-.5 0-.7.6-.4.9l2.4 2.4c.2.2.5.4.8.4h12.2c.5 0 .7-.6.4-.9l-2.4-2.4z" fill="white" />
        </svg>
      )
    default:
      return <span className="text-sm">●</span>
  }
}
