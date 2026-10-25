import EmployeeFeaturePage from "../EmployeeFeaturePage";

const policies = [
  ["Attendance and Timekeeping", "Record check-in and check-out accurately. Report missing or incorrect punches through the attendance correction workflow for manager review."],
  ["Leave and Time Off", "Submit leave requests through the EAMS portal and monitor their status. Approval depends on available balances, applicable company rules, and the required approval process."],
  ["Working Hours and Weekly Offs", "The standard schedule for this project is Monday through Friday. Saturday and Sunday are weekly office offs. Follow your assigned hours and communicate approved schedule changes to your manager."],
  ["Breaks", "Follow applicable company break guidelines and record attendance accurately. No break duration is specified here."],
  ["Overtime", "Obtain required approval before working overtime wherever company rules require it. Overtime records should accurately reflect additional hours worked."],
  ["Work From Home", "Follow the existing remote-work request and approval process. Remain available during agreed working hours and protect confidential company information."],
  ["Code of Conduct", "Maintain professional behavior, treat colleagues respectfully, avoid harassment and discrimination, and use company resources responsibly."],
  ["Information Security", "Protect your login credentials, use approved systems, and report suspected security incidents. Never share passwords."],
  ["Data Privacy and Confidentiality", "Access personal and company information only when authorized and necessary for your work."],
  ["Performance and Feedback", "Performance reviews should be based on job responsibilities, agreed objectives, documented work, and constructive feedback."],
  ["Holidays", "Consult the holiday calendar and follow official HR announcements for your applicable work location."],
] as const;

export default function EmployeePoliciesPage() {
  return <EmployeeFeaturePage title="Company Policies" description="Review workplace guidelines, responsibilities, and employee procedures." emptyTitle="" emptyDescription="">
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {policies.map(([title, description], index) => <article key={title} className="rounded-xl border border-slate-700 bg-[#20252d] p-5">
          <div className="flex items-start gap-3"><span aria-hidden="true" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-cyan-900 bg-cyan-950/60 text-sm font-bold text-cyan-300">{String(index + 1).padStart(2, "0")}</span><div><h2 className="font-semibold text-slate-100">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div></div>
        </article>)}
      </div>
      <aside className="rounded-xl border border-amber-800/70 bg-amber-950/30 p-4 text-sm leading-6 text-amber-100"><strong>Guidance notice:</strong> These are general workplace guidelines for the project interface. The official HR-approved policy and applicable HR announcements take precedence.</aside>
    </div>
  </EmployeeFeaturePage>;
}
