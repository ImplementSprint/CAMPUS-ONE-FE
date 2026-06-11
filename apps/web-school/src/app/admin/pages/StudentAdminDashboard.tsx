'use client';

import { useEffect, useState } from "react";
import { Award, AlertTriangle, BarChart2, BookOpen, CheckCircle, ClipboardList, Clock, GraduationCap, HeadphonesIcon, Library, Search, Users, XCircle, BellRing } from "lucide-react";
import { UnifiedAdminLayout } from "../components/UnifiedAdminLayout";
import { StudentList } from "../components/StudentList";
import { StudentDetail } from "../components/StudentDetail";
import { fetchStudentDetails, fetchStudentStats, type StudentStats } from "../services/student-admin.service";
import { getDeficiencies, getEnrollmentOfferings, getEnrollmentStatus, getGrades, getSubjects } from "@/lib/api";

type StudentView =
  | "dashboard"
  | "directory"
  | "detail"
  | "enrollment"
  | "academics"
  | "honors"
  | "clearance"
  | "reports"
  | "catalog"
  | "requests"
  | "notifications";

type TableValue = string | number | null | undefined;

function DataTable({
  columns,
  rows,
  loading,
  emptyMessage,
}: {
  columns: string[];
  rows: TableValue[][];
  loading: boolean;
  emptyMessage: string;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F59E0B]" />
      </div>
    );
  }

  if (rows.length === 0) {
    return <div className="text-center py-20 text-sm text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th key={column} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-700">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-6 py-4 text-sm text-gray-900">
                  {cell ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StudentSelectionPrompt({ onOpenDirectory }: { onOpenDirectory: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-[#F59E0B]">
        <GraduationCap className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">Select a student first</h3>
      <p className="mt-2 text-sm text-gray-500">
        Use the Student Directory to pick a record before opening academic, honors, or clearance views.
      </p>
      <button
        onClick={onOpenDirectory}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D97706]"
      >
        <Users className="h-4 w-4" />
        Open Directory
      </button>
    </div>
  );
}

function DashboardOverview({
  stats,
  loading,
  onNavigate,
}: {
  stats: StudentStats;
  loading: boolean;
  onNavigate: (view: StudentView) => void;
}) {
  const quickActions = [
    { id: "directory", label: "Student Directory", description: "Search and manage student profiles", icon: GraduationCap },
    { id: "enrollment", label: "Enrollment Center", description: "Review active offerings and schedules", icon: ClipboardList },
    { id: "academics", label: "Academic Hub", description: "View grades and progress summaries", icon: BookOpen },
    { id: "honors", label: "Honors Tracker", description: "Monitor honors eligibility", icon: Award },
    { id: "clearance", label: "Clearance & Deficiencies", description: "Check missing grades or failures", icon: AlertTriangle },
    { id: "reports", label: "Reports", description: "See enrollment and progress reports", icon: BarChart2 },
    { id: "catalog", label: "Subject Catalog", description: "Browse active curriculum subjects", icon: Library },
    { id: "requests", label: "Service Requests", description: "Review student service requests", icon: HeadphonesIcon },
    { id: "notifications", label: "Notification Center", description: "Compose announcements for students", icon: BellRing },
  ] as const;

  return (
    <div className="p-10">
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#F59E0B] mx-auto" />
              <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Students", value: stats.total, icon: GraduationCap, iconBg: "from-blue-500 to-blue-600", textColor: "text-gray-900", badge: "All", badgeColor: "text-blue-600 bg-blue-50" },
              { label: "Active", value: stats.active, icon: CheckCircle, iconBg: "from-green-500 to-green-600", textColor: "text-green-600", badge: "Active", badgeColor: "text-green-600 bg-green-50" },
              { label: "Inactive", value: stats.inactive, icon: XCircle, iconBg: "from-gray-500 to-gray-600", textColor: "text-gray-600", badge: "Inactive", badgeColor: "text-gray-600 bg-gray-50" },
              { label: "Pending Activation", value: stats.pending, icon: Clock, iconBg: "from-amber-500 to-amber-600", textColor: "text-amber-600", badge: "Pending", badgeColor: "text-amber-600 bg-amber-50" },
            ].map(({ label, value, icon: Icon, iconBg, textColor, badge, badgeColor }) => (
              <div key={label} className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#F59E0B] hover:shadow-xl">
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-gradient-to-br from-gray-50 to-transparent opacity-50" />
                <div className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className={`rounded-xl bg-gradient-to-br ${iconBg} p-3 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor}`}>{badge}</span>
                  </div>
                  <p className={`mb-1 text-4xl font-bold ${textColor}`}>{value}</p>
                  <p className="text-sm font-medium text-gray-600">{label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
              <p className="mt-1 text-sm text-gray-500">Common tasks and shortcuts</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quickActions.map(({ id, label, description, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className="group flex items-center justify-between rounded-2xl border-2 border-gray-200 p-5 text-left transition-all duration-300 hover:border-[#F59E0B] hover:shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-amber-50 p-2.5 transition-all duration-300 group-hover:bg-[#F59E0B]">
                      <Icon className="h-5 w-5 text-[#F59E0B] transition-colors group-hover:text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{label}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-400 transition-all duration-300 group-hover:text-[#F59E0B]">Open</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                <p className="mt-1 text-sm text-gray-500">Latest student enrollments and record updates</p>
              </div>
              <button onClick={() => onNavigate("directory")} className="text-sm font-semibold text-[#F59E0B] transition-colors hover:text-[#D97706]">
                View Directory
              </button>
            </div>
            <div className="text-center py-12">
              <GraduationCap className="mx-auto mb-3 h-12 w-12 text-gray-300" />
              <p className="text-sm text-gray-500">Open the Student Directory to review the latest records</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EnrollmentPanel({ selectedStudentId, onOpenDirectory }: { selectedStudentId: string | null; onOpenDirectory: () => void }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TableValue[][]>([]);

  useEffect(() => {
    let active = true;

    async function loadOfferings() {
      if (!selectedStudentId) {
        setRows([]);
        return;
      }

      setLoading(true);
      const offerings = await getEnrollmentOfferings({ studentId: selectedStudentId ?? undefined });
      if (active) {
        setRows((offerings || []).map((offering: any) => [
          offering.subjectCode,
          offering.subjectTitle,
          offering.term,
          offering.section,
          offering.schedule,
          offering.room,
          `${offering.slotsTaken || 0}/${offering.slotsTotal || 0}`,
          offering.isFull ? "Full" : "Open",
        ]));
      }
      if (active) setLoading(false);
    }

    void loadOfferings();

    return () => {
      active = false;
    };
  }, [selectedStudentId]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enrollment Center</h2>
        <p className="mt-1 text-sm text-gray-500">Review student-specific offerings and class availability.</p>
      </div>

      {!selectedStudentId ? (
        <StudentSelectionPrompt onOpenDirectory={onOpenDirectory} />
      ) : (
        <DataTable
          loading={loading}
          emptyMessage="No enrollment offerings found for this student"
          columns={["Subject Code", "Subject Name", "Term", "Section", "Schedule", "Room", "Slots", "Status"]}
          rows={rows}
        />
      )}
    </div>
  );
}

function AcademicPanel({ selectedStudentId, onOpenDirectory }: { selectedStudentId: string | null; onOpenDirectory: () => void }) {
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [gwa, setGwa] = useState("0.00");
  const [totalUnits, setTotalUnits] = useState(0);
  const [rows, setRows] = useState<TableValue[][]>([]);

  useEffect(() => {
    let active = true;

    async function loadGrades() {
      if (!selectedStudentId) {
        setRows([]);
        setStudentName("");
        return;
      }

      setLoading(true);
      const studentResult = await fetchStudentDetails(selectedStudentId);
      const studentData = studentResult.data as any;
      const applicantId = studentData?.applicant_id;

      if (applicantId) {
        const gradesResult = await getGrades(applicantId);
        if (active) {
          setStudentName(gradesResult.studentName || studentData?.applicant_profiles?.full_name || "Student");
          setGwa(gradesResult.gwa || "0.00");
          setTotalUnits(gradesResult.totalUnits || 0);
          setRows((gradesResult.grades || []).map((grade: any) => [
            grade.code,
            grade.subject,
            grade.units,
            grade.grade,
            grade.remarks,
          ]));
        }
      } else if (active) {
        setRows([]);
        setStudentName("");
      }

      if (active) setLoading(false);
    }

    void loadGrades();

    return () => {
      active = false;
    };
  }, [selectedStudentId]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Academic Hub</h2>
        <p className="mt-1 text-sm text-gray-500">View grades and academic standing for a selected student.</p>
      </div>

      {!selectedStudentId ? (
        <StudentSelectionPrompt onOpenDirectory={onOpenDirectory} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Student", value: studentName || "Selected record" },
              { label: "Total Units", value: totalUnits },
              { label: "GWA", value: gwa },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <DataTable
            loading={loading}
            emptyMessage="No grade records found for this student"
            columns={["Subject Code", "Subject Name", "Units", "Grade", "Remarks"]}
            rows={rows}
          />
        </>
      )}
    </div>
  );
}

function HonorsPanel({ selectedStudentId, onOpenDirectory }: { selectedStudentId: string | null; onOpenDirectory: () => void }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TableValue[][]>([]);

  useEffect(() => {
    let active = true;

    async function loadHonors() {
      if (!selectedStudentId) {
        setRows([]);
        return;
      }

      setLoading(true);
      const studentResult = await fetchStudentDetails(selectedStudentId);
      const studentData = studentResult.data as any;
      const applicantId = studentData?.applicant_id;

      if (applicantId) {
        const gradesResult = await getGrades(applicantId);
        const passing = (gradesResult.grades || []).filter((grade: any) => grade.remarks !== "Failed" && grade.grade !== "—");
        if (active) {
          setRows(passing.map((grade: any) => [grade.code, grade.subject, grade.units, grade.grade, grade.remarks]));
        }
      }

      if (active) setLoading(false);
    }

    void loadHonors();

    return () => {
      active = false;
    };
  }, [selectedStudentId]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Honors Tracker</h2>
        <p className="mt-1 text-sm text-gray-500">Monitor students with strong academic performance.</p>
      </div>

      {!selectedStudentId ? (
        <StudentSelectionPrompt onOpenDirectory={onOpenDirectory} />
      ) : (
        <DataTable
          loading={loading}
          emptyMessage="No honors-eligible records found for this student"
          columns={["Subject Code", "Subject Name", "Units", "Grade", "Remarks"]}
          rows={rows}
        />
      )}
    </div>
  );
}

function ClearancePanel({ selectedStudentId, onOpenDirectory }: { selectedStudentId: string | null; onOpenDirectory: () => void }) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<TableValue[][]>([]);

  useEffect(() => {
    let active = true;

    async function loadClearance() {
      if (!selectedStudentId) {
        setRows([]);
        return;
      }

      setLoading(true);
      const studentResult = await fetchStudentDetails(selectedStudentId);
      const studentData = studentResult.data as any;
      const applicantId = studentData?.applicant_id;

      if (applicantId) {
        const deficiencies = await getDeficiencies(applicantId);
        if (active) {
          setRows((deficiencies || []).map((item: any) => [item.code, item.title, item.finalGrade ?? "—", item.remarks ?? "—"]));
        }
      }

      if (active) setLoading(false);
    }

    void loadClearance();

    return () => {
      active = false;
    };
  }, [selectedStudentId]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Clearance &amp; Deficiencies</h2>
        <p className="mt-1 text-sm text-gray-500">Review failed or incomplete subjects that still need attention.</p>
      </div>

      {!selectedStudentId ? (
        <StudentSelectionPrompt onOpenDirectory={onOpenDirectory} />
      ) : (
        <DataTable
          loading={loading}
          emptyMessage="No deficiencies found for this student"
          columns={["Subject Code", "Subject Name", "Final Grade", "Remarks"]}
          rows={rows}
        />
      )}
    </div>
  );
}

function ReportsPanel({
  selectedStudentId,
  onOpenDirectory,
  stats,
}: {
  selectedStudentId: string | null;
  onOpenDirectory: () => void;
  stats: StudentStats;
}) {
  const [loading, setLoading] = useState(false);
  const [reportRows, setReportRows] = useState<TableValue[][]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState<number | null>(null);
  const [totalUnits, setTotalUnits] = useState<number | null>(null);
  const [gwa, setGwa] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    let active = true;

    async function loadReport() {
      if (!selectedStudentId) {
        setReportRows([]);
        setEnrollmentCount(null);
        setTotalUnits(null);
        setGwa(null);
        return;
      }

      setLoading(true);
      const studentResult = await fetchStudentDetails(selectedStudentId);
      const studentData = studentResult.data as any;
      const applicantId = studentData?.applicant_id;

      if (applicantId) {
        const [gradesResult, enrollmentStatus] = await Promise.all([
          getGrades(applicantId),
          getEnrollmentStatus(selectedStudentId),
        ]);

        if (active) {
          setStudentName(gradesResult.studentName || studentData?.applicant_profiles?.full_name || "Student");
          setGwa(gradesResult.gwa || "0.00");
          setTotalUnits(gradesResult.totalUnits || 0);
          setEnrollmentCount(enrollmentStatus.enrollmentCount || 0);
          setReportRows((gradesResult.grades || []).slice(0, 5).map((grade: any) => [grade.code, grade.subject, grade.units, grade.grade, grade.remarks]));
        }
      }

      if (active) setLoading(false);
    }

    void loadReport();

    return () => {
      active = false;
    };
  }, [selectedStudentId]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <p className="mt-1 text-sm text-gray-500">Enrollment and performance summaries.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { label: "Total Students", value: loading ? "..." : stats.total },
          { label: "Active", value: loading ? "..." : stats.active },
          { label: "Inactive", value: loading ? "..." : stats.inactive },
          { label: "Pending", value: loading ? "..." : stats.pending },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {!selectedStudentId ? (
        <StudentSelectionPrompt onOpenDirectory={onOpenDirectory} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Student", value: studentName || "Selected record" },
              { label: "Enrollment Count", value: enrollmentCount ?? 0 },
              { label: "GWA", value: gwa ?? "0.00" },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>

          <DataTable
            loading={loading}
            emptyMessage="No grade rows available for the report preview"
            columns={["Subject Code", "Subject Name", "Units", "Grade", "Remarks"]}
            rows={reportRows}
          />
        </>
      )}
    </div>
  );
}

function CatalogPanel() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [rows, setRows] = useState<TableValue[][]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadSubjects() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const subjects = await getSubjects();
        if (active) {
          setRows((subjects || []).map((subject: any) => [subject.subjectCode, subject.subjectTitle, subject.units, subject.semester, subject.schoolYear]));
        }
      } catch (error: any) {
        if (active) {
          setRows([]);
          setErrorMessage(error?.message || "Unable to load subject catalog right now.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void loadSubjects();

    return () => {
      active = false;
    };
  }, []);

  const filteredRows = rows.filter((row) => {
    const haystack = row.filter(Boolean).join(" ").toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Subject Catalog</h2>
        <p className="mt-1 text-sm text-gray-500">Browse active subjects and curriculum entries.</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by subject code or title..."
          className="w-full rounded-xl border border-gray-300 py-3.5 pl-12 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
        />
      </div>

      <DataTable
        loading={loading}
        emptyMessage={errorMessage || "No active subjects found"}
        columns={["Subject Code", "Subject Name", "Units", "Semester", "School Year"]}
        rows={filteredRows}
      />
    </div>
  );
}

function RequestsPanel() {
  const requestItems = [
    { title: "Transcript Request", description: "Track transcript and record release requests." },
    { title: "Certification Request", description: "Monitor certificates and proof-of-enrollment requests." },
    { title: "Profile Update", description: "Review corrections submitted by students." },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Service Requests</h2>
        <p className="mt-1 text-sm text-gray-500">Process and monitor student requests and support issues.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {requestItems.map((item) => (
          <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900">Request Workflow</h3>
        <p className="mt-2 text-sm text-gray-500">
          This view is restored as a navigation destination. If you want, I can wire it to the specific backend request table or API next.
        </p>
      </div>
    </div>
  );
}

function NotificationsPanel() {
  const announcements = [
    "Enrollment deadlines are approaching this week.",
    "Grade submission for midterms closes Friday.",
    "Subject catalog updates are now live.",
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Notification Center</h2>
        <p className="mt-1 text-sm text-gray-500">Compose announcements and campus-wide notices.</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm max-w-3xl">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Subject</label>
            <input type="text" placeholder="Announcement subject..." className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">Message</label>
            <textarea rows={5} placeholder="Write your announcement here..." className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#F59E0B]" />
          </div>
          <button className="rounded-xl bg-[#F59E0B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D97706]">
            Send Announcement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {announcements.map((announcement) => (
          <div key={announcement} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-700">{announcement}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StudentAdminDashboard() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [view, setView] = useState<StudentView>("dashboard");
  const [stats, setStats] = useState<StudentStats>({ total: 0, active: 0, inactive: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchStudentStats();
    if (result.data) {
      setStats(result.data);
    }
    setLoading(false);
  };

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setView("detail");
  };

  const handleBackFromDetail = () => {
    setSelectedStudentId(null);
    setView("directory");
    void loadStats();
  };

  const handleNavigate = (newView: string) => {
    const nextView = newView as StudentView;
    setView(nextView);

    if (nextView === "dashboard" || nextView === "directory") {
      setSelectedStudentId(null);
    }
  };

  const currentView = view;

  return (
    <UnifiedAdminLayout currentPortal="student" currentView={currentView} onNavigate={handleNavigate}>
      {view === "dashboard" ? (
        <DashboardOverview stats={stats} loading={loading} onNavigate={(nextView) => handleNavigate(nextView)} />
      ) : view === "directory" ? (
        <div className="p-8">
          <StudentList onSelectStudent={handleSelectStudent} onRefresh={loadStats} onBack={() => handleNavigate("dashboard")} />
        </div>
      ) : view === "detail" && selectedStudentId ? (
        <div className="p-8">
          <StudentDetail studentId={selectedStudentId} onBack={handleBackFromDetail} />
        </div>
      ) : view === "enrollment" ? (
        <EnrollmentPanel selectedStudentId={selectedStudentId} onOpenDirectory={() => handleNavigate("directory")} />
      ) : view === "academics" ? (
        <AcademicPanel selectedStudentId={selectedStudentId} onOpenDirectory={() => handleNavigate("directory")} />
      ) : view === "honors" ? (
        <HonorsPanel selectedStudentId={selectedStudentId} onOpenDirectory={() => handleNavigate("directory")} />
      ) : view === "clearance" ? (
        <ClearancePanel selectedStudentId={selectedStudentId} onOpenDirectory={() => handleNavigate("directory")} />
      ) : view === "reports" ? (
        <ReportsPanel selectedStudentId={selectedStudentId} onOpenDirectory={() => handleNavigate("directory")} stats={stats} />
      ) : view === "catalog" ? (
        <CatalogPanel />
      ) : view === "requests" ? (
        <RequestsPanel />
      ) : view === "notifications" ? (
        <NotificationsPanel />
      ) : (
        <DashboardOverview stats={stats} loading={loading} onNavigate={(nextView) => handleNavigate(nextView)} />
      )}
    </UnifiedAdminLayout>
  );
}
