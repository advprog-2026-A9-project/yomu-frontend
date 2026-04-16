const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const parseErrorMessage = async (response, fallbackMessage) => {
    try {
        const error = await response.json();
        return error.message || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
};

export const registerUser = async (data) => {
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

export const loginUser = async (data) => {
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

export const getCurrentUser = async (token) => {
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