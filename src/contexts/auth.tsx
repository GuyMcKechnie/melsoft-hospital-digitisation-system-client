import React, { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/api/client";

type User = {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    status?: string;
};

type AuthContextValue = {
    currentUser: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchMe = async () => {
        try {
            setLoading(true);
            const resp = await get<any>("/auth/me");
            // server envelopes responses as { success:true, data: { user } }
            const user = (resp && resp.data && resp.data.user) || null;
            setCurrentUser(user);
        } catch (err) {
            setCurrentUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <AuthContext.Provider
            value={{ currentUser, loading, refresh: fetchMe }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}

export default AuthProvider;
