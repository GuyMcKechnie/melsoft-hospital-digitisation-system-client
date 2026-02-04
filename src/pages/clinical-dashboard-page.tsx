import DashboardStatistics from "@/components/dashboard-statistics";
import PatientManagement from "@/components/patient-mangement";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { JSX } from "react";

function ClinicalDashboardPage(): JSX.Element {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex">
                <AppSidebar />
                <div className="flex-1">
                    <SiteHeader />
                    <main className="mx-auto">
                        <div className="space-y-6">
                            <DashboardStatistics />
                            <PatientManagement />
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default ClinicalDashboardPage;
