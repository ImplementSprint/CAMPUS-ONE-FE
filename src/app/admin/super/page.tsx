'use client';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import SuperAdminDashboard from '@/admin/pages/super-admin/SuperAdminDashboard';

export default function SuperAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <SuperAdminDashboard />
    </ProtectedRoute>
  );
}
