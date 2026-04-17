const API_URL = 'http://localhost:8080/api/discussion';


const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export interface CommentData {
    id: string;
    content: string;
    userId: string;
    readingId: string;
    parentId?: string | null;
    createdAt: string | null;
}

export const discussionService = {
    getCommentsByReading: async (readingId: string): Promise<CommentData[]> => {
        try {
            const response = await fetch(`${API_URL}/reading/${readingId}`, {

                headers: {
                    ...getAuthHeader()
                } as HeadersInit,
            });
            if (!response.ok) throw new Error("Gagal mengambil komentar");
            return await response.json();
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    },

    createComment: async (content: string, readingId: string, userId: string, parentId: string | null = null): Promise<CommentData> => {
        try {
            const response = await fetch(`${API_URL}/create`, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader()
                } as HeadersInit,
                body: JSON.stringify({
                    content,
                    readingId,
                    userId,
                    parentId
                }),
            });
            if (!response.ok) throw new Error("Gagal membuat komentar");
            return await response.json();
        } catch (error) {
            console.error("Error creating comment:", error);
            throw error;
        }
    },


    updateComment: async (commentId: string, content: string, userId: string): Promise<CommentData> => {
        try {
            const response = await fetch(`${API_URL}/${commentId}`, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    ...getAuthHeader()
                } as HeadersInit,
                body: JSON.stringify({ content, userId }),
            });
            if (!response.ok) throw new Error("Gagal mengubah komentar");
            return await response.json();
        } catch (error) {
            console.error("Error updating comment:", error);
            throw error;
        }
    },


    deleteComment: async (commentId: string, userId: string): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/${commentId}?userId=${userId}`, {
                method: "DELETE",

                headers: {
                    ...getAuthHeader()
                } as HeadersInit,
            });
            if (!response.ok) throw new Error("Gagal menghapus komentar");
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    }
};