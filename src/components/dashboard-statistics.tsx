import {
    ArrowDownRight,
    ArrowUpRight,
    Users,
    Calendar,
    Clock,
    UserX,
} from "lucide-react";

const statistics = [
    {
        title: "Total Registered Patients",
        value: "500 000",
        change: "+0.25%",
        trend: "up",
        icon: Users,
        iconColor: "bg-blue-100 text-blue-600",
    },
    {
        title: "Appointments Today",
        value: "1000",
        change: "+0.25%",
        trend: "up",
        icon: Calendar,
        iconColor: "bg-green-100 text-green-600",
    },
    {
        title: "Pending Reschedule Requests",
        value: "5000",
        change: "+0.25%",
        trend: "up",
        icon: Clock,
        iconColor: "bg-orange-100 text-orange-600",
    },
    {
        title: "Patients Not Registered",
        value: "600 000",
        change: "-2.05%",
        trend: "down",
        icon: UserX,
        iconColor: "bg-red-100 text-red-600",
    },
];

function DashboardStatistics() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 w-full px-4 py-4">
            {statistics.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                    <div
                        className="bg-card text-card-foreground backdrop-blur-xl rounded-2xl p-5 shadow-md shadow-sidebar-ring/10 hover:shadow-xl transition-all duration-300 group"
                        key={index}
                    >
                        <div className="flex flex-col">
                            {/* The Icon */}
                            <div className="mb-3">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconColor} group-hover:scale-110 transition-all duration-300`}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>

                            {/* The Title */}
                            <h3 className="text-lg font-bold mb-2">
                                {stat.title}
                            </h3>

                            {/* The Value (number of patients) */}
                            <p className="text-xl font-semibold text-muted-foreground mb-3">
                                {stat.value}
                            </p>

                            {/* The trend line at the bottom */}
                            <div className="flex items-center space-x-2">
                                {stat.trend === "up" ? (
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                                )}
                                <span
                                    className={`text-sm font-semibold ${stat.trend === "up" ? "text-emerald-500" : "text-red-500"}`}
                                >
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default DashboardStatistics;
