import { requireTherapist } from '@/lib/auth/session'
import { getTherapistBookings } from '@/lib/db/bookings'
import { BookingTable } from '@/components/dashboard/BookingTable'
import { StatsOverview } from '@/components/dashboard/StatsOverview'

export default async function AdminDashboardPage() {
  const { user } = await requireTherapist()

  const [pending, confirmed, all] = await Promise.all([
    getTherapistBookings(user.id, 'payment_submitted'),
    getTherapistBookings(user.id, 'confirmed'),
    getTherapistBookings(user.id),
  ])

  const stats = {
    pendingApproval: pending.length,
    confirmedToday: confirmed.filter(b => {
      if (!b.scheduledAt) return false
      return new Date(b.scheduledAt).toDateString() === new Date().toDateString()
    }).length,
    totalClients: new Set(all.map(b => b.clientId)).size,
    totalSessions: all.filter(b => b.bookingStatus === 'completed').length,
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="font-display text-2xl text-stone-900 mb-1">
          Good morning 🌿
        </h1>
        <p className="text-stone-500 text-sm">Here&apos;s what needs your attention today.</p>
      </div>

      <StatsOverview stats={stats} />

      {pending.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-stone-800 mb-4">
            Pending Approval ({pending.length})
          </h2>
          <BookingTable bookings={pending} showActions />
        </section>
      )}

      <section>
        <h2 className="font-display text-lg text-stone-800 mb-4">
          Upcoming Sessions
        </h2>
        <BookingTable bookings={confirmed} />
      </section>
    </div>
  )
}
