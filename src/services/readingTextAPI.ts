const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export type ReadingTextResponse = {
    id: number;
    title: string;
    content: string;
    categoryName: string;
};

export type ReadingTextRequest = {
    title: string;
    content: string;
    categoryId: number;
};

const parseErrorMessage = async (response: Response, fallbackMessage: string) => {
    try {
        const error = await response.json();
        return error.message || fallbackMessage;
    } catch {
        return fallbackMessage;
    }
};

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
        ? {
            Authorization: `Bearer ${token}`,
        }
        : {};
};

export const getAllTexts = async (): Promise<ReadingTextResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts`);

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Gagal mengambil data bacaan"));
    }

    return response.json();
};

export const createText = async (data: ReadingTextRequest): Promise<ReadingTextResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Gagal membuat teks bacaan"));
    }

    return response.json();
};

export const deleteText = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}`, {
        method: "DELETE",
        headers: {
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Gagal menghapus teks bacaan"));
    }
};