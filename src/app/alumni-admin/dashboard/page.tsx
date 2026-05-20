'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import AlumniAdminPage from '@/admin/pages/alumni-admin/AlumniAdminDashboard';

export default function AlumniAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <AlumniAdminPage />
    </ProtectedRoute>
  );
}
