'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorStudents } from '../pages/ProfessorStudents';

export default function ProfessorStudentsPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <ProfessorStudents />
      </div>
    </ProtectedRoute>
  );
}
