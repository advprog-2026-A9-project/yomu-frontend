const BASE_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:8080";

// Tipe data (Interface) khusus TypeScript agar kode lebih aman dan rapi
export interface ReadingTextRequest {
    title: string;
    content: string;
    categoryId: number;
}

export interface ReadingTextResponse {
    id: number;
    title: string;
    content: string;
    categoryName: string;
}

// Fungsi bantuan untuk menyisipkan token JWT otomatis ke header
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export const getAllTexts = async (): Promise<ReadingTextResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error("Gagal mengambil daftar teks bacaan");
    }
    return response.json();
};

export const createText = async (data: ReadingTextRequest): Promise<ReadingTextResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error("Gagal membuat teks bacaan");
    }
    return response.json();
};

export const deleteText = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) {
        throw new Error("Gagal menghapus teks bacaan");
    }
};