import '@/admin/alumni-admin/styles/globals.css'
import { UnifiedAdminLayout } from '@/admin/components/UnifiedAdminLayout'

export default function AlumniAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UnifiedAdminLayout>
      {children}
    </UnifiedAdminLayout>
  )
}
