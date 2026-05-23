import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/PageIntro'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { InfoCard } from '@/components/shared/InfoCard'
import { BookingPageContent } from '@/components/marketing/BookingPageContent'
import { BOOKING_STEPS } from '@/content/marketing'

export const metadata: Metadata = {
  title: 'Book a Session',
  description:
    'Request a private online mental wellness or relationship counseling session and submit UPI payment proof securely.',
}

export default function BookPage() {
  return (
    <>
      <PageIntro
        eyebrow="Book a session"
        title="Begin with a simple, secure request."
        description="Choose the support you need, request a preferred time, and submit private UPI payment proof for review."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <BookingPageContent />
        </div>
      </section>

      <section className="section-padding bg-primary-50">
        <div className="container-main">
          <SectionHeader
            eyebrow="Booking flow"
            title="Four steps, no pressure."
            description="The server confirms every booking and payment transition before the page moves forward."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BOOKING_STEPS.map((step) => (
              <InfoCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
