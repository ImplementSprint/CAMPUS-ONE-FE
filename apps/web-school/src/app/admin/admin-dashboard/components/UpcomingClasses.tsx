import { Clock, MapPin, ChevronRight, Users } from 'lucide-react'

const classes = [
  {
    id: 1,
    subject: 'Data Structures & Algorithms',
    code: 'CS 201',
    professor: 'Prof. Santos',
    time: '7:30 – 9:00 AM',
    room: 'Lab 302',
    enrolled: 35,
    color: 'bg-blue-500',
    status: 'ongoing',
  },
  {
    id: 2,
    subject: 'Calculus III',
    code: 'MATH 301',
    professor: 'Prof. Reyes',
    time: '9:00 – 10:30 AM',
    room: 'Rm 205',
    enrolled: 42,
    color: 'bg-violet-500',
    status: 'upcoming',
  },
  {
    id: 3,
    subject: 'Technical Writing',
    code: 'ENGL 101',
    professor: 'Prof. Cruz',
    time: '10:30 AM – 12:00 NN',
    room: 'Rm 118',
    enrolled: 38,
    color: 'bg-emerald-500',
    status: 'upcoming',
  },
  {
    id: 4,
    subject: 'Physics for Engineers',
    code: 'PHYS 201',
    professor: 'Prof. Lim',
    time: '1:00 – 2:30 PM',
    room: 'Lab 101',
    enrolled: 40,
    color: 'bg-amber-500',
    status: 'upcoming',
  },
]

export function UpcomingClasses() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Today&apos;s Classes</h3>
          <p className="text-[11px] text-gray-400">Thursday, May 15, 2025</p>
        </div>
        <button className="text-[11px] text-[#F59E0B] font-semibold flex items-center gap-0.5 hover:underline">
          Full schedule <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`relative rounded-xl border p-4 cursor-pointer hover:shadow-md transition-all duration-200 overflow-hidden ${
              cls.status === 'ongoing'
                ? 'border-[#F59E0B]/30 bg-amber-50/50'
                : 'border-gray-100 bg-gray-50/50 hover:bg-white'
            }`}
          >
            {cls.status === 'ongoing' && (
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wide">
                  Live
                </span>
              </div>
            )}
            <div className={`w-1.5 h-8 ${cls.color} rounded-full mb-3`} />
            <p className="text-xs font-bold text-gray-900 leading-snug pr-8">{cls.subject}</p>
            <p className="text-[10px] text-gray-400 font-mono mt-1">{cls.code}</p>
            <p className="text-[11px] text-gray-600 mt-2 font-medium">{cls.professor}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Clock className="w-3 h-3" />
                {cls.time}
              </div>
            </div>
            <div className="flex items-center justify-between mt-1.5">
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <MapPin className="w-3 h-3" />
                {cls.room}
              </div>
              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                <Users className="w-3 h-3" />
                {cls.enrolled}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
