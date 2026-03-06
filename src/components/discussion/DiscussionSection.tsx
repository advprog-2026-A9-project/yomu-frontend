import React, { useEffect, useState } from "react";
import { discussionService, CommentData } from "../../services/DiscussionAPI";

interface DiscussionProps {
  readingId: string;
  currentUserId: string;
}

const DiscussionSection: React.FC<DiscussionProps> = ({
  readingId,
  currentUserId,
}) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (readingId) {
      void loadComments();
    }
  }, [readingId]);

  const loadComments = async () => {
    setIsLoading(true);

    try {
      const data = await discussionService.getCommentsByReading(readingId);
      setComments(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newContent.trim()) return;

    setIsSubmitting(true);

    try {
      const newComment = await discussionService.createComment(
        newContent,
        readingId,
        currentUserId
      );

      setComments((prev) => [...prev, newComment]);
      setNewContent("");
    } catch (error) {
      alert("Gagal mengirim komentar");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-left">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">
        Diskusi Pembelajaran
      </h3>

      {/* List Komentar */}
      <div className="space-y-4 mb-8 max-h-[500px] overflow-y-auto pr-2">
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Memuat diskusi...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 italic">
            Belum ada komentar. Yuk mulai diskusi!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 bg-gray-900 rounded-lg border border-gray-600"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-blue-300">
                  User {comment.userId.substring(0, 6)}...
                </span>

                <span className="text-xs text-gray-500">
                  {comment.createdAt
                    ? new Date(comment.createdAt).toLocaleDateString()
                    : "Baru saja"}
                </span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                {comment.content}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Form Input */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Tulis pendapatmu tentang bacaan ini..."
          className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting || !newContent.trim()}
          className={`self-end px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
        </button>
      </form>
    </div>
  );
};

export default DiscussionSection;