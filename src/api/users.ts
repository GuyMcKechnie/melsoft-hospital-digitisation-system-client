import { crud } from "./client";

export type User = {
    id: string;
    name: string;
    email: string;
    role?: "admin" | "staff" | "doctor" | "patient";
    active?: boolean;
};

export function listUsers(params?: Record<string, any>) {
    return crud.list<User[]>("users", params);
}

export function getUser(id: string) {
    return crud.getById<User>("users", id);
}

export function createUser(payload: Partial<User>) {
    return crud.create<User>("users", payload);
}

export function updateUser(id: string, payload: Partial<User>) {
    return crud.update<User>("users", id, payload);
}

export function deleteUser(id: string) {
    return crud.remove<void>("users", id);
}
