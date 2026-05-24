'use client'

import { useEffect } from 'react'

export default function AdminDashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin dashboard error:', error)
  }, [error])

  return (
    <div className="max-w-xl mx-auto text-center py-16">
      <h2 className="font-display text-xl text-stone-800 mb-2">
        Something went wrong
      </h2>
      <p className="text-stone-500 text-sm mb-6">
        We couldn&apos;t load the dashboard. This may be a temporary issue.
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  )
}
