import { useState } from 'react'

type Props = {
  open: boolean
  amount: number
  onClose: () => void
  onSubmit: (method: string, file?: File | null) => void
}

export default function PaymentModal({ open, amount, onClose, onSubmit }: Props) {
  const [method, setMethod] = useState<string>('Bank Transfer')
  const [file, setFile] = useState<File | null>(null)

  if (!open) return null

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <header className="modal-head">
          <h3>Confirm Payment</h3>
          <button onClick={onClose} aria-label="Close">✕</button>
        </header>

        <div className="modal-body">
          <p>Total amount: <strong>₱{amount}</strong></p>

          <label className="modal-field">
            <div>Payment Method</div>
            <select value={method} onChange={(e) => setMethod(e.target.value)}>
              <option>Bank Transfer</option>
              <option>GCash/E-Wallet</option>
              <option>Over-the-Counter</option>
            </select>
          </label>

          <label className="modal-field">
            <div>Upload Proof of Payment</div>
            <input type="file" accept="image/*,application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <footer className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onSubmit(method, file)
            }}
          >
            Submit for verification
          </button>
        </footer>
      </div>
    </div>
  )
}
