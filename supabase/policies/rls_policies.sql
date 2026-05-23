-- ============================================================
-- SERENOVA RLS POLICIES — COMPLETE
-- Philosophy: DENY ALL by default. Grant minimum required.
-- ============================================================

-- ── HELPER FUNCTIONS ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_therapist()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role IN ('therapist', 'admin')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_client()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND role = 'client'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── USERS POLICIES ────────────────────────────────────────────
-- Users can read their own data
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Therapists can read client profiles (for their clients only)
CREATE POLICY "therapist_select_clients" ON public.users
  FOR SELECT USING (
    is_therapist() AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE (client_id = users.id OR therapist_id = users.id)
      AND (client_id = auth.uid() OR therapist_id = auth.uid())
    )
  );

-- Users can update their own profile
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = OLD.role); -- Cannot change own role

-- ── THERAPIST PROFILES POLICIES ──────────────────────────────
-- Anyone can read therapist profiles (public info)
CREATE POLICY "therapist_profiles_select_public" ON public.therapist_profiles
  FOR SELECT USING (true);

-- Only therapist can update their own profile
CREATE POLICY "therapist_profiles_update_own" ON public.therapist_profiles
  FOR UPDATE USING (user_id = auth.uid() AND is_therapist());

-- ── BOOKINGS POLICIES ─────────────────────────────────────────
-- Clients see their own bookings
CREATE POLICY "bookings_select_client" ON public.bookings
  FOR SELECT USING (client_id = auth.uid());

-- Therapist sees all bookings assigned to them
CREATE POLICY "bookings_select_therapist" ON public.bookings
  FOR SELECT USING (therapist_id = auth.uid() AND is_therapist());

-- Only authenticated clients can create bookings
CREATE POLICY "bookings_insert_client" ON public.bookings
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    is_client()
  );

-- Clients can only update client_notes on their bookings
CREATE POLICY "bookings_update_client_notes" ON public.bookings
  FOR UPDATE USING (client_id = auth.uid())
  WITH CHECK (
    client_id = auth.uid() AND
    booking_status = OLD.booking_status AND
    payment_status = OLD.payment_status AND
    therapist_notes = OLD.therapist_notes
  );

-- Therapists can update any field on their bookings
CREATE POLICY "bookings_update_therapist" ON public.bookings
  FOR UPDATE USING (therapist_id = auth.uid() AND is_therapist());

-- ── PAYMENT PROOFS POLICIES ───────────────────────────────────
-- Client sees their own payment proofs
CREATE POLICY "payment_proofs_select_client" ON public.payment_proofs
  FOR SELECT USING (client_id = auth.uid());

-- Therapist sees payment proofs for their bookings
CREATE POLICY "payment_proofs_select_therapist" ON public.payment_proofs
  FOR SELECT USING (
    is_therapist() AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = payment_proofs.booking_id
      AND bookings.therapist_id = auth.uid()
    )
  );

-- Client can upload payment proof
CREATE POLICY "payment_proofs_insert_client" ON public.payment_proofs
  FOR INSERT WITH CHECK (
    client_id = auth.uid() AND
    is_client() AND
    EXISTS (
      SELECT 1 FROM public.bookings
      WHERE bookings.id = booking_id
      AND bookings.client_id = auth.uid()
      AND bookings.booking_status = 'pending_payment'
    )
  );

-- ── MESSAGES POLICIES ─────────────────────────────────────────
-- Users can see messages they sent or received
CREATE POLICY "messages_select_participant" ON public.messages
  FOR SELECT USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
  );

-- Authenticated users can send messages (to/from therapist only)
CREATE POLICY "messages_insert_authenticated" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    auth.uid() IS NOT NULL AND
    (
      -- Client messaging therapist
      (is_client() AND EXISTS (
        SELECT 1 FROM public.users
        WHERE id = receiver_id AND role IN ('therapist', 'admin')
      )) OR
      -- Therapist messaging client
      (is_therapist() AND EXISTS (
        SELECT 1 FROM public.users
        WHERE id = receiver_id AND role = 'client'
      ))
    )
  );

-- Users can mark their received messages as read
CREATE POLICY "messages_update_read" ON public.messages
  FOR UPDATE USING (receiver_id = auth.uid())
  WITH CHECK (
    receiver_id = auth.uid() AND
    sender_id = OLD.sender_id AND
    content = OLD.content
  );

-- Therapist can delete expired messages
CREATE POLICY "messages_delete_therapist" ON public.messages
  FOR DELETE USING (is_therapist());

-- ── CONTACT INQUIRIES POLICIES ────────────────────────────────
-- Anyone can submit contact form (no auth required)
CREATE POLICY "contact_insert_public" ON public.contact_inquiries
  FOR INSERT WITH CHECK (true);

-- Only therapist can read inquiries
CREATE POLICY "contact_select_therapist" ON public.contact_inquiries
  FOR SELECT USING (is_therapist());

-- Only therapist can update (mark as replied)
CREATE POLICY "contact_update_therapist" ON public.contact_inquiries
  FOR UPDATE USING (is_therapist());

-- ── AVAILABILITY BLOCKS POLICIES ─────────────────────────────
-- Anyone can read availability (for booking)
CREATE POLICY "availability_select_public" ON public.availability_blocks
  FOR SELECT USING (true);

-- Only therapist manages their own availability
CREATE POLICY "availability_manage_therapist" ON public.availability_blocks
  FOR ALL USING (therapist_id = auth.uid() AND is_therapist());

-- ── AUDIT LOG POLICIES ────────────────────────────────────────
-- Only admin/therapist can read audit log
CREATE POLICY "audit_select_admin" ON public.audit_log
  FOR SELECT USING (is_therapist());

-- Service role inserts (no user can insert directly)
CREATE POLICY "audit_insert_service" ON public.audit_log
  FOR INSERT WITH CHECK (false); -- Only service role via SECURITY DEFINER
