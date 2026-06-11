'use client';
import React from 'react';

import { useEffect, useState } from 'react';
import { getProfile } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [ap, setAp] = useState<any>(null);
  const [parent, setParent] = useState<any>(null);
  const [academic, setAcademic] = useState<any[]>([]);
  const [alumni, setAlumni] = useState<any[]>([]);
  const [program, setProgram] = useState<any>(null);
  const [studentNumber, setStudentNumber] = useState('—');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    
    const loadProfile = async () => {
      try {
        const profileData = await getProfile(user.id);
        setAp(profileData.applicant);
        setParent(profileData.parent);
        setAcademic(profileData.academic);
        setProgram(profileData.program);
        setAlumni(profileData.alumni);
        setStudentNumber(profileData.studentNumber ?? '—');
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, authLoading]);

  const fmt = (iso: string | null) => iso ? new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—';
  const fullName = ap ? `${ap.first_name} ${ap.middle_name ? ap.middle_name + ' ' : ''}${ap.last_name}`.trim() : '—';

  return (
    <DashboardLayout>
      <div className="p-3.5 md:p-6 w-full pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500">Loading profile...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Avatar + Title Card */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-3.5">
          <div className="flex flex-col items-center mb-5">
            <div className="w-24 h-24 rounded-full bg-amber-500 flex items-center justify-center mb-3">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-black text-gray-900 text-center">Student Profile</h1>
          </div>

          <InfoRow icon="person" label="Full Name" value={fullName} />
          <InfoRow icon="card" label="Student Number" value={studentNumber} />
          <InfoRow icon="mail" label="Email" value={ap?.email ?? '—'} />
          <InfoRow icon="phone" label="Contact Number" value={ap?.mobile_number ?? '—'} />
          <InfoRow icon="location" label="Address" value={ap?.address ?? '—'} />
          <InfoRow icon="calendar" label="Date of Birth" value={fmt(ap?.birthdate)} />
          <InfoRow icon="school" label="Program" value={ap?.program ?? '—'} />
          <InfoRow icon="check" label="Status" value={ap?.status ?? '—'} isLast />
        </div>

        {/* Program */}
        {program && (
          <Section title="College / Course Information">
            <InfoRow icon="library" label="Program" value={program.college_program ?? program.senior_high_track ?? '—'} />
            <InfoRow icon="grid" label="Department" value={program.college_department ?? '—'} isLast />
          </Section>
        )}

        {/* Parents */}
        {parent && (
          <Section title="Parents / Guardian Information">
            <InfoRow icon="person" label="Father" value={parent.father_name} />
            <InfoRow icon="person" label="Mother" value={parent.mother_name} />
            <InfoRow icon="phone" label="Contact No." value={parent.father_contact} />
            <InfoRow icon="location" label="Address" value={parent.father_address} />
            <InfoRow icon="person-circle" label="Guardian" value={parent.guardian_name} />
            <InfoRow icon="location" label="Guardian Address" value={parent.guardian_address} />
            <InfoRow icon="phone" label="Phone (Home)" value={parent.guardian_phone_home} />
            <InfoRow icon="phone" label="Phone (Work)" value={parent.guardian_phone_work} isLast />
          </Section>
        )}

        {/* Academic */}
        {academic.length > 0 && (
          <Section title="Educational Background">
            {academic.map((row, i) => (
              <div key={i} className={`flex gap-2 py-2.5 text-xs ${i < academic.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <span className="flex-[1.2] text-gray-600 font-medium">{row.grade_level}</span>
                <span className="flex-[2] text-gray-900 font-semibold">{row.school_name}</span>
                <span className="flex-[0.8] text-gray-500 text-right">{row.completion_year}</span>
              </div>
            ))}
          </Section>
        )}

        {/* Alumni */}
        {alumni.length > 0 && (
          <Section title="Alumni Information">
            {alumni.map((row, i) => (
              <InfoRow key={i} icon="people" label={row.relationship} value={`${row.name} - ${row.college} - ${row.batch_year}`} isLast={i === alumni.length - 1} />
            ))}
          </Section>
        )}
      </>
    )}
      </div>
    </DashboardLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-3.5">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-black text-gray-900">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function InfoRow({ icon, label, value, isLast }: { icon: string; label: string; value: string; isLast?: boolean }) {
  const iconMap: Record<string, React.ReactElement> = {
    person: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    card: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
    mail: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    phone: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    location: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    calendar: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    school: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 13c0 5.523-4.477 10-10 10S1 18.523 1 13c0-.34.016-.678.048-1.013L12 14z" /></svg>,
    check: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    library: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>,
    grid: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
    'person-circle': <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    people: <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  };

  return (
    <div className={`flex gap-3 items-center bg-gray-50 border border-gray-200 rounded-xl p-3 ${!isLast ? 'mb-2.5' : ''}`}>
      <div className="text-gray-500 flex-shrink-0">{iconMap[icon] || iconMap.person}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-sm text-gray-900 font-bold mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}


