# Deployment

## Apps

```text
apps/web-lms    -> campusone.com and platform/login flows
apps/web-school -> {schoolSlug}.campusone.com internal school portal
```

## Required Environment

```text
BACKEND_API_URL
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN
NEXT_PUBLIC_SCHOOL_PORTAL_BASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

No Supabase service-role key belongs in this repo.

## Local Development

```powershell
npm ci
npm run dev:web-lms
npm run dev:web-school
```

Suggested local URLs:

```text
web-lms:    http://localhost:3000
web-school: http://localhost:3001?school=san-beda
backend:    http://localhost:4000
```

## Production Domains

```text
campusone.com              -> apps/web-lms
app.campusone.com          -> apps/web-lms or platform dashboard
{schoolSlug}.campusone.com -> apps/web-school
api.campusone.com          -> campus-one-backend
```

## Build

```powershell
npm ci
npm run build
```

The current production build can emit Recharts static-render size warnings during prerender. Treat non-zero exit codes as blocking; the warnings alone are not blocking.
