
import api from "./api";
import { setAuthToken } from "./client";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
    token: string;
    user: { email: string };
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
    token: string;
    user: { email: string };
};

export async function login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    if (data?.token) setAuthToken(data.token);
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
    if (data?.token) setAuthToken(data.token);
    return data;
}

export function logout() {
    setAuthToken(null);
}
