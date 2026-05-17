'use client';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { StudentAdminDashboard } from '@/admin/pages/student-admin/StudentAdminDashboard';

export default function StudentAdminPage() {
  return (
    <ProtectedRoute allowedRoles={['student_admin']}>
      <StudentAdminDashboard />
    </ProtectedRoute>
  );
}
