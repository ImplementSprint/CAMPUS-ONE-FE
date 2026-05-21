# Frontend Secrets And Environment

This repo only uses public browser-safe values and deployment provider tokens. Do not add Supabase service-role keys here.

## GitHub Repository

```text
https://github.com/ImplementSprint/campus-one-fe
```

## Required GitHub Secrets

| Name | Used By | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Web builds while Supabase client paths still exist | Public Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Web builds while Supabase client paths still exist | Public anon key only. |
| `BACKEND_API_URL` | Server-side web routes and deployment config | Production value should be `https://api.campusone.com`. |
| `NEXT_PUBLIC_API_URL` | Browser-side API client | Production value should be `https://api.campusone.com`. |
| `NEXT_PUBLIC_API_BASE_URL` | Legacy browser-side API env compatibility | Keep aligned with `NEXT_PUBLIC_API_URL`. |

## Suggested Repository Variables

| Name | Example |
|---|---|
| `NEXT_PUBLIC_LMS_BASE_URL` | `https://campusone.com` |
| `NEXT_PUBLIC_SCHOOL_PORTAL_BASE_URL` | `https://app.campusone.com` |
| `NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN` | `campusone.com` |

## CLI Setup Template

Run these after the real values are available:

```powershell
gh secret set NEXT_PUBLIC_SUPABASE_URL --repo ImplementSprint/campus-one-fe
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --repo ImplementSprint/campus-one-fe
gh secret set BACKEND_API_URL --repo ImplementSprint/campus-one-fe
gh secret set NEXT_PUBLIC_API_URL --repo ImplementSprint/campus-one-fe
gh secret set NEXT_PUBLIC_API_BASE_URL --repo ImplementSprint/campus-one-fe

gh variable set NEXT_PUBLIC_LMS_BASE_URL --body https://campusone.com --repo ImplementSprint/campus-one-fe
gh variable set NEXT_PUBLIC_SCHOOL_PORTAL_BASE_URL --body https://app.campusone.com --repo ImplementSprint/campus-one-fe
gh variable set NEXT_PUBLIC_SCHOOL_PORTAL_DOMAIN --body campusone.com --repo ImplementSprint/campus-one-fe
```

## Verification

```powershell
npm ci
npm run verify
```
