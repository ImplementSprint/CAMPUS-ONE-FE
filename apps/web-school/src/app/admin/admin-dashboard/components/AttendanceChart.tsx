'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const data = [
  { day: 'Mon', rate: 88 },
  { day: 'Tue', rate: 92 },
  { day: 'Wed', rate: 85 },
  { day: 'Thu', rate: 90 },
  { day: 'Fri', rate: 78 },
  { day: 'Sat', rate: 65 },
]

type AttendanceTooltipProps = {
  active?: boolean;
  payload?: Array<{ value?: number | string }>;
  label?: string | number;
};

function CustomTooltip({ active, payload, label }: AttendanceTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[#F59E0B] font-bold text-xs mb-1.5">{label}</p>
      <div className="flex items-center gap-2 text-xs">
        <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
        <span className="text-white/50">Attendance:</span>
        <span className="text-white font-bold">{payload[0]?.value}%</span>
      </div>
    </div>
  )
}

const avg = Math.round(data.reduce((s, d) => s + d.rate, 0) / data.length)

export function AttendanceChart() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-full flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900">Attendance</h3>
          <p className="text-xs text-gray-400 mt-0.5">This week&apos;s daily rate</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-[11px] font-bold px-3 py-1.5 rounded-xl">
          Avg {avg}%
        </div>
      </div>

      {/* Progress rings alternative: circular mini stats */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { label: 'Present', value: '3,342', color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Absent', value: '500', color: 'text-red-500', bg: 'bg-red-50' },
          { label: 'Late', value: '120', color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl px-3 py-2.5 text-center`}>
            <p className={`font-black text-base ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: -28, bottom: 0 }} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              unit="%"
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb', radius: 6 }} />
            <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.rate >= 85 ? '#F59E0B' : entry.rate >= 75 ? '#fbbf24' : '#e5e7eb'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-[#F59E0B]" />
          <span className="text-[10px] text-gray-400">&ge;85% (Good)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-amber-300" />
          <span className="text-[10px] text-gray-400">75–84%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-sm bg-gray-200" />
          <span className="text-[10px] text-gray-400">&lt;75% (Low)</span>
        </div>
      </div>
    </div>
  )
}
