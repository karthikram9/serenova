import type { SupabaseClient } from '@supabase/supabase-js'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { Booking, BookingWithClient, PaymentProof } from '@/types/booking'

type DbBooking = {
  id: string
  client_id: string
  therapist_id: string
  session_type: Booking['sessionType']
  booking_status: Booking['bookingStatus']
  payment_status: Booking['paymentStatus']
  scheduled_at: string | null
  cal_booking_uid: string | null
  zoom_link: string | null
  payment_ref: string | null
  session_fee_inr: number
  is_first_session: boolean
  therapist_notes: string | null
  client_notes: string | null
  created_at: string
  updated_at: string
}

type DbPaymentProof = {
  id: string
  booking_id: string
  client_id: string
  storage_path: string
  file_name: string
  file_size: number
  upi_ref: string | null
  submitted_at: string
}

type DbBookingWithClient = DbBooking & {
  client: {
    full_name: string
    email: string
    avatar_url: string | null
  } | null
  payment_proofs: DbPaymentProof[] | null
}

export function mapBooking(row: DbBooking): Booking {
  return {
    id: row.id,
    clientId: row.client_id,
    therapistId: row.therapist_id,
    sessionType: row.session_type,
    bookingStatus: row.booking_status,
    paymentStatus: row.payment_status,
    scheduledAt: row.scheduled_at,
    calBookingUid: row.cal_booking_uid,
    zoomLink: row.zoom_link,
    paymentRef: row.payment_ref,
    sessionFeeInr: row.session_fee_inr,
    isFirstSession: row.is_first_session,
    therapistNotes: row.therapist_notes,
    clientNotes: row.client_notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapPaymentProof(row: DbPaymentProof): PaymentProof {
  return {
    id: row.id,
    bookingId: row.booking_id,
    clientId: row.client_id,
    storagePath: row.storage_path,
    fileName: row.file_name,
    fileSize: row.file_size,
    upiRef: row.upi_ref,
    submittedAt: row.submitted_at,
  }
}

export async function getClientBookings(clientId: string): Promise<Booking[]> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch bookings')
  return (data as DbBooking[]).map(mapBooking)
}

export async function getTherapistBookings(
  therapistId: string,
  status?: Booking['bookingStatus']
): Promise<BookingWithClient[]> {
  const supabase = await createServerSupabaseClient()
  let query = supabase
    .from('bookings')
    .select(`
      *,
      client:users!bookings_client_id_fkey(full_name, email, avatar_url),
      payment_proofs(*)
    `)
    .eq('therapist_id', therapistId)
    .order('scheduled_at', { ascending: true })

  if (status) query = query.eq('booking_status', status)

  const { data, error } = await query
  if (error) throw new Error('Failed to fetch bookings')

  return (data as DbBookingWithClient[]).map((row) => ({
    ...mapBooking(row),
    client: {
      fullName: row.client?.full_name ?? '',
      email: row.client?.email ?? '',
      avatarUrl: row.client?.avatar_url ?? null,
    },
    paymentProofs: (row.payment_proofs ?? []).map(mapPaymentProof),
  }))
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single()

  if (error || !data) return null
  return mapBooking(data as DbBooking)
}

export async function hasActiveBookingAt(
  supabase: SupabaseClient,
  therapistId: string,
  scheduledAt: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .eq('therapist_id', therapistId)
    .eq('scheduled_at', scheduledAt)
    .in('booking_status', ['pending_payment', 'payment_submitted', 'confirmed'])
    .limit(1)

  if (error) throw new Error('Failed to verify availability')
  return (data ?? []).length > 0
}
