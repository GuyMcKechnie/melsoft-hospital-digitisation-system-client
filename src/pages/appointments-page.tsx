import React, { JSX, useState } from "react";
import RootLayout from "@/components/layout";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type Appointment = {
    id: string;
    service: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    doctor?: string;
    status: "Pending" | "Approved" | "Completed" | "Cancelled";
};

const initialAppointments: Appointment[] = [
    {
        id: "a1",
        service: "General Consultation",
        date: "2026-02-10",
        time: "10:30",
        doctor: "Dr. Nkosi",
        status: "Approved",
    },
    {
        id: "a2",
        service: "Blood Test",
        date: "2026-02-01",
        time: "09:00",
        doctor: "Pathology Lab",
        status: "Completed",
    },
    {
        id: "a3",
        service: "X-Ray",
        date: "2026-02-20",
        time: "14:00",
        doctor: "Dr. Lee",
        status: "Pending",
    },
    {
        id: "a4",
        service: "Pediatrics Consultation",
        date: "2025-12-15",
        time: "11:00",
        doctor: "Dr. Patel",
        status: "Completed",
    },
];

export default function AppointmentsPage(): JSX.Element {
    const [appointments, setAppointments] =
        useState<Appointment[]>(initialAppointments);

    const now = new Date();

    const parseDateTime = (a: Appointment) => new Date(`${a.date}T${a.time}`);

    const upcoming = appointments.filter(
        (a) => parseDateTime(a) >= now && a.status !== "Cancelled",
    );
    const past = appointments.filter(
        (a) => parseDateTime(a) < now || a.status === "Cancelled",
    );

    const cancelAppointment = (id: string) => {
        setAppointments((prev) =>
            prev.map((a) =>
                a.id === id && a.status !== "Completed"
                    ? { ...a, status: "Cancelled" }
                    : a,
            ),
        );
    };

    const rescheduleAppointment = (id: string) => {
        const a = appointments.find((x) => x.id === id);
        if (!a || a.status === "Completed" || a.status === "Cancelled") return;

        const newDate = window.prompt("Enter new date (YYYY-MM-DD)", a.date);
        if (!newDate) return;
        const newTime = window.prompt("Enter new time (HH:MM)", a.time);
        if (!newTime) return;

        setAppointments((prev) =>
            prev.map((x) =>
                x.id === id
                    ? { ...x, date: newDate, time: newTime, status: "Pending" }
                    : x,
            ),
        );
    };

    const formatDT = (a: Appointment) => {
        const d = parseDateTime(a);
        return `${d.toLocaleDateString()} • ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    };

    return (
        <RootLayout>
            <SiteHeader />

            <main className="mx-auto p-6 max-w-[1000px]">
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
                        {upcoming.length === 0 ? (
                            <div className="text-muted-foreground">
                                No upcoming appointments.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {upcoming.map((a) => (
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
                                                    rescheduleAppointment(a.id)
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
                                                    cancelAppointment(a.id)
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
                                {past.map((a) => (
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
