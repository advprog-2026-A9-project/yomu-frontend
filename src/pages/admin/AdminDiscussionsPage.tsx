import React, { useEffect, useState } from 'react';
import { discussionService, CommentData } from '../../services/DiscussionAPI';
import { Trash2, MessageSquare } from 'lucide-react';
import { GlassCard } from '../../components/common/UI';

export default function AdminDiscussionPage() {
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const data = await discussionService.getAllCommentsAdmin();
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Apakah Anda yakin ingin memoderasi (menghapus) komentar ini?')) return;
        
        try {
            await discussionService.moderateCommentAdmin(id);
            // Update state dengan menghapus komentar yang berhasil dimoderasi dari list
            setComments(comments.filter(c => c.id !== id));
            alert('Komentar berhasil dihapus.');
        } catch (error) {
            console.error("Failed to moderate comment", error);
            alert('Gagal menghapus komentar. Pastikan Anda memiliki akses Admin.');
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3">
                    <MessageSquare className="text-indigo-400" /> Manajemen Diskusi
                </h2>
                <p className="mt-1 text-sm text-indigo-200/70">
                    Moderasi dan kelola komentar dari semua pengguna di platform.
                </p>
            </div>

            <GlassCard className="overflow-x-auto p-0">
                <table className="w-full text-left text-sm text-indigo-100">
                    <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-indigo-200/70">
                        <tr>
                            <th className="px-6 py-4 font-semibold">User ID</th>
                            <th className="px-6 py-4 font-semibold">Reading ID</th>
                            <th className="px-6 py-4 font-semibold">Komentar</th>
                            <th className="px-6 py-4 font-semibold">Tanggal</th>
                            <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {comments.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-indigo-200/50">
                                    Tidak ada komentar saat ini.
                                </td>
                            </tr>
                        ) : (
                            comments.map((comment) => (
                                <tr key={comment.id} className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="px-6 py-4 font-mono text-xs text-indigo-300/70">{comment.userId}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-indigo-300/70">{comment.readingId}</td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <p className="truncate" title={comment.content}>{comment.content}</p>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        {comment.createdAt ? new Date(comment.createdAt).toLocaleString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => handleDelete(comment.id)}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-200"
                                        >
                                            <Trash2 size={14} /> Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    );
}