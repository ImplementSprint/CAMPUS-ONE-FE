'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { EngagementCommunicationPage } from '@/admin/pages/alumni-admin/views/EngagementCommunicationPage';

export default function AlumniAdminEngagementCommunicationPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <EngagementCommunicationPage />
    </ProtectedRoute>
  );
}
