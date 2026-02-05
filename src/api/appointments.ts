import { crud } from "./client";

export type Appointment = {
    id: string;
    service: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    doctor?: string;
    status: "Pending" | "Approved" | "Completed" | "Cancelled";
};

export function listAppointments(params?: Record<string, any>) {
    return crud.list<Appointment[]>("appointments", params);
}

export function getAppointment(id: string) {
    return crud.getById<Appointment>("appointments", id);
}

export function createAppointment(payload: Partial<Appointment>) {
    return crud.create<Appointment>("appointments", payload);
}

export function updateAppointment(id: string, payload: Partial<Appointment>) {
    return crud.update<Appointment>("appointments", id, payload);
}

export function deleteAppointment(id: string) {
    return crud.remove<void>("appointments", id);
}
