import {
    CategoryResponse,
    ReadingTextResponse,
    ReadingTextRequest,
    QuizQuestionResponse,
    QuizQuestionRequest,
    QuizSubmissionRequest,
    QuizSubmissionResponse
} from '../types/reading';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

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

// KEMBALIKAN HEADERS KE VERSI STANDAR (CORS-SAFE)
// Jangan masukkan Cache-Control di Header sini agar tidak diblokir Spring Boot
const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return token
        ? {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
        : {
            "Content-Type": "application/json"
        };
};

// ==========================================
// API FUNCTIONS : CATEGORY
// ==========================================

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/categories?t=${new Date().getTime()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal mengambil daftar kategori"));
    return response.json();
};

export const createCategory = async (name: string): Promise<CategoryResponse> => {
    const response = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal membuat kategori"));
    return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/categories/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal menghapus kategori"));
};

// ==========================================
// API FUNCTIONS : READING TEXTS
// ==========================================

export const getAllTexts = async (): Promise<ReadingTextResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts?t=${new Date().getTime()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal mengambil data bacaan"));
    return response.json();
};

export const getReadingById = async (id: string | number): Promise<ReadingTextResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}?t=${new Date().getTime()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Teks bacaan tidak ditemukan"));
    return response.json();
};

export const createText = async (data: ReadingTextRequest): Promise<ReadingTextResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal membuat teks bacaan"));
    return response.json();
};

export const updateText = async (id: string | number, data: ReadingTextRequest): Promise<ReadingTextResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal memperbarui teks bacaan"));
    return response.json();
};

export const deleteText = async (id: number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal menghapus teks bacaan"));
};

export const markReadingAsCompleted = async (id: string | number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}/complete`, {
        method: 'POST',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, 'Gagal menandai bacaan selesai'));
    }
};

// ==========================================
// API FUNCTIONS : QUIZ & QUESTIONS
// ==========================================

export const getQuestionsByReadingId = async (id: string | number): Promise<QuizQuestionResponse[]> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}/questions?t=${new Date().getTime()}`, {
        method: "GET",
        headers: getAuthHeaders(),
        cache: 'no-store',
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal mengambil soal kuis"));
    return response.json();
};

export const addQuestionToReading = async (readingId: string | number, payload: QuizQuestionRequest): Promise<QuizQuestionResponse> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${readingId}/questions`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal menambahkan pertanyaan kuis"));
    return response.json();
};

export const deleteQuestion = async (readingId: string | number, questionId: string | number): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${readingId}/questions/${questionId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(await parseErrorMessage(response, "Gagal menghapus pertanyaan kuis"));
};

export const submitQuiz = async (id: string | number, payload: any): Promise<QuizSubmissionResponse> => {
    const formattedAnswers = Object.entries(payload.answers).map(([qId, oId]) => ({
        questionId: Number(qId),
        selectedOptionId: Number(oId)
    }));

    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}/quiz`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ answers: formattedAnswers }),
    });

    if (!response.ok) throw new Error(await parseErrorMessage(response, "Kuis sudah dikerjakan atau gagal mengirim jawaban"));
    return response.json();
};

export const getCompletionStatus = async (id: string | number): Promise<{completed: boolean, score: number}> => {
    const response = await fetch(`${BASE_URL}/api/reading-texts/${id}/quiz/completion`, {
        method: "GET",
        headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Gagal mengecek status kuis");
    return response.json();
};