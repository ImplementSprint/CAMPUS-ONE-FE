'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { DashboardPage } from '@/admin/alumni-admin/pages';

export default function AlumniAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <DashboardPage />
    </ProtectedRoute>
  );
}
