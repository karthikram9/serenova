import * as React from 'react'
import { Calendar } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 md:p-12 bg-white rounded-2xl border border-cream-200 card-surface max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4 animate-pulse">
        {icon || <Calendar size={24} />}
      </div>
      <h3 className="text-lg font-medium text-stone-800 mb-2 font-display">
        {title}
      </h3>
      <p className="text-stone-500 text-sm leading-relaxed mb-6">
        {description}
      </p>
      {action && (
        <div className="w-full flex justify-center">
          {action}
        </div>
      )}
    </div>
  )
}
