import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/PageIntro'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { InfoCard } from '@/components/shared/InfoCard'
import { AUDIENCE_POINTS, CARE_VALUES } from '@/content/marketing'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn about Serenova, a calm online space for mental wellness and relationship support.',
}

export default function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About Serenova"
        title="A quieter way to ask for support."
        description="Serenova exists for people who want thoughtful mental wellness and relationship guidance without pressure, noise, or judgment."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            align="left"
            eyebrow="What guides the work"
            title="Care should feel clear, private, and deeply human."
            description="The platform is built around emotional safety: simple language, predictable steps, secure access, and a tone that leaves space to breathe."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CARE_VALUES.map((value) => (
              <InfoCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-main">
          <SectionHeader
            eyebrow="Who this is for"
            title="Support for what feels difficult to carry alone."
            description="You do not need to have the perfect words before reaching out. It is enough to begin with what feels true today."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {AUDIENCE_POINTS.map((point) => (
              <InfoCard key={point.title} {...point} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
