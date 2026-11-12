# 🏢 EAMS — Employee Attendance Management System

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

EAMS is a role-based portal for managing employee **attendance, leave, and salary**. It includes a built-in **AI assistant** that answers natural-language questions ("who's on leave today?", "how many leave days do I have left?") using only the data the signed-in user is allowed to see.

> 🚧 **Status: In progress.** The frontend is complete for all roles. The backend currently covers authentication and employee management. See [Project Status](#-project-status).

---

## 📑 Table of Contents

- [Roles and Permissions](#-roles-and-permissions)
- [How Access Control Works](#-how-access-control-works)
- [Authentication Flow](#-authentication-flow)
- [Project Structure](#-project-structure)
- [Setup](#-setup)
- [Project Status](#-project-status)
- [Security Notes](#-security-notes)

---

## 👥 Roles and Permissions

| Role | Can see | Can do |
|---|---|---|
| **Admin** | Everyone's data | Everything HR can do, plus company-wide reports |
| **HR** | Everyone's data | Register employees, approve/reject leaves, manage salary, reset anyone's password |
| **Manager** | Direct reports only | Approve/reject team leaves, view team attendance |
| **Employee** | Own data only | Check in/out, apply for leave, view own payslips |

There is **no self-registration**. HR or Admin creates every account, and the system issues a one-time temporary password. Nobody chooses their own initial password.

Every role also gets the AI assistant, which only answers using data that role is allowed to see.

---

## 🔐 How Access Control Works

The key design decision in this project: **the frontend never decides who can see what.**

Every data endpoint (`GET /api/leaves`, `GET /api/attendance`, `GET /api/salary`, `POST /api/chatbot/ask`, etc.) is called the same way for every role. There is no `?scope=team` parameter and no role flag sent from the client. The backend reads the caller's **role and employee ID from the JWT** and returns only what that role may see.

A Manager and an HR user can call the same endpoint and safely get different results, because filtering happens once, server-side.

**Why this matters**
- The frontend can't be tricked into showing restricted data, because it never receives it.
- Adding a new page for an existing data type (for example a future `/admin/attendance`) usually needs no new backend work.

---

## 🔑 Authentication Flow

1. **HR/Admin registers an employee.** The backend creates a `User` (credentials) and an `Employee` (profile) document, and returns a random temporary password once.
2. **The employee logs in** with it. The backend issues a JWT containing their `role` and `employeeId`.
3. **The Next.js login route stores the JWT in an httpOnly cookie** (not accessible to client-side JavaScript) and redirects to the dashboard for their role.
4. **On each request,** a Next.js API route reads the cookie server-side and forwards the token to Spring Boot as `Authorization: Bearer <token>`. The backend only trusts Bearer tokens, never cookies.
5. **Spring Boot's `JwtAuthFilter` validates the token** on every request and sets up the security context, so `@PreAuthorize` checks (for example `hasAnyRole('HR', 'ADMIN')`) work correctly.

A bootstrap seeder (`DataSeeder`) creates exactly one Admin account the first time the backend starts against an empty database. That gives you the first login before anyone else can be registered.

---

## 📁 Project Structure

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
│   │   │   └── settings/              # Change password (shared by all roles)
│   │   └── api/                       # BFF routes: bridge cookie auth to Bearer tokens
│   ├── components/                    # Sidebars, tables, forms, chat window
│   ├── lib/
│   │   ├── api/                       # Client-side calls (browser → BFF routes)
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
        ├── config/                    # CORS, DataSeeder (bootstrap admin)
        └── exception/                 # Centralized error handling
```

---

## ⚙️ Setup

### Prerequisites
- Node.js and npm
- Java and Maven
- A MongoDB Atlas cluster (Network Access must allow your IP)

### 1. Backend

Set these environment variables:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/eams?retryWrites=true&w=majority
JWT_SECRET=<a long random string, e.g. from: openssl rand -base64 32>
```

Then build and run:

```bash
cd backend/eams-chatbot
mvn clean install
```

Run `EamsChatbotApplication` from your IDE (or with `mvn spring-boot:run`).

On first run, **watch the console**: it prints the seeded Admin's email and temporary password.

The backend runs on `http://localhost:8081` by default.

### 2. Frontend

```bash
npm install
```

Create `.env.local` in the project root:

```env
BACKEND_URL=http://localhost:8081
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

### 3. First login

Log in with the seeded Admin credentials from the backend console. From there, Admin (or HR, once registered) can create every other account.

---

## 📊 Project Status

The **frontend** is fully built for every role and every planned page.

**Backend: implemented**
- [x] Login, JWT issuance and validation
- [x] Employee registration (HR/Admin)
- [x] Self-service password change
- [x] Admin/HR password reset for any employee

**Backend: in progress** (frontend UI is ready and waiting)
- [ ] Attendance: `GET/POST /api/attendance`, check-in/out
- [ ] Leaves: `GET /api/leaves`, apply/approve/reject
- [ ] Salary: `GET/POST /api/salary`
- [ ] AI chatbot: `POST /api/chatbot/ask`
- [ ] Reports/analytics endpoint (the Admin Reports page currently computes stats client-side from the employee, leave, and attendance lists)

Each pending frontend page already calls the endpoint shape described above, so it will work as soon as the matching backend controller and service exist, with no frontend changes needed.

---

## 🛡️ Security Notes

- Passwords are never stored or sent in plaintext, except in a single one-time API response (registration or password reset). The database only holds a **bcrypt hash**.
- JWTs live in **httpOnly cookies** on the frontend, never accessible to JavaScript, and are sent to the backend only as **Bearer tokens**. Because the API doesn't rely on cookies for auth, CSRF is not a relevant attack surface for the API itself.
- Every protected backend endpoint enforces its own role check with `@PreAuthorize`. Hiding a button or link in the frontend is a UX convenience, never the real security boundary.

---
## 👩‍💻 Author

**Sukanya Rana** — [GitHub](https://github.com/Sukanya1103) · [LinkedIn](https://www.linkedin.com/in/sukanya-rana-719832345)
