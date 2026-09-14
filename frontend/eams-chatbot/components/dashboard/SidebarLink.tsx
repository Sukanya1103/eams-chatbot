// components/dashboard/SidebarLink.tsx
// Tiny shared piece so all 4 sidebars look and behave consistently.
// Highlights itself when the current route matches.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        isActive
          ? "bg-white text-cyan-800 shadow-sm"
          : "text-cyan-50 hover:bg-cyan-600 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
