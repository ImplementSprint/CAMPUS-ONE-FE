'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

type ServiceType = 'Document Request' | 'Alumni Card' | 'Clearance';
type RequestStatus = 'Processing' | 'Ready for Pickup' | 'Shipped' | 'Completed' | 'Cancelled' | 'Pending';

type RequestItem = {
  id: string;
  serviceType: ServiceType;
  dateSubmitted: string;
  status: RequestStatus;
  title: string;
  description: string;
};

const mockRequests: RequestItem[] = [
  { id: 'REQ-2024-001', serviceType: 'Alumni Card', dateSubmitted: 'May 1, 2024', status: 'Processing', title: 'Alumni Card Application', description: 'Official alumni identification card' },
  { id: 'REQ-2024-002', serviceType: 'Document Request', dateSubmitted: 'Apr 28, 2024', status: 'Ready for Pickup', title: 'Diploma Copy Request', description: 'Official diploma copy' },
  { id: 'REQ-2024-003', serviceType: 'Clearance', dateSubmitted: 'Apr 20, 2024', status: 'Shipped', title: 'Background Clearance', description: 'Background clearance verification' },
  { id: 'REQ-2024-004', serviceType: 'Document Request', dateSubmitted: 'Mar 15, 2024', status: 'Completed', title: 'Transcript Request', description: 'Academic transcript' },
  { id: 'REQ-2024-005', serviceType: 'Alumni Card', dateSubmitted: 'Feb 10, 2024', status: 'Completed', title: 'Alumni Card Replacement', description: 'Replacement alumni identification card' },
  { id: 'REQ-2024-006', serviceType: 'Clearance', dateSubmitted: 'Jan 5, 2024', status: 'Completed', title: 'Employment Verification', description: 'Employment clearance letter' },
];

function getStatusClass(status: RequestStatus): string {
  switch (status) {
    case 'Processing':
      return 'bg-[#fff1db] text-[#d38b00]';
    case 'Ready for Pickup':
      return 'bg-[#e3f5e8] text-[#1f9d55]';
    case 'Shipped':
      return 'bg-[#e6eaff] text-[#6473ff]';
    case 'Completed':
      return 'bg-[#e8f2ff] text-[#2d6cdf]';
    case 'Cancelled':
      return 'bg-[#ffe4e4] text-[#d14b4b]';
    case 'Pending':
      return 'bg-[#ececec] text-[#666]';
    default:
      return 'bg-slate-100 text-slate-600';
  }
}

function MyRequestsContent() {
  const [search, setSearch] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | ''>('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('');

  const filteredRequests = useMemo(() => {
    return mockRequests.filter((request) => {
      const matchesSearch = !search || [request.id, request.title, request.description].join(' ').toLowerCase().includes(search.toLowerCase());
      const matchesServiceType = !serviceTypeFilter || request.serviceType === serviceTypeFilter;
      const matchesStatus = !statusFilter || request.status === statusFilter;
      return matchesSearch && matchesServiceType && matchesStatus;
    });
  }, [search, serviceTypeFilter, statusFilter]);

  return (
    <section className="mx-auto w-full max-w-[1080px] space-y-6 px-2 sm:px-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-[44px] font-black leading-[0.95] tracking-[-0.06em] text-slate-950">Active Applications</h1>
          <p className="mt-2 text-[18px] text-[#58739b]">View and manage all your requests and applications</p>
        </div>

        <Link
          href="/alumni/dashboard/document-request"
          className="inline-flex h-11 items-center gap-2 rounded-[12px] bg-[#4167ff] px-5 text-[15px] font-semibold text-white shadow-[0_8px_20px_rgba(65,103,255,0.25)] transition hover:bg-[#3156eb]"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by ID, title, or description..."
          className="h-11 rounded-[12px] border border-slate-200 bg-white px-4 text-[15px] text-slate-950 outline-none ring-0 placeholder:text-slate-400 focus:border-[#4167ff]"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative">
            <select
              value={serviceTypeFilter}
              onChange={(event) => setServiceTypeFilter(event.target.value as ServiceType | '')}
              className="h-11 w-full appearance-none rounded-[12px] border border-slate-200 bg-white px-4 pr-10 text-[15px] text-slate-950 outline-none focus:border-[#4167ff]"
            >
              <option value="">All Service Types</option>
              <option value="Document Request">Document Request</option>
              <option value="Alumni Card">Alumni Card</option>
              <option value="Clearance">Clearance</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as RequestStatus | '')}
              className="h-11 w-full appearance-none rounded-[12px] border border-slate-200 bg-white px-4 pr-10 text-[15px] text-slate-950 outline-none focus:border-[#4167ff]"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Shipped">Shipped</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.4fr_1fr_0.9fr_0.8fr] border-b border-slate-200 bg-[#f8fafc] px-5 py-4 text-[13px] font-bold uppercase tracking-[0.02em] text-slate-500">
          <div>Reference ID</div>
          <div>Service Type</div>
          <div>Date Submitted</div>
          <div>Status</div>
        </div>

        {filteredRequests.map((request) => (
          <div key={request.id} className="grid grid-cols-[1.4fr_1fr_0.9fr_0.8fr] items-center border-b border-slate-100 px-5 py-5 last:border-b-0">
            <div className="text-[16px] font-semibold text-slate-950">{request.id}</div>
            <div className="text-[15px] text-slate-700">{request.serviceType}</div>
            <div className="text-[15px] text-slate-700">{request.dateSubmitted}</div>
            <div>
              <span className={`inline-flex rounded-full px-3 py-1.5 text-[13px] font-semibold ${getStatusClass(request.status)}`}>
                {request.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-[15px] text-[#58739b]">
        Showing <span className="font-semibold text-slate-950">{filteredRequests.length}</span> of <span className="font-semibold text-slate-950">{mockRequests.length}</span> requests
      </div>
    </section>
  );
}

export default function MyRequestsPage() {
  return <ProtectedRoute allowedRoles={['alumni']}><MyRequestsContent /></ProtectedRoute>;
}
