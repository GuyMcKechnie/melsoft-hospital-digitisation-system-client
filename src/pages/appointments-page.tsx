import { JSX, useEffect, useState } from "react";
import RootLayout from "@/components/layout";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
    listAppointments,
    cancelAppointment as apiCancelAppointment,
    rescheduleAppointment as apiRescheduleAppointment,
    Appointment as ApiAppointment,
} from "@/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth";

type Appointment = ApiAppointment;

const initialAppointments: Appointment[] = [];

const parseDateTime = (a: Appointment): Date => {
    return new Date(`${a.date}T${a.time}`);
};

export default function AppointmentsPage(): JSX.Element {
    const { currentUser, loading: authLoading } = useAuth();
    const [appointments, setAppointments] =
        useState<Appointment[]>(initialAppointments);
    const [loading, setLoading] = useState(false);

    const handleCancelAppointment = async (id: string) => {
        const a = appointments.find((x) => x.id === id);
        if (!a || a.status === "Completed" || a.status === "Cancelled") return;

        try {
            await apiCancelAppointment(id);
            setAppointments((prev) =>
                prev.map((x) =>
                    x.id === id
                        ? {
                              ...x,
                              status: "Cancelled",
                          }
                        : x,
                ),
            );
            toast.success("Appointment cancelled");
        } catch (err) {
            console.error("Failed to cancel appointment", err);
            toast.error("Failed to cancel appointment");
        }
    };

    const handleRescheduleAppointment = async (id: string) => {
        const a = appointments.find((x) => x.id === id);
        if (!a || a.status === "Completed" || a.status === "Cancelled") return;

        const newDate = window.prompt("Enter new date (YYYY-MM-DD)", a.date);
        if (!newDate) return;
        const newTime = window.prompt("Enter new time (HH:MM)", a.time);
        if (!newTime) return;

        try {
            await apiRescheduleAppointment(id, newDate, newTime);
            setAppointments((prev) =>
                prev.map((x) =>
                    x.id === id
                        ? {
                              ...x,
                              date: newDate,
                              time: newTime,
                              status: "Pending",
                          }
                        : x,
                ),
            );
            toast.success("Appointment rescheduled");
        } catch (err) {
            console.error("Failed to reschedule appointment", err);
            toast.error("Failed to reschedule appointment");
        }
    };

    const formatDT = (a: Appointment) => {
        const d = parseDateTime(a);
        return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    useEffect(() => {
        // restrict client-side: only patients may access this page
        if (authLoading) return;
        if (!currentUser || currentUser.role !== "patient") {
            setAppointments([]);
            setLoading(false);
            return;
        }

        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const data = await listAppointments();
                if (mounted && Array.isArray(data)) setAppointments(data);
            } catch (err) {
                console.error("Failed to load appointments", err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const onCreate = (e: Event) => {
            const detail = (e as CustomEvent).detail as Appointment;
            if (detail) setAppointments((prev) => [detail, ...prev]);
        };

        const onConfirm = (e: Event) => {
            const { tempId, appointment } = (e as CustomEvent).detail as any;
            if (!tempId || !appointment) return;
            setAppointments((prev) =>
                prev.map((a) => (a.id === tempId ? appointment : a)),
            );
        };

        const onRollback = (e: Event) => {
            const { tempId, message } = (e as CustomEvent).detail as any;
            if (!tempId) return;
            setAppointments((prev) => prev.filter((a) => a.id !== tempId));
            if (message) toast.error(message);
        };

        window.addEventListener(
            "appointments:create",
            onCreate as EventListener,
        );
        window.addEventListener(
            "appointments:create:confirm",
            onConfirm as EventListener,
        );
        window.addEventListener(
            "appointments:create:rollback",
            onRollback as EventListener,
        );

        return () => {
            window.removeEventListener(
                "appointments:create",
                onCreate as EventListener,
            );
            window.removeEventListener(
                "appointments:create:confirm",
                onConfirm as EventListener,
            );
            window.removeEventListener(
                "appointments:create:rollback",
                onRollback as EventListener,
            );
        };
    }, []);

    const upcoming = appointments.filter(
        (a) =>
            new Date(`${a.date}T${a.time}`) > new Date() &&
            a.status !== "Cancelled",
    );
    const past = appointments.filter(
        (a) =>
            new Date(`${a.date}T${a.time}`) <= new Date() ||
            a.status === "Cancelled",
    );

    return (
        <RootLayout>
            <SiteHeader />

            <main className="mx-auto p-6 max-w-250">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">My Appointments</h1>
                    <p className="text-sm text-muted-foreground">
                        View upcoming and past appointments. Cancel or
                        reschedule where allowed.
                    </p>
                </div>

                <div className="space-y-6">
                    <section className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <h2 className="text-lg font-medium mb-4">
                            Upcoming Appointments
                        </h2>
                        {loading ? (
                            <div className="text-muted-foreground">
                                Loading...
                            </div>
                        ) : upcoming.length === 0 ? (
                            <div className="text-muted-foreground">
                                No upcoming appointments.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {upcoming.map((a: Appointment) => (
                                    <div
                                        key={a.id}
                                        className="flex items-center justify-between border border-border rounded-md p-3 hover:bg-popover"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {a.service}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {a.doctor} • {formatDT(a)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`text-sm ${a.status === "Pending" ? "text-destructive" : a.status === "Approved" ? "text-green-600" : "text-muted-foreground"}`}
                                            >
                                                {a.status}
                                            </div>
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    handleRescheduleAppointment(
                                                        a.id,
                                                    )
                                                }
                                                disabled={
                                                    a.status === "Completed"
                                                }
                                            >
                                                Reschedule
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() =>
                                                    handleCancelAppointment(
                                                        a.id,
                                                    )
                                                }
                                                disabled={
                                                    a.status === "Completed"
                                                }
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <h2 className="text-lg font-medium mb-4">
                            Past Appointments
                        </h2>
                        {past.length === 0 ? (
                            <div className="text-muted-foreground">
                                No past appointments.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {past.map((a: Appointment) => (
                                    <div
                                        key={a.id}
                                        className="flex items-center justify-between border border-border rounded-md p-3 bg-[--card-background]"
                                    >
                                        <div>
                                            <div className="font-medium">
                                                {a.service}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {a.doctor} • {formatDT(a)}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`text-sm ${a.status === "Cancelled" ? "text-destructive" : "text-muted-foreground"}`}
                                            >
                                                {a.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </RootLayout>
    );
}
