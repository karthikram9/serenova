/* eslint-disable @typescript-eslint/no-explicit-any */
import { requireClient } from '@/lib/auth/session'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'

export default async function ProofViewPage({
  params,
}: {
  params: { bookingId: string }
}) {
  const { user } = await requireClient()
  const supabase = await createServerSupabaseClient()

  // 1. Verify ownership via bookings
  const { data: booking } = await supabase
    .from('bookings')
    .select('id, client_id')
    .eq('id', params.bookingId)
    .single()

  if (!booking || booking.client_id !== user.id) {
    redirect('/dashboard')
  }

  // 2. Fetch proof record
  const { data: proof } = await supabase
    .from('payment_proofs')
    .select('storage_path, file_name')
    .eq('booking_id', params.bookingId)
    .single()

  if (!proof) {
    return (
      <div className="max-w-xl mx-auto text-center py-12">
        <h1 className="text-xl font-display text-stone-800 mb-2">No Proof Found</h1>
        <p className="text-stone-500 mb-6">Payment proof has not been uploaded for this session yet.</p>
        <Link href={"/dashboard" as any} className="inline-flex items-center px-4 py-2 border border-cream-200 bg-white hover:bg-cream-50 text-stone-700 rounded-lg transition-colors text-sm font-medium">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  // 3. Generate signed URL
  const { data: signedUrlData, error } = await supabase.storage
    .from('payment-proofs')
    .createSignedUrl(proof.storage_path, 60 * 60) // 1 hour

  if (error || !signedUrlData?.signedUrl) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 text-red-600">
        Error generating secure link. Please try again later.
      </div>
    )
  }

  const isPdf = proof.file_name.toLowerCase().endsWith('.pdf')

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={"/dashboard" as any} className="p-2 text-stone-500 hover:text-stone-800 hover:bg-cream-50 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-2xl text-stone-900 mb-1">Payment Proof</h1>
          <p className="text-stone-500 text-sm">{proof.file_name}</p>
        </div>
      </div>

      <div className="card-surface p-2 border border-cream-200 overflow-hidden bg-stone-50/50 flex flex-col items-center">
        {isPdf ? (
          <iframe 
            src={`${signedUrlData.signedUrl}#view=FitH`} 
            className="w-full h-[600px] rounded-lg border-none"
            title="Payment Proof PDF"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={signedUrlData.signedUrl} 
            alt="Payment Proof" 
            className="max-w-full max-h-[600px] object-contain rounded-lg"
          />
        )}
      </div>

      <div className="flex justify-end">
        <a 
          href={signedUrlData.signedUrl} 
          download={proof.file_name}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 text-white text-sm font-medium rounded-lg hover:bg-stone-900 transition-colors"
        >
          <Download size={16} /> Download Copy
        </a>
      </div>
    </div>
  )
}
