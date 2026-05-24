
'use client'

import { useState, useTransition } from 'react'
import { approveBooking, rejectPaymentProof } from '@/actions/bookings'
import { formatDate } from '@/lib/utils'
import { SESSION_TYPE_LABELS } from '@/types/booking'
import type { BookingWithClient } from '@/types/booking'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface Props {
  bookings: BookingWithClient[]
  showActions?: boolean
}

const STATUS_STYLES: Record<string, string> = {
  pending_payment:   'bg-warm-50 text-warm-600 border-warm-200',
  payment_submitted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed:         'bg-primary-50 text-primary-700 border-primary-200',
  completed:         'bg-stone-100 text-stone-600 border-stone-200',
  cancelled:         'bg-red-50 text-red-600 border-red-200',
}

export function BookingTable({ bookings, showActions = false }: Props) {
  const [isPending, startTransition] = useTransition()
  const [processingId, setProcessingId] = useState<string | null>(null)

  function approve(bookingId: string) {
    const zoomLink = prompt('Enter Zoom meeting link:')
    if (!zoomLink) return

    setProcessingId(bookingId)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('bookingId', bookingId)
      formData.append('zoomLink', zoomLink)
      await approveBooking(formData)
      setProcessingId(null)
    })
  }

  function reject(bookingId: string) {
    const note = prompt('Reason for rejection:')
    if (!note) return

    setProcessingId(bookingId)
    startTransition(async () => {
      const formData = new FormData()
      formData.append('bookingId', bookingId)
      formData.append('therapistNotes', note)
      await rejectPaymentProof(formData)
      setProcessingId(null)
    })
  }

  if (bookings.length === 0) {
    return (
      <div className="card-surface p-10 text-center text-stone-400 text-sm">
        No bookings to display
      </div>
    )
  }

  return (
    <div className="card-surface overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200 bg-cream-50">
              <th className="text-left px-6 py-4 text-stone-600 font-medium whitespace-nowrap">Client</th>
              <th className="text-left px-6 py-4 text-stone-600 font-medium whitespace-nowrap">Service</th>
              <th className="text-left px-6 py-4 text-stone-600 font-medium whitespace-nowrap">Scheduled</th>
              <th className="text-left px-6 py-4 text-stone-600 font-medium whitespace-nowrap">Status</th>
              {showActions && (
                <th className="text-left px-6 py-4 text-stone-600 font-medium whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium text-stone-800">{booking.client?.fullName}</p>
                    <p className="text-stone-400 text-xs">{booking.client?.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                  {SESSION_TYPE_LABELS[booking.sessionType] ?? booking.sessionType}
                </td>
                <td className="px-6 py-4 text-stone-600 whitespace-nowrap">
                  {booking.scheduledAt ? formatDate(booking.scheduledAt) : '—'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${STATUS_STYLES[booking.bookingStatus] ?? ''}`}>
                    {booking.bookingStatus.replace(/_/g, ' ')}
                  </span>
                </td>
                {showActions && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {booking.bookingStatus === 'payment_submitted' && (
                      <div className="flex items-center gap-2">
                        <button
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => approve(booking.id)}
                          disabled={isPending && processingId === booking.id}
                        >
                          {isPending && processingId === booking.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <CheckCircle size={14} />
                          )}
                          Approve
                        </button>
                        <button
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white border border-warm-200 text-warm-600 hover:bg-warm-50 text-xs font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => reject(booking.id)}
                          disabled={isPending}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
