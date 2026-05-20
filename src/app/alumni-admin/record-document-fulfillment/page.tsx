'use client';

import { ProtectedRoute } from '../../components/ProtectedRoute';
import { RecordDocumentFulfillmentPage } from '@/admin/pages/alumni-admin/views/RecordDocumentFulfillmentPage';

export default function AlumniAdminRecordDocumentFulfillmentPage() {
  return (
    <ProtectedRoute allowedRoles={['alumni_admin']}>
      <RecordDocumentFulfillmentPage />
    </ProtectedRoute>
  );
}
