import DashboardStatistics, {
    DashboardStat,
} from "@/components/dashboard-statistics";
import { SiteHeader } from "@/components/site-header";
import RootLayout from "@/components/layout";
import { get } from "@/api/client";
import { listEnquiries, Enquiry } from "@/api/enquiries";
import { MessageSquareText, UserCheck, UserCog, Users } from "lucide-react";
import { useEffect, useState } from "react";

function AdminDashboard(): JSX.Element {
    const [stats, setStats] = useState<DashboardStat[]>([
        {
            title: "Total Patients",
            value: "0",
            icon: Users,
            iconColor: "bg-blue-100 text-blue-600",
        },
        {
            title: "Total Staff",
            value: "0",
            icon: UserCheck,
            iconColor: "bg-green-100 text-green-600",
        },
        {
            title: "Total Admins",
            value: "0",
            icon: UserCog,
            iconColor: "bg-orange-100 text-orange-600",
        },
        {
            title: "Total Enquiries",
            value: "0",
            icon: MessageSquareText,
            iconColor: "bg-red-100 text-red-600",
        },
    ]);
    const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;

        const extractTotal = (resp: any): number => {
            const metaTotal = resp?.data?.meta?.total;
            if (typeof metaTotal === "number") return metaTotal;
            const items = resp?.data?.items ?? resp?.items ?? resp;
            if (Array.isArray(items)) return items.length;
            return 0;
        };

        const load = async () => {
            setLoading(true);
            try {
                const [patientsResp, staffResp, adminResp, enquiriesResp] =
                    await Promise.all([
                        get<any>("/users", { role: "user", limit: 1 }),
                        get<any>("/users", { role: "staff", limit: 1 }),
                        get<any>("/users", { role: "admin", limit: 1 }),
                        listEnquiries({ page: 1, limit: 5 }),
                    ]);

                const patientsTotal = extractTotal(patientsResp);
                const staffTotal = extractTotal(staffResp);
                const adminTotal = extractTotal(adminResp);
                const enquiriesTotal =
                    enquiriesResp?.meta?.total ??
                    enquiriesResp?.items?.length ??
                    0;

                if (mounted) {
                    setStats([
                        {
                            title: "Total Patients",
                            value: patientsTotal.toLocaleString(),
                            icon: Users,
                            iconColor: "bg-blue-100 text-blue-600",
                        },
                        {
                            title: "Total Staff",
                            value: staffTotal.toLocaleString(),
                            icon: UserCheck,
                            iconColor: "bg-green-100 text-green-600",
                        },
                        {
                            title: "Total Admins",
                            value: adminTotal.toLocaleString(),
                            icon: UserCog,
                            iconColor: "bg-orange-100 text-orange-600",
                        },
                        {
                            title: "Total Enquiries",
                            value: enquiriesTotal.toLocaleString(),
                            icon: MessageSquareText,
                            iconColor: "bg-red-100 text-red-600",
                        },
                    ]);
                    setRecentEnquiries(enquiriesResp.items ?? []);
                }
            } catch (err) {
                if (mounted) {
                    setRecentEnquiries([]);
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const formatDate = (value?: string | null) => {
        if (!value) return "--";
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return "--";
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "2-digit",
        });
    };

    return (
        <RootLayout>
            <SiteHeader />
            <main className="mx-auto p-6">
                <div className="space-y-6">
                    <DashboardStatistics stats={stats} />

                    <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <h3 className="text-xl font-semibold mb-4">
                            Recent Enquiries
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-sm text-muted-foreground">
                                        <th className="p-2">Subject</th>
                                        <th className="p-2">From</th>
                                        <th className="p-2">Status</th>
                                        <th className="p-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr className="border-t border-border">
                                            <td className="p-2" colSpan={4}>
                                                Loading enquiries...
                                            </td>
                                        </tr>
                                    ) : recentEnquiries.length > 0 ? (
                                        recentEnquiries.map((enquiry) => (
                                            <tr
                                                key={enquiry.id}
                                                className="border-t border-border"
                                            >
                                                <td className="p-2">
                                                    {enquiry.subject || "--"}
                                                </td>
                                                <td className="p-2">
                                                    {enquiry.fromName || "--"}
                                                </td>
                                                <td className="p-2">
                                                    {enquiry.status || "--"}
                                                </td>
                                                <td className="p-2">
                                                    {formatDate(
                                                        enquiry.createdAt,
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="border-t border-border">
                                            <td className="p-2" colSpan={4}>
                                                No enquiries found.
                                            </td>
                                        </tr>
                                    )}
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
