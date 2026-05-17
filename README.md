# Campus Portal — Frontend (Web)

Next.js 14 + Tailwind CSS web application. Desktop-first, fully responsive.

---

## Prerequisites

- Node.js 18+
- npm 9+
- A running Supabase project

---

## Setup

```bash
npm install
```

Create a `.env.local` file in this folder:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_STUDENT_API_URL=http://localhost:4004
NEXT_PUBLIC_ALUMNI_API_URL=http://localhost:4003
```

---

## Run

```bash
npm run dev       # Development server → http://localhost:3000
npm run build     # Production build
npm start         # Production server
```

---

## Pages & Routes

| Route | Description | Role |
|-------|-------------|------|
| `/` | Home / Entry page | Public |
| `/login` | Login page | Public |
| `/admissions` | Application wizard | Applicant |
| `/admissions/track` | Track application status | Public |
| `/dashboard` | Student dashboard | Student |
| `/subjects` | Browse subjects | Student |
| `/courses` | My courses | Student |
| `/grades` | Semestral grades | Student |
| `/enrollment` | Online enrollment | Student |
| `/add-drop` | Add/drop courses | Student |
| `/deficiencies` | Deficiencies | Student |
| `/graduation` | Graduation status | Student |
| `/payment` | Balance & payment | Student |
| `/profile` | Student profile | Student |
| `/professor` | Professor dashboard | Professor |
| `/alumni/dashboard` | Alumni dashboard | Alumni |
| `/alumni/register` | Alumni registration | Public |
| `/admin/applicant` | Applicant admin dashboard | applicant_admin |
| `/admin/student` | Student admin dashboard | student_admin |
| `/admin/alumni` | Alumni admin dashboard | alumni_admin |
| `/admin/super` | Super admin dashboard | super_admin |

---

## Admin Accounts

Admin accounts are stored in the `admin_users` table in Supabase with a `role` column:

| Role | Redirects To |
|------|-------------|
| `student_admin` | `/admin/student` |
| `applicant_admin` | `/admin/applicant` |
| `alumni_admin` | `/admin/alumni` |
| `super_admin` | `/admin/super` |

> Admin dashboards are desktop-only and blocked on mobile devices.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Auth:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Language:** TypeScript
