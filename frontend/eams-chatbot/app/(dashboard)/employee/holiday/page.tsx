import EmployeeFeaturePage from "../EmployeeFeaturePage";
import EmployeeEmptyTable from "../EmployeeEmptyTable";

export default function EmployeeHolidaysPage() {
  return <EmployeeFeaturePage title="Holidays" description="Review upcoming and past company holidays." emptyTitle="Holiday information is unavailable" emptyDescription="This project does not currently provide an employee holiday calendar or holiday data source. No dates are shown here until company data is connected.">
    <EmployeeEmptyTable columns={["Holiday name", "Date", "Day", "Type"]} emptyMessage="No holiday records are available." />
  </EmployeeFeaturePage>;
}
