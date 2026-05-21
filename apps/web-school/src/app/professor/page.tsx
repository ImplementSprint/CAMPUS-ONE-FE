'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorDashboard } from './pages/ProfessorDashboard';

export default function ProfessorPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <ProfessorDashboard />
    </ProtectedRoute>
  );
}
