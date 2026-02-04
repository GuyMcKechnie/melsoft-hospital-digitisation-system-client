import DashboardStatistics from "@/components/dashboard-statistics";
import PatientManagement from "@/components/patient-mangement";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { JSX } from "react";

function ClinicalDashboardPage(): JSX.Element {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex bg-gray-50">
                <AppSidebar />

                <div className="flex-1">
                    <SiteHeader />

                    <main className="p-6 max-w-[1200px] mx-auto">
                        <div className="space-y-6">
                            <div>
                                <DashboardStatistics />
                            </div>
                            <div>
                                <PatientManagement />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export default ClinicalDashboardPage;
