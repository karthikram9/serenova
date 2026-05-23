import type { LucideIcon } from 'lucide-react'

interface InfoCardProps {
  icon?: LucideIcon
  title: string
  description: string
}

export function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <article className="card-surface h-full p-6 md:p-7">
      {Icon ? (
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
          <Icon aria-hidden="true" size={21} className="text-primary-600" />
        </div>
      ) : null}
      <h3 className="mb-2 font-display text-xl text-stone-900">{title}</h3>
      <p className="text-sm leading-relaxed text-stone-600">{description}</p>
    </article>
  )
}
