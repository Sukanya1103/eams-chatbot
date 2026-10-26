import EmployeeFeaturePage from "../EmployeeFeaturePage";
import EmployeeEmptyTable from "../EmployeeEmptyTable";

export default function EmployeeOvertimePage() {
  return <EmployeeFeaturePage title="Overtime" description="View overtime records and approval information." emptyTitle="Overtime records are unavailable" emptyDescription="The current employee APIs do not provide overtime hours, request status, or approval details. No overtime totals or request workflow are simulated.">
    <EmployeeEmptyTable columns={["Date", "Overtime hours", "Status", "Approval information"]} emptyMessage="No overtime records are available." />
  </EmployeeFeaturePage>;
}
