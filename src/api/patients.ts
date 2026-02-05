import { crud } from "./client";

export type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    dob?: string; // YYYY-MM-DD
    gender?: "Male" | "Female" | "Other";
    email?: string;
    phone?: string;
    address?: string;
    medicalRecordNumber?: string;
};

export function listPatients(params?: Record<string, any>) {
    return crud.list<Patient[]>("patients", params);
}

export function getPatient(id: string) {
    return crud.getById<Patient>("patients", id);
}

export function createPatient(payload: Partial<Patient>) {
    return crud.create<Patient>("patients", payload);
}

export function updatePatient(id: string, payload: Partial<Patient>) {
    return crud.update<Patient>("patients", id, payload);
}

export function deletePatient(id: string) {
    return crud.remove<void>("patients", id);
}
