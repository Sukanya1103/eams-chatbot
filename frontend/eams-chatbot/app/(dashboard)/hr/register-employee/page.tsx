import RegisterEmployeeModal from "@/components/employees/RegisterEmployeeModal";

export default function RegisterEmployeePage() {
  return <div className="mx-auto max-w-3xl rounded-2xl border border-blue-100 bg-white p-8 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#3B82F6]">People operations</p><h1 className="mt-1 text-2xl font-bold text-slate-950">Register employee</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Create a new employee profile and securely issue their temporary sign-in credentials from the registration modal.</p><div className="mt-6"><RegisterEmployeeModal /></div></div>;
}
