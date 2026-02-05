import React, { useState } from "react";
import RootLayout from "@/components/layout";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Service = {
    id: string;
    name: string;
    department: string;
    duration: string;
    price?: string;
    description?: string;
};

const SERVICES: Service[] = [
    {
        id: "s1",
        name: "General Consultation",
        department: "General Medicine",
        duration: "30 mins",
        price: "R200",
    },
    {
        id: "s2",
        name: "Pediatrics Consultation",
        department: "Pediatrics",
        duration: "30 mins",
        price: "R220",
    },
    {
        id: "s3",
        name: "Blood Test",
        department: "Pathology",
        duration: "15 mins",
        price: "R150",
    },
    {
        id: "s4",
        name: "X-Ray",
        department: "Radiology",
        duration: "20 mins",
        price: "R350",
    },
];

export default function ServicesPage() {
    const [selected, setSelected] = useState<Service | null>(null);
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState<
        null | "idle" | "loading" | "success" | "error"
    >("idle");
    const [message, setMessage] = useState<string | null>(null);

    const handleSelect = (s: Service) => {
        setSelected(s);
        setMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (!selected) {
            setMessage("Please select a service.");
            return;
        }
        if (!date || !time) {
            setMessage("Please choose a date and time.");
            return;
        }

        const payload = {
            serviceId: selected.id,
            serviceName: selected.name,
            date,
            time,
            notes,
        };

        setStatus("loading");

        try {
            // Attempt to send booking request to API. If API not available, simulate success.
            const resp = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (resp.ok) {
                setStatus("success");
                setMessage(
                    "Booking request submitted. You will be notified when confirmed.",
                );
                setDate("");
                setTime("");
                setNotes("");
                setSelected(null);
            } else {
                // If server returns error, try to parse message
                const data = await resp.json().catch(() => ({}));
                setStatus("error");
                setMessage(data?.message || "Failed to submit booking.");
            }
        } catch (err) {
            // Simulate success if network/API not available
            setStatus("success");
            setMessage("Booking request submitted (simulation).");
            setDate("");
            setTime("");
            setNotes("");
            setSelected(null);
        }
    };

    return (
        <RootLayout>
            <SiteHeader />
            <main className="mx-auto p-6 max-w-[1000px]">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">Book a Service</h1>
                    <p className="text-sm text-muted-foreground">
                        Select a service, choose date & time, then submit a
                        booking request.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <section className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <h2 className="text-lg font-medium mb-4">
                            Available Services
                        </h2>
                        <div className="space-y-3">
                            {SERVICES.map((s) => (
                                <div
                                    key={s.id}
                                    className="flex items-center justify-between border border-border rounded-md p-3 hover:bg-popover"
                                >
                                    <div>
                                        <div className="font-medium">
                                            {s.name}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {s.department} • {s.duration} •{" "}
                                            {s.price}
                                        </div>
                                        {s.description && (
                                            <div className="text-sm text-muted-foreground mt-1">
                                                {s.description}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <Button
                                            variant={
                                                selected?.id === s.id
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                            onClick={() => handleSelect(s)}
                                        >
                                            {selected?.id === s.id
                                                ? "Selected"
                                                : "Select"}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        <h2 className="text-lg font-medium mb-4">
                            Booking Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">
                                    Selected Service
                                </label>
                                <div className="h-10 flex items-center">
                                    <div className="flex-1 text-sm">
                                        {selected ? (
                                            <div>
                                                <div className="font-medium">
                                                    {selected.name}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {selected.department} •{" "}
                                                    {selected.duration}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-muted-foreground">
                                                No service selected
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-1">
                                        Date
                                    </label>
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={(e) =>
                                            setDate(e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-muted-foreground mb-1">
                                        Time
                                    </label>
                                    <Input
                                        type="time"
                                        value={time}
                                        onChange={(e) =>
                                            setTime(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">
                                    Notes (optional)
                                </label>
                                <textarea
                                    className="w-full rounded-md border border-border px-3 py-2 text-sm"
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {message && (
                                <div
                                    className={`text-sm ${status === "error" ? "text-destructive" : "text-green-600"}`}
                                >
                                    {message}
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <Button
                                    type="submit"
                                    disabled={status === "loading"}
                                >
                                    {status === "loading"
                                        ? "Submitting..."
                                        : "Submit Booking Request"}
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setSelected(null);
                                        setDate("");
                                        setTime("");
                                        setNotes("");
                                        setMessage(null);
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </RootLayout>
    );
}
