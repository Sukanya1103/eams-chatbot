import EmployeeFeaturePage from "../EmployeeFeaturePage";
import EmployeeEmptyTable from "../EmployeeEmptyTable";

export default function EmployeeWorkFromHomePage() {
  return <EmployeeFeaturePage title="Work From Home" description="Review your work-from-home requests and their status." emptyTitle="Work-from-home requests are not available" emptyDescription="There is no employee work-from-home request API or existing request workflow in this project. This page does not submit or imply requests.">
    <EmployeeEmptyTable columns={["Requested dates", "Status", "Reason", "Actions"]} emptyMessage="No work-from-home request data is available." />
  </EmployeeFeaturePage>;
}
