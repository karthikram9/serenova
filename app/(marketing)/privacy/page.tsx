import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/PageIntro'

const PRIVACY_SECTIONS = [
  {
    title: 'Information we collect',
    body:
      'Serenova may collect account details, contact information, booking context, payment confirmation details, and messages you choose to send through the platform.',
  },
  {
    title: 'How information is used',
    body:
      'Information is used to provide access, manage booking requests, confirm payments, support session communication, improve reliability, and respond to inquiries.',
  },
  {
    title: 'Confidentiality',
    body:
      'Personal information is treated as private and is not sold. Access is limited to what is needed for care, operations, security, and legal compliance.',
  },
  {
    title: 'Payments and files',
    body:
      'Payment proof uploads are intended for private storage and manual verification. Sensitive files should only be uploaded where the platform specifically requests them.',
  },
  {
    title: 'Data retention',
    body:
      'Some records may be retained for operational, safety, legal, or accounting reasons. Secure messages may have retention rules defined by the platform configuration.',
  },
  {
    title: 'Your choices',
    body:
      'You may ask questions about your information, request corrections where appropriate, or stop using the platform at any time.',
  },
]

function slugify(value: string) {
  return value.toLowerCase().replace(/\s+/g, '-')
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'Learn how Serenova handles personal information, confidentiality, payment proof uploads, and data retention.',
}

export default function PrivacyPage() {
  return (
    <>
      <PageIntro
        eyebrow="Privacy policy"
        title="Your privacy matters from the first click."
        description="This policy explains the kind of information Serenova may handle and the principles used to protect it."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <div className="mx-auto max-w-3xl space-y-8">
            {PRIVACY_SECTIONS.map((section) => (
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
              This policy is informational and should be reviewed before launch
              for the final business, clinical, and legal operating details.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
