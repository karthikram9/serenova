export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 max-w-5xl animate-pulse">
      <div>
        <div className="h-8 w-48 bg-cream-200 rounded-lg mb-2" />
        <div className="h-4 w-72 bg-cream-100 rounded" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card-surface p-5">
            <div className="w-10 h-10 rounded-xl bg-cream-100 mb-4" />
            <div className="h-4 w-24 bg-cream-100 rounded mb-2" />
            <div className="h-7 w-12 bg-cream-200 rounded" />
          </div>
        ))}
      </div>

      <div className="card-surface p-6">
        <div className="h-5 w-40 bg-cream-200 rounded mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 bg-cream-50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}
