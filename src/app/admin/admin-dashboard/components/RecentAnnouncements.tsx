import { Megaphone, ChevronRight, Pin } from 'lucide-react'

const announcements = [
  {
    id: 1,
    title: 'Final Examination Schedule Released',
    body: 'The final examination schedule for Semester 2 AY 2024–2025 has been posted. Please check your respective departments.',
    category: 'Academic',
    time: '2 hours ago',
    priority: 'high',
    pinned: true,
  },
  {
    id: 2,
    title: 'Grade Submission Deadline — April 30',
    body: 'All faculty members must submit final grades no later than April 30, 2025 via the faculty portal.',
    category: 'Faculty',
    time: '5 hours ago',
    priority: 'high',
    pinned: false,
  },
  {
    id: 3,
    title: 'Campus Library Extended Hours During Finals',
    body: 'During finals week, the library will be open 24/7 to support student studying and research.',
    category: 'Facility',
    time: '1 day ago',
    priority: 'normal',
    pinned: false,
  },
  {
    id: 4,
    title: 'Summer Enrollment Opens May 15',
    body: 'Online enrollment for summer classes will begin on May 15. Slots are limited, enroll early.',
    category: 'Enrollment',
    time: '2 days ago',
    priority: 'normal',
    pinned: false,
  },
]

const categoryStyle: Record<string, string> = {
  Academic: 'bg-blue-50 text-blue-700 border-blue-100',
  Faculty: 'bg-violet-50 text-violet-700 border-violet-100',
  Facility: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Enrollment: 'bg-amber-50 text-amber-700 border-amber-100',
}

export function RecentAnnouncements() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center">
            <Megaphone className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Announcements</h3>
            <p className="text-[11px] text-gray-400">Latest campus updates</p>
          </div>
        </div>
        <button className="text-[11px] text-[#F59E0B] font-semibold flex items-center gap-0.5 hover:underline">
          View all <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2 flex-1">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div
              className={`w-1 flex-shrink-0 rounded-full self-stretch ${
                ann.priority === 'high' ? 'bg-[#F59E0B]' : 'bg-gray-200'
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  {ann.pinned && <Pin className="w-3 h-3 text-[#F59E0B] flex-shrink-0" />}
                  <p className="text-xs font-bold text-gray-900 leading-tight truncate">
                    {ann.title}
                  </p>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${
                    categoryStyle[ann.category]
                  }`}
                >
                  {ann.category}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-1">{ann.body}</p>
              <p className="text-[10px] text-gray-300 mt-1.5">{ann.time}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-50">
        <button className="w-full text-xs font-semibold text-gray-400 hover:text-[#F59E0B] transition-colors py-1">
          + Post new announcement
        </button>
      </div>
    </div>
  )
}
