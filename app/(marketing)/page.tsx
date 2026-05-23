import type { Metadata } from 'next'
import { HeroSection } from '@/components/marketing/HeroSection'
import { TrustSection } from '@/components/marketing/TrustSection'
import { TherapistIntro } from '@/components/marketing/TherapistIntro'
import { ServicesGrid } from '@/components/marketing/ServicesGrid'
import { ApproachSection } from '@/components/marketing/ApproachSection'
import { BookingFlow } from '@/components/marketing/BookingFlow'
import { PrivacyBadge } from '@/components/marketing/PrivacyBadge'
import { GentleCTA } from '@/components/marketing/GentleCTA'
import { StructuredData } from '@/components/shared/StructuredData'

export const metadata: Metadata = {
  title: 'Online Therapy & Relationship Counseling',
  description:
    'A safe, private space for mental health support and relationship counseling. Book an online session whenever you feel ready.',
}

export default function HomePage() {
  return (
    <>
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'MedicalBusiness',
          name: 'Serenova',
          url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
          description:
            'Online mental wellness and relationship counseling support.',
          areaServed: 'IN',
          availableLanguage: ['English'],
          isAcceptingNewPatients: true,
        }}
      />
      <HeroSection />
      <TrustSection />
      <TherapistIntro />
      <ServicesGrid />
      <ApproachSection />
      <BookingFlow />
      <PrivacyBadge />
      <GentleCTA />
    </>
  )
}
