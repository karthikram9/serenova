'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function signInWithGoogle() {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url as never)
}

export async function signInWithEmailOTP(formData: FormData) {
  const raw = { email: formData.get('email') as string }
  const parsed = emailSchema.safeParse(raw)

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid email' }
  }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
    },
  })

  if (error) return { error: error.message }
  return { success: true, email: parsed.data.email }
}

export async function verifyEmailOTP(email: string, token: string) {
  const tokenSchema = z.string().length(6).regex(/^\d+$/)
  const parsed = tokenSchema.safeParse(token)
  if (!parsed.success) return { error: 'Invalid OTP format' }

  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token: parsed.data,
    type: 'email',
  })

  if (error) return { error: 'Invalid or expired code. Please try again.' }
  redirect('/dashboard' as never)
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  redirect('/' as never)
}
