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

// High-level helpers
export function cancelAppointment(id: string) {
    // Prefer a dedicated endpoint if backend provides one (PATCH /appointments/:id/cancel)
    // Fallback to updating the appointment status.
    return updateAppointment(id, { status: "Cancelled" });
}

export function rescheduleAppointment(id: string, date: string, time: string) {
    // Backend may offer a dedicated reschedule endpoint; otherwise update fields.
    return updateAppointment(id, { date, time, status: "Pending" });
}

export type CreateAppointmentPayload = Omit<Partial<Appointment>, "id">;
export type UpdateAppointmentPayload = Partial<Appointment>;

