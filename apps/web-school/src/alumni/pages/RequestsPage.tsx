import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { RequestFilters, ServiceType, RequestStatus } from '../types/requests'
import { mockRequests, filterRequests } from '../types/requests'

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function getStatusColor(status: RequestStatus): string {
  switch (status) {
    case 'Processing':
      return 'status-processing'
    case 'Ready for Pickup':
      return 'status-ready'
    case 'Shipped':
      return 'status-shipped'
    case 'Completed':
      return 'status-completed'
    case 'Cancelled':
      return 'status-cancelled'
    case 'Pending':
      return 'status-pending'
    default:
      return 'status-default'
  }
}

export function RequestsPage() {
  const router = useRouter()
  const { filter = '', search: initialSearch = '' } = router.query as Record<string, string>
  const [search, setSearch] = useState(initialSearch)
  const [serviceTypeFilter, setServiceTypeFilter] = useState<ServiceType | ''>('')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')

  const filters: RequestFilters = {
    filter: (filter as 'active' | 'completed' | 'readyForPickup') || undefined,
    search: search || undefined,
    serviceType: serviceTypeFilter || undefined,
    status: statusFilter || undefined,
  }

  const filteredRequests = filterRequests(mockRequests, filters)

  const getFilterTitle = () => {
    if (filter === 'active') return 'Active Applications'
    if (filter === 'completed') return 'Completed Requests'
    if (filter === 'readyForPickup') return 'Items for Pickup'
    return 'My Requests'
  }

  const handleServiceTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setServiceTypeFilter((e.target.value as ServiceType) || '')
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter((e.target.value as RequestStatus) || '')
  }

  return (
    <section className="requests-page">
      <header className="requests-header">
        <div>
          <h1>{getFilterTitle()}</h1>
          <p>View and manage all your requests and applications</p>
        </div>
        <Link href="/document-request" className="requests-cta-button">
          <span>+</span>
          New Request
        </Link>
      </header>

      <div className="requests-filters">
        <div className="requests-search">
          <input
            type="text"
            placeholder="Search by ID, title, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="requests-search-input"
          />
        </div>

        <div className="requests-filter-controls">
          <select
            value={serviceTypeFilter}
            onChange={handleServiceTypeChange}
            className="requests-filter-select"
          >
            <option value="">All Service Types</option>
            <option value="Document Request">Document Request</option>
            <option value="Alumni Card">Alumni Card</option>
            <option value="Clearance">Clearance</option>
          </select>

          <select
            value={statusFilter}
            onChange={handleStatusChange}
            className="requests-filter-select"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
            <option value="Shipped">Shipped</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredRequests.length > 0 ? (
        <div className="requests-list">
          <div className="requests-table-header">
            <div className="requests-col-id">Reference ID</div>
            <div className="requests-col-service">Service Type</div>
            <div className="requests-col-date">Date Submitted</div>
            <div className="requests-col-status">Status</div>
          </div>

          {filteredRequests.map((request) => (
            <div key={request.id} className="requests-table-row">
              <div className="requests-col-id">
                <strong>{request.id}</strong>
              </div>
              <div className="requests-col-service">
                <span>{request.serviceType}</span>
              </div>
              <div className="requests-col-date">
                <span>{formatDate(request.dateSubmitted)}</span>
              </div>
              <div className="requests-col-status">
                <span className={`status-badge ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="requests-empty-state">
          <p>No requests found matching your filters.</p>
          <Link href="/document-request" className="requests-empty-link">
            Create a new request
          </Link>
        </div>
      )}

      <div className="requests-summary">
        <p>
          Showing <strong>{filteredRequests.length}</strong> of <strong>{mockRequests.length}</strong> requests
        </p>
      </div>
    </section>
  )
}
