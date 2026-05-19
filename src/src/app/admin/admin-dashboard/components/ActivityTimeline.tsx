import { UserPlus, BookOpen, Award, FileText, AlertCircle, CheckCircle } from 'lucide-react'

const activities = [
  {
    id: 1,
    title: 'New enrollment confirmed',
    detail: 'Maria Santos enrolled in BSCS 3rd Year',
    time: '2 min ago',
    icon: UserPlus,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Grades submitted',
    detail: 'Prof. Reyes submitted grades for MATH 301',
    time: '15 min ago',
    icon: Award,
    color: 'bg-[#F59E0B]',
  },
  {
    id: 3,
    title: 'New course created',
    detail: 'AI in Education (CSAI 401) added to curriculum',
    time: '1 hr ago',
    icon: BookOpen,
    color: 'bg-violet-500',
  },
  {
    id: 4,
    title: 'Document request approved',
    detail: 'Transcript of records approved for Juan Dela Cruz',
    time: '2 hrs ago',
    icon: CheckCircle,
    color: 'bg-emerald-500',
  },
  {
    id: 5,
    title: 'Incomplete grade flagged',
    detail: '3 students have incomplete marks in PHYS 201',
    time: '3 hrs ago',
    icon: AlertCircle,
    color: 'bg-red-500',
  },
  {
    id: 6,
    title: 'Announcement published',
    detail: 'Finals schedule posted to all students',
    time: '5 hrs ago',
    icon: FileText,
    color: 'bg-gray-400',
  },
]

export function ActivityTimeline() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Activity Feed</h3>
          <p className="text-[11px] text-gray-400">Real-time system activity</p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-[10px] text-emerald-500 font-semibold">Live</span>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gray-100" />
        <div className="space-y-4">
          {activities.map((act) => {
            const Icon = act.icon
            return (
              <div key={act.id} className="flex gap-3 relative group cursor-pointer">
                <div
                  className={`w-8 h-8 rounded-full ${act.color} flex items-center justify-center flex-shrink-0 z-10 shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="min-w-0 flex-1 pt-1 pb-1">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{act.title}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{act.detail}</p>
                  <p className="text-[10px] text-gray-300 mt-1">{act.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <button className="w-full text-xs font-semibold text-gray-400 hover:text-[#F59E0B] transition-colors py-1">
          View full activity log →
        </button>
      </div>
    </div>
  )
}
