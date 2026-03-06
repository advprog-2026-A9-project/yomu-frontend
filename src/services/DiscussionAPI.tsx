const API_URL = 'http://localhost:8080/api/discussion';

export interface CommentData {
    id: string;
    content: string;
    userId: string;
    readingId: string;
    createdAt: string | null;
}

export const discussionService = {
    getCommentsByReading: async (readingId: string): Promise<CommentData[]> => {
        try {
            const response = await fetch(`${API_URL}/reading/${readingId}`);
            
            if (!response.ok) {
                throw new Error("Gagal mengambil komentar");
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error fetching comments:", error);
            return []; // Kembalikan array kosong jika gagal agar UI tidak error
        }
    },

    createComment: async (content: string, readingId: string, userId: string): Promise<CommentData> => {
        try {
            const response = await fetch(`${API_URL}/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content,
                    readingId,
                    userId
                }),
            });
            
            if (!response.ok) {
                throw new Error("Gagal membuat komentar");
            }
            
            return await response.json();
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error; // Lempar error agar bisa ditangkap oleh blok catch di DiscussionSection.tsx
        }
    }
};