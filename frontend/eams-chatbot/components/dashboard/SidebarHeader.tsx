"use client";

export interface SidebarCollapseProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function SidebarHeader({
  collapsed,
  onToggle,
}: SidebarCollapseProps) {
  return (
    <div className={`mb-8 flex items-start ${collapsed ? "justify-center" : "justify-between px-3"}`}>
      {!collapsed && (
        <div>
          <p className="text-lg font-black tracking-tight text-white">EAMS</p>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
            Enterprise portal
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-cyan-100 transition hover:bg-cyan-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-200"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {collapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}
        </svg>
      </button>
    </div>
  );
}
