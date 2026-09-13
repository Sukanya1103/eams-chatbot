// components/dashboard/EmployeeSidebar.tsx
// EMPLOYEE role — can only ever see their own data, so links stay
// generic ("My attendance") rather than naming anyone.
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/employee", label: "Overview" },
  { href: "/employee/my-attendance", label: "My attendance" },
  { href: "/employee/my-leaves", label: "My leaves" },
  { href: "/employee/my-salary", label: "My salary" },
  { href: "/employee/chatbot", label: "Assistant" },
];

export default function EmployeeSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-4">
      <div className="space-y-1">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          Employee
        </p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
