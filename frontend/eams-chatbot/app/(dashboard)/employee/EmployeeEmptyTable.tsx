export default function EmployeeEmptyTable({ columns, emptyMessage }: { columns: string[]; emptyMessage: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[#F4F7FA] text-xs font-semibold uppercase tracking-wide text-slate-600">
          <tr>{columns.map((column) => <th key={column} scope="col" className="px-4 py-3">{column}</th>)}</tr>
        </thead>
        <tbody>
          <tr><td colSpan={columns.length} className="px-4 py-12 text-center text-[#64748B]">{emptyMessage}</td></tr>
        </tbody>
      </table>
    </div>
  );
}
