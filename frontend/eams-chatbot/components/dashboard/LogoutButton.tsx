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
      className="w-full rounded-lg border border-cyan-500/70 px-3 py-2.5 text-left text-sm font-medium text-cyan-50 transition hover:bg-cyan-600 hover:text-white"
    >
      Sign out
    </button>
  );
}
