'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TooltipProps } from 'recharts'

const data = [
  { month: 'Aug', enrolled: 3200, newStudents: 320 },
  { month: 'Sep', enrolled: 3400, newStudents: 200 },
  { month: 'Oct', enrolled: 3500, newStudents: 100 },
  { month: 'Nov', enrolled: 3520, newStudents: 20 },
  { month: 'Dec', enrolled: 3500, newStudents: 0 },
  { month: 'Jan', enrolled: 3600, newStudents: 380 },
  { month: 'Feb', enrolled: 3720, newStudents: 120 },
  { month: 'Mar', enrolled: 3780, newStudents: 60 },
  { month: 'Apr', enrolled: 3842, newStudents: 62 },
]

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[#F59E0B] font-bold text-xs mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-white/50">{p.name === 'enrolled' ? 'Enrolled' : 'New Students'}:</span>
          <span className="text-white font-semibold">{(p.value ?? 0).toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export function AnalyticsChart() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-bold text-gray-900">Student Analytics</h3>
          <p className="text-xs text-gray-400 mt-0.5">Enrollment trends this academic year</p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-50 rounded-xl p-1 border border-gray-100">
          <button className="text-[11px] px-3 py-1.5 rounded-lg bg-[#F59E0B] text-black font-bold shadow-sm">
            Monthly
          </button>
          <button className="text-[11px] px-3 py-1.5 rounded-lg text-gray-500 hover:bg-white transition-colors font-medium">
            Semestral
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-[#F59E0B] rounded-full" />
          <span className="text-[11px] text-gray-500">Enrolled</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-indigo-400 rounded-full" />
          <span className="text-[11px] text-gray-500">New Students</span>
        </div>
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="enrolledGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="newStudentsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="enrolled"
              stroke="#F59E0B"
              strokeWidth={2.5}
              fill="url(#enrolledGradient)"
              dot={false}
              activeDot={{ r: 5, fill: '#F59E0B', strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="newStudents"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#newStudentsGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#818cf8', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
