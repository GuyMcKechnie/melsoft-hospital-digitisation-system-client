import React, { JSX, useState } from "react";
import { z } from "zod";
import { Trash2, Plus, X } from "lucide-react";

type Patient = {
    name: string;
    id: string;
    lastVisit: string;
    diagnosis: string;
    doctor: string;
    age: number;
};

type PatientInput = Omit<Patient, "age"> & { age: string };

function PatientManagement(): JSX.Element {
    const [patients, setPatients] = useState<Patient[]>([
        {
            name: "Janet Abigail",
            id: "12345678",
            lastVisit: "March 7th 2025",
            diagnosis: "Flu",
            doctor: "Blok",
            age: 21,
        },
    ]);

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
        setPatients((prev) => [
            ...prev,
            {
                name: parsed.name,
                id: parsed.id,
                lastVisit: parsed.lastVisit ?? "",
                diagnosis: parsed.diagnosis ?? "",
                doctor: parsed.doctor ?? "",
                age: parsed.age,
            },
        ]);

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
        setPatients((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="min-h-screen bg-background p-6 text-foreground">
            <h2 className="text-3xl font-bold text-center mb-6">Admin Panel</h2>

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
                            <th className="p-3">Delete</th>
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
                                    key={index}
                                    className="border-b border-border hover:bg-popover"
                                >
                                    <td className="p-3">{patient.name}</td>
                                    <td className="p-3">{patient.id}</td>
                                    <td className="p-3">{patient.lastVisit}</td>
                                    <td className="p-3">{patient.diagnosis}</td>
                                    <td className="p-3">{patient.doctor}</td>
                                    <td className="p-3">{patient.age}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() =>
                                                handleDeletePatient(index)
                                            }
                                            className="bg-destructive text-primary-foreground px-3 py-1 rounded hover:opacity-90 transition-all"
                                        >
                                            <Trash2 />
                                        </button>
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

export default PatientManagement;
