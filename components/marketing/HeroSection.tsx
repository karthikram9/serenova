import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Shield } from 'lucide-react'

const EMOTIONAL_TAGS = [
  'Overthinking',
  'Relationship stress',
  'Burnout',
  'Loneliness',
  'Anxiety',
  'Emotional confusion',
]

export function HeroSection() {
  return (
    <section
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(150,192,168,0.18) 0%, transparent 70%),
          radial-gradient(ellipse 60% 40% at 80% 80%, rgba(236,175,144,0.12) 0%, transparent 60%),
          var(--color-cream-50)
        `,
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute right-6 top-24 h-80 w-80 rounded-full bg-primary-100/30 blur-3xl" />
        <div className="absolute bottom-20 left-6 h-72 w-72 rounded-full bg-warm-100/25 blur-3xl" />
      </div>

      <div className="container-main relative z-10 pt-24 pb-16 text-center">
        <div className="animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5">
          <Shield aria-hidden="true" size={13} className="text-primary-600" />
          <span className="text-xs font-medium tracking-wide text-primary-700">
            Confidential online support
          </span>
        </div>

        <h1 className="animate-fade-in-up delay-100 mx-auto mb-6 max-w-3xl font-display text-stone-900">
          A safe space to{' '}
          <span className="text-gradient-primary italic">pause, reflect,</span>
          {' '}and heal
        </h1>

        <p className="animate-fade-in-up delay-200 mx-auto mb-4 max-w-xl text-lg leading-relaxed text-stone-500 md:text-xl">
          Professional mental health support and relationship counseling, from
          the comfort of your own space.
        </p>

        <div className="animate-fade-in delay-300 mb-10 flex flex-wrap justify-center gap-2">
          {EMOTIONAL_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-cream-200 bg-cream-100 px-3 py-1 text-xs text-stone-500"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="animate-fade-in-up delay-400 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/book">
            <Button
              size="lg"
              className="h-12 rounded-full bg-primary-600 px-8 text-white shadow-soft transition-all duration-300 hover:bg-primary-700 hover:shadow-card"
            >
              Book a Session
              <ArrowRight aria-hidden="true" size={16} />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-cream-300 px-8 text-stone-600 hover:border-primary-300 hover:bg-cream-100"
            >
              Learn how it works
            </Button>
          </Link>
        </div>

        <p className="animate-fade-in delay-500 mt-8 text-sm italic text-stone-400">
          &quot;Whenever you feel ready, support is here.&quot;
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="white"
            fillOpacity="0.6"
          />
        </svg>
      </div>
    </section>
  )
}
