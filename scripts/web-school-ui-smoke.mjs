const baseUrl = process.env.WEB_SCHOOL_BASE_URL || 'http://localhost:3001';

const routes = [
  { path: '/', expected: 200, mustContain: 'Choose where you need to go.' },
  { path: '/login', expected: 200, mustContain: 'Sign in to access your portal' },
  { path: '/admissions', expected: 200, mustContain: 'Start Your Application' },
  { path: '/admissions/track', expected: 200, mustContain: 'Track Your Application' },
  { path: '/alumni/register', expected: 200, mustContain: 'Alumni' },
  { path: '/dashboard', expected: 200, allowRedirectTo: '/login' },
  { path: '/admin/campus-dashboard', expected: 200, allowRedirectTo: '/login' },
  { path: '/professor', expected: 200, allowRedirectTo: '/login' },
  { path: '/alumni/dashboard', expected: 200, allowRedirectTo: '/login' },
];

for (const route of routes) {
  const response = await fetch(`${baseUrl}${route.path}`, { redirect: 'manual' });
  const location = response.headers.get('location') || '';
  const body = await response.text();

  const redirectedOk =
    response.status >= 300 &&
    response.status < 400 &&
    route.allowRedirectTo &&
    location.includes(route.allowRedirectTo);
  const statusOk = response.status === route.expected || redirectedOk;
  const contentOk = route.mustContain ? body.includes(route.mustContain) : true;

  if (!statusOk || !contentOk) {
    console.error(
      JSON.stringify(
        {
          path: route.path,
          status: response.status,
          location,
          expected: route.expected,
          allowRedirectTo: route.allowRedirectTo,
          contentOk,
        },
        null,
        2,
      ),
    );
    process.exitCode = 1;
  } else {
    console.log(`OK ${route.path} -> ${response.status}${location ? ` ${location}` : ''}`);
  }
}
