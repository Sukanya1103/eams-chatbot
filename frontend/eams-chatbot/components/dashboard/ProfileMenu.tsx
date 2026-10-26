"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { getMyProfile, updateMyProfile } from "@/lib/api/profile";
import type { MyProfile } from "@/types/employee";
import type { Role } from "@/types/user";
import LogoutButton from "./LogoutButton";

export default function ProfileMenu({ userName, email, role }: { userName: string; email: string; role: Role }) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<MyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const initials = userName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase() || role[0];

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", closeOnOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  async function showProfile() {
    setOpen(false);
    setLoadError("");
    setSaved(false);
    setLoading(true);
    try {
      const details = await getMyProfile();
      setProfile(details);
      setDateOfBirth(details.dateOfBirth ?? "");
      setContactNumber(details.contactNumber ?? "");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Could not load your profile.");
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setSaveError("");
    setSaved(false);
    try {
      const updated = await updateMyProfile({ dateOfBirth: dateOfBirth || null, contactNumber });
      setProfile(updated);
      setDateOfBirth(updated.dateOfBirth ?? "");
      setContactNumber(updated.contactNumber ?? "");
      setSaved(true);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Could not save your changes.");
    } finally {
      setSaving(false);
    }
  }

  return <>
    <div ref={menuRef} className="relative">
      <button type="button" aria-label="Open profile menu" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((value) => !value)} title="Profile" className="grid h-10 w-10 place-items-center rounded-full bg-[#17324D] text-xs font-bold text-white ring-2 ring-white transition hover:bg-[#24445F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">{initials}</button>
      {open && <div role="menu" className="absolute right-0 top-12 z-[70] w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-[#1F2937] shadow-xl shadow-slate-900/15">
        <div className="border-b border-slate-100 px-4 py-4">
          <p className="truncate text-sm font-bold">{userName}</p>
          <p className="mt-0.5 truncate text-xs text-[#64748B]">{email}</p>
          <span className="mt-2 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#24445F]">{roleLabel(role)}</span>
        </div>
        <div className="p-2">
          <button role="menuitem" type="button" onClick={showProfile} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-300">
            <svg aria-hidden="true" className="h-5 w-5 text-[#24445F]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>
            <span><span className="block font-semibold">My profile</span><span className="mt-0.5 block text-xs text-[#64748B]">View and update your details</span></span>
          </button>
          <div className="my-2 border-t border-slate-100" />
          <LogoutButton />
        </div>
      </div>}
    </div>

    {loading && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/35 p-4" role="status"><div className="rounded-xl bg-white px-5 py-4 text-sm font-medium text-slate-700 shadow-xl">Loading your profile…</div></div>}
    {loadError && <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/40 p-4" role="alertdialog" aria-modal="true" aria-label="Profile unavailable"><div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"><h2 className="font-bold">Profile unavailable</h2><p className="mt-2 text-sm text-red-700">{loadError}</p><button type="button" onClick={() => setLoadError("")} className="mt-5 rounded-lg bg-[#17324D] px-4 py-2 text-sm font-semibold text-white">Close</button></div></div>}
    {profile && <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/50 p-3 sm:p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfile(null); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="my-profile-title" className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white text-[#1F2937] shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#3B82F6]">Account</p><h2 id="my-profile-title" className="mt-1 text-xl font-bold">My profile</h2><p className="mt-1 text-sm text-[#64748B]">Your work details and personal contact information.</p></div>
          <button type="button" aria-label="Close profile" onClick={() => setProfile(null)} className="rounded-lg px-3 py-1 text-xl text-[#64748B] hover:bg-slate-100">×</button>
        </header>
        <form onSubmit={saveProfile} className="p-5 sm:p-6">
          <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <ReadOnly label="Full name" value={profile.name} />
            <ReadOnly label="Work email" value={profile.email} />
            <ReadOnly label="Employee ID" value={profile.employeeId} />
            <ReadOnly label="Role" value={roleLabel(profile.role)} />
            <ReadOnly label="Designation" value={profile.designation} />
            <ReadOnly label="Department" value={profile.department} />
            <ReadOnly label="Date of joining" value={profile.dateOfJoining} />
            <label className="block text-sm font-medium text-slate-700">Date of birth<input type="date" max={new Date().toISOString().slice(0, 10)} value={dateOfBirth} onChange={(event) => setDateOfBirth(event.target.value)} className={inputClass} /></label>
            <label className="block text-sm font-medium text-slate-700">Phone number<input type="tel" autoComplete="tel" maxLength={20} pattern="([+0-9() .-]{7,20})?" value={contactNumber} onChange={(event) => setContactNumber(event.target.value)} placeholder="Add your phone number" className={inputClass} /></label>
          </div>
          {saveError && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{saveError}</p>}
          {saved && <p role="status" className="mt-4 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">Your profile was updated.</p>}
          <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5"><p className="text-xs text-[#64748B]">Your name, role, and work details are managed by your administrator.</p><div className="ml-auto flex gap-3"><button type="button" onClick={() => setProfile(null)} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">Close</button><button type="submit" disabled={saving} className="rounded-lg bg-[#17324D] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#24445F] disabled:opacity-60">{saving ? "Saving…" : "Save changes"}</button></div></footer>
        </form>
      </section>
    </div>}
  </>;
}

function ReadOnly({ label, value }: { label: string; value?: string | null }) {
  return <div><p className="text-sm font-medium text-slate-700">{label}</p><p className="mt-1.5 min-h-10 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700">{value || "Not provided"}</p></div>;
}

function roleLabel(role: Role) {
  const labels: Record<Role, string> = { ADMIN: "Admin", HR: "HR", MANAGER: "Manager", EMPLOYEE: "Employee" };
  return labels[role];
}

const inputClass = "mt-1.5 block min-h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
