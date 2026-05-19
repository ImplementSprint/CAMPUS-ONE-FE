'use client';
<<<<<<< HEAD
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { Check, Circle, Upload } from 'lucide-react';

function CardApplicationContent() {
  return (
    <section className="rounded-[18px] border border-slate-200/70 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03),0_10px_26px_rgba(15,23,42,0.04)] sm:px-6 sm:py-6">
      <h1 className="text-[30px] font-black leading-tight tracking-[-0.04em] text-slate-950 sm:text-[40px]">Alumni Card Application</h1>
      <p className="mt-3 text-[18px] text-[#58739b]">Request or renew your alumni ID</p>

      <div className="mt-5 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Card Application Info</h2>
        <ul className="mt-3 space-y-2 text-[16px] text-[#58739b]">
          <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-slate-500" />For new cards or replacements</li>
          <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-slate-500" />Processing: 5-7 business days</li>
          <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-slate-500" />Validity: Lifetime</li>
          <li className="flex items-start gap-2"><Check className="mt-1 h-4 w-4 shrink-0 text-slate-500" />Fee: P300 (pay upon delivery/pick-up)</li>
        </ul>
      </div>

      <div className="mt-4 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Application Type</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-[12px] border border-[#cfe0ff] bg-[#f9fbff] px-4 py-3">
            <div className="mt-1 grid h-4 w-4 place-items-center rounded-full border-2 border-[#356dff]"><div className="h-2 w-2 rounded-full bg-[#356dff]" /></div>
            <span>
              <span className="block text-[16px] font-bold text-slate-950">New Card Application</span>
              <span className="block text-[13px] text-[#58739b]">First-time alumni card</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 px-4 py-3">
            <Circle className="mt-1 h-4 w-4 text-slate-400" />
            <span>
              <span className="block text-[16px] font-bold text-slate-950">Replacement Card</span>
              <span className="block text-[13px] text-[#58739b]">Lost or damaged card</span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">Delivery Method</h2>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-[12px] border border-[#cfe0ff] px-4 py-3">
            <div className="mt-1 grid h-4 w-4 place-items-center rounded-full border-2 border-[#356dff]"><div className="h-2 w-2 rounded-full bg-[#356dff]" /></div>
            <span>
              <span className="block text-[16px] font-bold text-slate-950">Pick-up at Office</span>
              <span className="block text-[13px] text-[#58739b]">FREE</span>
            </span>
          </label>
          <label className="flex items-start gap-3 rounded-[12px] border border-slate-200 px-4 py-3">
            <Circle className="mt-1 h-4 w-4 text-slate-400" />
            <span>
              <span className="block text-[16px] font-bold text-slate-950">Delivery</span>
              <span className="block text-[13px] text-[#58739b]">P150 shipping fee</span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-slate-200/70 bg-white p-4 sm:p-5">
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-slate-950">ID Photo</h2>
        <div className="mt-4 rounded-[16px] border border-[#d7e3ff] bg-[#fafcff] p-4">
          <div className="flex min-h-[210px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d3defb] bg-gradient-to-b from-white to-[#f8fbff] px-4 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-[20px] bg-[#eaf2ff] text-[#356dff]">
              <Upload className="h-8 w-8" />
            </div>
            <div className="mt-6 text-[18px] font-bold text-slate-950">Upload file</div>
            <p className="mt-3 text-[16px] text-[#58739b]">Drag and drop your 2x2 photo here or <span className="font-semibold text-[#356dff]">Choose file</span></p>
          </div>
          <div className="mt-2 flex items-center justify-between text-[13px] text-[#58739b]"><span>Supported formats: JPG, PNG</span><span>Maximum size: 5MB</span></div>
          <div className="mt-2 rounded-[12px] border border-slate-200 bg-white px-4 py-3 text-center text-[16px] text-slate-900">No file selected yet</div>
        </div>
      </div>

      <label className="mt-4 flex items-start gap-3 rounded-[12px] border border-slate-200 bg-white p-4">
        <input type="checkbox" className="mt-1 h-5 w-5 rounded border-slate-300 text-[#356dff]" />
        <span>
          <span className="block text-[15px] font-bold uppercase tracking-[0.03em] text-slate-900">Data Privacy Notice <span className="text-[#ef4444]">*</span></span>
          <span className="mt-1 block text-[15px] leading-relaxed text-[#58739b]">I authorize Campus One to collect and process my personal information for alumni card application purposes in accordance with the Data Privacy Act of 2012.</span>
        </span>
      </label>

      <button className="mt-4 h-14 w-full rounded-[16px] bg-[#356dff] text-[16px] font-semibold text-white shadow-sm">Submit Application</button>
=======
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

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!consentAccepted) { alert('Please accept the data privacy notice.'); return; }
    setStatus('loading');
    try {
      const res = await fetch(`${API_BASE}/api/v1/alumni/cards/apply`, {
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
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
    </section>
  );
}

export default function CardApplicationPage() {
<<<<<<< HEAD
  return <ProtectedRoute allowedRoles={['alumni']}><CardApplicationContent /></ProtectedRoute>;
=======
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <CardApplicationContent />
    </ProtectedRoute>
  );
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
}
