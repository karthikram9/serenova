-- ============================================================
-- SERENOVA DATABASE SCHEMA
-- Version: 1.0
-- ============================================================

-- ── EXTENSIONS ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('client', 'therapist', 'admin');
CREATE TYPE session_type AS ENUM (
  'individual_therapy',
  'relationship_counseling',
  'emotional_wellness'
);
CREATE TYPE booking_status AS ENUM (
  'pending_payment',
  'payment_submitted',
  'confirmed',
  'completed',
  'cancelled',
  'rescheduled'
);
CREATE TYPE payment_status AS ENUM (
  'pending',
  'submitted',
  'verified',
  'failed'
);
CREATE TYPE message_retention AS ENUM (
  '7_days',
  '30_days',
  '90_days',
  'permanent'
);

-- ── USERS TABLE ──────────────────────────────────────────────
-- Extends Supabase auth.users
CREATE TABLE public.users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'client',
  full_name     TEXT NOT NULL DEFAULT '',
  email         TEXT NOT NULL UNIQUE,
  avatar_url    TEXT,
  phone         TEXT,
  timezone      TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'te')),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ── THERAPIST PROFILES ───────────────────────────────────────
CREATE TABLE public.therapist_profiles (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  bio                 TEXT NOT NULL DEFAULT '',
  short_bio           TEXT NOT NULL DEFAULT '',
  specializations     TEXT[] NOT NULL DEFAULT '{}',
  credentials         TEXT[] NOT NULL DEFAULT '{}',
  years_experience    INTEGER NOT NULL DEFAULT 0,
  session_duration_min INTEGER NOT NULL DEFAULT 50,
  session_fee_inr     INTEGER NOT NULL DEFAULT 0,
  is_accepting_clients BOOLEAN NOT NULL DEFAULT true,
  cal_username        TEXT,
  cal_event_slug      TEXT,
  availability_config JSONB DEFAULT '{}',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

-- ── BOOKINGS ─────────────────────────────────────────────────
CREATE TABLE public.bookings (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  therapist_id      UUID NOT NULL REFERENCES public.users(id),
  session_type      session_type NOT NULL,
  booking_status    booking_status NOT NULL DEFAULT 'pending_payment',
  payment_status    payment_status NOT NULL DEFAULT 'pending',
  scheduled_at      TIMESTAMPTZ,
  cal_booking_uid   TEXT UNIQUE,
  zoom_link         TEXT,
  client_notes      TEXT,
  therapist_notes   TEXT,
  session_fee_inr   INTEGER NOT NULL DEFAULT 0,
  payment_ref       TEXT,
  is_first_session  BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ── PAYMENT PROOFS ───────────────────────────────────────────
CREATE TABLE public.payment_proofs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id  UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  storage_path TEXT NOT NULL,
  file_name   TEXT NOT NULL,
  file_size   INTEGER NOT NULL,
  upi_ref     TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;

-- ── MESSAGES ─────────────────────────────────────────────────
CREATE TABLE public.messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id   UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  booking_id  UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  content     TEXT NOT NULL CHECK (char_length(content) <= 2000),
  is_read     BOOLEAN NOT NULL DEFAULT false,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT different_users CHECK (sender_id <> receiver_id)
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- ── CONTACT INQUIRIES ────────────────────────────────────────
CREATE TABLE public.contact_inquiries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL CHECK (char_length(name) <= 100),
  email       TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  subject     TEXT NOT NULL CHECK (char_length(subject) <= 200),
  message     TEXT NOT NULL CHECK (char_length(message) <= 2000),
  is_replied  BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- ── AVAILABILITY BLOCKS ──────────────────────────────────────
CREATE TABLE public.availability_blocks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id    UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  start_at        TIMESTAMPTZ NOT NULL,
  end_at          TIMESTAMPTZ NOT NULL,
  is_blocked      BOOLEAN NOT NULL DEFAULT false,
  reason          TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_time_range CHECK (end_at > start_at)
);
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;

-- ── AUDIT LOG ────────────────────────────────────────────────
CREATE TABLE public.audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  table_name  TEXT NOT NULL,
  record_id   UUID,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  INET,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- ── UPDATED_AT TRIGGER ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER therapist_profiles_updated_at
  BEFORE UPDATE ON public.therapist_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── AUTO-CREATE USER ON AUTH SIGNUP ──────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── AUTO-EXPIRE MESSAGE CLEANUP ───────────────────────────────
CREATE OR REPLACE FUNCTION delete_expired_messages()
RETURNS void AS $$
BEGIN
  DELETE FROM public.messages
  WHERE expires_at IS NOT NULL AND expires_at < now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
