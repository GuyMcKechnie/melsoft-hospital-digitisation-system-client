import React, { JSX, useEffect, useState } from "react";
import { listUsers, createUser, updateUser, deleteUser } from "@/api";
import { toast } from "sonner";
import { z } from "zod";
import { Trash2, Plus, X, Edit3, Check, RotateCw } from "lucide-react";

type Patient = {
    name: string;
    id: string;
    lastVisit: string;
    diagnosis: string;
    doctor: string;
    age: number;
};

type PatientInput = Omit<Patient, "age"> & { age: string };

function UserManagement(): JSX.Element {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [newPatient, setNewPatient] = useState<PatientInput>({
        name: "",
        id: "",
        lastVisit: "",
        diagnosis: "",
        doctor: "",
        age: "",
    });
    const [errors, setErrors] = useState<Record<string, string> | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPatient((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const PatientFormSchema = z.object({
        name: z.string().min(1, "Name is required"),
        id: z.string().min(1, "ID is required"),
        lastVisit: z.string().optional().or(z.literal("")),
        diagnosis: z.string().optional().or(z.literal("")),
        doctor: z.string().optional().or(z.literal("")),
        age: z.preprocess((val) => {
            if (typeof val === "string") {
                const n = parseInt(val, 10);
                return Number.isNaN(n) ? 0 : n;
            }
            if (typeof val === "number") return val;
            return 0;
        }, z.number().int().nonnegative()),
    });

    const handleAddPatient = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors(null);

        const result = PatientFormSchema.safeParse(newPatient as any);
        if (!result.success) {
            const errMap: Record<string, string> = {};
            result.error.issues.forEach((err: z.ZodIssue) => {
                const key = String(err.path[0] ?? "form");
                if (!errMap[key]) errMap[key] = err.message;
            });
            setErrors(errMap);
            return;
        }

        const parsed = result.data;
        // optimistic UI: create local entry and attempt to persist to API
        const tempId = `tmp-${Date.now()}`;
        const newEntry: Patient = {
            name: parsed.name,
            id: tempId,
            lastVisit: parsed.lastVisit ?? "",
            diagnosis: parsed.diagnosis ?? "",
            doctor: parsed.doctor ?? "",
            age: parsed.age,
        };

        setPatients((prev) => [newEntry, ...prev]);

        (async () => {
            try {
                const created = await createUser({
                    name: parsed.name,
                    email: `${parsed.id}@example.com`,
                    role: "patient",
                    active: true,
                } as any);

                // replace temp entry with server-created user (if returned)
                setPatients((prev) =>
                    prev.map((p) =>
                        p.id === tempId ? { ...p, id: created.id } : p,
                    ),
                );
                toast.success("User created");
            } catch (err: any) {
                // rollback
                setPatients((prev) => prev.filter((p) => p.id !== tempId));
                toast.error(err?.message || "Failed to create user");
            }
        })();

        setNewPatient({
            name: "",
            id: "",
            lastVisit: "",
            diagnosis: "",
            doctor: "",
            age: "",
        });
        setShowForm(false);
    };

    const handleDeletePatient = (index: number) => {
        const p = patients[index];
        if (!p) return;

        // optimistic remove
        const snapshot = patients;
        setPatients((prev) => prev.filter((_, i) => i !== index));

        (async () => {
            try {
                // if id is temp, just remove locally
                if (p.id.startsWith("tmp-")) return;
                await deleteUser(p.id);
                toast.success("User deleted");
            } catch (err: any) {
                setPatients(snapshot);
                toast.error(err?.message || "Failed to delete user");
            }
        })();
    };

    // Inline edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<Patient> | null>(null);

    const startEdit = (p: Patient) => {
        if (p.id.startsWith("tmp-")) {
            toast.error(
                "Please wait for user creation to finish before editing.",
            );
            return;
        }
        setEditingId(p.id);
        setEditForm({ ...p });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm(null);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({
            ...(prev ?? {}),
            [name]: name === "age" ? Number(value) : value,
        }));
    };

    const saveEdit = async (id: string) => {
        if (!editForm) return;
        const snapshot = patients;
        // optimistic update
        setPatients((prev) =>
            prev.map((p) =>
                p.id === id ? ({ ...p, ...editForm } as Patient) : p,
            ),
        );

        try {
            await updateUser(id, {
                name: editForm.name,
                // map other fields if your backend supports them
            } as any);
            toast.success("User updated");
            cancelEdit();
        } catch (err: any) {
            setPatients(snapshot);
            toast.error(err?.message || "Failed to update user");
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            try {
                const data = await listUsers();
                if (mounted && Array.isArray(data)) {
                    // Map server users to Patient shape minimally
                    setPatients(
                        data.map((u) => ({
                            name: u.name || u.email || "",
                            id: u.id,
                            lastVisit: "",
                            diagnosis: "",
                            doctor: "",
                            age: 0,
                        })),
                    );
                }
            } catch (err) {
                console.error("Failed to load users", err);
            } finally {
                if (mounted) setLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen w-full bg-background p-6 text-foreground">
            <h2 className="text-3xl font-bold text-center mb-6">
                User Management
            </h2>

            <div className="mb-4 flex justify-end">
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? "Cancel" : "Add New Patient"}
                </button>
            </div>

            {showForm && (
                <div className="bg-card p-6 rounded-xl shadow-sm mb-6 text-card-foreground">
                    <h3 className="text-xl font-semibold mb-4">
                        Add New Patient
                    </h3>
                    <form
                        onSubmit={handleAddPatient}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Patient Name"
                            value={newPatient.name}
                            onChange={handleInputChange}
                            className="p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                            aria-invalid={errors?.name ? "true" : "false"}
                        />
                        {errors?.name && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.name}
                            </p>
                        )}
                        <input
                            type="text"
                            name="id"
                            placeholder="ID Number"
                            value={newPatient.id}
                            onChange={handleInputChange}
                            className="p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                            required
                            aria-invalid={errors?.id ? "true" : "false"}
                        />
                        {errors?.id && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.id}
                            </p>
                        )}
                        <input
                            type="text"
                            name="lastVisit"
                            placeholder="Last Visit (e.g., March 7th 2025)"
                            value={newPatient.lastVisit}
                            onChange={handleInputChange}
                            className="p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <input
                            type="text"
                            name="diagnosis"
                            placeholder="Diagnosis"
                            value={newPatient.diagnosis}
                            onChange={handleInputChange}
                            className="p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <input
                            type="text"
                            name="doctor"
                            placeholder="Doctor Name"
                            value={newPatient.doctor}
                            onChange={handleInputChange}
                            className="p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={newPatient.age}
                            onChange={handleInputChange}
                            className="p-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-ring"
                            aria-invalid={errors?.age ? "true" : "false"}
                        />
                        {errors?.age && (
                            <p className="text-sm text-destructive mt-1">
                                {errors.age}
                            </p>
                        )}
                        <button
                            type="submit"
                            className="md:col-span-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all"
                        >
                            Add Patient
                        </button>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full bg-card shadow-sm rounded-xl text-card-foreground">
                    <thead>
                        <tr className="bg-primary text-primary-foreground text-left">
                            <th className="p-3">Patient Name</th>
                            <th className="p-3">ID No</th>
                            <th className="p-3">Last Visit</th>
                            <th className="p-3">Diagnosis</th>
                            <th className="p-3">Doctor</th>
                            <th className="p-3">Age</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {patients.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="p-4 text-center text-muted-foreground"
                                >
                                    No accounts found
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient, index) => (
                                <tr
                                    key={patient.id}
                                    className="border-b border-border hover:bg-popover"
                                >
                                    <td className="p-3">
                                        {editingId === patient.id ? (
                                            <input
                                                name="name"
                                                value={editForm?.name ?? ""}
                                                onChange={handleEditChange}
                                                className="p-1 border border-border rounded w-full"
                                            />
                                        ) : (
                                            patient.name
                                        )}
                                    </td>
                                    <td className="p-3">{patient.id}</td>
                                    <td className="p-3">
                                        {editingId === patient.id ? (
                                            <input
                                                name="lastVisit"
                                                value={
                                                    editForm?.lastVisit ?? ""
                                                }
                                                onChange={handleEditChange}
                                                className="p-1 border border-border rounded w-full"
                                            />
                                        ) : (
                                            patient.lastVisit
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {editingId === patient.id ? (
                                            <input
                                                name="diagnosis"
                                                value={
                                                    editForm?.diagnosis ?? ""
                                                }
                                                onChange={handleEditChange}
                                                className="p-1 border border-border rounded w-full"
                                            />
                                        ) : (
                                            patient.diagnosis
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {editingId === patient.id ? (
                                            <input
                                                name="doctor"
                                                value={editForm?.doctor ?? ""}
                                                onChange={handleEditChange}
                                                className="p-1 border border-border rounded w-full"
                                            />
                                        ) : (
                                            patient.doctor
                                        )}
                                    </td>
                                    <td className="p-3 w-24">
                                        {editingId === patient.id ? (
                                            <input
                                                name="age"
                                                type="number"
                                                value={String(
                                                    editForm?.age ?? "",
                                                )}
                                                onChange={handleEditChange}
                                                className="p-1 border border-border rounded w-full"
                                            />
                                        ) : (
                                            patient.age
                                        )}
                                    </td>
                                    <td className="p-3 flex gap-2">
                                        {editingId === patient.id ? (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        saveEdit(patient.id)
                                                    }
                                                    className="bg-primary text-primary-foreground px-3 py-1 rounded hover:opacity-90 transition-all flex items-center gap-2"
                                                >
                                                    <Check /> Save
                                                </button>
                                                <button
                                                    onClick={cancelEdit}
                                                    className="bg-ghost px-3 py-1 rounded hover:opacity-90 transition-all flex items-center gap-2"
                                                >
                                                    <RotateCw /> Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() =>
                                                        startEdit(patient)
                                                    }
                                                    className="bg-secondary text-secondary-foreground px-3 py-1 rounded hover:opacity-90 transition-all flex items-center gap-2"
                                                >
                                                    <Edit3 /> Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDeletePatient(
                                                            index,
                                                        )
                                                    }
                                                    className="bg-destructive text-primary-foreground px-3 py-1 rounded hover:opacity-90 transition-all"
                                                >
                                                    <Trash2 />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagement;
