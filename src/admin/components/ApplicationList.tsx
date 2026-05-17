'use client'
import { useState, useEffect } from "react";
import { Search, Eye, ArrowLeft, FileText, ArrowUpDown } from "lucide-react";
import type { AdmissionStatus } from "@/applicant/types/admissions.types";
import { fetchAllApplications, type AdminApplication } from "@/admin/services/admin.service";

interface ApplicationListProps {
  onSelectApplication: (id: string) => void;
  onRefresh?: () => void;
  onBack?: () => void;
}

export function ApplicationList({ onSelectApplication, onRefresh, onBack }: ApplicationListProps) {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    const result = await fetchAllApplications();
    if (result.data) {
      // Sanitize data to ensure no null values in required fields
      const sanitizedData = result.data.map(app => {
        // Construct full_name from individual name fields if full_name is null
        let displayName = app.full_name || "";
        if (!displayName) {
          const parts = [app.first_name, app.middle_name, app.last_name].filter(Boolean);
          displayName = parts.join(" ");
        }
        
        return {
          ...app,
          full_name: displayName || "",
          email: app.email || "",
          reference_number: app.reference_number || "",
        };
      });
      setApplications(sanitizedData);
      if (onRefresh) onRefresh();
    }
    setLoading(false);
  };

  const filteredApplications = applications.filter((app) => {
    try {
      // Ensure all values are strings before calling toLowerCase
      const fullName = String(app?.full_name ?? "");
      const email = String(app?.email ?? "");
      const refNumber = String(app?.reference_number ?? "");
      const search = String(searchTerm ?? "").toLowerCase();
      
      const matchesSearch =
        fullName.toLowerCase().includes(search) ||
        email.toLowerCase().includes(search) ||
        refNumber.toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || app?.status === statusFilter;

      return matchesSearch && matchesStatus;
    } catch (error) {
      console.error("Filter error:", error, app);
      return false;
    }
  }).sort((a, b) => {
    const currentSort = sortBy || "recent";
    switch (currentSort) {
      case "a-z":
        return (a.full_name || "").localeCompare(b.full_name || "");
      case "z-a":
        return (b.full_name || "").localeCompare(a.full_name || "");
      case "recent":
        return new Date(b.application_submitted_at).getTime() - new Date(a.application_submitted_at).getTime();
      case "oldest":
        return new Date(a.application_submitted_at).getTime() - new Date(b.application_submitted_at).getTime();
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: AdmissionStatus) => {
    const styles = {
      "Under Review": "bg-amber-50 text-amber-700 border-amber-200 shadow-sm",
      "Passed": "bg-green-50 text-green-700 border-green-200 shadow-sm",
      "Not Accepted": "bg-red-50 text-red-700 border-red-200 shadow-sm",
    };

    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap ${styles[status]}`}>
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-10">
      {/* Header with Back Button */}
      {onBack && (
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
          >
            <div className="p-2 rounded-lg group-hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold">Back to Dashboard</span>
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Applications</h2>
        <p className="text-base text-gray-600">
          {filteredApplications.length} application{filteredApplications.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="flex gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all appearance-none bg-white cursor-pointer w-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="all">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Passed">Passed</option>
            <option value="Not Accepted">Not Accepted</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent transition-all appearance-none bg-white cursor-pointer w-40"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.75rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem'
            }}
          >
            <option value="" disabled>Sort</option>
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
      </div>

      {/* Application Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-32">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#F59E0B]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#F59E0B]" />
              </div>
            </div>
            <p className="mt-6 text-sm font-medium text-gray-600">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No applications found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/4">
                    Applicant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/6">
                    Reference
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Level
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Submitted
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider w-1/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 w-1/4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center font-bold text-white text-sm shadow-md flex-shrink-0">
                          {(app.full_name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{app.full_name || "N/A"}</p>
                          <p className="text-xs text-gray-500 truncate">{app.email || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 w-1/6">
                      <span className="text-sm font-mono font-medium text-gray-900 whitespace-nowrap">
                        {app.reference_number || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      <span className="text-sm text-gray-900">{app.school_level}</span>
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      <span className="text-sm text-gray-900">{app.applicant_type}</span>
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      <div className="flex items-center">
                        {getStatusBadge(app.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 w-1/12">
                      <span className="text-sm text-gray-600 whitespace-nowrap">{formatDate(app.application_submitted_at)}</span>
                    </td>
                    <td className="px-6 py-4 w-1/12 text-center">
                      <button
                        onClick={() => onSelectApplication(app.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
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
