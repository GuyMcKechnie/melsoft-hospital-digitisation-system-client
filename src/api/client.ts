import api from "./api";

export function setAuthToken(token: string | null) {
    if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export async function get<T>(url: string, params?: Record<string, any>) {
    const { data } = await api.get<T>(url, { params });
    return data;
}

export async function post<T>(url: string, payload?: any) {
    const { data } = await api.post<T>(url, payload);
    return data;
}

export async function put<T>(url: string, payload?: any) {
    const { data } = await api.put<T>(url, payload);
    return data;
}

export async function del<T>(url: string) {
    const { data } = await api.delete<T>(url);
    return data;
}

export const crud = {
    list: <T = any>(resource: string, params?: Record<string, any>) =>
        get<T>(`/${resource}`, params),
    getById: <T = any>(resource: string, id: string) =>
        get<T>(`/${resource}/${id}`),
    create: <T = any>(resource: string, payload?: any) =>
        post<T>(`/${resource}`, payload),
    update: <T = any>(resource: string, id: string, payload?: any) =>
        put<T>(`/${resource}/${id}`, payload),
    remove: <T = any>(resource: string, id: string) =>
        del<T>(`/${resource}/${id}`),
};

export default api;
