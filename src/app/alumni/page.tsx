'use client';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AlumniDashboard } from './pages/AlumniDashboard';

export default function AlumniPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <AlumniDashboard />
    </ProtectedRoute>
  );
}
