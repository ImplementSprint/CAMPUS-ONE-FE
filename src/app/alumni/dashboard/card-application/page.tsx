'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

function CardApplicationContent() {
  const { user } = useAuth();
  const [applicationType, setApplicationType] = useState<'new' | 'replacement'>('new');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [idPhotoFileName, setIdPhotoFileName] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [isPhotoDragActive, setIsPhotoDragActive] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consentAccepted) { alert('Please accept the data privacy notice.'); return; }
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/alumni/cards/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: applicationType === 'new' ? 'New Card Application' : 'Replacement Card',
          applicationType, deliveryMethod, idPhotoFileName, consentAccepted,
          actor_uuid: user?.id, tenant_id: 'campus_one',
        }),
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('done');
      alert('Card application submitted!');
    } catch {
      alert('Failed to submit. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <section className="section-card">
      <header>
        <h2>Alumni Card Application</h2>
        <p>Request or renew your alumni ID</p>
      </header>
      <form className="form-grid" onSubmit={onSubmit}>
        <section className="form-block info-block">
          <h3>Card Application Info</h3>
          <ul>
            <li>For new cards or replacements</li>
            <li>Processing: 5–7 business days</li>
            <li>Validity: Lifetime</li>
            <li>Fee: ₱300 (pay upon delivery/pick-up)</li>
          </ul>
        </section>

        <section className="form-block">
          <h3>Application Type</h3>
          <div className="option-stack" role="radiogroup" aria-label="Application type">
            <label className="option-item">
              <input type="radio" name="application-type" value="new"
                checked={applicationType === 'new'} onChange={() => setApplicationType('new')} />
              <span><strong>New Card Application</strong><small>First-time alumni card</small></span>
            </label>
            <label className="option-item">
              <input type="radio" name="application-type" value="replacement"
                checked={applicationType === 'replacement'} onChange={() => setApplicationType('replacement')} />
              <span><strong>Replacement Card</strong><small>Lost or damaged card</small></span>
            </label>
          </div>
        </section>

        <section className="form-block">
          <h3>Delivery Method</h3>
          <div className="option-stack" role="radiogroup" aria-label="Delivery method">
            <label className="option-item">
              <input type="radio" name="card-delivery" value="pickup"
                checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
              <span><strong>Pick-up at Office</strong><small>FREE</small></span>
            </label>
            <label className="option-item">
              <input type="radio" name="card-delivery" value="delivery"
                checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} />
              <span><strong>Delivery</strong><small>₱150 shipping fee</small></span>
            </label>
          </div>
        </section>

        <section className="form-block">
          <h3>ID Photo</h3>
          <label
            className={`upload-label upload-card ${isPhotoDragActive ? 'is-drag-active' : ''} ${idPhotoFileName ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsPhotoDragActive(true); }}
            onDragLeave={() => setIsPhotoDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsPhotoDragActive(false);
              const droppedFile = e.dataTransfer.files?.[0];
              setIdPhotoFileName(droppedFile ? droppedFile.name : '');
            }}
          >
            <input type="file" accept="image/jpeg,image/png" aria-label="Upload ID photo"
              onChange={(e) => setIdPhotoFileName(e.target.files?.[0]?.name ?? '')} />
            <span className="upload-card-head">
              <span className="upload-card-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M14 3H8.8C7.12 3 6.28 3 5.64 3.33A4 4 0 0 0 3.33 5.64C3 6.28 3 7.12 3 8.8v6.4c0 1.68 0 2.52.33 3.16a4 4 0 0 0 2.31 2.31c.64.33 1.48.33 3.16.33h6.4c1.68 0 2.52 0 3.16-.33a4 4 0 0 0 2.31-2.31c.33-.64.33-1.48.33-3.16V10zm0 0v5h5m-9 8 2.4-2.4a1 1 0 0 1 1.4 0L16 16m-6-1 1.2-1.2a1 1 0 0 1 1.4 0l.4.4" />
                </svg>
              </span>
              <span className="upload-card-copy">
                <strong>{idPhotoFileName ? 'Photo selected' : 'Upload file'}</strong>
                <span>Drag and drop your 2×2 photo here or <em>Choose file</em></span>
              </span>
            </span>
            <span className="upload-card-meta">
              <small>Supported formats: JPG, PNG</small>
              <small>Maximum size: 5MB</small>
            </span>
            <span className="upload-card-file" aria-live="polite">
              {idPhotoFileName || 'No file selected yet'}
            </span>
          </label>
        </section>

        <label className="checkbox-row consent-row">
          <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} />
          <span>
            <strong className="required-inline">DATA PRIVACY NOTICE<span className="required-mark">*</span></strong>
            {' '}I authorize Campus One to collect and process my personal information for alumni card
            application purposes in accordance with the Data Privacy Act of 2012.
          </span>
        </label>

        <button className="primary-btn" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </section>
  );
}

export default function CardApplicationPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <CardApplicationContent />
    </ProtectedRoute>
  );
}
