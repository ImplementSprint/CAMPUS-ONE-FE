import { SectionCard } from '../components/common/SectionCard'

export function BillingPage() {
  return (
    <SectionCard title="Billing" subtitle="Manage invoices and payments">
      <div className="billing-summary">
        <div className="billing-card billing-highlight-card">
          <h3>Account Balance</h3>
          <div className="billing-amount-display">₱1,500</div>
          <p>2 unpaid invoices</p>
          <button className="primary-btn">Pay Now</button>
        </div>

        <div className="billing-card">
          <h3>Alumni Card</h3>
          <div className="billing-item">
            <span>Card Application Fee</span>
            <span>₱300</span>
          </div>
          <span className="status-pill is-pending">Pending</span>
        </div>

        <div className="billing-card">
          <h3>Document Request</h3>
          <div className="billing-item">
            <span>Transcript of Records</span>
            <span>₱500</span>
          </div>
          <span className="status-pill is-verification">Under Verification</span>
        </div>

        <div className="billing-card">
          <h3>Premium Services</h3>
          <div className="billing-item">
            <span>Courier Delivery Fee</span>
            <span>₱150</span>
          </div>
          <span className="status-pill is-open">Processing</span>
        </div>
      </div>

      <section className="billing-details">
        <h3>Recent Transactions</h3>
        <div className="requests-list">
          <div className="requests-table-header">
            <div>Description</div>
            <div>Amount</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          <div className="requests-table-row">
            <div><strong>Document Request - ToR</strong></div>
            <div>₱500</div>
            <div>Dec 15, 2024</div>
            <div><span className="status-pill is-verification">Verification</span></div>
          </div>

          <div className="requests-table-row">
            <div><strong>Alumni Card</strong></div>
            <div>₱300</div>
            <div>Dec 10, 2024</div>
            <div><span className="status-pill is-pending">Pending</span></div>
          </div>

          <div className="requests-table-row">
            <div><strong>Courier Fee</strong></div>
            <div>₱150</div>
            <div>Dec 5, 2024</div>
            <div><span className="status-pill is-open">Processing</span></div>
          </div>
        </div>
      </section>
    </SectionCard>
  )
}
