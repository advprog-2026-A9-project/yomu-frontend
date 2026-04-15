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
  
  // State untuk melacak komentar mana yang sedang dibalas
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    if (readingId) void loadComments();
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
        currentUserId,
        replyingTo // Kirim ID parent jika ada
      );

      setComments((prev) => [...prev, newComment]);
      setNewContent("");
      setReplyingTo(null); // Reset setelah berhasil mengirim
    } catch (error) {
      alert("Gagal mengirim komentar");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk mendapatkan komentar utama (root)
  const rootComments = comments.filter((c) => !c.parentId);
  
  // Fungsi untuk mendapatkan balasan dari sebuah komentar
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  return (
    <div className="mt-10 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-left">
      <h3 className="text-2xl font-bold text-blue-400 mb-6">Diskusi Pembelajaran</h3>

      <div className="space-y-6 mb-8 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <p className="text-gray-400 animate-pulse">Memuat diskusi...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 italic bg-gray-900 p-4 rounded-lg text-center">
            Belum ada komentar. Yuk mulai diskusi!
          </p>
        ) : (
          rootComments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Komentar Utama */}
              <div className="p-4 bg-gray-900 rounded-lg border border-gray-600">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-blue-300">
                    User {comment.userId.substring(0, 6)}...
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Baru saja"}
                  </span>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">{comment.content}</p>
                <button 
                  onClick={() => setReplyingTo(comment.id)}
                  className="text-xs font-semibold text-gray-400 hover:text-blue-400 transition"
                >
                  ↩ Balas
                </button>
              </div>

              {/* Render Balasan (Indented/Menjorok ke dalam) */}
              {getReplies(comment.id).length > 0 && (
                <div className="ml-8 space-y-3 border-l-2 border-gray-700 pl-4">
                  {getReplies(comment.id).map((reply) => (
                    <div key={reply.id} className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-blue-400">
                          User {reply.userId.substring(0, 6)}...
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString() : "Baru saja"}
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Form Input Komentar/Balasan */}
      <div className="pt-4 border-t border-gray-700">
        {replyingTo && (
          <div className="flex justify-between items-center mb-2 bg-blue-900/30 p-2 rounded border border-blue-800">
            <span className="text-xs text-blue-300">Membaca balasan ke diskusi ini...</span>
            <button onClick={() => setReplyingTo(null)} className="text-xs text-red-400 hover:text-red-300">
              Batal
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={replyingTo ? "Tulis balasanmu..." : "Tulis pendapatmu tentang bacaan ini..."}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !newContent.trim()}
            className={`self-end px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${
              isSubmitting || !newContent.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Mengirim..." : replyingTo ? "Kirim Balasan" : "Kirim Komentar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DiscussionSection;