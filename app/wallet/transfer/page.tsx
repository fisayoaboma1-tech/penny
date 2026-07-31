"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ChevronDown, Search } from "lucide-react"
import WalletBottomNav from "@/components/wallet-bottom-nav"
import { WalletPageHeader } from "@/components/wallet/page-header"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"

type BankCatalog = {
  regions?: Record<string, Record<string, string[]>>
  international?: string[]
}

const ProviderBadge = ({ name, logo }: { name: string; logo: ReactNode }) => (
  <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
      {logo}
    </div>
    <span className="text-[11px] font-medium text-slate-600">{name}</span>
  </div>
)

const transferProviders = [
  {
    name: "American Express",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M4 8.5h16a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5a1 1 0 0 1 1-1Z" fill="#006FCF" />
        <path d="M7.2 10.2h2.1l1.3 3.6h-1.7l-.3-.8H7.7l-.2.8H6.1l1.1-3.6Zm4.6 0h1.5l1.3 3.6h-1.4l-.2-.7h-1.2l-.2.7h-1.4l1.4-3.6Zm3.1 0h1.5l1.3 3.6h-1.4l-.2-.7h-1.2l-.2.7h-1.4l1.4-3.6Z" fill="#fff" />
        <path d="M5.7 10.2h3.1l.9 3.6H7.3l-.3-.8H5.8l-.1.8H4.3l1.4-3.6Z" fill="#2E77B6" />
      </svg>
    ),
  },
  {
    name: "Apple Pay",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M15.4 12.4c0-1.8 1.5-2.7 1.6-2.8-.9-1.3-2.3-1.5-2.8-1.5-1.2-.1-2.3.7-2.9.7-.6 0-1.6-.7-2.6-.7-1.3 0-2.5.8-3.2 2-.1.2-.2.6-.2.9 0 1.4.7 2.8 1.6 3.8.7.8 1.6 1.7 2.7 1.7 1.1 0 1.4-.7 2.7-.7 1.3 0 1.7.7 2.8.7 1.2 0 2-1 2.7-1.9.8-1.1 1.1-2.1 1.2-2.3-.8-.3-1.5-1.2-1.5-2.2Z" fill="#111" />
        <path d="M13.1 5.8c.6-.7 1-1.7.8-2.7-.8.1-1.7.6-2.3 1.3-.5.6-.9 1.5-.8 2.4.9.1 1.8-.4 2.3-1Z" fill="#111" />
      </svg>
    ),
  },
  {
    name: "Mastercard",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <circle cx="9" cy="12" r="4" fill="#EB001B" />
        <circle cx="15" cy="12" r="4" fill="#F79E1B" />
        <path d="M12 8.5c.9 1 1.4 2.9 1 4.5-.4 1.6-1.3 3-2.5 3.9A4.9 4.9 0 0 1 9 16.5c0-1.7.7-3.3 1.9-4.4A6.2 6.2 0 0 1 12 8.5Z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: "PayPal",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="3" fill="#0070BA" />
        <path d="M13.7 8.8h-3c-.4 0-.7.3-.7.7l-.2 1.4h2.2c1.6 0 2.7.8 2.4 2.7-.2 1.2-1.2 2-2.4 2H9.9l-.5 3.2h-1.7l1.2-7.6c.2-1.2 1.2-2 2.4-2h2.2c.4 0 .8.3.8.7l-.2 1.4Z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Wise",
    logo: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
        <path d="M4.5 4.5h7.2l1.8 3.2-1.8 3.2H4.5l1.8-3.2-1.8-3.2Z" fill="#00A1FF" />
        <path d="M13.5 4.5h4.8l1.8 3.2-1.8 3.2h-4.8l1.8-3.2-1.8-3.2Z" fill="#1A1F71" />
        <path d="M8.7 13.1h6.2l1.7 3.1-1.7 3.1H8.7l1.7-3.1-1.7-3.1Z" fill="#00A1FF" />
        <path d="M17.1 13.1h2.4l1.7 3.1-1.7 3.1h-2.4l1.7-3.1-1.7-3.1Z" fill="#1A1F71" />
      </svg>
    ),
  },
]

const defaultBanks = [
  "Bank of America",
  "JPMorgan Chase",
  "Wells Fargo",
  "Citibank",
  "Capital One",
  "PNC Bank",
  "TD Bank",
  "U.S. Bank",
  "Goldman Sachs Bank",
  "Citizens Bank",
  "Barclays",
  "HSBC UK",
  "Lloyds Bank",
  "NatWest",
  "Santander UK",
  "Standard Chartered",
  "Metro Bank",
  "Royal Bank of Scotland",
  "First Direct",
  "Monzo",
  "Starling Bank",
  "Revolut",
  "Wise",
  "M&S Bank",
  "Halifax",
  "Nationwide",
  "Virgin Money",
  "Coutts",
]

const regionForCountry: Record<string, string> = {
  Algeria: "Africa",
  Angola: "Africa",
  Benin: "Africa",
  Botswana: "Africa",
  "Burkina Faso": "Africa",
  Burundi: "Africa",
  "Cabo Verde": "Africa",
  Cameroon: "Africa",
  "Central African Republic": "Africa",
  Chad: "Africa",
  Comoros: "Africa",
  Congo: "Africa",
  Djibouti: "Africa",
  Egypt: "Africa",
  "Equatorial Guinea": "Africa",
  Eritrea: "Africa",
  Eswatini: "Africa",
  Ethiopia: "Africa",
  Gabon: "Africa",
  Gambia: "Africa",
  Ghana: "Africa",
  Guinea: "Africa",
  "Guinea-Bissau": "Africa",
  Kenya: "Africa",
  Lesotho: "Africa",
  Liberia: "Africa",
  Libya: "Africa",
  Madagascar: "Africa",
  Malawi: "Africa",
  Mali: "Africa",
  Mauritania: "Africa",
  Mauritius: "Africa",
  Morocco: "Africa",
  Mozambique: "Africa",
  Namibia: "Africa",
  Niger: "Africa",
  Nigeria: "Africa",
  Rwanda: "Africa",
  "Sao Tome and Principe": "Africa",
  Senegal: "Africa",
  Seychelles: "Africa",
  "Sierra Leone": "Africa",
  Somalia: "Africa",
  "South Africa": "Africa",
  "South Sudan": "Africa",
  Sudan: "Africa",
  Tanzania: "Africa",
  Togo: "Africa",
  Tunisia: "Africa",
  Uganda: "Africa",
  Zambia: "Africa",
  Zimbabwe: "Africa",
  Canada: "North America",
  Mexico: "North America",
  "United States": "North America",
  Austria: "Europe",
  Belgium: "Europe",
  Bulgaria: "Europe",
  Croatia: "Europe",
  Cyprus: "Europe",
  "Czech Republic": "Europe",
  Denmark: "Europe",
  Estonia: "Europe",
  Finland: "Europe",
  France: "Europe",
  Germany: "Europe",
  Greece: "Europe",
  Hungary: "Europe",
  Iceland: "Europe",
  Ireland: "Europe",
  Italy: "Europe",
  Latvia: "Europe",
  Liechtenstein: "Europe",
  Lithuania: "Europe",
  Luxembourg: "Europe",
  Malta: "Europe",
  Monaco: "Europe",
  Montenegro: "Europe",
  Netherlands: "Europe",
  Norway: "Europe",
  Poland: "Europe",
  Portugal: "Europe",
  Romania: "Europe",
  Russia: "Europe",
  Serbia: "Europe",
  Slovakia: "Europe",
  Slovenia: "Europe",
  Spain: "Europe",
  Sweden: "Europe",
  Switzerland: "Europe",
  Turkey: "Europe",
  Ukraine: "Europe",
  "United Kingdom": "Europe",
  Albania: "Europe",
  Andorra: "Europe",
  Armenia: "Europe",
  Belarus: "Europe",
  "Bosnia and Herzegovina": "Europe",
  Georgia: "Europe",
  Kazakhstan: "Europe",
  Moldova: "Europe",
  "San Marino": "Europe",
  Australia: "Oceania",
  Fiji: "Oceania",
  Kiribati: "Oceania",
  "Marshall Islands": "Oceania",
  Micronesia: "Oceania",
  Nauru: "Oceania",
  "New Zealand": "Oceania",
  Palau: "Oceania",
  "Papua New Guinea": "Oceania",
  Samoa: "Oceania",
  "Solomon Islands": "Oceania",
  Tonga: "Oceania",
  Tuvalu: "Oceania",
  Vanuatu: "Oceania",
  "Vatican City": "Europe",
  Afghanistan: "Asia",
  Bahrain: "Middle East",
  Bangladesh: "Asia",
  Bhutan: "Asia",
  Brunei: "Asia",
  Cambodia: "Asia",
  China: "Asia",
  India: "Asia",
  Indonesia: "Asia",
  Iran: "Asia",
  Iraq: "Asia",
  Israel: "Middle East",
  Japan: "Asia",
  Jordan: "Middle East",
  Kuwait: "Middle East",
  Kyrgyzstan: "Asia",
  Laos: "Asia",
  Lebanon: "Middle East",
  Malaysia: "Asia",
  Maldives: "Asia",
  Mongolia: "Asia",
  Myanmar: "Asia",
  Nepal: "Asia",
  Oman: "Middle East",
  Pakistan: "Asia",
  Philippines: "Asia",
  Qatar: "Middle East",
  "Saudi Arabia": "Middle East",
  Singapore: "Asia",
  "Sri Lanka": "Asia",
  Syria: "Middle East",
  Taiwan: "Asia",
  Tajikistan: "Asia",
  Thailand: "Asia",
  "Timor-Leste": "Asia",
  Turkmenistan: "Asia",
  UAE: "Middle East",
  "United Arab Emirates": "Middle East",
  Uzbekistan: "Asia",
  Vietnam: "Asia",
  Yemen: "Middle East",
  Argentina: "Latin America",
  Bahamas: "Latin America",
  Barbados: "Latin America",
  Belize: "Latin America",
  Bolivia: "Latin America",
  Brazil: "Latin America",
  Chile: "Latin America",
  Colombia: "Latin America",
  "Costa Rica": "Latin America",
  Cuba: "Latin America",
  Dominica: "Latin America",
  "Dominican Republic": "Latin America",
  Ecuador: "Latin America",
  "El Salvador": "Latin America",
  Grenada: "Latin America",
  Guatemala: "Latin America",
  Guyana: "Latin America",
  Haiti: "Latin America",
  Honduras: "Latin America",
  Jamaica: "Latin America",
  Nicaragua: "Latin America",
  Panama: "Latin America",
  Paraguay: "Latin America",
  Peru: "Latin America",
  "Saint Kitts and Nevis": "Latin America",
  "Saint Lucia": "Latin America",
  "Saint Vincent and the Grenadines": "Latin America",
  Suriname: "Latin America",
  "Trinidad and Tobago": "Latin America",
  Uruguay: "Latin America",
  Venezuela: "Latin America",
}


const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
]

export default function WalletTransferPage() {
  const router = useRouter()
  const { user, profile } = useAuth()
  const walletBalance = profile?.balance ?? 0
  const isRestricted = profile?.restricted ?? false
  const [selectedBank, setSelectedBank] = useState("Select bank")
  const [bankSearch, setBankSearch] = useState("")
  const [isBankOpen, setIsBankOpen] = useState(false)
  const [bankCatalog, setBankCatalog] = useState<BankCatalog>({})
  const [bankCatalogLoaded, setBankCatalogLoaded] = useState(false)
  const [bankError, setBankError] = useState<string | null>(null)
  const [countrySearch, setCountrySearch] = useState("")
  const [isCountryOpen, setIsCountryOpen] = useState(false)
  const [recipientName, setRecipientName] = useState("")
  const [recipientEmail, setRecipientEmail] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [iban, setIban] = useState("")
  const [swiftCode, setSwiftCode] = useState("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [sortCode, setSortCode] = useState("")
  const [country, setCountry] = useState("United Kingdom")
  const [bankAddress, setBankAddress] = useState("")
  const mainRef = useRef<HTMLElement | null>(null)
  const [reference, setReference] = useState("")
  const [amount, setAmount] = useState("")

  const accountName = useMemo(() => {
    if (!user) return "Chukwudi Enoch"
    return user.user_metadata?.full_name || user.email?.split("@")[0] || "Chukwudi Enoch"
  }, [user])

  const profileImageUrl = useMemo(() => {
    return (
      profile?.profile_image_url ||
      user?.user_metadata?.avatar_url ||
      user?.user_metadata?.profile_image ||
      "https://res.cloudinary.com/qz5m8bhg/image/upload/v1785158069/unnamed_f9ug3t.png"
    )
  }, [profile, user])

  const formattedBalance = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(walletBalance)

  useEffect(() => {
    let isActive = true

    const loadBankCatalog = async () => {
      setBankError(null)

      try {
        const response = await fetch("/data/bank-catalog.json", { cache: "force-cache" })
        if (!response.ok) {
          throw new Error("Unable to load bank catalog")
        }

        const payload = await response.json()
        const catalog = payload && typeof payload === "object" && !Array.isArray(payload) ? payload : {}

        if (isActive) {
          setBankCatalog(catalog as BankCatalog)
          setBankCatalogLoaded(true)
        }
      } catch {
        if (isActive) {
          setBankCatalog({})
          setBankCatalogLoaded(true)
          setBankError("We couldn't load bank options for this country right now.")
        }
      }
    }

    loadBankCatalog()

    return () => {
      isActive = false
    }
  }, [])

  const resolveCountryBanks = (countryName: string, catalog: BankCatalog) => {
    const region = regionForCountry[countryName] || "International"
    const regionBanks = catalog.regions?.[region]
    const countrySpecificBanks = regionBanks?.[countryName]
    const regionalDefaultBanks = regionBanks?.default
    const localBanks = [...(countrySpecificBanks || []), ...(regionalDefaultBanks || [])]
    const internationalBanks = catalog.international || []
    const combinedBanks = Array.from(new Set([...localBanks, ...internationalBanks, ...defaultBanks]))

    return combinedBanks.length > 0 ? combinedBanks : defaultBanks
  }

  const countryBanks = useMemo(() => resolveCountryBanks(country, bankCatalog), [country, bankCatalog])
  const filteredBanks = useMemo(() => countryBanks.filter((bank) => bank.toLowerCase().includes(bankSearch.toLowerCase())), [countryBanks, bankSearch])
  const filteredCountries = useMemo(() => countries.filter((countryOption) => countryOption.toLowerCase().includes(countrySearch.toLowerCase())), [countrySearch])

  const scrollToTopAndRefresh = () => {
    if (typeof window === "undefined") return

    const restore = () => {
      if (mainRef.current) {
        mainRef.current.scrollTop = 0
      }
      window.scrollTo({ top: 0, behavior: "auto" })
      document.documentElement.style.scrollBehavior = "auto"
    }

    requestAnimationFrame(() => {
      restore()
      window.setTimeout(restore, 0)
      window.setTimeout(restore, 25)
      window.setTimeout(() => {
        router.refresh()
      }, 50)
    })
  }

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const handleViewportResize = () => {
      const keyboardVisible = window.innerHeight - viewport.height - viewport.offsetTop > 120
      if (keyboardVisible) {
        window.scrollTo({ top: 0, behavior: "auto" })
        mainRef.current?.scrollTo({ top: 0, behavior: "auto" })
      }
    }

    viewport.addEventListener("resize", handleViewportResize)
    return () => viewport.removeEventListener("resize", handleViewportResize)
  }, [])

  const handleCountrySelect = (countryOption: string) => {
    if (typeof document !== "undefined") {
      const activeElement = document.activeElement as HTMLElement | null
      activeElement?.blur()
    }

    setCountry(countryOption)
    setSelectedBank("Select bank")
    setBankSearch("")
    setCountrySearch("")
    setIsCountryOpen(false)
    setIsBankOpen(false)

    scrollToTopAndRefresh()
  }

  const countryRequirements: Record<string, { requiresIban: boolean; requiresSwift: boolean; requiresRouting: boolean; requiresSortCode: boolean; requiresBankAddress: boolean }> = {
    "United States": { requiresIban: false, requiresSwift: false, requiresRouting: true, requiresSortCode: false, requiresBankAddress: true },
    "United Kingdom": { requiresIban: true, requiresSwift: false, requiresRouting: false, requiresSortCode: true, requiresBankAddress: true },
    Germany: { requiresIban: true, requiresSwift: true, requiresRouting: false, requiresSortCode: false, requiresBankAddress: true },
    France: { requiresIban: true, requiresSwift: true, requiresRouting: false, requiresSortCode: false, requiresBankAddress: true },
    Netherlands: { requiresIban: true, requiresSwift: true, requiresRouting: false, requiresSortCode: false, requiresBankAddress: true },
    Ireland: { requiresIban: true, requiresSwift: true, requiresRouting: false, requiresSortCode: false, requiresBankAddress: true },
    Canada: { requiresIban: false, requiresSwift: false, requiresRouting: true, requiresSortCode: false, requiresBankAddress: true },
    Australia: { requiresIban: false, requiresSwift: true, requiresRouting: false, requiresSortCode: false, requiresBankAddress: true },
    "United Arab Emirates": { requiresIban: true, requiresSwift: true, requiresRouting: false, requiresSortCode: false, requiresBankAddress: true },
  }

  // Real-time subscription for restriction and balance updates
  useEffect(() => {
    if (!user) return

    const supabaseClient = createClient()
    const channel = supabaseClient
      .channel('transfer-page-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Profile update received:', payload)
          // This will trigger a re-render via the auth context
          // The useAuth hook will automatically refresh the profile
        }
      )
      .subscribe()

    return () => {
      supabaseClient.removeChannel(channel)
    }
  }, [user])

  const africanCountries = new Set([
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cameroon",
    "Central African Republic",
    "Chad",
    "Comoros",
    "Congo",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "Sao Tome and Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe",
  ])

  const requirements = africanCountries.has(country)
    ? { requiresIban: false, requiresSwift: false, requiresRouting: false, requiresSortCode: false, requiresBankAddress: false }
    : countryRequirements[country] || countryRequirements["United Kingdom"]

  return (
    <div className="h-screen min-h-0 w-full overflow-hidden flex flex-col pb-15 bg-[#f4f6f8] text-slate-900">
      <WalletPageHeader onBack={() => router.back()} />

      <main ref={mainRef} className="flex-1 min-h-0 overflow-y-auto pb-28 w-full mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[24px] border border-slate-100 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.03)] sm:p-5"
        >
          <div className="mt-4 rounded-[24px] border border-blue-100/80 bg-[linear-gradient(135deg,_#f5f9ff_0%,_#eef5ff_45%,_#f8fbff_100%)] p-4 text-slate-900 shadow-[0_2px_8px_rgba(15,23,42,0.02)] sm:p-5">
            <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-slate-200/60 blur-3xl" />
            <div className="pointer-events-none absolute left-0 top-14 h-20 w-20 rounded-full bg-slate-200/60 blur-3xl" />
            <div className="relative flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-slate-500">Transfer summary</p>
                  <h3 className="mt-1 text-base font-semibold text-slate-900">Send money internationally</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/80 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-600">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-700" fill="none" aria-hidden="true">
                    <path d="M12 3.75a4.25 4.25 0 0 0-4.25 4.25V9h-.75A1.75 1.75 0 0 0 5.25 10.75v7.5A1.75 1.75 0 0 0 7 20h10a1.75 1.75 0 0 0 1.75-1.75v-7.5A1.75 1.75 0 0 0 17 9h-.75V8A4.25 4.25 0 0 0 12 3.75Zm-2.5 5.25V8A2.5 2.5 0 0 1 12 5.5a2.5 2.5 0 0 1 2.5 2.5v1.5h-5Z" fill="currentColor" />
                    <path d="M12 13.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" fill="#fff" />
                  </svg>
                  <span>Secure transfer</span>
                </div>
              </div>

              <div className="rounded-[16px] border border-blue-100/70 bg-white/90 p-3 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                      <img src={profileImageUrl} alt={accountName} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.24em] text-slate-400">Paying from</p>
                      <p className="truncate text-sm font-semibold text-slate-900">{accountName}</p>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400" fill="none" aria-hidden="true">
                    <path d="m9 6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              <div className="rounded-[18px] border border-blue-100/70 bg-white/90 px-4 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Available balance</p>
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-[clamp(1.6rem,3.5vw,2.3rem)] font-semibold tracking-tight text-slate-900">{formattedBalance}</p>
                  <span className="pb-1 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">USD</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-slate-200 bg-white p-4 sm:p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">International wire transfer</h2>
              <p className="mt-1 text-sm text-slate-500">Complete the recipient and banking details below for a secure transfer.</p>
            </div>

            {isRestricted && (
              <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold">Transfer blocked</p>
                <p className="mt-1 text-sm text-amber-900">
                  Your account is currently restricted. To transfer, please contact support for assistance.
                </p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Country being sent to</label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onTouchStart={(event) => event.preventDefault()}
                    onPointerDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setIsCountryOpen((prev) => !prev)
                      setIsBankOpen(false)
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-[16px] border border-slate-200 bg-[#f8fafc] px-4 py-3 text-left text-sm font-semibold text-slate-900"
                  >
                    <span className="flex-1 truncate">{country}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${isCountryOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isCountryOpen && (
                    <div className="mt-2 rounded-[16px] border border-slate-200 bg-white p-2 shadow-lg">
                      <div className="flex items-center gap-2 rounded-[12px] border border-slate-200 px-3 py-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={countrySearch}
                          onChange={(event) => setCountrySearch(event.target.value)}
                          placeholder="Search countries"
                          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      <div className="mt-2 max-h-56 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                          filteredCountries.map((countryOption) => (
                            <button
                              key={countryOption}
                              type="button"
                              onMouseDown={(event) => event.preventDefault()}
                              onTouchStart={(event) => event.preventDefault()}
                              onPointerDown={(event) => event.preventDefault()}
                              onClick={() => handleCountrySelect(countryOption)}
                              className="flex w-full items-center rounded-[12px] px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              {countryOption}
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-slate-500">No countries found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Recipient full name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(event) => setRecipientName(event.target.value)}
                  placeholder="Enter recipient full name"
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">Recipient email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(event) => setRecipientEmail(event.target.value)}
                  placeholder="Enter recipient email"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">Amount</label>
                <div className="relative mt-2">
                  <input
                    type="text"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value.replace(/[^0-9.]/g, ""))}
                    placeholder="5,000"
                    className="w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 pr-14 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center rounded-r-[20px] bg-slate-50 px-4 text-sm font-semibold text-slate-700">
                    USD
                  </span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Select bank or payment service</label>
                <div className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBankOpen((prev) => !prev)
                      setIsCountryOpen(false)
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-[16px] border border-slate-200 bg-[#f8fafc] px-4 py-3 text-left text-sm font-semibold text-slate-900"
                  >
                    <span className="flex-1 truncate">{selectedBank}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${isBankOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isBankOpen && (
                    <div className="absolute z-10 mt-2 w-full rounded-[16px] border border-slate-200 bg-white p-2 shadow-lg">
                      <div className="flex items-center gap-2 rounded-[12px] border border-slate-200 px-3 py-2">
                        <Search className="h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={bankSearch}
                          onChange={(event) => setBankSearch(event.target.value)}
                          placeholder="Search banks"
                          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                      </div>

                      <div className="mt-2 max-h-56 overflow-y-auto">
                        {filteredBanks.length > 0 ? (
                          filteredBanks.map((bank) => (
                            <button
                              key={bank}
                              type="button"
                              onClick={() => {
                                setSelectedBank(bank)
                                setBankSearch("")
                                setIsBankOpen(false)
                                setCountrySearch("")
                                setTimeout(() => {
                                  setIsBankOpen(false)
                                }, 0)
                              }}
                              className="flex w-full items-center rounded-[12px] px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
                            >
                              {bank}
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-2 text-sm text-slate-500">{bankError || (!bankCatalogLoaded ? "Updating bank options..." : "No banks found")}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">Account number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(event) => setAccountNumber(event.target.value.replace(/\D/g, ""))}
                  placeholder="0000000000"
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              {requirements.requiresIban && (
                <div>
                  <label className="text-sm font-semibold text-slate-900">IBAN</label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(event) => setIban(event.target.value.toUpperCase())}
                    placeholder="GB29 NWBK 6016 1331 9268 19"
                    className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              {requirements.requiresSwift && (
                <div>
                  <label className="text-sm font-semibold text-slate-900">SWIFT / BIC</label>
                  <input
                    type="text"
                    value={swiftCode}
                    onChange={(event) => setSwiftCode(event.target.value.toUpperCase())}
                    placeholder="BARCGB22"
                    className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              {requirements.requiresRouting && (
                <div>
                  <label className="text-sm font-semibold text-slate-900">Routing number</label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(event) => setRoutingNumber(event.target.value.replace(/\D/g, ""))}
                    placeholder="021000021"
                    className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              {requirements.requiresSortCode && (
                <div>
                  <label className="text-sm font-semibold text-slate-900">Sort code</label>
                  <input
                    type="text"
                    value={sortCode}
                    onChange={(event) => setSortCode(event.target.value.replace(/\D/g, ""))}
                    placeholder="40123"
                    className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              {requirements.requiresBankAddress && (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-slate-900">Bank address</label>
                  <input
                    type="text"
                    value={bankAddress}
                    onChange={(event) => setBankAddress(event.target.value)}
                    placeholder="1 Financial Avenue, London"
                    className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-slate-900">Payment reference</label>
                <textarea
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="Invoice payment for consulting services"
                  rows={3}
                  className="mt-2 w-full rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="mt-5 rounded-[20px] border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p className="text-sm font-medium text-slate-900">Transfer note</p>
              <p className="mt-1 text-[13px] font-normal leading-5 text-slate-500">
                Fees may apply depending on the destination country and transfer speed. Review all details carefully before submitting.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {transferProviders.map((provider) => (
                  <ProviderBadge key={provider.name} name={provider.name} logo={provider.logo} />
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={isRestricted}
              className={`mt-5 w-full rounded-[16px] px-4 py-3 text-sm font-semibold text-white transition shadow-[0_10px_20px_rgba(15,23,42,0.12)] ${isRestricted ? "bg-slate-400 cursor-not-allowed hover:bg-slate-400" : "bg-slate-900 hover:bg-slate-800"}`}
            >
              Review transfer
            </button>
          </div>

        </motion.section>
      </main>

      <WalletBottomNav />
    </div>
  )
}