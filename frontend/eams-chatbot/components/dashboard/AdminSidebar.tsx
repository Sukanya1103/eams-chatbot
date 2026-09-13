// components/dashboard/AdminSidebar.tsx
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/chatbot", label: "Assistant" },
];

export default function AdminSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Admin
        </p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
