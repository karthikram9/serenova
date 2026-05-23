import type { SupabaseClient } from '@supabase/supabase-js'

export const PAYMENT_PROOF_BUCKET = 'payment-proofs'
export const MAX_PAYMENT_PROOF_BYTES = 5 * 1024 * 1024

const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
} as const

type AllowedMimeType = keyof typeof ALLOWED_TYPES

export interface ValidatedUpload {
  file: File
  extension: string
}

export async function validatePaymentProofFile(
  file: File | null
): Promise<ValidatedUpload | { error: string }> {
  if (!file) return { error: 'Please choose a payment proof file.' }
  if (file.size <= 0) return { error: 'The selected file is empty.' }
  if (file.size > MAX_PAYMENT_PROOF_BYTES) {
    return { error: 'Payment proof must be 5MB or smaller.' }
  }
  if (!isAllowedMimeType(file.type)) {
    return { error: 'Upload a JPG, PNG, WebP, or PDF file.' }
  }

  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer())
  if (!matchesMagicBytes(file.type, bytes)) {
    return { error: 'The file contents do not match the selected file type.' }
  }

  return { file, extension: ALLOWED_TYPES[file.type] }
}

export async function uploadPaymentProof(
  supabase: SupabaseClient,
  file: File,
  userId: string,
  bookingId: string,
  extension: string
): Promise<{ path: string } | { error: string }> {
  const path = `${userId}/${bookingId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage
    .from(PAYMENT_PROOF_BUCKET)
    .upload(path, file, {
      cacheControl: '0',
      contentType: file.type,
      upsert: false,
    })

  if (error) return { error: 'Failed to upload payment proof.' }
  return { path }
}

export async function removePaymentProof(
  supabase: SupabaseClient,
  path: string
): Promise<void> {
  await supabase.storage.from(PAYMENT_PROOF_BUCKET).remove([path])
}

export async function createPaymentProofSignedUrl(
  supabase: SupabaseClient,
  path: string
): Promise<{ url: string } | { error: string }> {
  const { data, error } = await supabase.storage
    .from(PAYMENT_PROOF_BUCKET)
    .createSignedUrl(path, 300)

  if (error || !data?.signedUrl) {
    return { error: 'Failed to create signed URL.' }
  }
  return { url: data.signedUrl }
}

function isAllowedMimeType(value: string): value is AllowedMimeType {
  return Object.prototype.hasOwnProperty.call(ALLOWED_TYPES, value)
}

function matchesMagicBytes(type: AllowedMimeType, bytes: Uint8Array): boolean {
  if (type === 'image/jpeg') return bytes[0] === 0xff && bytes[1] === 0xd8
  if (type === 'image/png') {
    return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e
  }
  if (type === 'image/webp') {
    return String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
      && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  }
  return bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44
}
