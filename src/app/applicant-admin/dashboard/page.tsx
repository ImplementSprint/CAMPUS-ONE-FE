'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { ApplicantAdminDashboard } from '../../admin/pages/ApplicantAdminDashboard';

export default function ApplicantAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['applicant_admin']}>
      <ApplicantAdminDashboard />
    </ProtectedRoute>
  );
}
