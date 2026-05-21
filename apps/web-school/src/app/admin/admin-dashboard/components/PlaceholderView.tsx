import type { LucideIcon } from 'lucide-react'
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  Megaphone,
  Settings,
  Search,
  Plus,
} from 'lucide-react'

interface ViewConfig {
  icon: LucideIcon
  label: string
  description: string
  color: string
  bg: string
}

const viewConfig: Record<string, ViewConfig> = {
  students: {
    icon: Users,
    label: 'Students',
    description: 'Manage student accounts, enrollment records, and academic profiles.',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  professors: {
    icon: GraduationCap,
    label: 'Professors',
    description: 'Manage faculty members, teaching loads, and department assignments.',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
  },
  courses: {
    icon: BookOpen,
    label: 'Courses',
    description: 'Manage course catalog, prerequisites, and curriculum structure.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  schedules: {
    icon: Calendar,
    label: 'Schedules',
    description: 'View and configure class schedules, room assignments, and timetables.',
    color: 'text-[#F59E0B]',
    bg: 'bg-amber-50',
  },
  grades: {
    icon: Award,
    label: 'Grades',
    description: 'Access student grade records, generate reports, and track academic progress.',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
  },
  announcements: {
    icon: Megaphone,
    label: 'Announcements',
    description: 'Create and publish announcements to students, faculty, and staff.',
    color: 'text-[#F59E0B]',
    bg: 'bg-amber-50',
  },
  settings: {
    icon: Settings,
    label: 'Settings',
    description: 'Configure system settings, roles, permissions, and integrations.',
    color: 'text-gray-600',
    bg: 'bg-gray-100',
  },
}

const mockRows = [
  { id: 1, col1: 'Item 001', col2: 'Active', col3: 'Category 1', col4: '84 records' },
  { id: 2, col1: 'Item 002', col2: 'Inactive', col3: 'Category 2', col4: '37 records' },
  { id: 3, col1: 'Item 003', col2: 'Pending', col3: 'Category 3', col4: '61 records' },
  { id: 4, col1: 'Item 004', col2: 'Active', col3: 'Category 1', col4: '92 records' },
  { id: 5, col1: 'Item 005', col2: 'Inactive', col3: 'Category 2', col4: '18 records' },
  { id: 6, col1: 'Item 006', col2: 'Pending', col3: 'Category 3', col4: '74 records' },
]

const statusCounts = [284, 241, 18, 25]

interface PlaceholderViewProps {
  view: string
}

export function PlaceholderView({ view }: PlaceholderViewProps) {
  const config = viewConfig[view] ?? viewConfig.settings
  const Icon = config.icon

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${config.bg} rounded-xl flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${config.color}`} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">{config.label}</h2>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-48 focus-within:border-[#F59E0B] transition-colors">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${config.label.toLowerCase()}...`}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>
          <button type="button" className="flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#D97706] text-black text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['Total', 'Active', 'Pending', 'Inactive'] as const).map((label, i) => (
          <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <p className={`text-2xl font-black ${i === 0 ? config.color : 'text-gray-700'}`}>
              {statusCounts[i]}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm">All {config.label}</h3>
          <div className="flex items-center gap-2">
            {(['All', 'Active', 'Inactive'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`text-[11px] px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  f === 'All' ? 'bg-[#F59E0B] text-black' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                {['ID', 'Name', 'Status', 'Category', 'Records', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className={`text-[10px] font-bold text-gray-400 uppercase tracking-wider px-5 py-3 ${
                      h === 'Actions' ? 'text-right' : 'text-left'
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5 text-xs text-gray-400 font-mono">
                    #{String(row.id).padStart(3, '0')}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full ${config.bg} flex items-center justify-center text-[10px] font-bold ${config.color}`}
                      >
                        {row.id.toString().padStart(2, '0')}
                      </div>
                      <span className="text-xs font-semibold text-gray-800">{row.col1}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        row.col2 === 'Active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : row.col2 === 'Pending'
                          ? 'bg-amber-50 text-amber-600'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {row.col2}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{row.col3}</td>
                  <td className="px-5 py-3.5 text-xs text-gray-500">{row.col4}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button type="button" className="text-[11px] text-[#F59E0B] font-semibold hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[11px] text-gray-400">Showing 1–6 of 284 results</p>
          <div className="flex items-center gap-1.5">
            {([1, 2, 3, '...', 47] as (number | string)[]).map((page, i) => (
              <button
                key={i}
                type="button"
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                  page === 1 ? 'bg-[#F59E0B] text-black shadow-sm' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
