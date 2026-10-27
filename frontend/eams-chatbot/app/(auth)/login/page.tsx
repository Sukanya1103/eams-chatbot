// src/app/(auth)/login/page.tsx
// One login form for every role. The backend returns a JWT with the role
// baked in; middleware.ts reads it and routes to the correct dashboard.
// No role selector here on purpose — the credentials alone determine it.

"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api/auth";
import { ROLE_HOME } from "@/types/user";

export default function LoginPage() {
  return <Suspense fallback={<main className="min-h-screen bg-cyan-50" />}><LoginForm /></Suspense>;
}

function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const { user } = await login({ email, password });
      router.replace(ROLE_HOME[user.role]);
      router.refresh();
    } catch {
      setError("That email or password isn't right. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cyan-50 px-4 py-10">
      <div className="absolute inset-x-0 top-0 h-2 bg-cyan-600" />
      <div className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-100 bg-white shadow-2xl shadow-cyan-950/10">
        <div className="bg-cyan-700 px-8 py-7 text-white">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white text-lg font-black text-cyan-700">E</div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-100">Enterprise access</p>
          <h1 className="mt-1 text-2xl font-bold">Welcome to EAMS</h1>
          <p className="mt-2 text-sm text-cyan-100">Sign in to your employee management workspace.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 px-8 py-7">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Work email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-cyan-200 px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-cyan-200 px-3 py-2.5 text-sm text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-cyan-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:opacity-50"
          >
            {isSubmitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="border-t border-cyan-100 px-8 py-4 text-center text-xs text-slate-400">Authorized personnel only · Secure company system</p>
      </div>
    </main>
  );
}

