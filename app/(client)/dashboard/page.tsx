/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireClient } from '@/lib/auth/session'
import { getClientBookings } from '@/lib/db/bookings'
import { SessionCard } from '@/components/dashboard/SessionCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { CalendarDays, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default async function ClientDashboardPage() {
  const { user, profile } = await requireClient()
  const bookings = await getClientBookings(user.id)

  const upcoming = bookings.filter(b =>
    ['pending_payment', 'payment_submitted', 'confirmed'].includes(b.bookingStatus)
  )
  const past = bookings.filter(b => b.bookingStatus === 'completed')

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl text-stone-900 mb-1">
          Welcome back, {profile.full_name.split(' ')[0] ?? 'there'} 👋
        </h1>
        <p className="text-stone-500 text-sm">
          How are you feeling today? Your support is always here.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/book">
          <div className="card-surface p-5 flex items-center gap-3 hover:shadow-card transition-shadow cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <CalendarDays size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-stone-800 text-sm font-medium">Book Session</p>
              <p className="text-stone-400 text-xs">Schedule your next session</p>
            </div>
          </div>
        </Link>
        <Link href={"/dashboard/messages" as any}>
          <div className="card-surface p-5 flex items-center gap-3 hover:shadow-card transition-shadow cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <MessageCircle size={20} className="text-primary-600" />
            </div>
            <div>
              <p className="text-stone-800 text-sm font-medium">Messages</p>
              <p className="text-stone-400 text-xs">Secure chat with therapist</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming Sessions */}
      <section>
        <h2 className="font-display text-lg text-stone-800 mb-4">
          Upcoming Sessions
        </h2>
        {upcoming.length === 0 ? (
          <EmptyState
            title="No upcoming sessions"
            description="Whenever you're ready, support is here."
            action={
              <Link href="/book">
                <Button size="sm" className="bg-primary-600 hover:bg-primary-700 text-white">
                  Book a Session
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {upcoming.map(booking => (
              <SessionCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* Past Sessions */}
      {past.length > 0 && (
        <section>
          <h2 className="font-display text-lg text-stone-800 mb-4">Past Sessions</h2>
          <div className="space-y-3">
            {past.slice(0, 3).map(booking => (
              <SessionCard key={booking.id} booking={booking} isPast />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
