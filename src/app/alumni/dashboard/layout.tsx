'use client';
import '../../../admin/alumni-admin/styles/globals.css';
import { AppShell } from '../../../alumni/components/layout/AppShell';
import { AlumniProvider } from '../../../alumni/components/app/AlumniContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';

export default function AlumniDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['alumni']}>
      <AlumniProvider>
        <AppShell>{children}</AppShell>
      </AlumniProvider>
    </ProtectedRoute>
  );
}

