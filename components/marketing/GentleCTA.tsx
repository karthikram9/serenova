import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function GentleCTA() {
  return (
    <section className="relative overflow-hidden bg-primary-600 py-24">
      <div
        className="pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-primary-500 opacity-50 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-warm-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-main relative z-10 text-center">
        <h2 className="mb-6 font-display text-3xl text-white md:text-4xl">
          Ready to begin?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-primary-100">
          Taking the first step is often the hardest part. There is no pressure;
          whenever you feel ready, support is here.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/book">
            <Button
              size="lg"
              className="h-14 rounded-full bg-white px-8 text-base font-semibold text-primary-700 shadow-lg hover:bg-cream-50"
            >
              Book your first session
              <ArrowRight aria-hidden="true" size={18} />
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="h-14 rounded-full border-primary-400 px-8 text-base text-white hover:bg-primary-500 hover:text-white"
            >
              I have a few questions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
