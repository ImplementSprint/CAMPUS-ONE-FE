'use client';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { UnifiedAdminDashboard } from './pages/UnifiedAdminDashboard';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <UnifiedAdminDashboard />
    </ProtectedRoute>
  );
}
