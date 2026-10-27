// components/ui/StatCard.tsx
// Small reusable stat tile — every dashboard overview page uses this for
// its summary numbers (headcount, pending leaves, attendance %, etc.)

export default function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-[#64748B]">{hint}</p>}
    </div>
  );
}
