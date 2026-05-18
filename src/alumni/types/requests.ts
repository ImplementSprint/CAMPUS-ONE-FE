export type ServiceType = 'Document Request' | 'Alumni Card' | 'Clearance'
export type RequestStatus = 'Processing' | 'Ready for Pickup' | 'Shipped' | 'Completed' | 'Cancelled' | 'Pending'

export interface Request {
  id: string // Reference ID (e.g., REQ-2024-001)
  serviceType: ServiceType
  dateSubmitted: Date
  status: RequestStatus
  title: string
  description?: string
  trackerUrl?: string // Link to specific tracker page
}

export interface RequestFilters {
  filter?: 'active' | 'completed' | 'readyForPickup'
  search?: string
  serviceType?: ServiceType
  status?: RequestStatus
}

// Mock data for development - replace with actual Redux state/API calls
export const mockRequests: Request[] = [
  {
    id: 'REQ-2024-001',
    serviceType: 'Alumni Card',
    dateSubmitted: new Date('2024-05-01'),
    status: 'Processing',
    title: 'Alumni Card Application',
    description: 'Official alumni identification card',
    trackerUrl: '/card-application',
  },
  {
    id: 'REQ-2024-002',
    serviceType: 'Document Request',
    dateSubmitted: new Date('2024-04-28'),
    status: 'Ready for Pickup',
    title: 'Diploma Copy Request',
    description: 'Official diploma copy',
    trackerUrl: '/document-request',
  },
  {
    id: 'REQ-2024-003',
    serviceType: 'Clearance',
    dateSubmitted: new Date('2024-04-20'),
    status: 'Shipped',
    title: 'Background Clearance',
    description: 'Background clearance verification',
    trackerUrl: '/clearance-tracker',
  },
  {
    id: 'REQ-2024-004',
    serviceType: 'Document Request',
    dateSubmitted: new Date('2024-03-15'),
    status: 'Completed',
    title: 'Transcript Request',
    description: 'Academic transcript',
    trackerUrl: '/document-request',
  },
  {
    id: 'REQ-2024-005',
    serviceType: 'Alumni Card',
    dateSubmitted: new Date('2024-02-10'),
    status: 'Completed',
    title: 'Alumni Card Replacement',
    description: 'Replacement alumni identification card',
    trackerUrl: '/card-application',
  },
  {
    id: 'REQ-2024-006',
    serviceType: 'Clearance',
    dateSubmitted: new Date('2024-01-05'),
    status: 'Completed',
    title: 'Employment Verification',
    description: 'Employment clearance letter',
    trackerUrl: '/clearance-tracker',
  },
]

// Utility functions for filtering and counting
export function getActiveRequests(requests: Request[]): Request[] {
  return requests.filter((req) => ['Processing', 'Ready for Pickup', 'Pending'].includes(req.status))
}

export function getCompletedRequests(requests: Request[]): Request[] {
  return requests.filter((req) => req.status === 'Completed')
}

export function getReadyForPickupRequests(requests: Request[]): Request[] {
  return requests.filter((req) => req.status === 'Ready for Pickup')
}

export function getPendingPayments(requests: Request[]): Request[] {
  // This would typically come from a billing/invoice system
  // For now, return active items that might need payment
  return requests.filter((req) => req.status === 'Processing').slice(0, 1)
}

export function filterRequests(requests: Request[], filters: RequestFilters): Request[] {
  let filtered = requests

  if (filters.filter === 'active') {
    filtered = getActiveRequests(filtered)
  } else if (filters.filter === 'completed') {
    filtered = getCompletedRequests(filtered)
  } else if (filters.filter === 'readyForPickup') {
    filtered = getReadyForPickupRequests(filtered)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (req) =>
        req.id.toLowerCase().includes(searchLower) ||
        req.title.toLowerCase().includes(searchLower) ||
        req.description?.toLowerCase().includes(searchLower),
    )
  }

  if (filters.serviceType) {
    filtered = filtered.filter((req) => req.serviceType === filters.serviceType)
  }

  if (filters.status) {
    filtered = filtered.filter((req) => req.status === filters.status)
  }

  return filtered
}
