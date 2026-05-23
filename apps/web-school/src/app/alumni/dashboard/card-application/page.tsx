 'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

function CardApplicationContent() {
  const { user } = useAuth();
  const [applicationType, setApplicationType] = useState<'new' | 'replacement'>('new');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [idPhotoFileName, setIdPhotoFileName] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consentAccepted) { alert('Please accept the data privacy notice.'); return; }
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/alumni/card-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_type: applicationType,
          delivery_method: deliveryMethod,
          id_photo_url: idPhotoFileName || undefined,
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
        <h2>Card Application</h2>
        <p>Request or renew your alumni ID</p>
      </header>
      <form className="form-grid" onSubmit={onSubmit}>
        <div className="form-block">
          <h3>Card Preview</h3>
          <div className="card-preview-shell">
            <div className="card-preview-face">
              <p>CAMPUS ONE</p>
              <strong>ALUMNI CARD</strong>
            </div>
          </div>
        </div>

        <div className="form-block info-block">
          <h3>Card Application Info</h3>
          <ul>
            <li>For new cards or replacements</li>
            <li>Processing: 5–7 business days</li>
            <li>Validity: Lifetime</li>
            <li>Fee: ₱300 (pay upon delivery/pick-up)</li>
          </ul>
        </div>

        <div className="form-block">
          <h3>Application Type</h3>
          <div className="option-stack">
            <label className="option-item">
              <input type="radio" name="appType" value="new" checked={applicationType === 'new'} onChange={() => setApplicationType('new')} />
              <span><strong>New Card Application</strong><small>First-time alumni card</small></span>
            </label>
            <label className="option-item">
              <input type="radio" name="appType" value="replacement" checked={applicationType === 'replacement'} onChange={() => setApplicationType('replacement')} />
              <span><strong>Replacement Card</strong><small>Lost or damaged card</small></span>
            </label>
          </div>
        </div>

        <div className="form-block">
          <h3>Delivery Method</h3>
          <div className="option-stack">
            <label className="option-item">
              <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
              <span><strong>Pick-up at Office</strong><small>FREE</small></span>
            </label>
            <label className="option-item">
              <input type="radio" name="delivery" value="delivery" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} />
              <span><strong>Delivery</strong><small>₱150 shipping fee</small></span>
            </label>
          </div>
        </div>

        <div className="form-block">
          <h3>ID Photo</h3>
          <label className="upload-label">
            <input type="file" accept="image/jpeg,image/png" onChange={(e) => setIdPhotoFileName(e.target.files?.[0]?.name ?? '')} />
            <span>{idPhotoFileName || 'Upload 2x2 Photo (JPG, PNG – Max. 5MB)'}</span>
          </label>
        </div>

        <label className="consent-row">
          <input type="checkbox" checked={consentAccepted} onChange={(e) => setConsentAccepted(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#f5a623', flexShrink: 0 }} />
          <span>
            <strong>DATA PRIVACY NOTICE</strong>
            I authorize Campus One to collect and process my personal information for alumni card application purposes in accordance with the Data Privacy Act of 2012.
          </span>
        </label>

        <button className="primary-btn" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Submitting...' : 'Submit Card Application'}
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
