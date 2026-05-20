const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const parseErrorMessage = async (response: Response, fallbackMessage: string): Promise<string> => {
    try {
        const error = await response.json();
        return error.message || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
};

export const registerUser = async (data: {
    username: string;
    email?: string;
    phoneNumber?: string;
    displayName: string;
    password: string;
}) => {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Registrasi gagal"));
    }
    return response.json();
};

export const loginUser = async (data: {
    identifier: string;
    password: string;
}) => {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Login gagal"));
    }
    return response.json();
};

export const getCurrentUser = async (token: string) => {
    const response = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Sesi tidak valid"));
    }
    return response.json();
};

export const updateAccount = async (token: string, data: {
    username?: string;
    displayName?: string;
    oldPassword?: string;
    newPassword?: string;
}) => {
    const response = await fetch(`${BASE_URL}/api/auth/account`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Gagal memperbarui akun"));
    }
    return response.json();
};

export const getMyClan = async (token: string) => {
    const response = await fetch(`${BASE_URL}/api/clans/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) return null;
    return response.json();
};

export const getAchievementShowcase = async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/gamification/showcase?userId=${userId}`);
    if (!response.ok) return [];
    return response.json();
};