import { useState } from 'react'
import Link from 'next/link'
import PaymentModal from '../components/PaymentModal'
import type { Payment } from '../types/payments'
import { getUnpaidInvoices, getPaymentHistory, updatePaymentStatus } from '../types/payments'

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function PaymentsPage() {
  const [invoices, setInvoices] = useState<Payment[]>(() => getUnpaidInvoices())
  const [history, setHistory] = useState<Payment[]>(() => getPaymentHistory())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)

  const refresh = () => {
    setInvoices(getUnpaidInvoices())
    setHistory(getPaymentHistory())
  }

  const handlePayNow = (p: Payment) => {
    setSelectedPayment(p)
    setModalOpen(true)
  }

  const handleSubmit = (method: string, file?: File | null) => {
    void method
    void file
    if (!selectedPayment) return
    // in a real app we'd upload the file then send a request
    updatePaymentStatus(selectedPayment.id, 'under_verification', selectedPayment.receiptUrl)
    setModalOpen(false)
    setSelectedPayment(null)
    refresh()
  }

  return (
    <section className="billing-page">
      <header className="billing-header">
        <h1>Payments</h1>
        <p>Pay outstanding invoices and review payment history</p>
      </header>

      <section className="billing-section">
        <h2>Unpaid Invoices</h2>
        {invoices.length > 0 ? (
          invoices.map((inv) => (
            <div className="billing-card" key={inv.id}>
              <div className="billing-card-header">
                <div>
                  <h3>{inv.service}</h3>
                  <p>{formatDate(inv.date)}</p>
                </div>
                <div>
                  <div className="billing-amount">₱{inv.amount}</div>
                  <div style={{ marginTop: 8 }}>
                    <button className="billing-pay-button" onClick={() => handlePayNow(inv)}>Pay Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="requests-empty-state">No unpaid invoices.</p>
        )}
      </section>

      <section className="billing-section">
        <h2>Payment History</h2>
        <div className="requests-list">
          <div className="requests-table-header">
            <div>Transaction ID</div>
            <div>Service</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Action</div>
          </div>

          {history.map((h) => (
            <div key={h.id} className="requests-table-row">
              <div><strong>{h.id}</strong></div>
              <div><span>{h.service}</span></div>
              <div><span>₱{h.amount}</span></div>
              <div><span>{formatDate(h.date)}</span></div>
              <div>
                <a className="requests-action-link" href={h.receiptUrl || '#'}>Download Receipt</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="billing-actions">
        <Link href="/dashboard" className="billing-back-link">Back to dashboard</Link>
      </div>

      <PaymentModal
        open={modalOpen}
        amount={selectedPayment?.amount ?? 0}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
