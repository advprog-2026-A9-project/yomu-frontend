import React, { useEffect, useState } from "react";
import { discussionService, CommentData } from "../../services/DiscussionAPI";

interface DiscussionProps {
  readingId: string;
  currentUserId: string;
  currentUserRole?: string; 
}

const DiscussionSection: React.FC<DiscussionProps> = ({
  readingId,
  currentUserId,
  currentUserRole, 
}) => {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [newContent, setNewContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (readingId) void loadComments();
  }, [readingId]);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
        replyingTo
      );
      setComments((prev) => [...prev, newComment]);
      setNewContent("");
      setReplyingTo(null);
      showToast("Komentar berhasil dikirim!"); // Ganti alert
    } catch (error) {
      showToast("Gagal mengirim komentar", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      await discussionService.deleteComment(commentId, currentUserId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast("Komentar dihapus");
    } catch (error) {
      showToast("Gagal menghapus komentar", "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    try {
      const updated = await discussionService.updateComment(commentId, editContent, currentUserId);
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
      showToast("Komentar diperbarui");
    } catch (error) {
      showToast("Gagal mengedit komentar", "error");
    }
  };

  const handleReaction = async (commentId: string, type: 'UPVOTE' | 'DOWNVOTE' | 'EMOJI', emojiCode?: string) => {
    try {
      await discussionService.addReaction(commentId, currentUserId, type, emojiCode);
      showToast(`Reaksi ${emojiCode || type} dikirim!`);
      // Penting: Refresh data agar angka counter reaksi terbaru muncul
      void loadComments(); 
    } catch (error) {
      showToast("Gagal mengirim reaksi", "error");
    }
  };

  const handleModerate = async (commentId: string) => {
    if (!window.confirm("ADMIN: Yakin ingin menghapus paksa komentar ini secara permanen?")) return;
    try {
      await discussionService.moderateCommentAdmin(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      showToast("Moderasi Admin berhasil!", "success");
    } catch (error) {
      showToast("Gagal memoderasi komentar", "error");
    }
  };

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const renderCommentItem = (comment: CommentData, isReply: boolean = false) => {
    const isOwner = comment.userId === currentUserId;
    const isEditing = editingId === comment.id;

    return (
      <div key={comment.id} className={`p-${isReply ? '3' : '4'} bg-gray-${isReply ? '800' : '900'} rounded-lg border border-gray-${isReply ? '700' : '600'} ${isReply ? 'mb-3' : ''}`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-${isReply ? 'xs' : 'sm'} font-bold text-blue-${isReply ? '400' : '300'}`}>
            User {comment.userId.substring(0, 6)}...
          </span>
          <span className={`text-${isReply ? '[10px]' : 'xs'} text-gray-500`}>
            {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : "Baru saja"}
          </span>
        </div>

        {isEditing ? (
          <form onSubmit={(e) => handleUpdate(e, comment.id)} className="mt-2 flex flex-col gap-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setEditingId(null)} className="text-xs text-gray-400 hover:text-white transition">Batal</button>
              <button type="submit" className="text-xs px-3 py-1 bg-blue-500 rounded text-white hover:bg-blue-600 transition">Simpan</button>
            </div>
          </form>
        ) : (
          <>
            <p className={`text-gray-300 text-${isReply ? 'xs' : 'sm'} leading-relaxed mb-3`}>{comment.content}</p>
            
            <div className="flex flex-wrap gap-4 items-center justify-between border-t border-gray-700/50 pt-2 mt-2">
              <div className="flex gap-3 items-center">
                {/* FITUR BARU: Tombol Reaksi dengan Counter Angka */}
                <div className="flex space-x-2">
                  <button onClick={() => handleReaction(comment.id, 'UPVOTE')} className="flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition">
                    👍 <span className="font-bold text-blue-400">{(comment as any).upvotes || 0}</span>
                  </button>
                  <button onClick={() => handleReaction(comment.id, 'DOWNVOTE')} className="flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition">
                    👎 <span className="font-bold text-red-400">{(comment as any).downvotes || 0}</span>
                  </button>
                  <button onClick={() => handleReaction(comment.id, 'EMOJI', '🔥')} className="flex items-center gap-1 text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 transition">
                    🔥 <span className="font-bold text-orange-400">{(comment as any).fireReactions || 0}</span>
                  </button>
                </div>

                {!isReply && (
                  <button 
                    onClick={() => { setReplyingTo(comment.id); setEditingId(null); }}
                    className="text-xs font-semibold text-gray-400 hover:text-blue-400 transition"
                  >
                    ↩ Balas
                  </button>
                )}
              </div>

              <div className="flex gap-3 items-center">
                {isOwner && (
                  <>
                    <button onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }} className="text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition">
                      ✎ Edit
                    </button>
                    <button onClick={() => handleDelete(comment.id)} className="text-xs font-semibold text-red-500 hover:text-red-400 transition">
                      🗑 Hapus
                    </button>
                  </>
                )}

                {currentUserRole === 'ADMIN' && (
                  <button 
                    onClick={() => handleModerate(comment.id)} 
                    className="text-[10px] font-bold text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 transition uppercase tracking-wider"
                  >
                    🛡️ Moderasi Admin
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="relative mt-10 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg text-left">
      
      {/* FITUR BARU: UI Notifikasi HTML (Toast) */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-6 py-3 rounded-lg shadow-2xl transition-all animate-bounce flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        } text-white font-bold`}>
          {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
        </div>
      )}

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
              {renderCommentItem(comment, false)}

              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="ml-8 border-l-2 border-gray-700 pl-4">
                  {renderCommentItem(reply, true)}
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <div className="pt-4 border-t border-gray-700">
        {replyingTo && (
          <div className="flex justify-between items-center mb-2 bg-blue-900/30 p-2 rounded border border-blue-800">
            <span className="text-xs text-blue-300">Membalas komentar...</span>
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