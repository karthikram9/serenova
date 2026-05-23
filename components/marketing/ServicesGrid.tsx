import Link from 'next/link'
import { SERVICES } from '@/content/services'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ArrowRight } from 'lucide-react'

export function ServicesGrid() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader
          eyebrow="How I can help"
          title="Find the right support for your current chapter"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className="card-surface p-8 flex flex-col h-full group hover:shadow-card transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-warm-100 flex items-center justify-center mb-6 group-hover:bg-warm-200 transition-colors">
                <service.icon size={24} className="text-warm-700" />
              </div>
              
              <h3 className="font-display text-xl text-stone-900 mb-2">{service.title}</h3>
              <p className="text-sm font-medium text-primary-600 mb-4">{service.tagline}</p>
              
              <p className="text-stone-600 text-sm leading-relaxed mb-6 flex-grow">
                {service.description}
              </p>
              
              <Link
                href={`/services#${service.slug}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-800 hover:text-primary-600 transition-colors mt-auto"
              >
                Learn more
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
