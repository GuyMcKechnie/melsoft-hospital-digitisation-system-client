import api from "./api";

const TOKEN_KEY = "melsoft_auth_token";

export function getStoredAuthToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch (e) {
        return null;
    }
}

export function setAuthToken(token: string | null) {
    if (token) {
        try {
            localStorage.setItem(TOKEN_KEY, token);
        } catch (e) { }
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        try {
            localStorage.removeItem(TOKEN_KEY);
        } catch (e) { }
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

// restore token from localStorage on module load so headers are set
try {
    const stored = getStoredAuthToken();
    if (stored) setAuthToken(stored);
} catch (e) { }

// intercept 401 responses: clear auth and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            setAuthToken(null);
            try {
                if (window.location.pathname !== "/") {
                    window.location.href = "/";
                }
            } catch (e) { }
        }
        return Promise.reject(error);
    }
);
