import EmployeeFeaturePage from "../EmployeeFeaturePage";
import ApplyWorkFromHomeForm from "@/components/work-from-home/ApplyWorkFromHomeForm";
import { getWorkFromHomeRequests } from "@/lib/server/workFromHome";

export default async function EmployeeWorkFromHomePage() {
  const requests = await getWorkFromHomeRequests();
  return <EmployeeFeaturePage title="Work From Home" description="Submit a work-from-home request and review its backend-confirmed status." emptyTitle="" emptyDescription="">
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-slate-400">Requests are saved as pending and remain subject to the company review process.</p><ApplyWorkFromHomeForm /></div>
      {requests.length ? <div className="overflow-x-auto rounded-xl border border-slate-700"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-[#252b34] text-xs font-semibold uppercase tracking-wide text-slate-300"><tr><th className="px-4 py-3">Requested dates</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Submitted</th></tr></thead><tbody className="divide-y divide-slate-700 text-slate-200">{requests.map((request) => <tr key={request.id} className="bg-[#20252d]"><td className="px-4 py-3">{dateLabel(request.startDate)}{request.endDate !== request.startDate ? ` – ${dateLabel(request.endDate)}` : ""}</td><td className="max-w-xs px-4 py-3"><p>{request.reason}</p>{request.remarks && <p className="mt-1 text-xs text-slate-400">{request.remarks}</p>}{request.reviewerComments && <p className="mt-1 text-xs text-cyan-200">Reviewer: {request.reviewerComments}</p>}</td><td className="px-4 py-3"><Status status={request.status} /></td><td className="px-4 py-3 text-slate-400">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(request.submittedAt))}</td></tr>)}</tbody></table></div> : <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-600 px-5 text-center text-sm text-slate-400">No work-from-home requests have been submitted.</div>}
    </div>
  </EmployeeFeaturePage>;
}

function Status({ status }: { status: string }) {
  const style = status === "APPROVED" ? "bg-emerald-950/70 text-emerald-200" : status === "REJECTED" ? "bg-red-950/70 text-red-200" : "bg-amber-950/70 text-amber-200";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{status}</span>;
}
function dateLabel(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
