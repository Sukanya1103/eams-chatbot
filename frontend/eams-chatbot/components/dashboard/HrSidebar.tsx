// components/dashboard/HrSidebar.tsx
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/hr", label: "Overview" },
  { href: "/hr/register-employee", label: "Register employee" },
  { href: "/hr/leaves", label: "Leaves" },
  { href: "/hr/salary", label: "Salary" },
  { href: "/hr/chatbot", label: "Assistant" },
];

export default function HrSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          HR
        </p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
