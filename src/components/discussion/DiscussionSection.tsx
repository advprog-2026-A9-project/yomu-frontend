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
        replyingTo
      );
      setComments((prev) => [...prev, newComment]);
      setNewContent("");
      setReplyingTo(null);
    } catch (error) {
      alert("Gagal mengirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm("Yakin ingin menghapus komentar ini?")) return;
    try {
      await discussionService.deleteComment(commentId, currentUserId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      alert("Gagal menghapus komentar");
    }
  };

  const startEdit = (comment: CommentData) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
    setReplyingTo(null); 
  };

  const handleUpdate = async (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!editContent.trim()) return;
    try {
      const updated = await discussionService.updateComment(commentId, editContent, currentUserId);
      setComments((prev) => prev.map((c) => (c.id === commentId ? updated : c)));
      setEditingId(null);
    } catch (error) {
      alert("Gagal mengedit komentar");
    }
  };


  const handleReaction = async (commentId: string, type: 'UPVOTE' | 'DOWNVOTE' | 'EMOJI', emojiCode?: string) => {
    try {
      await discussionService.addReaction(commentId, currentUserId, type, emojiCode);

      alert(`Reaksi ${emojiCode || type} berhasil ditambahkan!`);
    } catch (error) {
      alert("Gagal mengirim reaksi");
    }
  };

  const handleModerate = async (commentId: string) => {
    if (!window.confirm("ADMIN: Yakin ingin menghapus paksa komentar ini secara permanen?")) return;
    try {
      await discussionService.moderateCommentAdmin(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (error) {
      alert("Gagal memoderasi komentar. Pastikan Anda memiliki akses Admin.");
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
                {}
                <div className="flex space-x-1">
                  <button onClick={() => handleReaction(comment.id, 'UPVOTE')} title="Upvote" className="text-sm p-1 rounded hover:bg-gray-700 transition">👍</button>
                  <button onClick={() => handleReaction(comment.id, 'DOWNVOTE')} title="Downvote" className="text-sm p-1 rounded hover:bg-gray-700 transition">👎</button>
                  <button onClick={() => handleReaction(comment.id, 'EMOJI', '🔥')} title="Fire" className="text-sm p-1 rounded hover:bg-gray-700 transition">🔥</button>
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
                {}
                {isOwner && (
                  <>
                    <button onClick={() => startEdit(comment)} className="text-xs font-semibold text-yellow-500 hover:text-yellow-400 transition">
                      ✎ Edit
                    </button>
                    <button onClick={() => handleDelete(comment.id)} className="text-xs font-semibold text-red-500 hover:text-red-400 transition">
                      🗑 Hapus
                    </button>
                  </>
                )}

                {}
                {currentUserRole === 'ADMIN' && (
                  <button 
                    onClick={() => handleModerate(comment.id)} 
                    className="text-xs font-bold text-white bg-red-600/80 px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    🛡️ Moderasi
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
              {renderCommentItem(comment, false)}

              {getReplies(comment.id).length > 0 && (
                <div className="ml-8 border-l-2 border-gray-700 pl-4">
                  {getReplies(comment.id).map((reply) => renderCommentItem(reply, true))}
                </div>
              )}
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