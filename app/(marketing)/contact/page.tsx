import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageIntro } from '@/components/shared/PageIntro'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CONTACT_REASONS } from '@/content/marketing'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Serenova with questions about services, booking, privacy, or scheduling.',
}

export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Ask what you need to ask."
        description="If you are unsure about booking, services, privacy, or payment, start with a simple question."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <SectionHeader
                align="left"
                eyebrow="Before booking"
                title="You do not need to decide everything today."
                description="These are common reasons someone may reach out before choosing a session."
              />
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {CONTACT_REASONS.map((reason) => (
                  <li
                    key={reason}
                    className="rounded-lg border border-cream-200 bg-cream-50 px-4 py-3 text-sm text-stone-700"
                  >
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <aside className="rounded-lg border border-cream-200 bg-cream-50 p-6">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <Mail aria-hidden="true" size={23} className="text-primary-600" />
              </div>
              <h2 className="mb-3 font-display text-2xl text-stone-900">
                Prefer to sign in first?
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-stone-600">
                Existing clients can use the same secure sign-in flow for account access.
              </p>
              <Link href="/login">
                <Button className="w-full rounded-full bg-primary-600 text-white hover:bg-primary-700">
                  Sign in
                </Button>
              </Link>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}
