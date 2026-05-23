import { Shield, Lock, Heart, Clock } from 'lucide-react'
import { SectionHeader } from '@/components/shared/SectionHeader'

const TRUST_POINTS = [
  {
    icon: Shield,
    title: 'Fully Confidential',
    description: 'Everything you share stays between you and your therapist. Always.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'End-to-end secure sessions. Your data is never shared or sold.',
  },
  {
    icon: Heart,
    title: 'Non-Judgmental',
    description: 'A warm space where every emotion is welcome, understood, and respected.',
  },
  {
    icon: Clock,
    title: 'At Your Pace',
    description: 'No pressure. Begin when you\'re ready. Move forward on your terms.',
  },
]

export function TrustSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        <SectionHeader eyebrow="Why clients trust us" title="You deserve to feel truly safe" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_POINTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="card-surface p-7 text-center hover:shadow-elevated transition-shadow duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-100 transition-colors">
                <Icon aria-hidden="true" size={22} className="text-primary-600" />
              </div>
              <h3 className="font-display text-lg text-stone-800 mb-2">{title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
