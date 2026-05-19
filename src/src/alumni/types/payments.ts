export type PaymentStatus = 'pending_payment' | 'under_verification' | 'paid'

export interface Payment {
  id: string
  requestId?: string // link to Request.id when applicable
  service: string
  amount: number
  date: Date
  status: PaymentStatus
  method?: string
  receiptUrl?: string
}

// Mock payment data (replace with API/Redux in real app)
export let mockPayments: Payment[] = [
  {
    id: 'PAY-2024-001',
    requestId: 'REQ-2024-001',
    service: 'Alumni Card',
    amount: 300,
    date: new Date('2024-05-02'),
    status: 'pending_payment',
  },
  {
    id: 'PAY-2024-002',
    requestId: 'REQ-2024-002',
    service: 'Document Request (shipping)',
    amount: 120,
    date: new Date('2024-04-28'),
    status: 'under_verification',
    receiptUrl: '',
  },
  {
    id: 'PAY-2024-003',
    requestId: undefined,
    service: 'Alumni Membership Fee',
    amount: 50,
    date: new Date('2024-03-01'),
    status: 'paid',
  },
]

export function getUnpaidInvoices(): Payment[] {
  return mockPayments.filter((p) => p.status === 'pending_payment')
}

export function getPaymentHistory(): Payment[] {
  return mockPayments.filter((p) => p.status === 'paid' || p.status === 'under_verification')
}

export function updatePaymentStatus(paymentId: string, newStatus: PaymentStatus, receiptUrl?: string) {
  const idx = mockPayments.findIndex((p) => p.id === paymentId)
  if (idx >= 0) {
    mockPayments[idx] = { ...mockPayments[idx], status: newStatus, receiptUrl: receiptUrl ?? mockPayments[idx].receiptUrl }
  }
}

export function createPayment(payload: Omit<Payment, 'id' | 'date' | 'status'> & { status?: PaymentStatus }) {
  const id = `PAY-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`
  const newPay: Payment = {
    id,
    date: new Date(),
    status: payload.status ?? 'pending_payment',
    ...payload,
  }
  mockPayments = [newPay, ...mockPayments]
  return newPay
}
