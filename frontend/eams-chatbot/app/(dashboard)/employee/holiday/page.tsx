import EmployeeFeaturePage from "../EmployeeFeaturePage";

type Holiday = { name: string; date: string; category: string; tentative?: boolean };

// Illustrative national/religious observance dates; this is not an employer calendar.
const holidays: Holiday[] = [
  { name: "Republic Day", date: "2026-01-26", category: "National" },
  { name: "Maha Shivaratri", date: "2026-02-15", category: "Religious observance" },
  { name: "Holi", date: "2026-03-04", category: "Religious / regional observance" },
  { name: "Eid-ul-Fitr", date: "2026-03-21", category: "Religious observance", tentative: true },
  { name: "Ram Navami", date: "2026-03-26", category: "Religious observance" },
  { name: "Mahavir Jayanti", date: "2026-03-31", category: "Religious observance" },
  { name: "Good Friday", date: "2026-04-03", category: "Religious observance" },
  { name: "Buddha Purnima", date: "2026-05-01", category: "Religious observance" },
  { name: "Eid-ul-Adha (Bakrid)", date: "2026-05-27", category: "Religious observance", tentative: true },
  { name: "Muharram", date: "2026-06-26", category: "Religious observance", tentative: true },
  { name: "Independence Day", date: "2026-08-15", category: "National" },
  { name: "Milad-un-Nabi", date: "2026-08-26", category: "Religious observance", tentative: true },
  { name: "Janmashtami", date: "2026-09-04", category: "Religious observance" },
  { name: "Gandhi Jayanti", date: "2026-10-02", category: "National" },
  { name: "Dussehra", date: "2026-10-20", category: "Religious / regional observance" },
  { name: "Diwali", date: "2026-11-08", category: "Religious / regional observance" },
  { name: "Guru Nanak Jayanti", date: "2026-11-24", category: "Religious observance" },
  { name: "Christmas", date: "2026-12-25", category: "Religious observance" },
];

const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const weekdayFormatter = new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "UTC" });

export default function EmployeeHolidaysPage() {
  return <EmployeeFeaturePage title="Holiday Calendar" description="Illustrative India-wide 2026 observance dates. Your company’s applicable holidays depend on work location and HR announcements." emptyTitle="" emptyDescription="">
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200/70 bg-white p-4">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-[#3B82F6]">Illustrative calendar</p><p className="mt-1 text-sm text-slate-700">2026 · Reference dates, not confirmed company holidays</p></div>
        <span className="rounded-full border border-slate-300 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">2026</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#F4F7FA] text-xs font-semibold uppercase tracking-wide text-slate-600"><tr><th className="px-4 py-3">Holiday</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Weekday</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Date status</th></tr></thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">{holidays.map((holiday) => {
            const date = new Date(`${holiday.date}T00:00:00Z`);
            return <tr key={holiday.date + holiday.name} className="hover:bg-slate-50"><th scope="row" className="px-4 py-3 font-medium text-[#1F2937]">{holiday.name}</th><td className="px-4 py-3">{dateFormatter.format(date)}</td><td className="px-4 py-3">{weekdayFormatter.format(date)}</td><td className="px-4 py-3">{holiday.category}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-medium ${holiday.tentative ? "bg-amber-50 text-[#D97706]" : "bg-blue-50 text-[#24445F]"}`}>{holiday.tentative ? "Tentative · moon sighting" : "Confirmed reference date"}</span></td></tr>;
          })}</tbody>
        </table>
      </div>
      <div className="space-y-2 text-xs leading-5 text-[#64748B]"><p>Islamic calendar dates can vary with local moon sighting. Some observances and public holidays vary by region and work location.</p><p>Use the <a className="text-[#3B82F6] underline decoration-blue-600 underline-offset-2 hover:text-[#24445F]" href="https://www.iirs.gov.in/holidaycalender" target="_blank" rel="noreferrer">Indian Institute of Remote Sensing 2026 calendar</a> and <a className="text-[#3B82F6] underline decoration-blue-600 underline-offset-2 hover:text-[#24445F]" href="https://www.indiapost.gov.in/holidays-list" target="_blank" rel="noreferrer">India Post 2026 holiday list</a> as date references. Neither is an EAMS company calendar.</p><p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[#D97706]">The official company holiday calendar and HR announcements for your work location always take precedence. No company holiday status is implied by this illustrative list.</p></div>
    </div>
  </EmployeeFeaturePage>;
}
