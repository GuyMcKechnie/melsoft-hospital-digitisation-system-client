import { JSX, useState } from "react";
import RootLayout from "@/components/layout";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

type Reply = {
    id: string;
    from: "user" | "admin";
    message: string;
    date: string;
};

type MessageThread = {
    id: string;
    fromName: string;
    subject: string;
    createdAt: string;
    status: "open" | "closed";
    messages: Reply[];
};

const initialThreads: MessageThread[] = [
    {
        id: "m1",
        fromName: "Janet Abigail",
        subject: "Query about test results",
        createdAt: "2026-02-01T09:12:00",
        status: "open",
        messages: [
            {
                id: "r1",
                from: "user",
                message: "Hi, when will my blood test results be available?",
                date: "2026-02-01T09:12:00",
            },
        ],
    },
    {
        id: "m2",
        fromName: "John Doe",
        subject: "Reschedule appointment",
        createdAt: "2026-01-25T11:20:00",
        status: "open",
        messages: [
            {
                id: "r2",
                from: "user",
                message: "I need to reschedule my appointment to next week.",
                date: "2026-01-25T11:20:00",
            },
            {
                id: "r3",
                from: "admin",
                message: "Please provide preferred date and time.",
                date: "2026-01-25T12:00:00",
            },
        ],
    },
];

export default function EnquiriesPage(): JSX.Element {
    const [threads, setThreads] = useState<MessageThread[]>(initialThreads);
    const [selectedId, setSelectedId] = useState<string | null>(
        threads[0]?.id ?? null,
    );
    const [replyText, setReplyText] = useState("");

    const selectThread = (id: string) => {
        setSelectedId(id);
        setReplyText("");
    };

    const sendReply = () => {
        if (!selectedId || replyText.trim() === "") return;

        const now = new Date().toISOString();
        setThreads((prev) =>
            prev.map((t) =>
                t.id === selectedId
                    ? {
                          ...t,
                          messages: [
                              ...t.messages,
                              {
                                  id: `a-${Date.now()}`,
                                  from: "admin",
                                  message: replyText.trim(),
                                  date: now,
                              },
                          ],
                      }
                    : t,
            ),
        );

        setReplyText("");
    };

    const selected = threads.find((t) => t.id === selectedId) ?? null;

    return (
        <RootLayout>
            <SiteHeader />

            <main className="mx-auto p-6 max-w-300">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold">
                        Messages & Enquiries
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        View user messages and reply to them from here.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <aside className="col-span-1 bg-card p-4 rounded-xl shadow-sm text-card-foreground">
                        <h2 className="text-lg font-medium mb-3">
                            Conversations
                        </h2>
                        <div className="flex flex-col gap-2">
                            {threads.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => selectThread(t.id)}
                                    className={`text-left p-3 rounded-md border border-border hover:bg-popover ${selectedId === t.id ? "bg-popover" : "bg-card"}`}
                                >
                                    <div className="font-medium">
                                        {t.fromName}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {t.subject}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    <section className="lg:col-span-2 bg-card p-6 rounded-xl shadow-sm text-card-foreground">
                        {!selected ? (
                            <div className="text-muted-foreground">
                                Select a conversation to view messages.
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div>
                                    <div className="font-medium text-lg">
                                        {selected.subject}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        From: {selected.fromName} •{" "}
                                        {new Date(
                                            selected.createdAt,
                                        ).toLocaleString()}
                                    </div>
                                </div>

                                <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
                                    {selected.messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`p-3 rounded-md ${m.from === "admin" ? "bg-[--popover-background] ml-auto" : "bg-popover mr-auto"}`}
                                        >
                                            <div className="text-sm text-muted-foreground">
                                                {m.from === "admin"
                                                    ? "Admin"
                                                    : selected.fromName}{" "}
                                                •{" "}
                                                {new Date(
                                                    m.date,
                                                ).toLocaleString()}
                                            </div>
                                            <div className="mt-1">
                                                {m.message}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-2">
                                    <label className="block text-sm text-muted-foreground mb-1">
                                        Reply
                                    </label>
                                    <textarea
                                        className="w-full rounded-md border border-border px-3 py-2 text-sm bg-card text-card-foreground"
                                        rows={4}
                                        value={replyText}
                                        onChange={(e) =>
                                            setReplyText(e.target.value)
                                        }
                                    />
                                    <div className="mt-3 flex items-center gap-3">
                                        <Button onClick={sendReply}>
                                            Send Reply
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={() => setReplyText("")}
                                        >
                                            Clear
                                        </Button>
                                        <div className="ml-auto text-sm text-muted-foreground">
                                            Status: {selected.status}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </RootLayout>
    );
}
