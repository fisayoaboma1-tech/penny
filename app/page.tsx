import { Navigation } from "./landing-page/components/navigation"
import { HeroSection } from "./landing-page/components/hero-section"
import { WhatWeOfferCarousel } from "./landing-page/components/what-we-offer-carousel"
import { AccountsSection } from "./landing-page/components/accounts-section"
import { Footer } from "./landing-page/components/footer"
import { ContactSection } from "./landing-page/components/contact-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <AccountsSection />
      <WhatWeOfferCarousel />
       <ContactSection />
      <Footer />
    </main>
  )
}
