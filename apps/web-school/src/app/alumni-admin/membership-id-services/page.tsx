'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { MembershipIdServicesPage } from '@/admin/pages/alumni-admin/views/MembershipIdServicesPage';

export default function AlumniAdminMembershipIdServicesPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <MembershipIdServicesPage />
    </ProtectedRoute>
  );
}
