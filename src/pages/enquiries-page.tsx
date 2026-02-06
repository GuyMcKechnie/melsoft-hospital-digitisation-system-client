import { JSX, useEffect, useState } from "react";
import RootLayout from "@/components/layout";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { get, post } from "@/api/client";
import { useAuth } from "@/contexts/auth";

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

// initially empty; we'll load from the server
const initialThreads: MessageThread[] = [];

export default function EnquiriesPage(): JSX.Element {
    const [threads, setThreads] = useState<MessageThread[]>(initialThreads);
    const [selectedId, setSelectedId] = useState<string | null>(
        threads[0]?.id ?? null,
    );
    const [replyText, setReplyText] = useState("");
    const [loading, setLoading] = useState(false);
    const { currentUser, loading: authLoading } = useAuth();
    const [newSubject, setNewSubject] = useState("");
    const [newMessage, setNewMessage] = useState("");

    const selectThread = (id: string) => {
        setSelectedId(id);
        setReplyText("");
    };

    const sendReply = () => {
        if (!selectedId || replyText.trim() === "") return;
        (async () => {
            try {
                setLoading(true);
                await post(`/enquiries/${selectedId}/replies`, {
                    message: replyText.trim(),
                });
                // refresh list from server
                await fetchThreads();
                setReplyText("");
            } catch (err) {
                // TODO: show notification
            } finally {
                setLoading(false);
            }
        })();
    };

    const selected = threads.find((t) => t.id === selectedId) ?? null;

    async function fetchThreads() {
        if (authLoading) return;
        try {
            setLoading(true);
            const resp = await get<any>(`/enquiries`);
            const items = (resp && resp.data && resp.data.items) || [];
            // client-side safety: if not admin, ensure only own enquiries are visible
            const filtered =
                currentUser && currentUser.role !== "admin"
                    ? items.filter(
                          (i: any) =>
                              String(i.userId) === String(currentUser.id),
                      )
                    : items;
            setThreads(filtered);
            // select first if none selected
            if (filtered.length && !selectedId) setSelectedId(filtered[0].id);
        } catch (err) {
            // ignore for now
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchThreads();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, currentUser]);

    const createEnquiry = async () => {
        if (!currentUser || currentUser.role !== "patient") return;
        if (!newSubject.trim() || !newMessage.trim()) return;
        try {
            setLoading(true);
            const resp = await post<any>("/enquiries", {
                subject: newSubject.trim(),
                message: newMessage.trim(),
            });
            const created = resp && resp.data && resp.data.enquiry;
            setNewSubject("");
            setNewMessage("");
            await fetchThreads();
            if (created) setSelectedId(created.id);
        } catch (err) {
            // TODO: notify
        } finally {
            setLoading(false);
        }
    };

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
                        {/* Create form visible only to patients */}
                        {currentUser && currentUser.role === "patient" && (
                            <div className="mb-4 p-3 border rounded-md bg-background">
                                <div className="text-sm font-medium mb-2">
                                    Start a new enquiry
                                </div>
                                <input
                                    className="w-full rounded-md border border-border px-2 py-1 mb-2 text-sm bg-card text-card-foreground"
                                    placeholder="Subject"
                                    value={newSubject}
                                    onChange={(e) =>
                                        setNewSubject(e.target.value)
                                    }
                                />
                                <textarea
                                    className="w-full rounded-md border border-border px-2 py-1 text-sm mb-2 bg-card text-card-foreground"
                                    placeholder="Message"
                                    rows={3}
                                    value={newMessage}
                                    onChange={(e) =>
                                        setNewMessage(e.target.value)
                                    }
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={createEnquiry}
                                        disabled={
                                            loading ||
                                            !newSubject.trim() ||
                                            !newMessage.trim()
                                        }
                                    >
                                        Create
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setNewSubject("");
                                            setNewMessage("");
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            </div>
                        )}

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
