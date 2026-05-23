export type SessionType = 
  | 'individual_therapy'
  | 'relationship_counseling'
  | 'emotional_wellness'

export type BookingStatus = 
  | 'pending_payment'
  | 'payment_submitted'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'

export type PaymentStatus = 
  | 'pending'
  | 'submitted'
  | 'verified'
  | 'failed'

export interface Booking {
  id: string
  clientId: string
  therapistId: string
  sessionType: SessionType
  bookingStatus: BookingStatus
  paymentStatus: PaymentStatus
  scheduledAt: string
  zoomLink: string | null
  therapistNotes: string | null
  clientNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface BookingWithClient extends Booking {
  client: {
    fullName: string
    email: string
    avatarUrl: string | null
  }
}

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  individual_therapy:      'Individual Therapy',
  relationship_counseling: 'Relationship Counseling',
  emotional_wellness:      'Emotional Wellness Guidance',
}
