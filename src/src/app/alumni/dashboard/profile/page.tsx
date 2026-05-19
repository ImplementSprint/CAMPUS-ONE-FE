'use client';
<<<<<<< HEAD

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

type ContactInfo = {
  email: string;
  contactNumber: string;
  mailingAddress: string;
};

const initialContactInfo: ContactInfo = {
  email: 'jertznaval57@gmail.com',
  contactNumber: '09171234567',
  mailingAddress: 'Street, Barangay, City, Province',
};

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block text-[16px] font-medium text-slate-950">{children}</span>;
}

function StaticValue({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-6 text-[#58739b]">{children}</p>;
}

function ContactInput({
  label,
  value,
  onChange,
  type = 'text',
  readOnly,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  readOnly: boolean;
  multiline?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      {multiline ? (
        <textarea
          className="min-h-[84px] w-full rounded-[12px] border border-[#dbe3f1] bg-white px-4 py-3 text-[15px] text-slate-700 outline-none transition focus:border-[#6c8ef7]"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          aria-readonly={readOnly}
          rows={3}
        />
      ) : (
        <input
          className="h-11 w-full rounded-[12px] border border-[#dbe3f1] bg-white px-4 text-[15px] text-slate-700 outline-none transition focus:border-[#6c8ef7]"
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          readOnly={readOnly}
          aria-readonly={readOnly}
        />
      )}
    </label>
=======
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

function SettingIcon({ type }: { type: 'lock' | 'bell' | 'mail' | 'shield' | 'download' }) {
  if (type === 'lock') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V8a4 4 0 0 1 8 0v2" /></svg>;
  if (type === 'bell') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9a4 4 0 1 1 8 0v3.2c0 .8.3 1.6.9 2.2l1 1.1H6.1l1-1.1c.6-.6.9-1.4.9-2.2V9" /><path d="M10 17a2 2 0 0 0 4 0" /></svg>;
  if (type === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2" /><path d="m5 8 7 5 7-5" /></svg>;
  if (type === 'shield') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.4 2.7 8.5 7 10 4.3-1.5 7-5.6 7-10V6l-7-3Z" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v9" /><path d="m8.5 10.5 3.5 3.5 3.5-3.5" /><path d="M5 18h14" /></svg>;
}

function Toggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button type="button" className={`setting-toggle ${checked ? 'on' : ''}`} role="switch" aria-checked={checked} aria-label={label} onClick={onToggle}>
      <span />
    </button>
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
  );
}

function ProfileContent() {
  const { user } = useAuth();
<<<<<<< HEAD
  const [contactDraft, setContactDraft] = useState<ContactInfo>(initialContactInfo);
  const [isEditingContact, setIsEditingContact] = useState(false);

  const profileName = user?.name ?? 'John Doe';
  const nameParts = profileName.trim().split(/\s+/);
  const profileDetails = {
    lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : 'Doe',
    firstName: nameParts[0] || 'John',
    middleInitial: 'M',
    suffix: 'Jr.',
    birthdate: 'January 15, 1998',
    academicUnit: 'School of Engineering',
    collegeDepartment: 'Computer Science',
    yearGraduated: '2020',
  };

  const handleContactAction = () => {
    setIsEditingContact((current) => !current);
  };

  const handleCancelEdit = () => {
    setContactDraft(initialContactInfo);
    setIsEditingContact(false);
  };

  return (
    <section className="mx-auto w-full max-w-[1450px] px-4 py-4 sm:px-6 sm:py-6" aria-label="Profile settings">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
        <article className="rounded-[22px] border border-[#e8edf6] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-7 sm:py-7" aria-label="User information">
          <header>
            <h2 className="text-[27px] font-extrabold tracking-[-0.04em] text-slate-950">Personal Info</h2>
            <p className="mt-3 text-[15px] leading-6 text-[#58739b]">Review your profile details and update your contact information when needed.</p>
          </header>

          <div className="mt-6 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <FieldLabel>Last Name</FieldLabel>
                <StaticValue>{profileDetails.lastName}</StaticValue>
              </div>
              <div>
                <FieldLabel>First Name</FieldLabel>
                <StaticValue>{profileDetails.firstName}</StaticValue>
              </div>
              <div>
                <FieldLabel>Middle Initial</FieldLabel>
                <StaticValue>{profileDetails.middleInitial}</StaticValue>
              </div>
              <div>
                <FieldLabel>Suffix</FieldLabel>
                <StaticValue>{profileDetails.suffix}</StaticValue>
              </div>
            </div>

            <div>
              <FieldLabel>Birthdate</FieldLabel>
              <StaticValue>{profileDetails.birthdate}</StaticValue>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <FieldLabel>Academic Unit</FieldLabel>
                <StaticValue>{profileDetails.academicUnit}</StaticValue>
              </div>
              <div>
                <FieldLabel>College Department</FieldLabel>
                <StaticValue>{profileDetails.collegeDepartment}</StaticValue>
              </div>
              <div>
                <FieldLabel>Year Graduated</FieldLabel>
                <StaticValue>{profileDetails.yearGraduated}</StaticValue>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[22px] border border-[#e8edf6] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.05)] sm:px-7 sm:py-7" aria-label="Editable contact information">
          <header>
            <h2 className="text-[27px] font-extrabold tracking-[-0.04em] text-slate-950">Contact Details</h2>
            <p className="mt-3 text-[15px] leading-6 text-[#58739b]">Only these fields can be edited.</p>
          </header>

          <div className="mt-6 space-y-5">
            <ContactInput
              label="Email Address"
              type="email"
              value={contactDraft.email}
              onChange={(value) => setContactDraft((current) => ({ ...current, email: value }))}
              readOnly={!isEditingContact}
            />

            <ContactInput
              label="Contact Number"
              type="tel"
              value={contactDraft.contactNumber}
              onChange={(value) => setContactDraft((current) => ({ ...current, contactNumber: value }))}
              readOnly={!isEditingContact}
            />

            <ContactInput
              label="Mailing Address"
              value={contactDraft.mailingAddress}
              onChange={(value) => setContactDraft((current) => ({ ...current, mailingAddress: value }))}
              readOnly={!isEditingContact}
              multiline
            />

            <div className="flex flex-wrap gap-3 pt-1">
              <button
                className="inline-flex h-11 items-center rounded-full bg-[#4e79ff] px-5 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(78,121,255,0.22)] transition hover:bg-[#3f6df5]"
                type="button"
                onClick={handleContactAction}
              >
                {isEditingContact ? 'Save Changes' : 'Update Information'}
              </button>

              {isEditingContact ? (
                <button
                  className="h-11 rounded-full border border-[#dbe3f1] px-5 text-[15px] font-semibold text-[#58739b] transition hover:bg-slate-50"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        </article>
      </div>
=======
  const router = useRouter();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <section className="profile-main-layout" aria-label="Profile settings">
      <aside className="section-card settings-card" aria-label="Notifications and privacy settings">
        <header>
          <h2>Settings</h2>
          <p>Manage account notifications and privacy. Signed in as <strong style={{ color: '#f5a623' }}>{user?.email}</strong></p>
        </header>

        <div className="settings-group">
          <h3>Account</h3>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="lock" /></span>
            <span className="setting-copy"><strong>Change Password</strong><small>Update your account password</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
        </div>

        <div className="settings-group">
          <h3>Notifications</h3>
          <div className="setting-row">
            <span className="setting-icon-wrap"><SettingIcon type="bell" /></span>
            <span className="setting-copy"><strong>Push Notifications</strong><small>Receive app notifications</small></span>
            <Toggle checked={pushNotifications} onToggle={() => setPushNotifications((p) => !p)} label="Toggle push notifications" />
          </div>
          <div className="setting-row">
            <span className="setting-icon-wrap"><SettingIcon type="mail" /></span>
            <span className="setting-copy"><strong>Email Notifications</strong><small>Receive updates via email</small></span>
            <Toggle checked={emailNotifications} onToggle={() => setEmailNotifications((p) => !p)} label="Toggle email notifications" />
          </div>
        </div>

        <div className="settings-group">
          <h3>Privacy &amp; Security</h3>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="shield" /></span>
            <span className="setting-copy"><strong>Privacy Policy</strong><small>View our privacy policy</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="shield" /></span>
            <span className="setting-copy"><strong>Terms &amp; Conditions</strong><small>View terms of service</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
          <a className="setting-row clickable" href="#">
            <span className="setting-icon-wrap"><SettingIcon type="download" /></span>
            <span className="setting-copy"><strong>Download My Data</strong><small>Export your personal data</small></span>
            <span className="setting-chevron">&gt;</span>
          </a>
        </div>

        <button className="signout-btn" type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </aside>
>>>>>>> 57fc38d9ff45965d75ad134eebf190823cbbebfe
    </section>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
