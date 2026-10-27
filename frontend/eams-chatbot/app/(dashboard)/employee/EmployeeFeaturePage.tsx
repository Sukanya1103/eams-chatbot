import type { ReactNode } from "react";

export default function EmployeeFeaturePage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  children,
}: {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <header className="rounded-2xl border border-slate-200 bg-white p-6 text-[#1F2937] shadow-lg">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[#3B82F6]">EAMS Employee Workspace</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-[#64748B]">{description}</p>
      </header>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 text-[#1F2937] shadow-lg sm:p-6">
        {children ?? (
          <div className="grid min-h-56 place-items-center rounded-xl border border-dashed border-slate-300 px-5 py-10 text-center">
            <div className="max-w-lg">
              <span aria-hidden="true" className="mx-auto grid h-12 w-12 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-xl text-[#3B82F6]">i</span>
              <h2 className="mt-4 font-semibold text-[#1F2937]">{emptyTitle}</h2>
              <p className="mt-2 text-sm leading-6 text-[#64748B]">{emptyDescription}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
