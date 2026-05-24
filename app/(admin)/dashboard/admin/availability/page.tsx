import { requireTherapist } from '@/lib/auth/session'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { AvailabilityManager } from '@/components/dashboard/AvailabilityManager'

export const metadata = {
  title: 'Availability | Admin Dashboard',
}

export default async function AdminAvailabilityPage() {
  const { user } = await requireTherapist()
  const supabase = await createServerSupabaseClient()

  // Fetch current availability blocks for this therapist
  const { data: blocks } = await supabase
    .from('availability_blocks')
    .select('*')
    .eq('therapist_id', user.id)
    .order('start_at', { ascending: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-stone-900 mb-2">Availability</h1>
        <p className="text-stone-500">Manage your schedule blocks and time off.</p>
      </div>
      
      <AvailabilityManager blocks={blocks || []} />
    </div>
  )
}
