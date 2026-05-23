import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserRole } from '@/types/user'

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function requireAuth() {
  const user = await getSession()
  if (!user) redirect('/login' as never)
  return user
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth()
  const supabase = await createServerSupabaseClient()

  const { data: profile, error } = await supabase
    .from('users')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (error || !profile) redirect('/login' as never)
  if (!allowedRoles.includes(profile.role as UserRole)) redirect('/dashboard' as never)

  return { user, profile }
}

export async function requireTherapist() {
  return requireRole(['therapist', 'admin'])
}

export async function requireClient() {
  return requireRole(['client'])
}
