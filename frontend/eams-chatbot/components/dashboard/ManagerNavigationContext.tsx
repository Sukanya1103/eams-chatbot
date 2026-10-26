"use client";

import { createContext, useContext } from "react";

export const MANAGER_SECTIONS = [
  { name: "Overview", icon: "dashboard" },
  { name: "Employees", icon: "users" },
  { name: "Tasks", icon: "reports" },
  { name: "Projects", icon: "reports" },
  { name: "Attendance", icon: "attendance" },
  { name: "Leave Requests", icon: "leave" },
  { name: "Performance", icon: "performance" },
  { name: "Reports", icon: "reports" },
  { name: "Notifications", icon: "chat" },
  { name: "Calendar", icon: "holiday" },
  { name: "Documents", icon: "policy" },
  { name: "Settings", icon: "settings" },
] as const;

export type ManagerSection = (typeof MANAGER_SECTIONS)[number]["name"];

type ManagerNavigation = {
  section: ManagerSection;
  setSection: (section: ManagerSection) => void;
};

export const ManagerNavigationContext = createContext<ManagerNavigation | null>(null);

export function useManagerNavigation() {
  const navigation = useContext(ManagerNavigationContext);
  if (!navigation) {
    throw new Error("Manager navigation must be used inside DashboardShell.");
  }
  return navigation;
}
