import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageIntro } from '@/components/shared/PageIntro'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { InfoCard } from '@/components/shared/InfoCard'
import { BOOKING_STEPS } from '@/content/marketing'

export const metadata: Metadata = {
  title: 'Book a Session',
  description:
    'Understand the Serenova booking flow for online mental wellness and relationship support.',
}

export default function BookPage() {
  return (
    <>
      <PageIntro
        eyebrow="Book a session"
        title="Begin with a simple request."
        description="Booking is intentionally calm. In this phase, sessions are requested first, then reviewed and confirmed after payment verification."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            eyebrow="Booking flow"
            title="Four steps, no pressure."
            description="Before a session is confirmed, you can understand the path clearly and decide whether it feels right for you."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {BOOKING_STEPS.map((step) => (
              <InfoCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-50">
        <div className="container-main">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-display text-stone-900">
              Not sure which service to choose?
            </h2>
            <p className="mb-8 text-stone-600">
              It is completely okay to ask a question first. A short message can
              help clarify which kind of support may fit best.
            </p>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full border-primary-300 px-8">
                Ask before booking
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
