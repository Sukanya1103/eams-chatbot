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
];

export default function EmployeeSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-5">
      <div className="space-y-1">
        <div className="mb-8 px-3"><p className="text-lg font-black tracking-tight text-white">EAMS</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Enterprise portal</p></div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">Employee workspace</p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
