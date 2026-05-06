const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ==========================================
// TYPES (DTO Interfaces)
// ==========================================

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

// Tambahan tipe data untuk fitur Kuis
export type QuizOptionResponse = {
    id: number;
    optionText: string;
};

export type QuizQuestionResponse = {
    id: number;
    questionText: string;
    options: QuizOptionResponse[];
};

export type QuizSubmissionRequest = {
    // Key: ID Pertanyaan, Value: ID Opsi Jawaban
    answers: Record<number, number>;
};

export type QuizSubmissionResponse = {
    score: number;
    passed: boolean;
    message?: string;
};

// ==========================================
// HELPERS
// ==========================================

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

// ==========================================
// API FUNCTIONS
// ==========================================

export const getAllTexts = async (): Promise<ReadingTextResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts`, {
        headers: {
            ...getAuthHeaders(), // Ditambahkan agar Backend bisa mengenali user/role
        }
    });

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

// --- TAMBAHAN BARU UNTUK FITUR DETAIL & KUIS ---

export const getReadingById = async (id: string | number): Promise<ReadingTextResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}`, {
        headers: {
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Teks bacaan tidak ditemukan"));
    }

    return response.json();
};

export const getQuestionsByReadingId = async (id: string | number): Promise<QuizQuestionResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}/questions`, {
        headers: {
            ...getAuthHeaders(),
        },
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Gagal mengambil soal kuis"));
    }

    return response.json();
};

export const submitQuiz = async (id: string | number, payload: QuizSubmissionRequest): Promise<QuizSubmissionResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}/quiz`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, "Kuis sudah dikerjakan atau gagal mengirim jawaban"));
    }

    return response.json();
};