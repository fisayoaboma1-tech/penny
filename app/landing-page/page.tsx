import { Navigation } from "./components/navigation"
import { HeroSection } from "./components/hero-section"
import { WhatWeOfferCarousel } from "./components/what-we-offer-carousel"
import { AccountsSection } from "./components/accounts-section"
import { Footer } from "./components/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AccountsSection />
      <WhatWeOfferCarousel />
      <Footer />
    </main>
  )
}
