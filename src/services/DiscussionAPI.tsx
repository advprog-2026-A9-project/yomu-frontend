const API_URL = 'http://localhost:8080/api/discussion';

export interface CommentData {
    id: string;
    content: string;
    userId: string;
    readingId: string;
    parentId?: string | null; // Tambahkan ini
    createdAt: string | null;
}

export const discussionService = {
    getCommentsByReading: async (readingId: string): Promise<CommentData[]> => {
        try {
            const response = await fetch(`${API_URL}/reading/${readingId}`);
            if (!response.ok) throw new Error("Gagal mengambil komentar");
            return await response.json();
        } catch (error) {
            console.error("Error fetching comments:", error);
            return []; 
        }
    },

    // Tambahkan parameter parentId (bisa null jika komentar utama)
    createComment: async (content: string, readingId: string, userId: string, parentId: string | null = null): Promise<CommentData> => {
        try {
            const response = await fetch(`${API_URL}/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content,
                    readingId,
                    userId,
                    parentId // Kirim parentId ke backend
                }),
            });
            if (!response.ok) throw new Error("Gagal membuat komentar");
            return await response.json();
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error; 
        }
    }
};