import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-10 md:mb-14',
        align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl',
        className
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium uppercase tracking-wide text-primary-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-display text-stone-900">{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-stone-600 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  )
}
