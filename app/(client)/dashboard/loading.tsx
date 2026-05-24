import { Loader2 } from 'lucide-react'

export default function DashboardLoading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 size={32} className="animate-spin text-primary-500" />
      <p className="text-stone-500 text-sm font-medium animate-pulse">
        Loading...
      </p>
    </div>
  )
}
