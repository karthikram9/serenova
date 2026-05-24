/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireClient } from '@/lib/auth/session'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ClientUploadWrapper } from './client-wrapper'

export default async function UploadProofPage({
  searchParams,
}: {
  searchParams: { bookingId?: string }
}) {
  const { user } = await requireClient()
  const supabase = await createServerSupabaseClient()
  
  const bookingId = searchParams.bookingId

  if (!bookingId) {
    redirect('/dashboard')
  }

  // Verify ownership and status via bookings
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, client_id, status')
    .eq('id', bookingId)
    .single()

  if (!booking || booking.client_id !== user.id) {
    redirect('/dashboard')
  }

  if (booking.status !== 'pending_payment') {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <h1 className="text-xl font-display text-stone-800 mb-2">Upload Not Available</h1>
        <p className="text-stone-500 mb-6">This session does not require a payment proof upload at this time. Its current status is: {booking.status.replace('_', ' ')}.</p>
        <Link href={"/dashboard" as any} className="inline-flex items-center px-4 py-2 border border-cream-200 bg-white hover:bg-cream-50 text-stone-700 rounded-lg transition-colors text-sm font-medium">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard" as any} className="p-2 text-stone-500 hover:text-stone-800 hover:bg-cream-50 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl text-stone-900 mb-1">Upload Payment Proof</h1>
          <p className="text-stone-500 text-sm">Please provide a screenshot or PDF of your payment.</p>
        </div>
      </div>

      <div className="card-surface p-6 border border-cream-200">
        <ClientUploadWrapper bookingId={bookingId} />
      </div>
    </div>
  )
}
