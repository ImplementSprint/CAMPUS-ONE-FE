import { Users, GraduationCap, BookOpen, Megaphone, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  {
    label: 'Total Students',
    value: '3,842',
    change: '+124',
    trend: 'up' as const,
    sub: 'vs last semester',
    icon: Users,
    iconColor: 'text-blue-500',
    iconBg: 'bg-blue-50',
    accent: '#3b82f6',
  },
  {
    label: 'Active Professors',
    value: '186',
    change: '+12',
    trend: 'up' as const,
    sub: 'from last year',
    icon: GraduationCap,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
    accent: '#8b5cf6',
  },
  {
    label: 'Active Courses',
    value: '264',
    change: '-8',
    trend: 'down' as const,
    sub: 'discontinued',
    icon: BookOpen,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    accent: '#10b981',
  },
  {
    label: 'Announcements',
    value: '18',
    change: '+3',
    trend: 'up' as const,
    sub: 'this week',
    icon: Megaphone,
    iconColor: 'text-[#F59E0B]',
    iconBg: 'bg-amber-50',
    accent: '#F59E0B',
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        const isUp = stat.trend === 'up'
        return (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group overflow-hidden relative"
          >
            {/* Subtle accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl opacity-60"
              style={{ background: stat.accent }}
            />

            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
              >
                <Icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
              <div
                className={`flex items-center gap-1 text-[10px] font-bold rounded-full px-2 py-1 ${
                  isUp
                    ? 'text-emerald-600 bg-emerald-50'
                    : 'text-red-500 bg-red-50'
                }`}
              >
                {isUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>

            <p className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{stat.sub}</p>
          </div>
        )
      })}
    </div>
  )
}
