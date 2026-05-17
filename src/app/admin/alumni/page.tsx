'use client';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import AlumniAdminDashboard from '@/admin/pages/alumni-admin/AlumniAdminDashboard';

export default function AlumniAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <AlumniAdminDashboard />
    </ProtectedRoute>
  );
}
