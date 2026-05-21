'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { StudentAdminDashboard } from '../../admin/pages/StudentAdminDashboard';

export default function StudentAdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['student_admin']}>
      <StudentAdminDashboard />
    </ProtectedRoute>
  );
}
