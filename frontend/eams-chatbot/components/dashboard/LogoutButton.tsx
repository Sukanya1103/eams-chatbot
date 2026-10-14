// components/dashboard/LogoutButton.tsx
// Shared by all 4 sidebars — clears the httpOnly cookie via the BFF route,
// then sends the user back to /login.

"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/api/auth";

export default function LogoutButton({ collapsed = false }: { collapsed?: boolean }) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      aria-label="Sign out"
      title={collapsed ? "Sign out" : undefined}
      className={`w-full rounded-lg border border-cyan-500/70 px-3 py-2.5 text-sm font-medium text-cyan-50 transition hover:bg-cyan-600 hover:text-white ${
        collapsed ? "text-center" : "text-left"
      }`}
    >
      {collapsed ? "↗" : "Sign out"}
    </button>
  );
}
