import api from "./api";
import { setAuthToken } from "./client";

export type LoginPayload = { email: string; password: string };
// server responses are wrapped in an envelope: { success: true, data: { user, tokens: { accessToken, refreshToken } } }
export type LoginResponse = {
    data?: {
        user?: { email: string };
        tokens?: { accessToken?: string; refreshToken?: string };
    };
};

export type SignupPayload = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    idNumber?: string;
};

export type SignupResponse = {
    data?: {
        user?: { email: string };
        tokens?: { accessToken?: string; refreshToken?: string };
    };
};

export async function login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    const token = data?.data?.tokens?.accessToken || (data as any)?.token;
    if (token) setAuthToken(token);
    return data;
}

export async function signup(payload: SignupPayload) {
    const body = {
        name: `${payload.firstName} ${payload.lastName}`,
        email: payload.email,
        password: payload.password,
        confirmPassword: payload.confirmPassword,
        idNumber: payload.idNumber,
    };

    const { data } = await api.post<SignupResponse>("/auth/signup", body);
    const token = data?.data?.tokens?.accessToken || (data as any)?.token;
    if (token) setAuthToken(token);
    return data;
}

export function logout() {
    setAuthToken(null);
}
