// components/dashboard/HrSidebar.tsx
import SidebarLink from "./SidebarLink";
import LogoutButton from "./LogoutButton";

const LINKS = [
  { href: "/hr", label: "Overview" },
  { href: "/hr/register-employee", label: "Register employee" },
  { href: "/hr/leaves", label: "Leaves" },
  { href: "/hr/salary", label: "Salary" },
];

export default function HrSidebar() {
  return (
    <nav className="flex h-full flex-col justify-between p-5">
      <div className="space-y-1">
        <div className="mb-8 px-3"><p className="text-lg font-black tracking-tight text-white">EAMS</p><p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">Enterprise portal</p></div>
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-cyan-200">HR workspace</p>
        {LINKS.map((link) => (
          <SidebarLink key={link.href} {...link} />
        ))}
      </div>
      <LogoutButton />
    </nav>
  );
}
