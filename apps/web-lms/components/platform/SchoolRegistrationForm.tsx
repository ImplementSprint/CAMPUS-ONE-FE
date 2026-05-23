'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Building2, Loader2 } from 'lucide-react';
import type { SchoolRegistrationRequest } from '@campus-one/shared-contracts';
import {
  hasSchoolRegistrationErrors,
  type SchoolRegistrationErrors,
  validateSchoolRegistration,
} from '@/lib/school-registration-validation';

const SCHOOL_TYPES = [
  'Basic Education',
  'College',
  'University',
  'Training Center',
  'Review Center',
];

const EMPTY_FORM: SchoolRegistrationRequest = {
  name: '',
  representative: '',
  email: '',
  contactNumber: '',
  schoolType: '',
  targetSubdomain: '',
};

export function SchoolRegistrationForm() {
  const router = useRouter();
  const [form, setForm] = useState<SchoolRegistrationRequest>(EMPTY_FORM);
  const [errors, setErrors] = useState<SchoolRegistrationErrors>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const previewDomain = useMemo(() => {
    const domain = process.env.NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN
      ?? process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN
      ?? 'itsandbox.site';
    const slug = form.targetSubdomain.trim().toLowerCase() || 'school';
    return `${slug}.${domain}`;
  }, [form.targetSubdomain]);

  const updateField = (field: keyof SchoolRegistrationRequest, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatusMessage('');
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateSchoolRegistration(form);
    setErrors(validation.errors);

    if (hasSchoolRegistrationErrors(validation.errors)) return;

    setSubmitting(true);
    setStatusMessage('');

    try {
      const response = await fetch('/api/school/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatusMessage(data.message ?? 'Could not submit registration.');
        if (data.errors) setErrors(data.errors);
        return;
      }

      const next = data.next ?? `/schools/register/submitted?school=${encodeURIComponent(validation.payload.targetSubdomain)}`;
      router.push(next);
    } catch {
      setStatusMessage('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="School name"
          value={form.name}
          error={errors.name}
          onChange={(value) => updateField('name', value)}
          placeholder="Example National High School"
        />
        <Field
          label="School type"
          value={form.schoolType}
          error={errors.schoolType}
          onChange={(value) => updateField('schoolType', value)}
          options={SCHOOL_TYPES}
          placeholder="Select school type"
        />
        <Field
          label="Representative"
          value={form.representative}
          error={errors.representative}
          onChange={(value) => updateField('representative', value)}
          placeholder="Registrar or owner name"
        />
        <Field
          label="Email"
          value={form.email}
          error={errors.email}
          onChange={(value) => updateField('email', value)}
          placeholder="owner@school.edu"
          type="email"
        />
        <Field
          label="Contact number"
          value={form.contactNumber}
          error={errors.contactNumber}
          onChange={(value) => updateField('contactNumber', value)}
          placeholder="+63 900 000 0000"
        />
        <Field
          label="Preferred subdomain"
          value={form.targetSubdomain}
          error={errors.targetSubdomain}
          onChange={(value) => updateField('targetSubdomain', value)}
          placeholder="example-school"
        />
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3 text-sm text-slate-600">
          <Building2 className="h-4 w-4 flex-shrink-0 text-amber-600" />
          <span className="truncate">Portal preview: {previewDomain}</span>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          Submit for review
        </button>
      </div>

      {statusMessage && <p className="text-sm text-red-600">{statusMessage}</p>}
    </form>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  options?: string[];
  placeholder?: string;
  type?: string;
}) {
  const id = props.label.toLowerCase().replace(/\s+/g, '-');
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">{props.label}</span>
      {props.options ? (
        <select
          id={id}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        >
          <option value="">{props.placeholder}</option>
          {props.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={props.type ?? 'text'}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          placeholder={props.placeholder}
          className="mt-1 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-100"
        />
      )}
      {props.error && <span className="mt-1 block text-xs text-red-600">{props.error}</span>}
    </label>
  );
}
