import { useState } from "react";
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react";

interface Ticket {
  id: string;
  applicantName: string;
  subject: string;
  priority: "High" | "Med" | "Low";
  status: "Open" | "Resolved";
  date: string;
  messages: { sender: string; text: string; time: string }[];
}

export function ApplicantHelpDeskPage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [tickets] = useState<Ticket[]>([
    {
      id: "TKT-001",
      applicantName: "Maria Santos",
      subject: "Cannot upload documents",
      priority: "High",
      status: "Open",
      date: "2026-04-29",
      messages: [
        { sender: "Maria Santos", text: "I'm having trouble uploading my transcript. The system keeps showing an error.", time: "10:30 AM" },
      ]
    },
    {
      id: "TKT-002",
      applicantName: "Juan Dela Cruz",
      subject: "Question about exam schedule",
      priority: "Med",
      status: "Open",
      date: "2026-04-28",
      messages: [
        { sender: "Juan Dela Cruz", text: "When will the entrance exam be held?", time: "02:15 PM" },
        { sender: "Admin", text: "The exam is scheduled for May 1, 2026 at 9:00 AM.", time: "02:30 PM" },
      ]
    },
    {
      id: "TKT-003",
      applicantName: "Ana Reyes",
      subject: "Application status inquiry",
      priority: "Low",
      status: "Resolved",
      date: "2026-04-27",
      messages: [
        { sender: "Ana Reyes", text: "What is the status of my application?", time: "11:00 AM" },
        { sender: "Admin", text: "Your application is currently under review. You'll receive an update within 3-5 business days.", time: "11:15 AM" },
      ]
    },
  ]);

  const getPriorityBadge = (priority: string) => {
    const styles = {
      High: "bg-red-50 text-red-600 border-red-200",
      Med: "bg-amber-50 text-amber-600 border-amber-200",
      Low: "bg-blue-50 text-blue-600 border-blue-200",
    };
    return styles[priority as keyof typeof styles];
  };

  const getStatusBadge = (status: string) => {
    return status === "Open"
      ? "bg-amber-50 text-amber-600 border-amber-200"
      : "bg-green-50 text-green-600 border-green-200";
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedTicket) {
      setStatusMessage(`Reply sent to ${selectedTicket.applicantName}.`);
      setReplyText("");
    }
  };

  return (
    <div className="p-10">
      {statusMessage && (
        <div className="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700" role="status">
          {statusMessage}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Support Tickets</h3>
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedTicket?.id === ticket.id
                      ? "border-[#F59E0B] bg-amber-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                    <div className="flex gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityBadge(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900 mb-1 truncate">{ticket.subject}</p>
                  <p className="text-sm text-gray-600 truncate">{ticket.applicantName}</p>
                  <p className="text-xs text-gray-500 mt-2">{ticket.date}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedTicket.subject}</h2>
                    <p className="text-sm text-gray-600">{selectedTicket.applicantName} - {selectedTicket.id}</p>
                  </div>
                  {selectedTicket.status === "Open" && (
                    <button
                      onClick={() => setStatusMessage("Ticket marked as resolved.")}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityBadge(selectedTicket.priority)}`}>
                    {selectedTicket.priority} Priority
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(selectedTicket.status)}`}>
                    {selectedTicket.status}
                  </span>
                </div>
              </div>

              {/* Message Thread */}
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                {selectedTicket.messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.sender === "Admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-md ${message.sender === "Admin" ? "bg-[#F59E0B] text-white" : "bg-gray-100 text-gray-900"} rounded-2xl p-4`}>
                      <p className="text-sm font-semibold mb-1">{message.sender}</p>
                      <p className="text-sm mb-2">{message.text}</p>
                      <p className={`text-xs ${message.sender === "Admin" ? "text-amber-100" : "text-gray-500"}`}>{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              {selectedTicket.status === "Open" && (
                <div className="p-6 border-t border-gray-200 bg-gray-50">
                  <div className="flex gap-3">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] focus:border-transparent resize-none"
                      placeholder="Type your reply..."
                    />
                    <button
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="px-6 py-3 bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white rounded-xl font-semibold hover:from-[#D97706] hover:to-[#B45309] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-20 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a ticket to view details and respond</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
