import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const userRole = cookieStore.get('user_role')?.value;
  const hasLocalPlatformToken = Boolean(process.env.PLATFORM_SUPER_ADMIN_ACCESS_TOKEN);
  const hasPlatformCookie = Boolean(cookieStore.get('platform_access_token')?.value ?? cookieStore.get('access_token')?.value);

  if (userRole && userRole !== 'super_admin') {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f8fb] px-6 text-[#071943]">
        <div className="max-w-md rounded-[8px] border border-[#dfe5ee] bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5b00]">Restricted</p>
          <h1 className="mt-3 text-2xl font-black">Super admin access required</h1>
          <p className="mt-3 text-sm leading-6 text-[#52607e]">This platform route is limited to Campus One super admins.</p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-[8px] bg-[#071943] px-4 py-2 text-sm font-black text-white">
            Return to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!hasPlatformCookie && !hasLocalPlatformToken) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f8fb] px-6 text-[#071943]">
        <div className="max-w-lg rounded-[8px] border border-[#dfe5ee] bg-white p-8 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#ff5b00]">Missing token</p>
          <h1 className="mt-3 text-2xl font-black">Platform review token required</h1>
          <p className="mt-3 text-sm leading-6 text-[#52607e]">
            Sign in as a super admin that receives an access token, pass a bearer token to the proxy routes, or set
            PLATFORM_SUPER_ADMIN_ACCESS_TOKEN for local review.
          </p>
          <Link href="/login?next=/platform/schools" className="mt-6 inline-flex rounded-[8px] bg-[#ff5b00] px-4 py-2 text-sm font-black text-white">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  return children;
}
