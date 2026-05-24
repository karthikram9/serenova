/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react'
import type { Booking } from '@/types/booking'
import { SESSION_TYPE_LABELS } from '@/types/booking'
import { formatDate } from '@/lib/utils'
import { CopyLinkWidget } from './CopyLinkWidget'
import { Video, FileText, Upload } from 'lucide-react'
import Link from 'next/link'

interface Props {
  booking: Booking
  isPast?: boolean
}

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pending Payment',
  payment_submitted: 'Payment Submitted',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
}

export function SessionCard({ booking, isPast }: Props) {
  const isConfirmed = booking.bookingStatus === 'confirmed'
  const needsPayment = booking.bookingStatus === 'pending_payment'
  const isPaymentSubmitted = booking.bookingStatus === 'payment_submitted'

  return (
    <div className={`card-surface p-5 border ${isPast ? 'bg-stone-50 border-stone-200 opacity-80' : 'bg-white border-cream-200'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isConfirmed ? 'bg-primary-50 text-primary-700 border-primary-200' :
              needsPayment ? 'bg-warm-50 text-warm-700 border-warm-200' :
              isPaymentSubmitted ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-stone-100 text-stone-600 border-stone-200'
            }`}>
              {STATUS_LABELS[booking.bookingStatus] ?? booking.bookingStatus}
            </span>
            {booking.scheduledAt && (
              <span className="text-sm font-medium text-stone-700">
                {formatDate(booking.scheduledAt)}
              </span>
            )}
          </div>
          <p className="text-stone-500 text-sm">
            {SESSION_TYPE_LABELS[booking.sessionType] ?? 'Session'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {needsPayment && (
             <Link href={`/dashboard/proof/upload?bookingId=${booking.id}` as any} className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1.5 border border-primary-200 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-primary-100">
               <Upload size={16} /> Upload Proof
             </Link>
          )}

          {(!needsPayment && booking.bookingStatus !== 'cancelled') && (
            <Link href={`/dashboard/proof/${booking.id}` as any} className="text-sm text-stone-600 hover:text-primary-600 font-medium inline-flex items-center gap-1.5 border border-cream-200 bg-cream-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-cream-100">
              <FileText size={16} /> View Proof
            </Link>
          )}

          {isConfirmed && booking.zoomLink && (
            <div className="flex items-center gap-2">
              <Link href={(booking.zoomLink as any) || ""} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors">
                <Video size={16} /> Join
              </Link>
              <CopyLinkWidget link={booking.zoomLink} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
