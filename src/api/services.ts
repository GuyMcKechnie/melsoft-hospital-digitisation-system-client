import { crud } from "./client";

export type Service = {
    id: string;
    name: string;
    description?: string;
    durationMinutes?: number;
    price?: number;
    department?: string;
};

export function listServices(params?: Record<string, any>) {
    return crud.list<Service[]>("services", params);
}

export function getService(id: string) {
    return crud.getById<Service>("services", id);
}

export function createService(payload: Partial<Service>) {
    return crud.create<Service>("services", payload);
}

export function updateService(id: string, payload: Partial<Service>) {
    return crud.update<Service>("services", id, payload);
}

export function deleteService(id: string) {
    return crud.remove<void>("services", id);
}
