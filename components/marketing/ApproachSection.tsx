import { CheckCircle2 } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'

const PILLARS = [
  'Evidence-informed reflection',
  'Trauma-aware pacing',
  'Culturally sensitive care',
  'Collaborative goal setting',
]

export function ApproachSection() {
  return (
    <section className="section-padding bg-cream-100">
      <div className="container-main">
        <SectionHeader
          align="left"
          eyebrow="Therapeutic approach"
          title="A modern, compassionate approach to therapy"
          description="Care is not one-size-fits-all. Serenova combines structured tools with an empathetic space that adapts to what you need in the moment."
        />

        <div className="rounded-lg border border-cream-200 bg-white p-6 md:p-10">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            <ul className="space-y-3">
              {PILLARS.map((pillar) => (
                <li key={pillar} className="flex items-start gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    size={20}
                    className="mt-0.5 shrink-0 text-primary-500"
                  />
                  <span className="text-stone-700">{pillar}</span>
                </li>
              ))}
            </ul>
            <div className="rounded-lg border border-primary-100 bg-primary-50 p-8 text-center">
              <p className="font-display text-xl italic leading-relaxed text-stone-800">
                &ldquo;The goal is not to rush toward a perfect answer. The goal is
                to create enough safety for the next honest step.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
