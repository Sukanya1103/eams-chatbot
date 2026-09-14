// components/dashboard/ManagerSidebar.tsx
// Every link here is implicitly scoped to "my team" by the backend's
// DataScopeService, not by anything in this component.
import RoleWorkspaceSidebar from "./RoleWorkspaceSidebar";

export default function ManagerSidebar() {
  return <RoleWorkspaceSidebar role="MANAGER" />;
}
