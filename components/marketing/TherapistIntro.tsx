import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HeartHandshake } from 'lucide-react'

export function TherapistIntro() {
  return (
    <section className="section-padding bg-cream-50">
      <div className="container-main">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 lg:order-1">
            <div
              className="aspect-[4/5] rounded-2xl border border-cream-200 bg-gradient-to-br from-cream-100 via-white to-primary-50 shadow-card"
              aria-hidden="true"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft">
                  <HeartHandshake size={42} className="text-primary-500" />
                </div>
              </div>
            </div>
            <div className="absolute -z-10 -bottom-6 -left-6 h-full w-full rounded-2xl border-2 border-primary-200" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary-600">
              Care with steadiness
            </p>
            <h2 className="mb-6 font-display text-stone-900">
              Support that feels human, private, and unhurried.
            </h2>
            <div className="mb-8 space-y-4 leading-relaxed text-stone-600">
              <p>
                Serenova is built around the belief that meaningful support begins
                with being heard clearly and respectfully.
              </p>
              <p>
                The experience is designed for people navigating emotional stress,
                relationship difficulty, burnout, and life transitions, with simple
                booking and secure communication kept intentionally calm.
              </p>
            </div>

            <Link href="/about">
              <Button className="rounded-full bg-stone-800 px-8 text-white hover:bg-stone-900">
                Learn about the approach
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
