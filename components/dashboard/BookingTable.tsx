'use client'

import { useState, useTransition } from 'react'
import { approveBooking, rejectPaymentProof } from '@/actions/bookings'
import { formatDate } from '@/lib/utils'
import { SESSION_TYPE_LABELS } from '@/types/booking'
import type { BookingWithClient } from '@/types/booking'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { TherapistProofViewer } from './TherapistProofViewer'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

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
  
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null)
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleApprove(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeBookingId) return
    setErrorMsg(null)
    
    const formData = new FormData(e.currentTarget)
    formData.set('bookingId', activeBookingId)
    
    setProcessingId(activeBookingId)
    startTransition(async () => {
      const result = await approveBooking(formData)
      if ('error' in result) {
        setErrorMsg(result.error)
      } else {
        setApproveOpen(false)
      }
      setProcessingId(null)
    })
  }

  function handleReject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!activeBookingId) return
    setErrorMsg(null)
    
    const formData = new FormData(e.currentTarget)
    formData.set('bookingId', activeBookingId)
    
    setProcessingId(activeBookingId)
    startTransition(async () => {
      const result = await rejectPaymentProof(formData)
      if ('error' in result) {
        setErrorMsg(result.error)
      } else {
        setRejectOpen(false)
      }
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
    <>
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
              {bookings.map((booking) => {
                const proofId = booking.paymentProofs?.[0]?.id
                
                return (
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
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${STATUS_STYLES[booking.bookingStatus] ?? ''}`}>
                          {booking.bookingStatus.replace(/_/g, ' ')}
                        </span>
                        {proofId && (
                          <TherapistProofViewer proofId={proofId} fileName={booking.paymentProofs[0]?.fileName} />
                        )}
                      </div>
                    </td>
                    {showActions && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.bookingStatus === 'payment_submitted' && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="h-8 gap-1 text-xs bg-primary-600 hover:bg-primary-700 text-white"
                              onClick={() => {
                                setActiveBookingId(booking.id)
                                setErrorMsg(null)
                                setApproveOpen(true)
                              }}
                              disabled={isPending && processingId === booking.id}
                            >
                              {isPending && processingId === booking.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <CheckCircle size={14} />
                              )}
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1 text-xs border-warm-200 text-warm-600 hover:bg-warm-50"
                              onClick={() => {
                                setActiveBookingId(booking.id)
                                setErrorMsg(null)
                                setRejectOpen(true)
                              }}
                              disabled={isPending}
                            >
                              <XCircle size={14} /> Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-stone-900">Approve Session</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApprove} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="zoomLink">Zoom Meeting Link</Label>
              <Input
                id="zoomLink"
                name="zoomLink"
                type="url"
                required
                placeholder="https://zoom.us/j/..."
                className="border-cream-300 focus-visible:ring-primary-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="approveNotes">Notes (Optional)</Label>
              <Textarea
                id="approveNotes"
                name="therapistNotes"
                placeholder="Any notes for the client..."
                className="border-cream-300 focus-visible:ring-primary-500 min-h-[80px]"
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{errorMsg}</p>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-cream-100">
              <Button type="button" variant="outline" onClick={() => setApproveOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary-600 hover:bg-primary-700 text-white">
                {isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                Confirm Approval
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-stone-900">Reject Payment Proof</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleReject} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="rejectNotes">Reason for Rejection</Label>
              <Textarea
                id="rejectNotes"
                name="therapistNotes"
                required
                placeholder="Please explain why the payment proof was rejected..."
                className="border-cream-300 focus-visible:ring-primary-500 min-h-[100px]"
              />
            </div>
            {errorMsg && (
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-100">{errorMsg}</p>
            )}
            <div className="flex justify-end gap-3 pt-4 border-t border-cream-100">
              <Button type="button" variant="outline" onClick={() => setRejectOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" variant="destructive" disabled={isPending}>
                {isPending && <Loader2 size={16} className="animate-spin mr-2" />}
                Reject Proof
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
