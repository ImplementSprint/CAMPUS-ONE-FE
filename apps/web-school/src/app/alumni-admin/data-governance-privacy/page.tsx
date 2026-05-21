'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { DataGovernancePrivacyPage } from '@/admin/pages/alumni-admin/views/DataGovernancePrivacyPage';

export default function AlumniAdminDataGovernancePrivacyPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <DataGovernancePrivacyPage />
    </ProtectedRoute>
  );
}
