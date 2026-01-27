import DashboardStatistics from "@/components/dashboard-statistics";
import PatientManagement from "@/components/patient-mangement";
import { JSX } from "react";

function ClinicalDashboardPage(): JSX.Element {
    return (
        <div className="space-y-6">
            <div>
                <DashboardStatistics />
            </div>
            <div>
                <PatientManagement />
            </div>
        </div>
    );
}

export default ClinicalDashboardPage;
