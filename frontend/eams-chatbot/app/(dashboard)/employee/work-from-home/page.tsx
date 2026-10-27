import EmployeeFeaturePage from "../EmployeeFeaturePage";
import ApplyWorkFromHomeForm from "@/components/work-from-home/ApplyWorkFromHomeForm";
import { getWorkFromHomeRequests } from "@/lib/server/workFromHome";

export default async function EmployeeWorkFromHomePage() {
  const requests = await getWorkFromHomeRequests();
  return <EmployeeFeaturePage title="Work From Home" description="Submit a work-from-home request and review its backend-confirmed status." emptyTitle="" emptyDescription="">
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-[#64748B]">Requests are saved as pending and remain subject to the company review process.</p><ApplyWorkFromHomeForm /></div>
      {requests.length ? <div className="overflow-x-auto rounded-xl border border-slate-200"><table className="w-full min-w-[650px] text-left text-sm"><thead className="bg-[#F4F7FA] text-xs font-semibold uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">Requested dates</th><th className="px-4 py-3">Reason</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Submitted</th></tr></thead><tbody className="divide-y divide-slate-200 text-slate-700">{requests.map((request) => <tr key={request.id} className="bg-white"><td className="px-4 py-3">{dateLabel(request.startDate)}{request.endDate !== request.startDate ? ` – ${dateLabel(request.endDate)}` : ""}</td><td className="max-w-xs px-4 py-3"><p>{request.reason}</p>{request.remarks && <p className="mt-1 text-xs text-[#64748B]">{request.remarks}</p>}{request.reviewerComments && <p className="mt-1 text-xs text-[#24445F]">Reviewer: {request.reviewerComments}</p>}</td><td className="px-4 py-3"><Status status={request.status} /></td><td className="px-4 py-3 text-[#64748B]">{new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeZone: "Asia/Kolkata" }).format(new Date(request.submittedAt))}</td></tr>)}</tbody></table></div> : <div className="grid min-h-36 place-items-center rounded-xl border border-dashed border-slate-300 px-5 text-center text-sm text-[#64748B]">No work-from-home requests have been submitted.</div>}
    </div>
  </EmployeeFeaturePage>;
}

function Status({ status }: { status: string }) {
  const style = status === "APPROVED" ? "bg-green-50 text-[#16A34A]" : status === "REJECTED" ? "bg-red-50 text-[#DC2626]" : "bg-amber-50 text-[#D97706]";
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{status}</span>;
}
function dateLabel(value: string) { return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`)); }
