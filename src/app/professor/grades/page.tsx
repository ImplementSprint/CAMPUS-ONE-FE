'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorGrades } from '../pages/ProfessorGrades';

export default function ProfessorGradesPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <ProfessorGrades />
      </div>
    </ProtectedRoute>
  );
}
