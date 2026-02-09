'use client'

import { LandingNavbar } from '@/components/landing/landing-navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { AISystemSection } from '@/components/landing/ai-system-section'
import { FAQSection } from '@/components/landing/faq-section'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      <LandingNavbar />
      <HeroSection />
      <FeaturesSection />
      <AISystemSection />
      <FAQSection />
    </div>
  )
}
