import type { Metadata } from 'next'
import { PageIntro } from '@/components/shared/PageIntro'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { InfoCard } from '@/components/shared/InfoCard'
import { APPROACH_STEPS, CARE_VALUES } from '@/content/marketing'

export const metadata: Metadata = {
  title: 'Approach',
  description:
    'Discover Serenova’s calm, privacy-first, and practical approach to emotional wellness support.',
}

export default function ApproachPage() {
  return (
    <>
      <PageIntro
        eyebrow="Approach"
        title="Steady support, not rushed advice."
        description="The Serenova experience is intentionally simple: listen carefully, understand the pattern, and move toward small steps that feel possible."
      />

      <section className="section-padding bg-white">
        <div className="container-main">
          <SectionHeader
            eyebrow="How sessions feel"
            title="A calm structure for difficult conversations."
            description="Care does not need to feel clinical or cold. It can be warm, thoughtful, and still grounded."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {APPROACH_STEPS.map((step) => (
              <InfoCard key={step.title} {...step} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-cream-50">
        <div className="container-main">
          <SectionHeader
            align="left"
            eyebrow="Design principles"
            title="The product experience follows the care philosophy."
            description="Every screen should reduce friction, protect privacy, and make the next step obvious without making anyone feel pushed."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {CARE_VALUES.map((value) => (
              <InfoCard key={value.title} {...value} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
