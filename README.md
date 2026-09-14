# EAMS — Employee Attendance Management System

A role-based portal for managing employee attendance, leave, and salary, with a built-in AI assistant that answers questions scoped to what each signed-in user is allowed to see.

**Stack:** Next.js 14+ (App Router, TypeScript, Tailwind) · Spring Boot 4 (Java) · MongoDB Atlas · JWT authentication

---

## Roles

| Role | Can see | Can do |
|---|---|---|
| **Admin** | Everyone's data | Everything HR can do, plus company-wide reports |
| **HR** | Everyone's data | Register employees, approve/reject leaves, manage salary, reset anyone's password |
| **Manager** | Their direct reports only | Approve/reject their team's leaves, view team attendance |
| **Employee** | Only their own data | Check in/out, apply for leave, view their own payslips |

There's no self-registration — HR or Admin creates every account, which issues a one-time temporary password. Nobody chooses their own initial password.

Every role also has access to an AI assistant that answers natural-language questions ("who's on leave today?", "how many days do I have left?") using only the data that role is allowed to see. Scoping happens entirely on the backend — the frontend never decides what's safe to show.

---

## How access control actually works

The single most important design decision in this project: **the frontend never decides who can see what.** Every data-fetching endpoint (`GET /api/leaves`, `GET /api/attendance`, `GET /api/salary`, `POST /api/chatbot/ask`, etc.) is called *identically* regardless of role — there's no `?scope=team` query param, no role flag sent from the client. The backend reads the caller's role and employee ID from their JWT and returns only what that role is allowed to see. A Manager and an HR user can call the exact same endpoint and get different results, safely, because the filtering happens server-side, once, in one place.

This means:
- The frontend can't be tricked into showing data it shouldn't (there's nothing to trick — it never receives out-of-scope data in the first place)
- Adding a new page for an existing data type (e.g. a future `/admin/attendance`) usually means zero new backend work

---

## Project structure

```
EAMS/
├── (frontend — Next.js, project root)
│   ├── app/
│   │   ├── (auth)/login/              # Public login page
│   │   ├── (dashboard)/               # Everything behind auth
│   │   │   ├── admin/                 # Overview, Employees, Reports, Chatbot
│   │   │   ├── hr/                    # Overview, Register employee, Leaves, Salary, Chatbot
│   │   │   ├── manager/               # Overview, Team attendance, Team leaves, Chatbot
│   │   │   ├── employee/              # Overview, My attendance, My leaves, My salary, Chatbot
│   │   │   └── settings/              # Change password (shared by every role)
│   │   └── api/                       # BFF routes — bridge cookie auth to Bearer tokens
│   ├── components/                    # Sidebars, tables, forms, chat window
│   ├── lib/
│   │   ├── api/                       # Client-side calls (browser → our BFF routes)
│   │   ├── server/                    # Server Component calls (direct → Spring Boot)
│   │   └── auth/                      # Session/JWT helpers
│   ├── types/                         # Shared TypeScript types
│   └── middleware.ts                  # Route-level auth + role guarding
│
└── backend/eams-chatbot/              # Spring Boot, Maven
    └── src/main/java/com/eams/eams_chatbot/
        ├── controller/                # REST endpoints
        ├── service/                   # Business logic
        ├── security/                  # JWT provider, filter, Spring Security config
        ├── model/                     # MongoDB documents (User, Employee, ...)
        ├── repository/                # Spring Data MongoDB repositories
        ├── dto/request/ + dto/response/
        ├── config/                    # CORS, DataSeeder (bootstrap admin account)
        └── exception/                 # Centralized error handling
```

---

## Authentication flow

1. HR/Admin registers an employee → backend creates a `User` (login credentials) + `Employee` (profile) document, and returns a randomly generated temporary password **once**.
2. That person logs in with it. The backend issues a JWT containing their `role` and `employeeId`.
3. The frontend's login route stores the JWT in an **httpOnly cookie** (never touchable by client-side JS) and redirects to the dashboard matching their role.
4. On every subsequent request, a Next.js API route reads that cookie server-side and forwards the token to Spring Boot as `Authorization: Bearer <token>` — the actual backend never trusts cookies for auth, only Bearer tokens.
5. Spring Boot's `JwtAuthFilter` validates the token on every request and populates the security context, so `@PreAuthorize` checks on controllers (e.g. `hasAnyRole('HR', 'ADMIN')`) work correctly.

There's a bootstrap seeder (`DataSeeder`) that creates exactly one Admin account the first time the backend starts against an empty database — that's how you get your very first login before anyone else can be registered.

---

## Setup

### Backend

1. Requires a MongoDB Atlas cluster (Network Access must allow your IP).
2. Set two environment variables before running:
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/eams?retryWrites=true&w=majority
   JWT_SECRET=<a long random string, e.g. via `openssl rand -base64 32`>
   ```
3. `mvn clean install` then run `EamsChatbotApplication`. Watch the console on first run — it prints the seeded Admin's email and temporary password.
4. Runs on `http://localhost:8081` by default.

### Frontend

1. `npm install`
2. Create `.env.local`:
   ```
   BACKEND_URL=http://localhost:8081
   ```
3. `npm run dev` — runs on `http://localhost:3000`.

Log in with the seeded Admin credentials from the backend console. From there, Admin (or HR, once registered) can create every other account.

---

## What's implemented vs. what's frontend-only

The frontend is fully built for every role and every planned page. The backend currently implements:

- Login, JWT issuance and validation
- Employee registration (HR/Admin)
- Self-service password change
- Admin/HR password reset for any employee

Not yet implemented on the backend (frontend UI exists and is ready to connect):
- Attendance (`GET/POST /api/attendance`, check-in/out)
- Leaves (`GET /api/leaves`, apply/approve/reject)
- Salary (`GET/POST /api/salary`)
- Chatbot (`POST /api/chatbot/ask`)
- Reports/analytics endpoint (the Admin Reports page currently derives its stats client-side from the employee/leave/attendance lists rather than a dedicated aggregation endpoint)

Every one of these frontend pages already calls the exact endpoint shape described above and will work as soon as the corresponding backend controller/service exists — no frontend changes needed.

---

## Security notes

- Passwords are never stored or transmitted in plaintext outside of a single one-time API response (registration, password reset). The database only ever holds a bcrypt hash.
- JWTs live in httpOnly cookies on the frontend, never accessible to JavaScript, and are only ever sent to the backend as Bearer tokens — not as cookies — so CSRF isn't a relevant attack surface for the API itself.
- Every protected backend endpoint enforces its own role check via `@PreAuthorize`; the frontend hiding a button or link is a UX convenience, never the actual security boundary.
