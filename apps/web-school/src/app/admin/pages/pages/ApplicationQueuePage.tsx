import { useState, useEffect } from "react";
import { Search, Filter, Eye, UserPlus, CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import { fetchAllApplications, updateApplicationStatus } from "../../services/admin.service";

interface Application {
  id: string;
  referenceNumber: string;
  applicantName: string;
  program: string;
  dateSubmitted: string;
  status: "Pending" | "Accepted" | "Rejected";
}

interface ApplicationQueuePageProps {
  onSelectApplication: (id: string) => void;
}

export function ApplicationQueuePage({ onSelectApplication }: ApplicationQueuePageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [programFilter, setProgramFilter] = useState("All");
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingBulk, setProcessingBulk] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    const res = await fetchAllApplications();
    if (res.data) {
      const mapped: Application[] = res.data.map(app => ({
        id: app.id,
        referenceNumber: app.reference_number || `REF-${app.id.substring(0, 5).toUpperCase()}`,
        applicantName: app.full_name || `${app.first_name} ${app.last_name}`,
        program: app.program || "General Admissions",
        dateSubmitted: app.application_submitted_at 
          ? new Date(app.application_submitted_at).toISOString().split('T')[0]
          : "N/A",
        status: app.status === "Passed" 
          ? "Accepted" 
          : app.status === "Not Accepted" 
            ? "Rejected" 
            : "Pending"
      }));
      setApplications(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const handleBulkApprove = async () => {
    if (selectedApps.length === 0) return;
    if (!confirm(`Are you sure you want to approve the ${selectedApps.length} selected applications?\nThis will generate applicant numbers and send official acceptance emails.`)) return;

    setStatusMessage(null);
    setProcessingBulk(true);
    try {
      await Promise.all(
        selectedApps.map(id => updateApplicationStatus(id, "Passed"))
      );
      setStatusMessage({ type: "success", text: "Selected applications approved successfully." });
      setSelectedApps([]);
      await loadApplications();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Error updating applications: ${err.message}` });
    } finally {
      setProcessingBulk(false);
    }
  };

  const handleBulkReject = async () => {
    if (selectedApps.length === 0) return;
    const reason = prompt(
      `Are you sure you want to reject the ${selectedApps.length} selected applications?\nProvide a brief rejection reason to send to applicants:`,
      "Required admission qualifications not met."
    );
    if (reason === null) return; // User cancelled prompt

    setStatusMessage(null);
    setProcessingBulk(true);
    try {
      await Promise.all(
        selectedApps.map(id => updateApplicationStatus(id, "Not Accepted", reason))
      );
      setStatusMessage({ type: "success", text: "Selected applications rejected successfully." });
      setSelectedApps([]);
      await loadApplications();
    } catch (err: any) {
      setStatusMessage({ type: "error", text: `Error updating applications: ${err.message}` });
    } finally {
      setProcessingBulk(false);
    }
  };

  // Dynamically extract programs and statuses for filters
  const uniquePrograms = Array.from(new Set(applications.map(app => app.program)));
  const programs = ["All", ...uniquePrograms];
  const statuses = ["All", "Pending", "Accepted", "Rejected"];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesProgram = programFilter === "All" || app.program === programFilter;
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const toggleSelection = (id: string) => {
    setSelectedApps(prev =>
      prev.includes(id) ? prev.filter(appId => appId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedApps.length === filteredApplications.length) {
      setSelectedApps([]);
    } else {
      setSelectedApps(filteredApplications.map(app => app.id));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-600 border-amber-200",
      Accepted: "bg-green-50 text-green-600 border-green-200",
      Rejected: "bg-red-50 text-red-600 border-red-200",
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted": return <CheckCircle className="w-4 h-4" />;
      case "Rejected": return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-10">
      {statusMessage && (
        <div
          className={`mb-6 rounded-md border px-4 py-3 text-sm font-medium ${
            statusMessage.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-green-200 bg-green-50 text-green-700"
          }`}
          role={statusMessage.type === "error" ? "alert" : "status"}
        >
          {statusMessage.text}
        </div>
      )}
      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent appearance-none bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status} Status</option>
              ))}
            </select>
          </div>

          {/* Program Filter */}
          <div>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent appearance-none bg-white"
            >
              {programs.map(program => (
                <option key={program} value={program}>{program === "All" ? "All Programs" : program}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedApps.length > 0 && (
        <div className="bg-gradient-to-r from-[#F59E0B] to-[#D97706] rounded-2xl p-4 mb-6 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={selectedApps.length === filteredApplications.length}
              onChange={toggleSelectAll}
              className="w-5 h-5 rounded border-white"
            />
            <span className="font-semibold">{selectedApps.length} selected</span>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleBulkApprove}
              disabled={processingBulk}
              className="px-6 py-2 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {processingBulk ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              Approve Selected
            </button>
            <button 
              onClick={handleBulkReject}
              disabled={processingBulk}
              className="px-6 py-2 bg-white text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {processingBulk ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              Reject Selected
            </button>
          </div>
        </div>
      )}

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-[#F59E0B] animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Fetching live applications from backend...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No applicant profiles found matching filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApps.length === filteredApplications.length && filteredApplications.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Program Applied</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Submitted</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedApps.includes(app.id)}
                        onChange={() => toggleSelection(app.id)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{app.referenceNumber}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white font-semibold">
                          {app.applicantName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{app.applicantName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.program}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.dateSubmitted}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onSelectApplication(app.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-colors"
                          title="Assign Reviewer"
                        >
                          <UserPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
