 'use client';
import { useState, FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { requestAlumniRecord, type AlumniRecordRequest } from '../../services/alumni.service';

function DocumentRequestContent() {
  const { user } = useAuth();
  const [documentType, setDocumentType] = useState('');
  const [numberOfCopies, setNumberOfCopies] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'courier'>('pickup');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!consentAccepted) {
      setMessage({ type: 'error', text: 'Please accept the data privacy notice before submitting.' });
      return;
    }
    if (!user?.id) {
      setMessage({ type: 'error', text: 'Please sign in again before submitting.' });
      return;
    }
    setStatus('loading');
    try {
      const result = await requestAlumniRecord({
        document_type: documentType as AlumniRecordRequest['document_type'],
        notes: purpose,
        number_of_copies: numberOfCopies,
        delivery_method: deliveryMethod,
        actor_uuid: user.id,
      });
      if (result.error) throw new Error(result.error.message);
      setStatus('done');
      setMessage({ type: 'success', text: 'Document request submitted. The alumni office will review it next.' });
      setPurpose('');
      setDocumentType('');
      setNumberOfCopies(1);
      setDeliveryMethod('pickup');
      setConsentAccepted(false);
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit the request. Please try again.' });
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
        {message ? (
          <p
            className={`form-message form-message--${message.type}`}
            role={message.type === 'error' ? 'alert' : 'status'}
          >
            {message.text}
          </p>
        ) : null}
        <div className="form-block">
          <h3>Document Details</h3>
          <label>
            Document Type *
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} required>
              <option value="" disabled>Select document type</option>
              <option value="TOR">Transcript of Records</option>
              <option value="DIPLOMA">Diploma</option>
              <option value="CERTIFICATE">Certificate of Graduation</option>
              <option value="GOOD_MORAL">Good Moral Certificate</option>
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
              <span><strong>Courier Delivery</strong><small>PHP 150 shipping fee</small></span>
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
