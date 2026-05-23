import { cn } from '@/lib/utils'

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  className?: string
}

export function PageIntro({ eyebrow, title, description, className }: PageIntroProps) {
  return (
    <section className={cn('bg-cream-50 pt-28 pb-14 md:pt-36 md:pb-20', className)}>
      <div className="container-main">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-primary-600">
            {eyebrow}
          </p>
          <h1 className="font-display text-stone-900">{title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}
