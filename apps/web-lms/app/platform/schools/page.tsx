import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SchoolReviewDashboard } from '@/components/platform/SchoolReviewDashboard';

export default async function PlatformSchoolsPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;

  if (role !== 'super_admin') {
    redirect('/');
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-950 lg:px-8">
      <SchoolReviewDashboard />
    </main>
  );
}
