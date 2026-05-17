'use client'
import { useState, useEffect } from "react";
import { UnifiedAdminLayout } from "../../components/UnifiedAdminLayout";
import { StudentList } from "../../components/StudentList";
import { StudentDetail } from "../../components/StudentDetail";
import { CheckCircle, XCircle, Clock, GraduationCap, BookOpen, ClipboardList, Award, AlertTriangle, BarChart2, Library, HeadphonesIcon, BellRing, Search } from "lucide-react";
import { fetchStudentStats, fetchEnrollments, fetchGrades, fetchDeficiencies, fetchSubjects, fetchServiceRequests, fetchReportStats, type StudentStats } from "@/admin/services/student-admin.service";

type StudentView = "dashboard" | "directory" | "enrollment" | "academics" | "honors" | "clearance" | "reports" | "catalog" | "requests" | "notifications" | "detail";

function DataTable({ columns, rows, loading, emptyMessage }: { columns: string[]; rows: (string | number | null)[][]; loading: boolean; emptyMessage: string; }) {
  if (loading) return <div className="flex items-center justify-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F59E0B]"></div></div>;
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {rows.length === 0 ? <div className="text-center py-20 text-gray-500 text-sm">{emptyMessage}</div> : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200"><tr>{columns.map(c => <th key={c} className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">{c}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-100">{rows.map((row, i) => <tr key={i} className="hover:bg-gray-50">{row.map((cell, j) => <td key={j} className="px-6 py-4 text-sm text-gray-900">{cell ?? '—'}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EnrollmentPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchEnrollments().then(r => { if (r.data) setData(r.data); setLoading(false); }); }, []);
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-900 mb-6">Enrollment Center</h2><DataTable loading={loading} emptyMessage="No enrollment records found" columns={['Student Number', 'Full Name', 'Email', 'Level', 'Status', 'Enrolled Date']} rows={data.map(s => [s.student_number, s.full_name, s.email, s.school_level, s.enrollment_status, s.enrolled_at ? new Date(s.enrolled_at).toLocaleDateString() : '—'])} /></div>;
}

function AcademicsPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchGrades().then(r => { if (r.data) setData(r.data); setLoading(false); }); }, []);
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-900 mb-6">Academic Hub</h2><DataTable loading={loading} emptyMessage="No grade records found" columns={['Student ID', 'Subject Code', 'Score', 'Remarks']} rows={data.map((g: any) => [g.student_id, g.subject_code, g.score, g.remarks])} /></div>;
}

function HonorsPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchGrades().then(r => { if (r.data) setData(r.data); setLoading(false); }); }, []);
  const passed = data.filter((g: any) => g.remarks !== 'Failed' && g.score != null);
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-900 mb-2">Honors Tracker</h2><p className="text-sm text-gray-500 mb-6">Students with passing grades eligible for Latin Honors review</p><DataTable loading={loading} emptyMessage="No honors data found" columns={['Student ID', 'Subject Code', 'Score', 'Remarks']} rows={passed.map((g: any) => [g.student_id, g.subject_code, g.score, g.remarks ?? 'Passed'])} /></div>;
}

function ClearancePanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchDeficiencies().then(r => { if (r.data) setData(r.data); setLoading(false); }); }, []);
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-900 mb-2">Clearance & Deficiencies</h2><p className="text-sm text-gray-500 mb-6">Students with failed subjects or missing grades</p><DataTable loading={loading} emptyMessage="No deficiencies found — all students are clear" columns={['Student ID', 'Subject Code', 'Score', 'Remarks']} rows={data.map((g: any) => [g.student_id, g.subject_code, g.score, g.remarks])} /></div>;
}

function ReportsPanel() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchReportStats().then(r => { if (r.data) setStats(r.data); setLoading(false); }); }, []);
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports</h2>
      {loading ? <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F59E0B]"></div></div> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[{ label: 'Total Students', value: stats?.total ?? 0 }, { label: 'College', value: stats?.college ?? 0 }, { label: 'Senior High School', value: stats?.shs ?? 0 }, { label: 'Irregular Students', value: stats?.irregular ?? 0 }].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm text-center"><p className="text-4xl font-bold text-gray-900 mb-2">{value}</p><p className="text-sm text-gray-600">{label}</p></div>
          ))}
        </div>
      )}
    </div>
  );
}

function CatalogPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => { fetchSubjects().then(r => { if (r.data) setData(r.data); setLoading(false); }); }, []);
  const filtered = data.filter(s => s.subject_code?.toLowerCase().includes(search.toLowerCase()) || s.subject_name?.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Subject Catalog</h2>
      <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /><input type="text" placeholder="Search subjects..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" /></div>
      <DataTable loading={loading} emptyMessage="No subjects found" columns={['Subject Code', 'Subject Name', 'Units', 'Department', 'Prerequisites']} rows={filtered.map(s => [s.subject_code, s.subject_name, s.units, s.department ?? '—', s.prerequisites ?? '—'])} />
    </div>
  );
}

function RequestsPanel() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetchServiceRequests().then(r => { if (r.data) setData(r.data); setLoading(false); }); }, []);
  return <div className="p-8"><h2 className="text-2xl font-bold text-gray-900 mb-6">Service Requests</h2><DataTable loading={loading} emptyMessage="No service requests found" columns={['Student ID', 'Document Type', 'Status', 'Requested At']} rows={data.map((r: any) => [r.student_id, r.document_type, r.status, r.created_at ? new Date(r.created_at).toLocaleDateString() : '—'])} /></div>;
}

function NotificationsPanel() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Center</h2>
      <p className="text-sm text-gray-500 mb-6">Send announcements to students</p>
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm max-w-2xl">
        <div className="space-y-4">
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label><input type="text" placeholder="Announcement subject..." className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" /></div>
          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Message</label><textarea rows={5} placeholder="Write your announcement here..." className="w-full px-4 py-3 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] resize-none" /></div>
          <button className="px-6 py-3 bg-[#F59E0B] text-white font-semibold rounded-xl hover:bg-[#D97706] transition-colors">Send Announcement</button>
        </div>
      </div>
    </div>
  );
}

export function StudentAdminDashboard() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [view, setView] = useState<StudentView>("dashboard");
  const [stats, setStats] = useState<StudentStats>({ total: 0, active: 0, inactive: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchStudentStats();
    if (result.data) setStats(result.data);
    setLoading(false);
  };

  const currentView = selectedStudentId ? "detail" : view;
  const handleNavigate = (newView: string) => { setView(newView as StudentView); setSelectedStudentId(null); };

  const quickActions = [
    { id: "directory",  label: "Student Directory",       desc: "Search and manage student profiles",      icon: GraduationCap },
    { id: "enrollment", label: "Enrollment Center",        desc: "Manage subject loading and schedules",    icon: ClipboardList },
    { id: "academics",  label: "Academic Hub",             desc: "View rosters and grade progress",         icon: BookOpen },
    { id: "honors",     label: "Honors Tracker",           desc: "Monitor Latin Honors eligibility",        icon: Award },
    { id: "clearance",  label: "Clearance & Deficiencies", desc: "Check missing grades or failed subjects", icon: AlertTriangle },
    { id: "reports",    label: "Reports",                  desc: "Generate enrollment statistics",          icon: BarChart2 },
  ];

  const renderContent = () => {
    if (selectedStudentId) return <div className="p-8"><StudentDetail studentId={selectedStudentId} onBack={() => { setSelectedStudentId(null); loadStats(); }} /></div>;
    switch (view) {
      case "directory":     return <StudentList onSelectStudent={id => setSelectedStudentId(id)} onRefresh={loadStats} onBack={() => setView("dashboard")} />;
      case "enrollment":    return <EnrollmentPanel />;
      case "academics":     return <AcademicsPanel />;
      case "honors":        return <HonorsPanel />;
      case "clearance":     return <ClearancePanel />;
      case "reports":       return <ReportsPanel />;
      case "catalog":       return <CatalogPanel />;
      case "requests":      return <RequestsPanel />;
      case "notifications": return <NotificationsPanel />;
      default: return (
        <div className="p-10">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="relative"><div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#F59E0B] mx-auto"></div><div className="absolute inset-0 flex items-center justify-center"><GraduationCap className="w-6 h-6 text-[#F59E0B]" /></div></div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: stats.total, icon: GraduationCap, textColor: 'text-gray-900', badgeColor: 'text-blue-600 bg-blue-50', badge: 'All', iconBg: 'from-blue-500 to-blue-600' },
                  { label: 'Active', value: stats.active, icon: CheckCircle, textColor: 'text-green-600', badgeColor: 'text-green-600 bg-green-50', badge: 'Active', iconBg: 'from-green-500 to-green-600' },
                  { label: 'Inactive', value: stats.inactive, icon: XCircle, textColor: 'text-gray-600', badgeColor: 'text-gray-600 bg-gray-50', badge: 'Inactive', iconBg: 'from-gray-500 to-gray-600' },
                  { label: 'Pending Activation', value: stats.pending, icon: Clock, textColor: 'text-amber-600', badgeColor: 'text-amber-600 bg-amber-50', badge: 'Pending', iconBg: 'from-amber-500 to-amber-600' },
                ].map(({ label, value, icon: Icon, textColor, badgeColor, badge, iconBg }) => (
                  <div key={label} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-gradient-to-br ${iconBg} rounded-xl shadow-lg`}><Icon className="w-6 h-6 text-white" /></div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeColor}`}>{badge}</span>
                    </div>
                    <p className={`text-4xl font-bold ${textColor} mb-1`}>{value}</p>
                    <p className="text-sm font-medium text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="mb-6"><h3 className="text-xl font-bold text-gray-900">Quick Actions</h3><p className="text-sm text-gray-500 mt-1">Common tasks and shortcuts</p></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {quickActions.map(({ id, label, desc, icon: Icon }) => (
                    <button key={id} onClick={() => setView(id as StudentView)} className="group flex items-center justify-between p-5 border-2 border-gray-200 rounded-2xl hover:border-[#F59E0B] hover:shadow-lg transition-all duration-300 text-left">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-[#F59E0B] transition-all duration-300"><Icon className="w-5 h-5 text-[#F59E0B] group-hover:text-white transition-colors" /></div>
                        <div><p className="font-bold text-gray-900 text-sm">{label}</p><p className="text-xs text-gray-500 mt-0.5">{desc}</p></div>
                      </div>
                      <span className="text-gray-300 group-hover:text-[#F59E0B] group-hover:translate-x-1 transition-all duration-300">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <UnifiedAdminLayout currentPortal="student" currentView={currentView} onNavigate={handleNavigate}>
      {renderContent()}
    </UnifiedAdminLayout>
  );
}
