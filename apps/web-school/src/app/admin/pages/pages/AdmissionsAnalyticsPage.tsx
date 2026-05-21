import { TrendingUp, TrendingDown, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { DashboardStats } from "../../services/admin.service";

interface AdmissionsAnalyticsPageProps {
  stats: DashboardStats;
}

export function AdmissionsAnalyticsPage({ stats }: AdmissionsAnalyticsPageProps) {
  const weeklyData = [
    { week: "Week 1", applications: 12 },
    { week: "Week 2", applications: 18 },
    { week: "Week 3", applications: 15 },
    { week: "Week 4", applications: 22 },
    { week: "Week 5", applications: 19 },
    { week: "Week 6", applications: 25 },
    { week: "Week 7", applications: 28 },
    { week: "Week 8", applications: 32 },
  ];

  const programData = [
    { program: "Computer Science", count: 45 },
    { program: "Business Admin", count: 38 },
    { program: "Nursing", count: 35 },
    { program: "Engineering", count: 38 },
  ];

  const maxWeekly = Math.max(...weeklyData.map(d => d.applications));
  const maxProgram = Math.max(...programData.map(d => d.count));

  const conversionRate = stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0;
  const rejectionRate = stats.total > 0 ? Math.round((stats.rejected / stats.total) * 100) : 0;
  const pendingRate = stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0;

  return (
    <div className="p-10 space-y-8">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{stats.total}</p>
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-xs text-green-600 font-semibold mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{conversionRate}%</p>
          <p className="text-sm text-gray-600">Acceptance Rate</p>
          <p className="text-xs text-green-600 font-semibold mt-2">↑ 5% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
            <TrendingDown className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">5.2</p>
          <p className="text-sm text-gray-600">Avg Processing Days</p>
          <p className="text-xs text-green-600 font-semibold mt-2">↓ 1.3 days faster</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">{rejectionRate}%</p>
          <p className="text-sm text-gray-600">Rejection Rate</p>
          <p className="text-xs text-red-600 font-semibold mt-2">↑ 2% from last month</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications per Program - Bar Chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Applications per Program</h3>
          <div className="space-y-4">
            {programData.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.program}</span>
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(item.count / maxProgram) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Breakdown - Donut Chart (Simplified) */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Status Breakdown</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="32"
                  strokeDasharray={`${(stats.accepted / stats.total) * 502.4} 502.4`}
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="32"
                  strokeDasharray={`${(stats.pending / stats.total) * 502.4} 502.4`}
                  strokeDashoffset={`-${(stats.accepted / stats.total) * 502.4}`}
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="32"
                  strokeDasharray={`${(stats.rejected / stats.total) * 502.4} 502.4`}
                  strokeDashoffset={`-${((stats.accepted + stats.pending) / stats.total) * 502.4}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-gray-900">{stats.accepted}</p>
              <p className="text-xs text-gray-500">Accepted</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-amber-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-semibold text-gray-900">{stats.rejected}</p>
              <p className="text-xs text-gray-500">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Submissions - Line Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Weekly Application Submissions (Last 8 Weeks)</h3>
        <div className="h-64 flex items-end justify-between gap-4">
          {weeklyData.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: "200px" }}>
                <div
                  className="absolute bottom-0 w-full bg-gradient-to-t from-[#F59E0B] to-[#D97706] rounded-t-lg transition-all duration-500 hover:from-[#D97706] hover:to-[#B45309]"
                  style={{ height: `${(item.applications / maxWeekly) * 100}%` }}
                >
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-900">
                    {item.applications}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-medium">{item.week}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
