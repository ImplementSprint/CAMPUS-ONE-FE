'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { AdminSettingsPage } from '@/admin/pages/alumni-admin/views/AdminSettingsPage';

export default function SettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <AdminSettingsPage />
    </ProtectedRoute>
  );
}
