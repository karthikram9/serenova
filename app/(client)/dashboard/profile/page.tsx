import { requireClient } from '@/lib/auth/session'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { User, Mail } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

export default async function ClientProfilePage() {
  const { user } = await requireClient()
  const supabase = await createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, avatar_url, email')
    .eq('id', user.id)
    .single()

  if (!profile) return null

  const initials = getInitials(profile.full_name)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl text-stone-900 mb-1">My Profile</h1>
        <p className="text-stone-500 text-sm">
          Your personal information and account details.
        </p>
      </div>

      <div className="card-surface p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
        <Avatar className="h-20 w-20 border-2 border-primary-100 shadow-sm">
          {profile.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} referrerPolicy="no-referrer" />
          ) : null}
          <AvatarFallback className="bg-primary-50 text-primary-700 font-semibold text-xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3 text-stone-800">
            <User size={18} className="text-stone-400" />
            <span className="font-medium text-lg">{profile.full_name}</span>
          </div>
          <div className="flex items-center gap-3 text-stone-800">
            <Mail size={18} className="text-stone-400" />
            <span className="text-stone-600">{profile.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
