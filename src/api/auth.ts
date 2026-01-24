
import api from "./api";

export type LoginPayload = { email: string; password: string };
export type LoginResponse = {
    token: string;
    user: { email: string };
};

export type SignupPayload = {
    email: string;
    password: string;
    confirmPassword: string;
};

export type SignupResponse = {
    token: string;
    user: { email: string };
};

export async function login(payload: LoginPayload) {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);
    return data;
}

export async function signup(payload: SignupPayload) {
    const { data } = await api.post<SignupResponse>("/auth/signup", payload);
    return data;
}
