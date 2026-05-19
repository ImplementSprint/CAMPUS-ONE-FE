'use client';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ProfessorDashboard } from './pages/ProfessorDashboard';

export default function ProfessorPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <ProfessorDashboard />
    </ProtectedRoute>
  );
}
