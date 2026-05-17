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
  const [courierAddress, setCourierAddress] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consentAccepted) { alert('Please accept the data privacy notice.'); return; }
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/alumni/records/request`, {
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
        <section className="form-block">
          <h3>Document Details</h3>
          <label>
            <span className="required-inline">Document Type<span className="required-mark">*</span></span>
            <div className="select-shell">
              <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} required>
                <option value="" disabled>Select document type</option>
                <option>Transcript of Records</option>
                <option>Diploma</option>
                <option>Certificate of Graduation</option>
                <option>Certificate of Enrollment</option>
              </select>
              <span className="select-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </span>
            </div>
          </label>
          <label>
            <span className="required-inline">Number of Copies<span className="required-mark">*</span></span>
            <input type="number" min={1} value={numberOfCopies} onChange={(e) => setNumberOfCopies(Number(e.target.value) || 1)} required />
          </label>
          <label>
            <span className="required-inline">Purpose of Request<span className="required-mark">*</span></span>
            <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} rows={4} placeholder="e.g., Employment, Further Studies" required />
          </label>
        </section>

        <section className="form-block">
          <h3><span className="required-inline">Delivery Method<span className="required-mark">*</span></span></h3>
          <div className="option-stack" role="radiogroup" aria-label="Delivery method">
            <label className="option-item">
              <input type="radio" name="document-delivery" value="pickup" required
                checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
              <span><strong>Pick-up at Office</strong><small>FREE</small></span>
            </label>
            <label className="option-item">
              <input type="radio" name="document-delivery" value="courier" required
                checked={deliveryMethod === 'courier'} onChange={() => setDeliveryMethod('courier')} />
              <span><strong>Courier Delivery</strong><small>₱150 shipping fee</small></span>
            </label>
          </div>
          {deliveryMethod === 'courier' && (
            <div className="courier-fields">
              <label>
                <span className="required-inline">Address<span className="required-mark">*</span></span>
                <textarea value={courierAddress} onChange={(e) => setCourierAddress(e.target.value)} rows={3} placeholder="Enter complete delivery address" required />
              </label>
              <label>
                <span className="required-inline">Contact Details<span className="required-mark">*</span></span>
                <input type="text" value={contactDetails} onChange={(e) => setContactDetails(e.target.value)} placeholder="Name and contact number" required />
              </label>
            </div>
          )}
        </section>

        <section className="form-block payment-placeholder">
          <h3>Payment Gateway</h3>
          <p>Payment integration placeholder for online checkout and reference code capture.</p>
          <div className="payment-gateway-card" role="status" aria-live="polite">
            <strong>Coming Soon</strong>
            <span>GCash, Credit/Debit Card, and Bank Transfer options will be available here.</span>
          </div>
        </section>

        <label className="checkbox-row consent-row">
          <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} />
          <span>
            <strong className="required-inline">DATA PRIVACY NOTICE<span className="required-mark privacy-mark">*</span></strong>
            {' '}I authorize Campus One to collect and process my personal information for document
            request purposes in accordance with the Data Privacy Act of 2012.
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

