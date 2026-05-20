'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import SuperAdminPage from '@/admin/pages/super-admin/SuperAdminDashboard';

export default function SuperAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <SuperAdminPage />
    </ProtectedRoute>
  );
}
