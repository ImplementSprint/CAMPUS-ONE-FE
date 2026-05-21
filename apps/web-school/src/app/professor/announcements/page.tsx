'use client';
import { ProtectedRoute } from '@/shared/ui/ProtectedRoute';
import { ProfessorAnnouncements } from '../pages/ProfessorAnnouncements';

export default function ProfessorAnnouncementsPage() {
  return (
    <ProtectedRoute allowedRoles={['professor']}>
      <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
        <ProfessorAnnouncements />
      </div>
    </ProtectedRoute>
  );
}
