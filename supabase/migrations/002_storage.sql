-- ============================================================
-- SERENOVA STORAGE BUCKETS
-- ============================================================

-- Create private bucket for payment proofs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-proofs',
  'payment-proofs',
  false,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
) ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

-- Storage bucket RLS Policies for payment-proofs
-- Deny all by default
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Clients can upload to payment-proofs
CREATE POLICY "payment_proofs_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'payment-proofs' AND 
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'client'
    )
  );

-- Clients can read their own uploads
CREATE POLICY "payment_proofs_select_own" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND 
    auth.uid() IS NOT NULL AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Therapists/Admins can read all payment proofs
CREATE POLICY "payment_proofs_select_therapist" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'payment-proofs' AND 
    auth.uid() IS NOT NULL AND 
    EXISTS (
      SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('therapist', 'admin')
    )
  );
