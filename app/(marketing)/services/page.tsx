import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageIntro } from '@/components/shared/PageIntro'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { SERVICES } from '@/content/services'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Explore individual therapy, relationship counseling, and emotional wellness support through Serenova.',
}

export default function ServicesPage() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title="Choose the support that fits this season."
        description="Each service is designed to create a private, steady space for reflection, emotional clarity, and practical next steps."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            eyebrow="Available support"
            title="Three simple starting points."
            description="You can begin with the area that feels most present. The work can evolve as your needs become clearer."
          />
          <div className="space-y-6">
            {SERVICES.map((service) => (
              <article
                id={service.slug}
                key={service.id}
                className="rounded-lg border border-cream-200 bg-cream-50 p-6 md:p-8"
              >
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
                  <div>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                      <service.icon aria-hidden="true" size={24} className="text-primary-600" />
                    </div>
                    <h2 className="mb-2 font-display text-2xl text-stone-900">
                      {service.title}
                    </h2>
                    <p className="mb-4 text-sm font-medium text-primary-600">
                      {service.tagline}
                    </p>
                    <p className="max-w-2xl text-stone-600">{service.description}</p>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-stone-800">
                      This may help with
                    </h3>
                    <ul className="space-y-2">
                      {service.forWhom.map((item) => (
                        <li key={item} className="text-sm text-stone-600">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/book">
              <Button className="rounded-full bg-primary-600 px-8 text-white hover:bg-primary-700">
                Start a booking request
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
