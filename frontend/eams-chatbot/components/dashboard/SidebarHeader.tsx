"use client";

export interface SidebarCollapseProps {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
  workspaceLabel?: string;
}

export default function SidebarHeader({ collapsed, onToggle, onClose, workspaceLabel }: SidebarCollapseProps) {
  return (
    <div className={`mb-8 flex min-h-9 items-center ${collapsed ? "justify-center" : "justify-between px-3"}`}>
      {!collapsed && workspaceLabel && <p className="min-w-0 flex-1 pr-3 text-[10px] font-semibold uppercase leading-4 tracking-[0.14em] text-slate-200">{workspaceLabel === "System administration" ? <>System<br />Administrator</> : workspaceLabel}</p>}
      <button type="button" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} title={collapsed ? "Expand sidebar" : "Collapse sidebar"} className="hidden h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 md:grid">
        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{collapsed ? <path d="m9 18 6-6-6-6" /> : <path d="m15 18-6-6 6-6" />}</svg>
      </button>
      {onClose && <button type="button" onClick={onClose} aria-label="Close navigation menu" className="grid h-9 w-9 place-items-center rounded-lg text-slate-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300 md:hidden"><svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m18 6-12 12M6 6l12 12" /></svg></button>}
    </div>
  );
}
