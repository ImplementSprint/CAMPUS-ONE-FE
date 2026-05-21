# API Contracts

The frontend repository consumes backend-owned contracts. Backend DTOs and route behavior are authoritative in `campus-one-backend`.

## Local Contract Packages

```text
packages/shared-contracts
packages/api-client
```

`packages/shared-contracts` contains browser-safe DTOs and enums. `packages/api-client` contains fetch helpers for LMS and school portal code.

## Public School Lookup

LMS proxies school discovery through its Next route handlers:

```http
GET /api/schools?search={query}
GET /api/schools/{slug}
```

The route handlers call the backend:

```http
GET {BACKEND_API_URL}/api/schools
GET {BACKEND_API_URL}/api/schools/{slug}
```

## Tenant Context

`web-school` sends the active school context to backend APIs with:

```http
X-School-Slug: {schoolSlug}
```

The school slug is resolved in this order:

1. `?school={slug}` query string for local development and LMS redirects.
2. Subdomain host such as `{schoolSlug}.campusone.com`.
3. `localStorage["campus-one:selected-school"]` fallback.
4. `NEXT_PUBLIC_SCHOOL_SLUG` for server-side/static build contexts.

## Contract Sync Rule

When backend contract types change, update `packages/shared-contracts` and `packages/api-client` in the same frontend PR or in a directly linked PR.

Do not import backend runtime modules into this repository.
