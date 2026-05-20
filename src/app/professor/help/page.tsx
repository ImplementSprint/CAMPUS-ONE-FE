'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorHelp } from '../pages/ProfessorHelp';

export default function ProfessorHelpPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <ProfessorHelp />
      </div>
    </ProtectedRoute>
  );
}
