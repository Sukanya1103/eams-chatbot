// components/dashboard/SidebarLink.tsx
// Tiny shared piece so all 4 sidebars look and behave consistently.
// Highlights itself when the current route matches.

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarIcon, { type SidebarIconName } from "./SidebarIcon";

export default function SidebarLink({
  href,
  label,
  icon,
  collapsed = false,
  onNavigate,
  active,
}: {
  href: string;
  label: string;
  icon?: SidebarIconName;
  collapsed?: boolean;
  onNavigate?: () => void;
  active?: boolean;
}) {
  const pathname = usePathname();
  const isRootDashboard = /^\/(admin|hr|manager|employee)$/.test(href);
  const isActive = active ?? (isRootDashboard ? pathname === href : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-label={label}
      aria-current={isActive ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 ${collapsed ? "justify-center" : ""} ${
        isActive
          ? "bg-[#3B82F6] text-white shadow-sm"
          : "text-slate-100 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon && <SidebarIcon name={icon} />}
      <span className={collapsed ? "sr-only" : "truncate"}>{label}</span>
    </Link>
  );
}
