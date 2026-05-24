'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { requireTherapist } from '@/lib/auth/session'

type ActionResult<T extends object = object> = ({ success: true } & T) | { error: string }

export async function addAvailabilityBlock(formData: FormData): Promise<ActionResult> {
  const { user } = await requireTherapist()
  const startAt = formData.get('startAt') as string
  const endAt = formData.get('endAt') as string
  
  if (!startAt || !endAt || new Date(startAt) >= new Date(endAt)) {
    return { error: 'Invalid time range. End time must be after start time.' }
  }
  
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase.from('availability_blocks').insert({
    therapist_id: user.id,
    start_at: new Date(startAt).toISOString(),
    end_at: new Date(endAt).toISOString(),
    is_blocked: formData.get('isBlocked') === 'true',
    reason: (formData.get('reason') as string) || null,
  })
  
  if (error) {
    console.error('Availability add error:', error)
    return { error: 'Failed to add availability block.' }
  }
  
  revalidatePath('/dashboard/admin/availability')
  return { success: true }
}

export async function deleteAvailabilityBlock(formData: FormData): Promise<ActionResult> {
  const { user } = await requireTherapist()
  const blockId = formData.get('blockId') as string
  
  if (!blockId) return { error: 'Invalid request.' }
  
  const supabase = await createServerSupabaseClient()
  const { error } = await supabase.from('availability_blocks')
    .delete()
    .eq('id', blockId)
    .eq('therapist_id', user.id)
  
  if (error) {
    return { error: 'Failed to delete block.' }
  }
  
  revalidatePath('/dashboard/admin/availability')
  return { success: true }
}
