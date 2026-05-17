'use client';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { ApplicantAdminDashboard } from '@/admin/pages/applicant-admin/ApplicantAdminDashboard';

export default function ApplicantAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['applicant_admin']}>
      <ApplicantAdminDashboard onSwitchPortal={() => {}} />
    </ProtectedRoute>
  );
}
