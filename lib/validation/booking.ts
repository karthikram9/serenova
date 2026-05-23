import { z } from 'zod'

export const sessionTypeSchema = z.enum([
  'individual_therapy',
  'relationship_counseling',
  'emotional_wellness',
])

const isoDateTimeSchema = z.string().datetime({ offset: true })

export const createBookingSchema = z.object({
  sessionType: sessionTypeSchema,
  scheduledAt: isoDateTimeSchema,
  clientNotes: z.string().trim().max(500).optional(),
  idempotencyKey: z.string().uuid(),
})

export const paymentProofSchema = z.object({
  bookingId: z.string().uuid(),
  upiRef: z
    .string()
    .trim()
    .max(100)
    .regex(/^[a-zA-Z0-9 ._-]*$/, 'UPI reference contains unsupported characters')
    .optional(),
})

export const approvalSchema = z.object({
  bookingId: z.string().uuid(),
  zoomLink: z
    .string()
    .url('Must be a valid URL')
    .regex(/^https:\/\/(?:[a-zA-Z0-9-]+\.)?zoom\.us\/[^\s]+$/, 'Must be a valid Zoom meeting URL starting with https://'),
  therapistNotes: z.string().trim().max(2000).optional(),
})

export const rejectionSchema = z.object({
  bookingId: z.string().uuid(),
  therapistNotes: z.string().trim().min(1).max(2000),
})

export const signedUrlSchema = z.object({
  proofId: z.string().uuid(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type ApprovalInput = z.infer<typeof approvalSchema>
export type RejectionInput = z.infer<typeof rejectionSchema>
