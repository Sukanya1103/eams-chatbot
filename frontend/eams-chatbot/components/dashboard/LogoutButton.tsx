// components/dashboard/LogoutButton.tsx
// Shared by all 4 sidebars — clears the httpOnly cookie via the BFF route,
// then sends the user back to /login.

"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full rounded-md px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-900"
    >
      Sign out
    </button>
  );
}
