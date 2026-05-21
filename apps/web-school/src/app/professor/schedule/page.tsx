'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorSchedule } from '../pages/ProfessorSchedule';

export default function ProfessorSchedulePage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <ProfessorSchedule />
      </div>
    </ProtectedRoute>
  );
}
