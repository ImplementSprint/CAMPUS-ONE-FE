'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { GraduateExitOnboardingPage } from '@/admin/pages/alumni-admin/views/GraduateExitOnboardingPage';

export default function AlumniAdminGraduateExitPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <GraduateExitOnboardingPage />
    </ProtectedRoute>
  );
}
