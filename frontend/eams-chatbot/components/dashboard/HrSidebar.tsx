// components/dashboard/HrSidebar.tsx
import RoleWorkspaceSidebar from "./RoleWorkspaceSidebar";
import type { SidebarCollapseProps } from "./SidebarHeader";

export default function HrSidebar(props: SidebarCollapseProps) {
  return <RoleWorkspaceSidebar role="HR" {...props} />;
}
