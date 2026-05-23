-- ============================================================
-- SERENOVA BOOKING GUARDS
-- Module 6: prevent duplicate active slots and duplicate proofs
-- ============================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_bookings_unique_active_slot
  ON public.bookings (therapist_id, scheduled_at)
  WHERE scheduled_at IS NOT NULL
    AND booking_status IN ('pending_payment', 'payment_submitted', 'confirmed');

CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_proofs_one_per_booking
  ON public.payment_proofs (booking_id);
