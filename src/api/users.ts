import { crud } from "./client";

export type User = {
    id: string;
    name: string;
    email: string;
    role?: "admin" | "staff" | "doctor" | "patient";
    active?: boolean;
};

export function listUsers(params?: Record<string, any>) {
    return (async () => {
        const res = await crud.list<any>("users", params);
        // API responses are sometimes wrapped as { success: true, data: { items: [...] } }
        if (res && typeof res === "object") {
            if (Array.isArray(res)) return res as User[];
            if (Array.isArray(res.items)) return res.items as User[];
            if (res.data && Array.isArray(res.data.items)) return res.data.items as User[];
        }
        return res as User[];
    })();
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
