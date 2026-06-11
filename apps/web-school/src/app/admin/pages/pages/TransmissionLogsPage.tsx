import { useState } from "react";
import { Filter, Mail, Bell, MessageSquare, CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react";

interface Log {
  id: string;
  timestamp: string;
  eventType: "Kafka Alert" | "Email" | "SMS";
  recipient: string;
  messagePreview: string;
  status: "Sent" | "Failed" | "Queued";
}

export function TransmissionLogsPage() {
  const [eventFilter, setEventFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const [logs] = useState<Log[]>([
    {
      id: "LOG-001",
      timestamp: "2026-04-29 10:45:23",
      eventType: "Email",
      recipient: "maria.santos@email.com",
      messagePreview: "Your application has been received and is under review...",
      status: "Sent"
    },
    {
      id: "LOG-002",
      timestamp: "2026-04-29 10:30:15",
      eventType: "Kafka Alert",
      recipient: "admissions-queue",
      messagePreview: "New application submitted: APP-001",
      status: "Sent"
    },
    {
      id: "LOG-003",
      timestamp: "2026-04-29 09:15:42",
      eventType: "SMS",
      recipient: "+63 912 345 6789",
      messagePreview: "Your entrance exam is scheduled for May 1, 2026...",
      status: "Failed"
    },
    {
      id: "LOG-004",
      timestamp: "2026-04-29 08:00:00",
      eventType: "Email",
      recipient: "juan.delacruz@email.com",
      messagePreview: "Interview scheduled for April 30, 2026 at 10:00 AM...",
      status: "Queued"
    },
    {
      id: "LOG-005",
      timestamp: "2026-04-28 16:30:00",
      eventType: "Kafka Alert",
      recipient: "document-verification",
      messagePreview: "Documents uploaded for APP-002",
      status: "Sent"
    },
  ]);

  const eventTypes = ["All", "Kafka Alert", "Email", "SMS"];
  const statuses = ["All", "Sent", "Failed", "Queued"];

  const filteredLogs = logs.filter(log => {
    const matchesEvent = eventFilter === "All" || log.eventType === eventFilter;
    const matchesStatus = statusFilter === "All" || log.status === statusFilter;
    return matchesEvent && matchesStatus;
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "Email": return <Mail className="w-5 h-5" />;
      case "Kafka Alert": return <Bell className="w-5 h-5" />;
      case "SMS": return <MessageSquare className="w-5 h-5" />;
      default: return <Mail className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "Email": return "bg-blue-50 text-blue-600 border-blue-200";
      case "Kafka Alert": return "bg-purple-50 text-purple-600 border-purple-200";
      case "SMS": return "bg-green-50 text-green-600 border-green-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Sent: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", icon: CheckCircle },
      Failed: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200", icon: XCircle },
      Queued: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", icon: Clock },
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <div className="p-10">
      {retryMessage && (
        <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800" role="status">
          {retryMessage}
        </div>
      )}
      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent appearance-none bg-white"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type === "All" ? "All Event Types" : type}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent appearance-none bg-white"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status === "All" ? "All Statuses" : status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message Preview</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLogs.map((log) => {
                const statusInfo = getStatusBadge(log.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900">{log.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${getEventColor(log.eventType)}`}>
                        {getEventIcon(log.eventType)}
                        {log.eventType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.recipient}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.messagePreview}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                        <StatusIcon className="w-4 h-4" />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {log.status === "Failed" && (
                        <button
                          onClick={() => setRetryMessage(`Retry queued for ${log.id}.`)}
                          className="p-2 text-[#F59E0B] hover:bg-amber-50 rounded-lg transition-colors"
                          title="Retry Failed"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
