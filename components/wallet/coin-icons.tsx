"use client"

export function CoinIcon({ name }: { name: string }) {
  switch (name) {
    case "Bitcoin":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#F7931A" />
          <path d="M22.5 14.2c.3-2-.8-3-2.2-3.7l.5-1.8-1.2-.3-.4 1.6c-.3-.1-.6-.2-1-.3l.4-1.6-1.2-.3-.5 1.8c-.3-.1-.5-.1-.8-.2l.4-1.6-1.2-.3-.5 1.8-1.6-.4-.3 1.2 1.2.3-.8 3.2-1.2-.3-.3 1.2 1.6.4-.5 1.8 1.2.3.5-1.8c.3.1.6.2 1 .3l-.5 1.8 1.2.3.5-1.8c1.6.3 2.8.2 3.3-1.3.4-1.2 0-1.9-.8-2.4 1.2-.3 2-.8 2.2-2zm-3.9 2.7c-.3 1-2 1-2.6.9l.5-2 2.6.6c.6.1.7.5-.5.5zm.4-3.5c-.3.9-1.6.8-2 .7l.4-1.7c.4.1 1.7.3 1.6 1z" fill="white" />
        </svg>
      )
    case "Ethereum":
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
    case "Tether":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#50AF95" />
          <path d="M17.9 14.5v-2.3h5.5V9.2H8.6v3h5.5v2.3c-4.5.2-7.9 1-7.9 1.9s3.4 1.7 7.9 1.9v6.8h3.8v-6.8c4.5-.2 7.9-1 7.9-1.9s-3.4-1.7-7.9-1.9z" fill="white" />
        </svg>
      )
    case "BNB":
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
    case "Solana":
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
    case "XRP":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#23292F" />
          <path d="M22.5 8h3.5l-6.5 6.5c-1.9 1.9-5 1.9-6.9 0L6.1 8h3.5l4.8 4.8c1 1 2.6 1 3.6 0L22.5 8z" fill="white" />
          <path d="M9.5 24H6l6.5-6.5c1.9-1.9 5-1.9 6.9 0L25.9 24h-3.5l-4.8-4.8c-1-1-2.6-1-3.6 0L9.5 24z" fill="white" />
        </svg>
      )
    case "USD Coin":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#2775CA" />
          <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4z" fill="white" fillOpacity="0.2" />
          <path d="M16 6C10.5 6 6 10.5 6 16s4.5 10 10 10 10-4.5 10-10S21.5 6 16 6z" fill="white" fillOpacity="0.3" />
          <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8z" fill="white" fillOpacity="0.4" />
          <path d="M16 10c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" fill="#2775CA" />
          <path d="M17.5 16.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5 1.5.7 1.5 1.5z" fill="white" />
          <path d="M16 13c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1s1-.4 1-1v-4c0-.6-.4-1-1-1z" fill="white" />
        </svg>
      )
    case "Cardano":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#0033AD" />
          <path d="M16 6c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7S17.5 6 16 6z" fill="white" />
          <path d="M16 20.6c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
          <path d="M10.5 10.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
          <path d="M21.5 10.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
          <path d="M8.5 18.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
          <path d="M23.5 18.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
          <path d="M12.5 14.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
          <path d="M19.5 14.5c-1.5 0-2.7 1.2-2.7 2.7s1.2 2.7 2.7 2.7 2.7-1.2 2.7-2.7-1.2-2.7-2.7-2.7z" fill="white" />
        </svg>
      )
    case "Dogecoin":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#C2A633" />
          <path d="M12.5 10h5.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5H12.5v3h-2V10h2zm0 7h5c1.4 0 2.5-1.1 2.5-2.5S18.9 12 17.5 12h-5v5z" fill="white" />
        </svg>
      )
    case "TRON":
      return (
        <svg viewBox="0 0 32 32" fill="none" className="w-5 h-5">
          <circle cx="16" cy="16" r="16" fill="#FF060A" />
          <path d="M8 10l3.5 14.5L24 16 8 10zm3.5 2.5l7.5 3-7.5 8.5v-11.5z" fill="white" />
        </svg>
      )
    default:
      return <span className="text-sm">●</span>
  }
}
