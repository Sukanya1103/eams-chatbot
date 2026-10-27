// components/dashboard/ManagerSidebar.tsx
// Every link here is implicitly scoped to "my team" by the backend's
// DataScopeService, not by anything in this component.
import RoleWorkspaceSidebar from "./RoleWorkspaceSidebar";
import type { SidebarCollapseProps } from "./SidebarHeader";

export default function ManagerSidebar(
  props: SidebarCollapseProps & {
    onNavigate?: () => void;
  },
) {
  return <RoleWorkspaceSidebar role="MANAGER" {...props} />;
}
