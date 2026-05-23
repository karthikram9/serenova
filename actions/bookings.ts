'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient, createAdminClient } from '@/lib/supabase/server'
import { requireAuth, requireClient, requireTherapist } from '@/lib/auth/session'
import { config } from '@/lib/config'
import { hasActiveBookingAt } from '@/lib/db/bookings'
import { approvalSchema, createBookingSchema, paymentProofSchema, rejectionSchema, signedUrlSchema } from '@/lib/validation/booking'
import { createPaymentProofSignedUrl, removePaymentProof, uploadPaymentProof, validatePaymentProofFile } from '@/lib/storage/uploads'
import { sendBookingConfirmationEmail, sendBookingApprovedEmail, sendBookingRejectedEmail, sendTherapistNotification } from '@/lib/email/resend'

type ActionResult<T extends object = object> = ({ success: true } & T) | { error: string }

const revalidateAll = () => ['/book', '/dashboard/sessions', '/dashboard/admin/bookings'].forEach(p => revalidatePath(p))

export async function createBooking(formData: FormData): Promise<ActionResult<{ bookingId: string }>> {
  const { user, profile } = await requireClient()
  const parsed = createBookingSchema.safeParse({
    sessionType: formData.get('sessionType'),
    scheduledAt: formData.get('scheduledAt'),
    clientNotes: formData.get('clientNotes') || undefined,
    idempotencyKey: formData.get('idempotencyKey'),
  })
  if (!parsed.success) return { error: 'Please check the booking details.' }

  const scheduledAt = new Date(parsed.data.scheduledAt)
  if (Number.isNaN(scheduledAt.getTime()) || scheduledAt <= new Date()) return { error: 'Choose a future session time.' }

  const supabase = await createServerSupabaseClient()
  const therapistId = config.therapist.userId
  const normalizedScheduledAt = scheduledAt.toISOString()
  const calBookingUid = `manual:${parsed.data.idempotencyKey}`

  try {
    if (await hasActiveBookingAt(supabase, therapistId, normalizedScheduledAt)) {
      return { error: 'That time is no longer available. Please choose another slot.' }
    }
  } catch { return { error: 'Unable to verify availability.' } }

  const { data: existing } = await supabase.from('bookings').select('id').eq('client_id', user.id).eq('cal_booking_uid', calBookingUid).maybeSingle()
  if (existing?.id) return { success: true, bookingId: existing.id as string }

  const { data, error } = await supabase.from('bookings').insert({
    client_id: user.id,
    therapist_id: therapistId,
    session_type: parsed.data.sessionType,
    scheduled_at: normalizedScheduledAt,
    cal_booking_uid: calBookingUid,
    client_notes: parsed.data.clientNotes ?? null,
    booking_status: 'pending_payment',
    payment_status: 'pending',
  }).select('id').single()

  if (error || !data?.id) return { error: 'Failed to create booking. Please try again.' }

  try {
    await sendBookingConfirmationEmail({
      to: profile.email,
      name: profile.full_name,
      bookingId: data.id,
      sessionType: parsed.data.sessionType,
    })
  } catch (err) { console.error('Email error:', err) }

  revalidateAll()
  return { success: true, bookingId: data.id as string }
}

export async function submitPaymentProof(formData: FormData): Promise<ActionResult> {
  const user = await requireAuth()
  const parsed = paymentProofSchema.safeParse({
    bookingId: formData.get('bookingId'),
    upiRef: formData.get('upiRef') || undefined,
  })
  if (!parsed.success) return { error: 'Invalid payment proof request.' }

  const fileResult = await validatePaymentProofFile(formData.get('file') as File | null)
  if ('error' in fileResult) return fileResult

  const supabase = await createServerSupabaseClient()
  const { data: booking } = await supabase.from('bookings').select('id, client_id, booking_status, payment_status')
    .eq('id', parsed.data.bookingId).eq('client_id', user.id).eq('booking_status', 'pending_payment').eq('payment_status', 'pending').single()

  if (!booking) return { error: 'This booking is not ready for payment proof.' }

  const { data: existingProof } = await supabase.from('payment_proofs').select('id').eq('booking_id', parsed.data.bookingId).eq('client_id', user.id).maybeSingle()
  if (existingProof?.id) return { error: 'Payment proof has already been submitted.' }

  const uploaded = await uploadPaymentProof(supabase, fileResult.file, user.id, parsed.data.bookingId, fileResult.extension)
  if ('error' in uploaded) return uploaded

  const { error: insertError } = await supabase.from('payment_proofs').insert({
    booking_id: parsed.data.bookingId,
    client_id: user.id,
    storage_path: uploaded.path,
    file_name: fileResult.file.name.slice(0, 180),
    file_size: fileResult.file.size,
    upi_ref: parsed.data.upiRef ?? null,
  })

  if (insertError) {
    await removePaymentProof(supabase, uploaded.path)
    return { error: 'Failed to record payment proof.' }
  }

  const adminSupabase = await createAdminClient()
  const { data: updated, error: updateError } = await adminSupabase.from('bookings').update({
    booking_status: 'payment_submitted',
    payment_status: 'submitted',
    payment_ref: parsed.data.upiRef ?? null,
  }).eq('id', parsed.data.bookingId).eq('client_id', user.id).eq('booking_status', 'pending_payment').eq('payment_status', 'pending').select('id').single()

  if (updateError || !updated) {
    await adminSupabase.from('payment_proofs').delete().eq('booking_id', parsed.data.bookingId).eq('client_id', user.id)
    await removePaymentProof(supabase, uploaded.path)
    return { error: 'Payment proof could not be applied to this booking.' }
  }

  try {
    await sendTherapistNotification(
      'New payment proof submitted — Serenova',
      `A client has submitted payment proof for booking ${parsed.data.bookingId}. Please review in your dashboard.`
    )
  } catch (err) { console.error('Email error:', err) }

  revalidateAll()
  return { success: true }
}

export async function approveBooking(formData: FormData): Promise<ActionResult> {
  const { user, profile } = await requireTherapist()
  const parsed = approvalSchema.safeParse({
    bookingId: formData.get('bookingId'),
    zoomLink: formData.get('zoomLink'),
    therapistNotes: formData.get('therapistNotes') || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? 'Invalid approval details.' }

  const supabase = profile.role === 'admin' ? await createAdminClient() : await createServerSupabaseClient()
  const { data: proof } = await supabase.from('payment_proofs').select('id').eq('booking_id', parsed.data.bookingId).limit(1).maybeSingle()
  if (!proof?.id) return { error: 'A payment proof is required before approval.' }

  let query = supabase.from('bookings').update({
    booking_status: 'confirmed',
    payment_status: 'verified',
    zoom_link: parsed.data.zoomLink,
    therapist_notes: parsed.data.therapistNotes ?? null,
  }).eq('id', parsed.data.bookingId).eq('booking_status', 'payment_submitted').eq('payment_status', 'submitted')

  if (profile.role !== 'admin') query = query.eq('therapist_id', user.id)

  const { data, error } = await query.select('id, scheduled_at, session_type, client:users!bookings_client_id_fkey(full_name, email)').single()
  if (error || !data) return { error: 'Booking could not be approved.' }

  const row = data as unknown as {
    id: string
    scheduled_at: string
    session_type: string
    client: { full_name: string; email: string } | null
  }

  if (row.client) {
    try {
      await sendBookingApprovedEmail({
        to: row.client.email,
        name: row.client.full_name,
        zoomLink: parsed.data.zoomLink,
        scheduledAt: row.scheduled_at,
        sessionType: row.session_type,
      })
    } catch (err) { console.error('Email error:', err) }
  }

  revalidateAll()
  return { success: true }
}

export async function rejectPaymentProof(formData: FormData): Promise<ActionResult> {
  const { user, profile } = await requireTherapist()
  const parsed = rejectionSchema.safeParse({
    bookingId: formData.get('bookingId'),
    therapistNotes: formData.get('therapistNotes'),
  })
  if (!parsed.success) return { error: 'A rejection note is required.' }

  const supabase = profile.role === 'admin' ? await createAdminClient() : await createServerSupabaseClient()
  let query = supabase.from('bookings').update({
    booking_status: 'cancelled',
    payment_status: 'failed',
    therapist_notes: parsed.data.therapistNotes,
  }).eq('id', parsed.data.bookingId).eq('booking_status', 'payment_submitted').eq('payment_status', 'submitted')

  if (profile.role !== 'admin') query = query.eq('therapist_id', user.id)

  const { data, error } = await query.select('id, scheduled_at, session_type, client:users!bookings_client_id_fkey(full_name, email)').single()
  if (error || !data) return { error: 'Payment proof could not be rejected.' }

  const row = data as unknown as {
    id: string
    scheduled_at: string | null
    session_type: string
    client: { full_name: string; email: string } | null
  }

  if (row.client) {
    try {
      await sendBookingRejectedEmail({
        to: row.client.email,
        name: row.client.full_name,
        sessionType: row.session_type,
        scheduledAt: row.scheduled_at,
        therapistNotes: parsed.data.therapistNotes,
      })
    } catch (err) { console.error('Email error:', err) }
  }

  revalidateAll()
  return { success: true }
}

export async function getPaymentProofSignedUrl(input: unknown): Promise<ActionResult<{ url: string }>> {
  const user = await requireAuth()
  const userSupabase = await createServerSupabaseClient()
  const { data: currentProfile } = await userSupabase.from('users').select('role').eq('id', user.id).single()
  const parsed = signedUrlSchema.safeParse(input)
  if (!parsed.success) return { error: 'Invalid proof request.' }

  const isAdmin = currentProfile?.role === 'admin'
  const supabase = isAdmin ? await createAdminClient() : userSupabase
  const { data: proof } = await supabase.from('payment_proofs').select('storage_path, client_id, bookings!inner(therapist_id)').eq('id', parsed.data.proofId).single()
  if (!proof) return { error: 'Payment proof not found.' }

  const row = proof as unknown as {
    storage_path: string
    client_id: string
    bookings: { therapist_id: string } | { therapist_id: string }[]
  }
  const booking = Array.isArray(row.bookings) ? row.bookings[0] : row.bookings
  if (!booking) return { error: 'Payment proof not found.' }

  if (!isAdmin && row.client_id !== user.id && booking.therapist_id !== user.id) return { error: 'Unauthorized.' }

  const signed = await createPaymentProofSignedUrl(supabase, row.storage_path)
  if ('error' in signed) return signed
  return { success: true, url: signed.url }
}
