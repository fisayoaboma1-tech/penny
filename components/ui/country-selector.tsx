"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"
import { countries, type Country } from "@/lib/countries"
import { cn } from "@/lib/utils"

interface CountrySelectorProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
  triggerClassName?: string
  panelClassName?: string
  dark?: boolean
}

export function CountrySelector({
  value,
  onValueChange,
  placeholder = "Select country",
  className,
  triggerClassName,
  panelClassName,
  dark = false,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedCountry = useMemo(() => {
    return countries.find((country) => country.code === value) ?? countries[0]
  }, [value])

  const filteredCountries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return countries

    return countries.filter((country) => {
      return (
        country.name.toLowerCase().includes(query) ||
        country.code.toLowerCase().includes(query) ||
        country.dialCode.includes(query)
      )
    })
  }, [search])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearch("")
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        setSearch("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen])

  const handleSelect = (country: Country) => {
    onValueChange(country.code)
    setIsOpen(false)
    setSearch("")
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center justify-between rounded-[1rem] border px-4 py-3 text-left text-sm font-medium transition-all duration-200",
          dark
            ? "border-emerald-500/10 bg-emerald-500/5 text-white hover:bg-emerald-500/10"
            : "border-slate-200 bg-white/95 text-slate-900 shadow-sm hover:border-green-700/40 hover:shadow-md",
          triggerClassName,
        )}
      >
        <span className={cn("block text-sm", dark ? "text-white" : "text-slate-900")}>{selectedCountry.dialCode}</span>
        <ChevronDown className={cn("ml-3 h-4 w-4 shrink-0 transition-transform", isOpen && "rotate-180", dark ? "text-emerald-200/70" : "text-slate-500")} />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 z-[70] mt-2 w-full min-w-[240px] rounded-[1.1rem] border shadow-[0_20px_50px_rgba(15,23,42,0.16)]",
            dark ? "border-emerald-500/20 bg-[#111111]" : "border-slate-200 bg-white",
            panelClassName,
          )}
        >
          <div className={cn("border-b p-3", dark ? "border-emerald-500/10" : "border-slate-200") }>
            <label className="sr-only" htmlFor="country-search">
              {placeholder}
            </label>
            <div className="relative">
              <Search className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", dark ? "text-emerald-200/60" : "text-slate-400")} />
              <input
                id="country-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search countries..."
                className={cn(
                  "w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm outline-none transition",
                  dark
                    ? "border-emerald-500/10 bg-emerald-500/5 text-white placeholder:text-emerald-200/50 focus:border-emerald-400/50"
                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-green-700/40",
                )}
              />
            </div>
          </div>

          <div className="max-h-[260px] overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === value

                return (
                  <button
                    key={country.code}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => handleSelect(country)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors",
                      isSelected
                        ? dark
                          ? "bg-emerald-500/10"
                          : "bg-emerald-50"
                        : dark
                          ? "hover:bg-emerald-500/10"
                          : "hover:bg-slate-50",
                    )}
                  >
                    <span className="min-w-0">
                        <span className={cn("block truncate text-sm", dark ? "text-white" : "text-slate-900")}>{country.name}</span>
                        <span className={cn("block text-xs", dark ? "text-emerald-200/70" : "text-slate-500")}>{country.dialCode}</span>
                    </span>
                    {isSelected && <Check className={cn("h-4 w-4 shrink-0", dark ? "text-emerald-400" : "text-green-700")} />}
                  </button>
                )
              })
            ) : (
              <div className={cn("px-4 py-5 text-sm", dark ? "text-emerald-200/70" : "text-slate-500")}>No countries found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
