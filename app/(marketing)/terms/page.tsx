import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/PageIntro'

const TERMS_SECTIONS = [
  {
    title: 'Use of the platform',
    body:
      'Serenova provides an online space for mental wellness consultation, booking coordination, secure communication, and related operational support.',
  },
  {
    title: 'Not emergency support',
    body:
      'Serenova is not an emergency service. If you may harm yourself or someone else, contact local emergency services or a trusted crisis helpline immediately.',
  },
  {
    title: 'Accounts and access',
    body:
      'You are responsible for using accurate information, keeping account access private, and notifying support if you believe your account has been compromised.',
  },
  {
    title: 'Bookings and payments',
    body:
      'Session requests, manual UPI payment confirmation, approvals, cancellations, and rescheduling may follow the operational rules shown during booking.',
  },
  {
    title: 'Respectful communication',
    body:
      'Messages and inquiries must remain respectful, lawful, and relevant to care or platform operations.',
  },
  {
    title: 'Changes to terms',
    body:
      'These terms may be updated as the platform, payment workflow, and operational policies evolve.',
  },
]

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-')
}

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the Serenova terms covering platform use, emergency limitations, accounts, bookings, payments, and communication.',
}

export default function TermsPage() {
  return (
    <>
      <PageIntro
        eyebrow="Terms of service"
        title="Clear expectations help care feel safer."
        description="These terms outline how Serenova should be used and what the platform is not designed to replace."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="mx-auto max-w-3xl space-y-8">
            {TERMS_SECTIONS.map((section) => (
              <section key={section.title} aria-labelledby={slugify(section.title)}>
                <h2
                  id={slugify(section.title)}
                  className="mb-3 font-display text-2xl text-stone-900"
                >
                  {section.title}
                </h2>
                <p className="text-stone-600">{section.body}</p>
              </section>
            ))}
            <p className="border-t border-cream-200 pt-6 text-sm text-stone-500">
              These terms should be reviewed before launch for final legal,
              clinical, payment, and jurisdiction-specific requirements.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
