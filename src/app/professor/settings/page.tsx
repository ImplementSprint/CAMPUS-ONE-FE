'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorSettings } from '../pages/ProfessorSettings';

export default function ProfessorSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <ProfessorSettings />
      </div>
    </ProtectedRoute>
  );
}
