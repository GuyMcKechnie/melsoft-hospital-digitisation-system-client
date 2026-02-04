import DashboardStatistics from "@/components/dashboard-statistics";
import { SiteHeader } from "@/components/site-header";
import RootLayout from "@/components/layout";
import { JSX } from "react";

function AdminDashboard(): JSX.Element {
    const appointments = [
        {
            patient: "Janet Abigail",
            date: "March 7th 2025",
            time: "10:00 AM",
            doctor: "Dr. Blok",
            status: "Scheduled",
        },
        {
            patient: "John Doe",
            date: "March 8th 2025",
            time: "11:30 AM",
            doctor: "Dr. Smith",
            status: "Completed",
        },
        {
            patient: "Mary Jane",
            date: "March 9th 2025",
            time: "02:00 PM",
            doctor: "Dr. Lee",
            status: "Cancelled",
        },
    ];

    return (
        <RootLayout>
            <SiteHeader />
            <main className="mx-auto p-6">
                <div className="space-y-6">
                    <DashboardStatistics />

                    <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <h3 className="text-xl font-semibold mb-4">
                            Upcoming Appointments
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-sm text-muted-foreground">
                                        <th className="p-2">Patient</th>
                                        <th className="p-2">Date</th>
                                        <th className="p-2">Time</th>
                                        <th className="p-2">Doctor</th>
                                        <th className="p-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.map((a, i) => (
                                        <tr
                                            key={i}
                                            className="border-t border-border"
                                        >
                                            <td className="p-2">{a.patient}</td>
                                            <td className="p-2">{a.date}</td>
                                            <td className="p-2">{a.time}</td>
                                            <td className="p-2">{a.doctor}</td>
                                            <td className="p-2">{a.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </RootLayout>
    );
}

export default AdminDashboard;
