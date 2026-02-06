import { Link } from "react-router-dom";
import { JSX, useEffect, useMemo, useState } from "react";
import { listAppointments, Appointment } from "@/api/appointments";
import { useAuth } from "@/contexts/auth";
import { SiteHeader } from "@/components/site-header";
import RootLayout from "@/components/layout";

const UserDashboard = (): JSX.Element => {
    const { currentUser } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            setLoading(true);
            try {
                const data = await listAppointments();
                if (mounted && Array.isArray(data)) {
                    setAppointments(data);
                }
            } catch (err) {
                if (mounted) setAppointments([]);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, []);

    const parseAppointmentDate = (appointment: Appointment) => {
        if (!appointment.date) return null;
        const time = appointment.time || "00:00";
        const normalizedTime = time.length === 5 ? `${time}:00` : time;
        const value = `${appointment.date}T${normalizedTime}`;
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return null;
        return parsed;
    };

    const upcomingAppointment = useMemo(() => {
        const now = new Date();
        const upcoming = appointments
            .map((appointment) => ({
                appointment,
                date: parseAppointmentDate(appointment),
            }))
            .filter(
                (item) =>
                    item.date &&
                    item.appointment.status !== "Cancelled" &&
                    item.date >= now,
            )
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());

        return upcoming.length > 0 ? upcoming[0].appointment : null;
    }, [appointments]);

    const recentAppointments = useMemo(() => {
        const sorted = appointments
            .map((appointment) => ({
                appointment,
                date: parseAppointmentDate(appointment),
            }))
            .sort((a, b) => {
                const aTime = a.date ? a.date.getTime() : 0;
                const bTime = b.date ? b.date.getTime() : 0;
                return bTime - aTime;
            })
            .map((item) => item.appointment);

        return sorted.slice(0, 3);
    }, [appointments]);

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

    const formatTime = (appointment?: Appointment | null) => {
        if (!appointment?.time) return "--";
        const [hours, minutes] = appointment.time.split(":");
        if (!hours || !minutes) return appointment.time;
        const date = new Date();
        date.setHours(Number(hours), Number(minutes), 0, 0);
        if (Number.isNaN(date.getTime())) return appointment.time;
        return date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "2-digit",
        });
    };

    const userName = currentUser?.name || currentUser?.email || "User";
    const accountStatus = currentUser?.status || "unknown";
    const statusLabel =
        accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1);
    const statusClass =
        accountStatus === "active" ? "text-green-600" : "text-muted-foreground";
    const totalAppointments = appointments.length;
    return (
        <RootLayout>
            <SiteHeader />

            <main className="mx-auto p-6">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-semibold">Welcome back</h1>
                        <p className="text-sm text-muted-foreground">
                            {userName}
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                            <p className="text-sm text-muted-foreground">
                                Next Appointment
                            </p>
                            <h2 className="text-xl font-semibold mt-1">
                                {loading
                                    ? "Loading..."
                                    : upcomingAppointment
                                      ? formatDate(upcomingAppointment.date)
                                      : "No upcoming"}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                {loading
                                    ? "--"
                                    : formatTime(upcomingAppointment)}
                            </p>
                        </div>

                        <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                            <p className="text-sm text-muted-foreground">
                                Total Appointments
                            </p>
                            <h2 className="text-xl font-semibold mt-1">
                                {loading
                                    ? "Loading..."
                                    : totalAppointments.toLocaleString()}
                            </h2>
                        </div>

                        <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                            <p className="text-sm text-muted-foreground">
                                Account Status
                            </p>
                            <h2
                                className={`text-xl font-semibold mt-1 ${statusClass}`}
                            >
                                {statusLabel}
                            </h2>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                            <h2 className="text-lg font-semibold mb-4">
                                Upcoming Appointment
                            </h2>

                            <div className="space-y-2 text-sm">
                                {loading ? (
                                    <p className="text-muted-foreground">
                                        Loading appointment details...
                                    </p>
                                ) : upcomingAppointment ? (
                                    <>
                                        <p>
                                            <span className="text-muted-foreground">
                                                Date:
                                            </span>{" "}
                                            {formatDate(
                                                upcomingAppointment.date,
                                            )}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">
                                                Time:
                                            </span>{" "}
                                            {formatTime(upcomingAppointment)}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">
                                                Doctor:
                                            </span>{" "}
                                            {upcomingAppointment.doctor || "--"}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">
                                                Service:
                                            </span>{" "}
                                            {upcomingAppointment.service ||
                                                "--"}
                                        </p>
                                        <p>
                                            <span className="text-muted-foreground">
                                                Status:
                                            </span>{" "}
                                            <span className="font-medium">
                                                {upcomingAppointment.status}
                                            </span>
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">
                                        No upcoming appointments.
                                    </p>
                                )}
                            </div>

                            <Link
                                to="/appointments"
                                className="inline-block mt-4 text-sm font-medium underline"
                            >
                                View all appointments
                            </Link>
                        </div>

                        <div className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                            <h2 className="text-lg font-semibold mb-4">
                                Recent Appointments
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground">
                                            <th className="pb-2">Date</th>
                                            <th className="pb-2">Service</th>
                                            <th className="pb-2">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr className="border-t border-border">
                                                <td
                                                    className="py-2"
                                                    colSpan={3}
                                                >
                                                    Loading appointments...
                                                </td>
                                            </tr>
                                        ) : recentAppointments.length > 0 ? (
                                            recentAppointments.map(
                                                (appointment) => (
                                                    <tr
                                                        key={appointment.id}
                                                        className="border-t border-border"
                                                    >
                                                        <td className="py-2">
                                                            {formatDate(
                                                                appointment.date,
                                                            )}
                                                        </td>
                                                        <td>
                                                            {appointment.service ||
                                                                "--"}
                                                        </td>
                                                        <td>
                                                            {appointment.status}
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr className="border-t border-border">
                                                <td
                                                    className="py-2"
                                                    colSpan={3}
                                                >
                                                    No appointments yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <Link
                                to="/appointments"
                                className="inline-block mt-4 text-sm font-medium underline"
                            >
                                View all appointments
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </RootLayout>
    );
};

export default UserDashboard;
