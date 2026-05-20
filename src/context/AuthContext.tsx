import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, loginUser } from "../services/authAPI";

type AuthUser = {
    userId: string;
    username: string;
    role: string;
    token: string | null;
    message: string;
    clanId?: string | null;
    clanTier?: string | null;
};

type LoginCredentials = {
    identifier: string;
    password: string;
};

type AuthContextValue = {
    user: AuthUser | null;
    loading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    setClanInfo: (clanId: string | null, clanTier: string | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const normalizeAuthUser = (payload: AuthPayload, fallbackToken: string | null = null): AuthUser | null => {
    const data = payload.data ?? payload;
    const token = data.token ?? payload.token ?? fallbackToken;

    if (!token) {
        return null;
    }

    return {
        userId: data.userId ?? data.id ?? payload.userId ?? payload.id ?? "",
        username: data.username ?? payload.username ?? "",
        role: data.role ?? payload.role ?? "USER",
        token,
        message: payload.message ?? data.message ?? "",
    };
};

import { getMyClan } from "../services/socialAPI";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const setClanInfo = (clanId: string | null, clanTier: string | null) => {
        setUser(prev => prev ? { ...prev, clanId, clanTier } : null);
    };

    const fetchClanInfo = async () => {
        try {
            const myClan = await getMyClan();
            if (!myClan) return { clanId: null, clanTier: null };
            return { clanId: myClan.id, clanTier: myClan.tier };
        } catch {
            return { clanId: null, clanTier: null };
        }
    };

    const refreshUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const currentUser = await getCurrentUser(token);
            const normalizedUser = normalizeAuthUser(currentUser, token);

            if (!normalizedUser) {
                throw new Error("Token tidak valid");
            }

            // Fetch clan info once during refresh
            const clanInfo = await fetchClanInfo();
            setUser({ ...normalizedUser, ...clanInfo });
        } catch {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void refreshUser();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const response = await loginUser(credentials);
        const normalizedUser = normalizeAuthUser(response);

        if (!normalizedUser?.token) {
            throw new Error("Token login tidak ditemukan pada response API");
        }

        localStorage.setItem("token", normalizedUser.token);

        // Fetch clan info once after login
        const clanInfo = await fetchClanInfo();
        setUser({ ...normalizedUser, ...clanInfo });
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAuthenticated: user !== null,
                isAdmin: user?.role === "ADMIN",
                login,
                logout,
                refreshUser,
                setClanInfo,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth harus digunakan di dalam AuthProvider");
    }

    return context;
};