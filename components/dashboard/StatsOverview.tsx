import { Users, Calendar, Clock, CheckCircle } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    pendingApproval: number
    confirmedToday: number
    totalClients: number
    totalSessions: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      label: 'Pending Approval',
      value: stats.pendingApproval,
      icon: Clock,
      color: 'text-warm-600',
      bg: 'bg-warm-50',
    },
    {
      label: 'Confirmed Today',
      value: stats.confirmedToday,
      icon: Calendar,
      color: 'text-primary-600',
      bg: 'bg-primary-50',
    },
    {
      label: 'Total Clients',
      value: stats.totalClients,
      icon: Users,
      color: 'text-stone-600',
      bg: 'bg-stone-100',
    },
    {
      label: 'Total Sessions',
      value: stats.totalSessions,
      icon: CheckCircle,
      color: 'text-stone-600',
      bg: 'bg-stone-100',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div key={card.label} className="card-surface p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.bg}`}>
              <Icon size={20} className={card.color} />
            </div>
            <p className="text-stone-500 text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-display text-stone-900 mt-1">{card.value}</p>
          </div>
        )
      })}
    </div>
  )
}
