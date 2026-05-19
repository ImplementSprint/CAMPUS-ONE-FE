'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

function DocumentRequestContent() {
  const { user } = useAuth();
  const [documentType, setDocumentType] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'courier'>('pickup');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consentAccepted) { alert('Please accept the data privacy notice.'); return; }
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/v1/alumni/records/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentType, notes: purpose, numberOfCopies,
          purpose, deliveryMethod, consentAccepted,
          actor_uuid: user?.id, tenant_id: 'campus_one',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('done');
      alert('Document request submitted!');
      setPurpose('');
    } catch {
      alert('Failed to submit. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section className="section-card">
      <header>
        <h2>Document Request</h2>
        <p>Submit official document requests</p>
      </header>
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="form-block">
          <h3>Document Details</h3>
          <label>
            Document Type *
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} required>
              <option value="" disabled>Select document type</option>
              <option>Transcript of Records</option>
              <option>Diploma</option>
              <option>Certificate of Graduation</option>
              <option>Certificate of Enrollment</option>
            </select>
          </label>
          <label>
            Number of Copies *
            <input type="number" min={1} value={numberOfCopies} onChange={(e) => setNumberOfCopies(Number(e.target.value) || 1)} required />
          </label>
          <label>
            Purpose of Request *
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={4} placeholder="e.g., Employment, Further Studies" required />
          </label>
        </div>

        <div className="form-block">
          <h3>Delivery Method</h3>
          <div className="option-stack">
            <label className="option-item">
              <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
              <span><strong>Pick-up at Office</strong><small>FREE</small></span>
            </label>
            <label className="option-item">
              <input type="radio" name="delivery" value="courier" checked={deliveryMethod === 'courier'} onChange={() => setDeliveryMethod('courier')} />
              <span><strong>Courier Delivery</strong><small>₱150 shipping fee</small></span>
            </label>
          </div>
        </div>

        <label className="consent-row">
          <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#f5a623', flexShrink: 0 }} />
          <span>
            <strong>DATA PRIVACY NOTICE</strong>
            I authorize Campus One to collect and process my personal information for document request purposes in accordance with the Data Privacy Act of 2012.
          </span>
        </label>

        <button className="primary-btn" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </section>
  );
}

export default function DocumentRequestPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <DocumentRequestContent />
    </ProtectedRoute>
  );
}
