// components/dashboard/SidebarLink.tsx
// Tiny shared piece so all 4 sidebars look and behave consistently.
// Highlights itself when the current route matches.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({
  href,
  label,
  collapsed = false,
}: {
  href: string;
  label: string;
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-label={label}
      title={collapsed ? label : undefined}
      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        collapsed ? "text-center" : ""
      } ${
        isActive
          ? "bg-white text-cyan-800 shadow-sm"
          : "text-cyan-50 hover:bg-cyan-600 hover:text-white"
      }`}
    >
      {collapsed ? label.charAt(0).toUpperCase() : label}
    </Link>
  );
}
