/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireTherapist } from '@/lib/auth/session'
import { getTherapistBookings } from '@/lib/db/bookings'
import { BookingTable } from '@/components/dashboard/BookingTable'

export const metadata = {
  title: 'Bookings | Admin Dashboard',
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const { user } = await requireTherapist()
  
  // Safe cast for filter, invalid statuses will just return empty arrays from DB
  const statusFilter = searchParams.status as any
  const bookings = await getTherapistBookings(user.id, statusFilter)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-stone-900 mb-2">All Bookings</h1>
        <p className="text-stone-500">View and manage all client sessions.</p>
      </div>
      <BookingTable bookings={bookings} showActions={true} />
    </div>
  )
}
