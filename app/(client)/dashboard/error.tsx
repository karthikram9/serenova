'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to Sentry or similar service in production
    console.error('Dashboard Error:', error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
        <AlertTriangle size={24} />
      </div>
      <h2 className="font-display text-xl text-stone-900 mb-2">Something went wrong</h2>
      <p className="text-stone-500 text-sm mb-6 max-w-md">
        We encountered an error while loading this page. Please try again.
      </p>
      <div className="flex gap-3">
        <button 
          onClick={() => reset()} 
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Try again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 border border-cream-200 bg-white hover:bg-cream-50 text-stone-700 rounded-lg text-sm font-medium transition-colors"
        >
          Reload page
        </button>
      </div>
    </div>
  )
}
