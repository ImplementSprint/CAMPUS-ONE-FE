'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import '../alumni.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

const academicUnits = [
  'College of Arts and Sciences', 'College of Business and Accountancy',
  'College of Engineering', 'College of Computer Studies',
  'College of Education', 'College of Hospitality and Tourism Management',
  'College of Nursing', 'Graduate School',
];

function TextField({ label, required = false, ...props }: { label: string; required?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="form-field">
      <span>{label} {required && <strong>*</strong>}</span>
      <input required={required} {...props} />
    </label>
  );
}

function SelectField({ label, required = false, options, placeholder, value, onChange }: { label: string; required?: boolean; options: string[]; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) {
  return (
    <label className="form-field">
      <span>{label} {required && <strong>*</strong>}</span>
      <select value={value} onChange={onChange} required={required}>
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

export default function AlumniRegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '',
    email: '', phone: '', studentId: '',
    academicUnit: '', graduationYear: '', program: '',
    password: '', confirmPassword: '', consent: false,
  });
  const [loading, setLoading] = useState(false);

  const set = (field: string, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { alert('Passwords do not match!'); return; }
    if (!formData.consent) { alert('You must accept the Terms and Conditions.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/alumni/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actor_uuid: crypto.randomUUID(),
          tenant_id: 'campus_one',
          first_name: formData.firstName,
          middle_name: formData.middleName || undefined,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          academic_unit: formData.academicUnit,
          graduation_year: parseInt(formData.graduationYear),
          program: formData.program || 'Not Specified',
          student_id: formData.studentId,
          is_legacy_registration: false,
        }),
      });
      if (!res.ok) throw new Error('Registration failed');
      alert('Registration successful! Please wait for admin approval.');
      router.push('/login');
    } catch {
      alert('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <header className="registration-topbar">
        <Link className="back-link" href="/">
          <span aria-hidden="true">←</span>
          <strong>Register</strong>
        </Link>
      </header>

      <main className="registration-page-main">
        <section className="registration-hero">
          <h1>Join Our Alumni Network</h1>
          <p>Create an account to access alumni services and stay connected with Campus One</p>
        </section>

        <form className="registration-form" onSubmit={handleSubmit}>
          <section className="registration-section">
            <h2>Personal Info</h2>
            <div className="field-grid single-column">
              <TextField label="First Name" required value={formData.firstName} onChange={(e) => set('firstName', e.target.value)} />
              <TextField label="Middle Name" value={formData.middleName} onChange={(e) => set('middleName', e.target.value)} />
              <TextField label="Last Name" required value={formData.lastName} onChange={(e) => set('lastName', e.target.value)} />
              <TextField label="Email Address" required type="email" value={formData.email} onChange={(e) => set('email', e.target.value)} />
              <TextField label="Phone Number" required placeholder="+63 XXX XXX XXXX" type="tel" value={formData.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
          </section>

          <section className="registration-section">
            <h2>Academic Info</h2>
            <div className="field-grid single-column">
              <TextField label="Student ID Number" required placeholder="e.g., 2020-12345" value={formData.studentId} onChange={(e) => set('studentId', e.target.value)} />
              <SelectField label="Academic Unit Affiliation" required placeholder="Select your academic unit" options={academicUnits} value={formData.academicUnit} onChange={(e) => set('academicUnit', e.target.value)} />
              <TextField label="Program (Course)" required placeholder="e.g., BS Computer Science" value={formData.program} onChange={(e) => set('program', e.target.value)} />
              <TextField label="Year of Graduation" required placeholder="e.g., 2024" type="number" value={formData.graduationYear} onChange={(e) => set('graduationYear', e.target.value)} />
            </div>
          </section>

          <section className="registration-section">
            <h2>Account Security</h2>
            <div className="field-grid single-column">
              <label className="form-field">
                <span>Password <strong>*</strong></span>
                <input type="password" required value={formData.password} onChange={(e) => set('password', e.target.value)} />
                <small style={{ color: '#8b93a3' }}>At least 8 characters</small>
              </label>
              <label className="form-field">
                <span>Confirm Password <strong>*</strong></span>
                <input type="password" required value={formData.confirmPassword} onChange={(e) => set('confirmPassword', e.target.value)} />
              </label>
            </div>
          </section>

          <section className="registration-consent">
            <label className="checkbox-row">
              <input type="checkbox" checked={formData.consent} onChange={(e) => set('consent', e.target.checked)} />
              <span>I agree to the <a href="#" style={{ color: '#f5a623' }}>Terms and Conditions</a> and <a href="#" style={{ color: '#f5a623' }}>Privacy Policy</a></span>
            </label>
          </section>

          <button className="registration-submit" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Create Account'}
          </button>
        </form>
      </main>
    </div>
  );
}
