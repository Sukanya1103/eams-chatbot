// components/dashboard/HrSidebar.tsx
import RoleWorkspaceSidebar from "./RoleWorkspaceSidebar";
import type { SidebarCollapseProps } from "./SidebarHeader";

export default function HrSidebar(
  props: SidebarCollapseProps & {
    onNavigate?: () => void;
  },
) {
  return <RoleWorkspaceSidebar role="HR" {...props} />;
}
