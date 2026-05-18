export interface CategoryResponse {
    id: number;
    name: string;
}

export interface ReadingTextResponse {
    id: number;
    title: string;
    content: string;
    categoryName: string;
}

export interface ReadingTextRequest {
    title: string;
    content: string;
    categoryId: number;
}

export interface QuizOptionResponse {
    id: number;
    optionText: string;
}

export interface QuizQuestionResponse {
    id: number;
    questionText: string;
    options: QuizOptionResponse[];
}

export interface QuizOptionRequest {
    optionText: string;
    isCorrect: boolean;
}

export interface QuizQuestionRequest {
    questionText: string;
    options: QuizOptionRequest[];
}

export interface QuizSubmissionRequest {
    answers: Record<number, number>; // Key: ID Pertanyaan, Value: ID Opsi Jawaban
}

export interface QuizSubmissionResponse {
    score: number;
    passed: boolean;
    message?: string;
}