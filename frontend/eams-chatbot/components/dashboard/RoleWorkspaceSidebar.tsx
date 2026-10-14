"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import SidebarLink from "./SidebarLink";
import SidebarHeader, { type SidebarCollapseProps } from "./SidebarHeader";

type WorkspaceRole = "HR" | "MANAGER";

const SELF_LINKS = [
  { href: "/employee", label: "My overview" },
  { href: "/employee/my-attendance", label: "My attendance" },
  { href: "/employee/my-leaves", label: "My leaves" },
  { href: "/employee/my-salary", label: "My salary" },
];

const ROLE_CONFIG = {
  HR: {
    label: "HR workspace",
    roleHome: "/hr",
    roleLinks: [
      { href: "/hr", label: "Overview" },
      { href: "/hr/register-employee", label: "Register employee" },
      { href: "/hr/leaves", label: "Leave approvals" },
      { href: "/hr/salary", label: "Payroll" },
    ],
  },
  MANAGER: {
    label: "Manager workspace",
    roleHome: "/manager",
    roleLinks: [
      { href: "/manager", label: "Overview" },
      { href: "/manager/team-attendance", label: "Team attendance" },
      { href: "/manager/team-leaves", label: "Team leave approvals" },
    ],
  },
} as const;

export default function RoleWorkspaceSidebar({
  role,
  collapsed,
  onToggle,
}: { role: WorkspaceRole } & SidebarCollapseProps) {
  const pathname = usePathname();
  const isSelfWorkspace = pathname.startsWith("/employee");
  const config = ROLE_CONFIG[role];
  const destination = isSelfWorkspace ? config.roleHome : "/employee";
  const links = isSelfWorkspace ? SELF_LINKS : config.roleLinks;

  return (
    <nav className={`flex h-full flex-col justify-between ${collapsed ? "p-3" : "p-5"}`}>
      <div className="space-y-1">
        <SidebarHeader collapsed={collapsed} onToggle={onToggle} />

        <Link
          href={destination}
          aria-label={isSelfWorkspace ? "Switch to role workspace" : "Switch to my workspace"}
          title={collapsed ? (isSelfWorkspace ? "Switch to role workspace" : "Switch to my workspace") : undefined}
          className={`mb-6 flex items-center rounded-xl border border-cyan-400/50 bg-cyan-800/40 py-3 text-left transition hover:bg-cyan-600 ${
            collapsed ? "justify-center px-2" : "justify-between px-3"
          }`}
        >
          {collapsed ? (
            <span aria-hidden="true" className="text-sm font-bold text-white">↔</span>
          ) : <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-200">Viewing</span>
            <span className="mt-0.5 block text-sm font-bold text-white">{isSelfWorkspace ? "My workspace" : config.label}</span>
          </span>}
          {!collapsed && <span className="rounded-lg bg-white/15 px-2 py-1 text-xs font-semibold text-white">Switch</span>}
        </Link>

        {!collapsed && <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          {isSelfWorkspace ? "My workspace" : config.label}
        </p>}
        {links.map((link) => <SidebarLink key={link.href} {...link} collapsed={collapsed} />)}
      </div>
      <LogoutButton collapsed={collapsed} />
    </nav>
  );
}
