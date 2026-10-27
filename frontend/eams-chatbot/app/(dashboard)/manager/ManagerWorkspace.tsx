
"use client";

import { useMemo, useState } from "react";
import { useManagerNavigation, type ManagerSection } from "@/components/dashboard/ManagerNavigationContext";

type IconName =
  | "dashboard" | "users" | "tasks" | "projects" | "attendance"
  | "calendar" | "performance" | "reports" | "bell" | "files"
  | "settings" | "menu" | "collapse" | "expand" | "logout"
  | "user" | "search" | "check" | "clock" | "alert" | "down"
  | "right" | "plus" | "close" | "edit" | "delete" | "download"
  | "mail" | "shield" | "activity" | "folder" | "home";

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, React.ReactNode> = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    tasks: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    projects: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M3 10h18"/></>,
    attendance: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 15l2 2 5-4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 17h2"/></>,
    performance: <><path d="M3 3v18h18"/><path d="m7 14 4-4 4 3 6-7"/><path d="M16 6h5v5"/></>,
    reports: <><path d="M4 19V5M10 19V9M16 19V3M22 19H2"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    files: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.6.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.6-.9l-1.7.6-1.4-2.4L7.5 15a8 8 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.6-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.6.9l1.7-.6 1.4 2.4-1.4 1.1a8 8 0 0 1-.1 2z"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    collapse: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M15 9l-3 3 3 3"/></>,
    expand: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9l3 3-3 3M15 3v18"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    alert: <><path d="m12 3 10 18H2z"/><path d="M12 9v4M12 17h.01"/></>,
    down: <path d="m7 10 5 5 5-5"/>,
    right: <path d="m9 18 6-6-6-6"/>,
    plus: <path d="M12 5v14M5 12h14"/>,
    close: <path d="m18 6-12 12M6 6l12 12"/>,
    edit: <><path d="M12 20h9"/><path d="m16.5 3.5 4 4L9 19l-5 1 1-5z"/></>,
    delete: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z"/><path d="m9 12 2 2 4-4"/></>,
    activity: <path d="M3 12h4l3-8 4 16 3-8h4"/>,
    folder: <><path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></>,
    home: <><path d="m3 10 9-7 9 7"/><path d="M5 9v12h14V9M9 21v-7h6v7"/></>,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

type Employee = {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "On Leave";
};

type Task = {
  id: number;
  title: string;
  assignee: string;
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed";
  due: string;
};

const initialEmployees: Employee[] = [
  { id: 1, name: "Aarav Sharma", email: "aarav@example.com", role: "Frontend Developer", department: "Engineering", status: "Active" },
  { id: 2, name: "Priya Verma", email: "priya@example.com", role: "UI/UX Designer", department: "Design", status: "Active" },
  { id: 3, name: "Rahul Singh", email: "rahul@example.com", role: "Backend Developer", department: "Engineering", status: "On Leave" },
  { id: 4, name: "Ananya Gupta", email: "ananya@example.com", role: "HR Executive", department: "Human Resources", status: "Active" },
];

const initialTasks: Task[] = [
  { id: 101, title: "Complete dashboard UI", assignee: "Aarav Sharma", priority: "High", status: "In Progress", due: "2026-10-27" },
  { id: 102, title: "Review design prototypes", assignee: "Priya Verma", priority: "Medium", status: "Pending", due: "2026-10-28" },
  { id: 103, title: "Fix integration bugs", assignee: "Rahul Singh", priority: "High", status: "Completed", due: "2026-10-24" },
];

const card = "rounded-2xl border border-blue-100 bg-white p-5 text-slate-800 shadow-sm";
const field = "w-full rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const primary = "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700";
const secondary = "inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm text-blue-700 transition hover:bg-blue-50";

export default function ManagerWorkspace({
  managerName: initialManagerName,
  managerEmail: initialManagerEmail,
}: {
  managerName: string;
  managerEmail: string;
}) {
  const { section, setSection } = useManagerNavigation();
  const [employees, setEmployees] = useState(initialEmployees);
  const [tasks, setTasks] = useState(initialTasks);
  const [projects, setProjects] = useState([
    { id: 1, name: "Dashboard Redesign", owner: "Aarav Sharma", progress: 75 },
    { id: 2, name: "Employee Portal", owner: "Priya Verma", progress: 45 },
    { id: 3, name: "Reporting Module", owner: "Ananya Gupta", progress: 100 },
  ]);
  const [leaves, setLeaves] = useState([
    { id: 1, name: "Rahul Singh", type: "Casual Leave", dates: "Oct 27–28", status: "Pending" },
    { id: 2, name: "Priya Verma", type: "Sick Leave", dates: "Oct 29", status: "Pending" },
  ]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [employeeRole, setEmployeeRole] = useState("");
  const [department, setDepartment] = useState("Engineering");
  const [taskTitle, setTaskTitle] = useState("");
  const [assignee, setAssignee] = useState("");
  const [priority, setPriority] = useState<Task["priority"]>("Medium");
  const [due, setDue] = useState("2026-10-30");
  const [managerName, setManagerName] = useState(initialManagerName);
  const [managerEmail, setManagerEmail] = useState(initialManagerEmail);
  const [documentNames, setDocumentNames] = useState<string[]>([]);

  function notify(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  const filteredEmployees = useMemo(
    () => employees.filter((e) =>
      `${e.name} ${e.email} ${e.role} ${e.department}`.toLowerCase().includes(search.toLowerCase())
    ),
    [employees, search]
  );

  const filteredTasks = tasks.filter((t) =>
    (filter === "All" || t.status === filter) &&
    `${t.title} ${t.assignee}`.toLowerCase().includes(search.toLowerCase())
  );

  const completed = tasks.filter((t) => t.status === "Completed").length;
  const openTasks = tasks.length - completed;
  const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
  const completionRate = tasks.length ? Math.round(completed / tasks.length * 100) : 0;

  function saveEmployee(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editingId !== null) {
      setEmployees((old) => old.map((e) =>
        e.id === editingId
          ? { ...e, name: employeeName.trim(), email: employeeEmail.trim(), role: employeeRole.trim(), department }
          : e
      ));
      notify("Employee updated.");
    } else {
      setEmployees((old) => [...old, {
        id: Date.now(),
        name: employeeName.trim(),
        email: employeeEmail.trim(),
        role: employeeRole.trim(),
        department,
        status: "Active",
      }]);
      notify("Employee added.");
    }

    setEmployeeName("");
    setEmployeeEmail("");
    setEmployeeRole("");
    setDepartment("Engineering");
    setEditingId(null);
    setShowEmployeeForm(false);
  }

  function saveTask(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!assignee) {
      notify("Select an assignee first.");
      return;
    }

    setTasks((old) => [...old, {
      id: Date.now(),
      title: taskTitle.trim(),
      assignee,
      priority,
      status: "Pending",
      due,
    }]);

    setTaskTitle("");
    setAssignee("");
    setShowTaskForm(false);
    notify("Task created.");
  }

  function exportTasks() {
    const rows = [
      ["Task", "Assignee", "Priority", "Status", "Due"],
      ...tasks.map((t) => [t.title, t.assignee, t.priority, t.status, t.due]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "manager-task-report.csv";
    a.click();
    URL.revokeObjectURL(url);
    notify("Report downloaded.");
  }

  function badge(value: string) {
    const colors: Record<string, string> = {
      Active: "bg-emerald-400/10 text-emerald-400",
      "On Leave": "bg-amber-400/10 text-amber-400",
      Pending: "bg-amber-400/10 text-amber-400",
      "In Progress": "bg-cyan-400/10 text-cyan-300",
      Completed: "bg-emerald-400/10 text-emerald-400",
      Approved: "bg-emerald-400/10 text-emerald-400",
      Rejected: "bg-red-400/10 text-red-400",
      Present: "bg-emerald-400/10 text-emerald-400",
      Absent: "bg-red-400/10 text-red-400",
    };
    return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium ${colors[value] ?? "bg-slate-500/10 text-slate-300"}`}>{value}</span>;
  }

  function taskTable(list: Task[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead><tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-600">
            {["Task", "Assignee", "Priority", "Due date", "Status"].map((h) => <th key={h} className="px-3 py-4 font-medium">{h}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-[#293139]">
            {list.map((task) => (
              <tr key={task.id} className="hover:bg-white/[0.025]">
                <td className="px-3 py-4 font-medium text-slate-700">{task.title}</td>
                <td className="px-3 py-4 text-slate-600">{task.assignee}</td>
                <td className={`px-3 py-4 ${task.priority === "High" ? "text-red-400" : task.priority === "Medium" ? "text-amber-400" : "text-slate-600"}`}>{task.priority}</td>
                <td className="px-3 py-4 text-slate-600">{task.due}</td>
                <td className="px-3 py-4">
                  <select aria-label={`Update ${task.title}`} className={`${field} min-w-[140px]`} value={task.status} onChange={(e) => {
                    setTasks((old) => old.map((t) => t.id === task.id ? { ...t, status: e.target.value as Task["status"] } : t));
                    notify("Task status updated.");
                  }}>
                    <option>Pending</option><option>In Progress</option><option>Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No matching tasks found.</p>}
      </div>
    );
  }

  function overview() {
    const stats: { label: string; value: number; icon: IconName; detail: string }[] = [
      { label: "Total Employees", value: employees.length, icon: "users", detail: "Team members" },
      { label: "Open Tasks", value: openTasks, icon: "tasks", detail: "Needs attention" },
      { label: "Completed Tasks", value: completed, icon: "check", detail: "Work completed" },
      { label: "Pending Leaves", value: pendingLeaves, icon: "calendar", detail: "Awaiting review" },
    ];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <div className={card} key={s.label}>
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-600">{s.label}</p>
                <span className="rounded-lg bg-blue-600/10 p-3 text-blue-700"><Icon name={s.icon} size={22}/></span>
              </div>
              <p className="mt-4 text-3xl font-semibold text-slate-800">{s.value}</p>
              <p className="mt-2 text-xs text-slate-500">{s.detail}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
          <div className={card}>
            <div className="flex items-center justify-between gap-3">
              <div><h2 className="font-semibold text-slate-800">Task Overview</h2><p className="mt-1 text-xs text-slate-500">Current workload distribution</p></div>
              <button className={secondary} onClick={() => setSection("Tasks")}>View tasks <Icon name="right" size={15}/></button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-7">
              <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-full" style={{ background: `conic-gradient(#00B8D4 ${completionRate}%, #303840 ${completionRate}% 100%)` }}>
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-slate-100"><span className="text-3xl font-semibold text-slate-800">{completionRate}%</span><span className="text-xs text-slate-500">Completed</span></div>
              </div>
              <div className="flex-1 space-y-4">
                {[
                  { label: "Completed", count: completed, color: "bg-blue-600" },
                  { label: "In Progress", count: tasks.filter((t) => t.status === "In Progress").length, color: "bg-[#8B8FE8]" },
                  { label: "Pending", count: tasks.filter((t) => t.status === "Pending").length, color: "bg-[#E8B75D]" },
                ].map((item) => <div key={item.label} className="flex justify-between text-sm"><span className="flex items-center gap-2 text-slate-600"><span className={`h-2.5 w-2.5 rounded-full ${item.color}`}/>{item.label}</span><b className="text-slate-800">{item.count}</b></div>)}
              </div>
            </div>
          </div>

          <div className={card}>
            <h2 className="font-semibold text-slate-800">Quick Actions</h2>
            <p className="mt-1 text-xs text-slate-500">Frequently used operations</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Add Employee", icon: "users" as IconName, target: "Employees" as ManagerSection },
                { label: "Assign Task", icon: "tasks" as IconName, target: "Tasks" as ManagerSection },
                { label: "Review Leaves", icon: "attendance" as IconName, target: "Leave Requests" as ManagerSection },
                { label: "View Reports", icon: "reports" as IconName, target: "Reports" as ManagerSection },
              ].map((item) => <button key={item.label} onClick={() => { setSection(item.target); if (item.target === "Employees") setShowEmployeeForm(true); if (item.target === "Tasks") setShowTaskForm(true); }} className="rounded-lg border border-slate-200 p-4 text-left transition hover:border-[#00B8D4] hover:bg-blue-600/5"><Icon name={item.icon} size={22} className="text-blue-700"/><p className="mt-3 text-sm font-medium text-slate-700">{item.label}</p></button>)}
            </div>
          </div>
        </div>

        <div className={card}>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-800">Recent Tasks</h2><p className="mt-1 text-xs text-slate-500">Monitor team activities</p></div><button className={primary} onClick={() => { setSection("Tasks"); setShowTaskForm(true); }}><Icon name="plus" size={16}/> New Task</button></div>
          {taskTable(tasks.slice(0, 5))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className={card}>
            <h2 className="font-semibold text-slate-800">Team Snapshot</h2>
            <div className="mt-4 space-y-4">{employees.slice(0, 5).map((e) => <div key={e.id} className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10 font-semibold text-blue-700">{e.name[0]}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-slate-800">{e.name}</p><p className="text-xs text-slate-500">{e.role}</p></div>{badge(e.status)}</div>)}</div>
          </div>
          <div className={card}>
            <h2 className="font-semibold text-slate-800">Upcoming Deadlines</h2>
            <div className="mt-4 space-y-3">{tasks.filter((t) => t.status !== "Completed").map((t) => <div key={t.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"><Icon name="clock" className="text-blue-700"/><div className="min-w-0 flex-1"><p className="truncate text-sm text-slate-800">{t.title}</p><p className="text-xs text-slate-500">{t.assignee}</p></div><span className="text-xs text-slate-600">{t.due}</span></div>)}</div>
          </div>
        </div>
      </div>
    );
  }

  function employeePage() {
    return (
      <div className={card}>
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-800">Employee Directory</h2><p className="mt-1 text-xs text-slate-500">Manage team members</p></div><button className={primary} onClick={() => { setEditingId(null); setEmployeeName(""); setEmployeeEmail(""); setEmployeeRole(""); setShowEmployeeForm(!showEmployeeForm); }}><Icon name="plus" size={16}/> Add Employee</button></div>
        {showEmployeeForm && <form onSubmit={saveEmployee} className="mt-5 grid gap-3 md:grid-cols-2"><input className={field} placeholder="Full name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required/><input className={field} placeholder="Email address" type="email" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)}/><input className={field} placeholder="Job title" value={employeeRole} onChange={(e) => setEmployeeRole(e.target.value)} required/><select className={field} value={department} onChange={(e) => setDepartment(e.target.value)}><option>Engineering</option><option>Design</option><option>Human Resources</option><option>Finance</option><option>Operations</option></select><div className="flex gap-2"><button className={primary} type="submit"><Icon name="check" size={16}/> Save Employee</button><button className={secondary} type="button" onClick={() => setShowEmployeeForm(false)}>Cancel</button></div></form>}
        <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b border-slate-200 text-xs text-slate-500">{["Employee", "Role", "Department", "Status", "Actions"].map((h) => <th key={h} className="px-3 py-4">{h}</th>)}</tr></thead><tbody className="divide-y divide-[#293139]">{filteredEmployees.map((e) => <tr key={e.id}><td className="px-3 py-4"><p className="text-slate-800">{e.name}</p><p className="text-xs text-slate-500">{e.email}</p></td><td className="px-3 py-4 text-slate-600">{e.role}</td><td className="px-3 py-4 text-slate-600">{e.department}</td><td className="px-3 py-4">{badge(e.status)}</td><td className="px-3 py-4"><div className="flex gap-3"><button aria-label="Edit employee" title="Edit" className="text-blue-600" onClick={() => { setEditingId(e.id); setEmployeeName(e.name); setEmployeeEmail(e.email); setEmployeeRole(e.role); setDepartment(e.department); setShowEmployeeForm(true); }}><Icon name="edit" size={16}/></button><button aria-label="Delete employee" title="Delete" className="text-red-400" onClick={() => { if (window.confirm(`Remove ${e.name}?`)) setEmployees((old) => old.filter((x) => x.id !== e.id)); }}><Icon name="delete" size={16}/></button></div></td></tr>)}</tbody></table></div>
      </div>
    );
  }

  function taskPage() {
    return <div className={card}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-800">Task Management</h2><p className="mt-1 text-xs text-slate-500">Assign tasks and track progress</p></div><button className={primary} onClick={() => setShowTaskForm(!showTaskForm)}><Icon name="plus" size={16}/> Assign Task</button></div>
      {showTaskForm && <form onSubmit={saveTask} className="mt-5 grid gap-3 md:grid-cols-2"><input className={field} placeholder="Task title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required/><select className={field} value={assignee} onChange={(e) => setAssignee(e.target.value)} required><option value="">Select team member</option>{employees.filter((e) => e.status === "Active").map((e) => <option key={e.id}>{e.name}</option>)}</select><select className={field} value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}><option>High</option><option>Medium</option><option>Low</option></select><input className={field} type="date" value={due} onChange={(e) => setDue(e.target.value)} required/><button className={primary} type="submit">Create Task</button></form>}
      <div className="mt-5 flex justify-between gap-3"><p className="text-sm text-slate-600">{filteredTasks.length} tasks</p><select className={`${field} max-w-48`} value={filter} onChange={(e) => setFilter(e.target.value)}><option>All</option><option>Pending</option><option>In Progress</option><option>Completed</option></select></div><div className="mt-3">{taskTable(filteredTasks)}</div>
    </div>;
  }

  function content() {
    switch (section) {
      case "Overview": return overview();
      case "Employees": return employeePage();
      case "Tasks": return taskPage();

      case "Projects": return <div className="grid gap-5 xl:grid-cols-2">{projects.map((p) => <div key={p.id} className={card}><div className="flex justify-between gap-3"><div><h2 className="font-semibold text-slate-800">{p.name}</h2><p className="mt-1 text-xs text-slate-500">Project lead: {p.owner}</p></div>{badge(p.progress === 100 ? "Completed" : "In Progress")}</div><div className="mt-6 flex justify-between text-sm text-slate-600"><span>Completion</span><span className="text-blue-600">{p.progress}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${p.progress}%` }}/></div><input aria-label={`Adjust ${p.name} progress`} className="mt-4 w-full accent-[#00B8D4]" type="range" min="0" max="100" value={p.progress} onChange={(e) => setProjects((old) => old.map((x) => x.id === p.id ? { ...x, progress: Number(e.target.value) } : x))}/></div>)}</div>;

      case "Attendance": return <div className={card}><h2 className="font-semibold text-slate-800">Team Attendance</h2><p className="mt-1 text-xs text-slate-500">Illustrative sample records</p><div className="mt-5 space-y-3">{employees.map((e, i) => <div key={e.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4"><div><p className="text-sm text-slate-800">{e.name}</p><p className="text-xs text-slate-500">{e.department}</p></div>{badge(e.status === "On Leave" ? "On Leave" : i === 3 ? "Absent" : "Present")}</div>)}</div><p className="mt-4 text-xs text-slate-500">Sample data only. Your existing attendance module is unchanged.</p></div>;

      case "Leave Requests": return <div className={card}><h2 className="font-semibold text-slate-800">Leave Approvals</h2><p className="mt-1 text-xs text-slate-500">Review sample requests</p><div className="mt-5 space-y-3">{leaves.map((l) => <div key={l.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4"><div><p className="text-sm text-slate-800">{l.name}</p><p className="mt-1 text-xs text-slate-500">{l.type} · {l.dates}</p><div className="mt-2">{badge(l.status)}</div></div>{l.status === "Pending" && <div className="flex gap-2"><button className="rounded-lg bg-emerald-500/15 px-3 py-2 text-xs text-emerald-400" onClick={() => { setLeaves((old) => old.map((x) => x.id === l.id ? { ...x, status: "Approved" } : x)); notify("Leave approved in sample data."); }}>Approve</button><button className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-400" onClick={() => { setLeaves((old) => old.map((x) => x.id === l.id ? { ...x, status: "Rejected" } : x)); notify("Leave rejected in sample data."); }}>Reject</button></div>}</div>)}</div></div>;

      case "Performance": return <div className="grid gap-5 xl:grid-cols-2"><div className={card}><Icon name="activity" size={24} className="text-blue-600"/><h2 className="mt-4 font-semibold text-slate-800">Team Productivity</h2><p className="mt-5 text-5xl font-semibold text-blue-700">{completionRate}%</p><div className="mt-5 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${completionRate}%` }}/></div><p className="mt-3 text-xs text-slate-500">{completed} of {tasks.length} tasks completed</p></div><div className={card}><h2 className="font-semibold text-slate-800">Workload Distribution</h2><div className="mt-5 space-y-5">{employees.map((e) => { const count = tasks.filter((t) => t.assignee === e.name && t.status !== "Completed").length; return <div key={e.id}><div className="mb-2 flex justify-between text-xs text-slate-600"><span>{e.name}</span><span>{count} open tasks</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${tasks.length ? count / tasks.length * 100 : 0}%` }}/></div></div>; })}</div></div></div>;

      case "Reports": return <div className="space-y-5"><div className={card}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold text-slate-800">Reports & Analytics</h2><p className="mt-1 text-xs text-slate-500">Export sample task data</p></div><button className={primary} onClick={exportTasks}><Icon name="download" size={16}/> Export CSV</button></div></div><div className="grid gap-4 sm:grid-cols-3">{[["Total Tasks", tasks.length], ["Completed", completed], ["Completion Rate", `${completionRate}%`]].map(([label, value]) => <div className={card} key={String(label)}><p className="text-sm text-slate-600">{label}</p><p className="mt-3 text-3xl font-semibold text-slate-800">{value}</p></div>)}</div><div className={card}><h2 className="font-semibold text-slate-800">Task Status Breakdown</h2>{(["Completed", "In Progress", "Pending"] as const).map((status) => { const count = tasks.filter((t) => t.status === status).length; return <div key={status} className="mt-5"><div className="mb-2 flex justify-between text-sm text-slate-600"><span>{status}</span><span>{count}</span></div><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: `${tasks.length ? count / tasks.length * 100 : 0}%` }}/></div></div>; })}</div></div>;

      case "Notifications": return <div className={card}><h2 className="font-semibold text-slate-800">Notifications Center</h2>{[`${openTasks} tasks are still open.`, `${pendingLeaves} leave requests require a decision.`, `${employees.filter((e) => e.status === "On Leave").length} employee(s) are on leave.`].map((message) => <div key={message} className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 p-4"><Icon name="bell" className="text-blue-600"/><p className="text-sm text-slate-700">{message}</p></div>)}<p className="mt-4 text-xs text-slate-500">These notifications are generated from sample data.</p></div>;

      case "Calendar": return <div className={card}><h2 className="font-semibold text-slate-800">Upcoming Schedule</h2>{tasks.filter((t) => t.status !== "Completed").map((t) => <div key={t.id} className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 p-4"><Icon name="calendar" className="text-blue-600"/><div className="min-w-0 flex-1"><p className="text-sm text-slate-800">{t.title}</p><p className="text-xs text-slate-500">{t.assignee}</p></div><span className="text-xs text-slate-600">{t.due}</span></div>)}</div>;

      case "Documents": return <div className={card}><Icon name="files" size={28} className="text-blue-600"/><h2 className="mt-3 font-semibold text-slate-800">Document Center</h2><p className="mt-1 text-xs text-slate-500">Select local files. Nothing is uploaded to a server.</p><input className="mt-5 max-w-full text-sm text-slate-600" type="file" multiple onChange={(e) => { const names = Array.from(e.target.files ?? []).map((f) => f.name); setDocumentNames((old) => [...old, ...names]); if (names.length) notify(`${names.length} file(s) selected.`); }}/>{documentNames.map((name, i) => <div key={`${name}-${i}`} className="mt-3 flex items-center gap-2 text-sm text-slate-700"><Icon name="files" size={16}/><span className="flex-1 break-all">{name}</span><button aria-label="Remove file" onClick={() => setDocumentNames((old) => old.filter((_, index) => index !== i))}><Icon name="close" size={15}/></button></div>)}</div>;

      case "Settings": return <form className={`${card} max-w-2xl space-y-5`} onSubmit={(e) => { e.preventDefault(); notify("Preferences updated for this session."); }}><div className="flex items-center gap-3"><Icon name="user" size={24} className="text-blue-600"/><div><h2 className="font-semibold text-slate-800">Manager Profile & Settings</h2><p className="mt-1 text-xs text-slate-500">These preferences are not saved to a backend.</p></div></div><div><label className="mb-2 block text-xs text-slate-600">Display name</label><input className={field} value={managerName} onChange={(e) => setManagerName(e.target.value)} required/></div><div><label className="mb-2 block text-xs text-slate-600">Email address</label><input className={field} type="email" value={managerEmail} onChange={(e) => setManagerEmail(e.target.value)} required/></div><button className={primary} type="submit">Save Preferences</button></form>;
    }
  }

  return (
    <div className="space-y-6 font-sans text-slate-800">
      {notice && (
        <div role="status" className="fixed right-5 top-5 z-[90] flex max-w-sm items-center gap-3 rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm text-slate-700 shadow-xl">
          <Icon name="check" className="text-blue-600"/>
          <span>{notice}</span>
          <button aria-label="Dismiss notification" onClick={() => setNotice("")}><Icon name="close" size={15}/></button>
        </div>
      )}

      <section className="rounded-2xl border border-blue-100 bg-gradient-to-r from-white to-blue-50 p-5 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Manager workspace</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Welcome back, {managerName}</h1>
            <p className="mt-2 text-sm text-slate-600">Monitor activities, coordinate your team, and manage daily operations.</p>
          </div>
          <span className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-medium text-slate-600">Sample data · Local session</span>
        </div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 shadow-sm">
          <Icon name="search" size={17} className="shrink-0 text-slate-500"/>
          <input className="w-full bg-transparent py-2.5 text-sm text-slate-800 outline-none placeholder:text-slate-400" placeholder="Search employees or tasks..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          {search && <button aria-label="Clear search" onClick={() => setSearch("")}><Icon name="close" size={14}/></button>}
        </label>
        <button aria-label="Notifications" title="Notifications" onClick={() => setSection("Notifications")} className="relative inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-medium text-blue-700 shadow-sm transition hover:bg-blue-50">
          <Icon name="bell" size={18}/> Notifications
          {pendingLeaves > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">{pendingLeaves}</span>}
        </button>
      </div>

      <section aria-labelledby="section-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="section-title" className="text-xl font-semibold text-slate-900">{section}</h2>
            <p className="mt-1 text-sm text-slate-600">Review {section.toLowerCase()} and coordinate your team.</p>
          </div>
          <span className="text-xs text-slate-500">Current view uses sample data</span>
        </div>
        {content()}
      </section>
    </div>
  );
}
