import { requireClient } from '@/lib/auth/session'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export default async function ClientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await requireClient()
  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, avatar_url, email')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <DashboardSidebar user={profile ?? { full_name: '', avatar_url: null, email: '' }} role="client" />
      <main className="flex-1 md:ml-64 p-6 md:p-10">
        {children}
      </main>
    </div>
  )
}
