import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, loginUser } from "../services/authAPI";

type AuthUser = {
    userId: string;
    username: string;
    role: string;
    token: string | null;
    message: string;
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
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const currentUser = await getCurrentUser(token);
            setUser({ ...currentUser, token });
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
        localStorage.setItem("token", response.token);
        setUser(response);
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