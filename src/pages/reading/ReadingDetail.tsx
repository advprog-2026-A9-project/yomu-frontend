import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getReadingById, getCompletionStatus } from '../../services/readingAPI';
import type { ReadingTextResponse } from '../../types/reading';

export default function ReadingDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [reading, setReading] = useState<ReadingTextResponse | null>(null);
    const [completion, setCompletion] = useState<{ completed: boolean; score: number }>({ completed: false, score: 0 });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchAllData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                // Mengambil Teks Bacaan dan Status Kuis secara bersamaan (paralel)
                const [readingData, completionStatus] = await Promise.all([
                    getReadingById(id),
                    getCompletionStatus(id)
                ]);

                setReading(readingData);
                setCompletion(completionStatus);
                setError('');
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data');
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id]);

    const handleStartQuiz = () => {
        navigate(`/readings/${id}/quiz`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <BookOpen size={48} className="text-indigo-500" />
                    <div className="text-xl text-indigo-400 font-semibold">Memuat teks bacaan...</div>
                </div>
            </div>
        );
    }

    if (error || !reading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6">
                <div className="bg-slate-900 border border-red-500/30 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
                    <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Waduh!</h2>
                    <p className="mb-8 text-indigo-100/70">{error || 'Teks bacaan tidak ditemukan.'}</p>
                    <button
                        onClick={() => navigate('/readings')}
                        className="bg-slate-800 hover:bg-slate-700 text-white w-full py-3 rounded-xl font-bold transition-colors"
                    >
                        Kembali ke Perpustakaan
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto">
                {/* Tombol Back */}
                <button
                    onClick={() => navigate('/readings')}
                    className="mb-8 text-indigo-300 hover:text-white font-medium transition-colors flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Kembali ke Library
                </button>

                <div className="bg-slate-900/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
                    {/* Hiasan Latar */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

                    {/* Judul & Kategori */}
                    <div className="mb-10 pb-8 border-b border-white/10 relative z-10">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                            {reading.categoryName}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            {reading.title}
                        </h1>
                    </div>

                    {/* Isi Teks */}
                    <div className="prose prose-invert prose-indigo max-w-none text-slate-300 text-lg leading-relaxed whitespace-pre-wrap relative z-10 font-serif">
                        {reading.content}
                    </div>

                    {/* Area Call to Action Kuis (Dinamis Berdasarkan Status) */}
                    <div className="mt-16 p-8 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl text-center shadow-inner relative z-10">
                        {completion.completed ? (
                            // TAMPILAN JIKA SUDAH MENGERJAKAN
                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="inline-flex items-center gap-2 px-5 py-2 bg-green-500/10 text-green-400 rounded-full font-bold border border-green-500/20 shadow-lg">
                                    <CheckCircle2 size={20} /> Kuis Selesai Dikerjakan
                                </div>
                                <h3 className="text-3xl font-black text-white mt-4">
                                    Skor Kamu: <span className="text-green-400 drop-shadow-md">{completion.score}</span>
                                </h3>
                                <p className="text-indigo-200/60 text-sm max-w-md mx-auto mb-6">
                                    Luar biasa! Kamu sudah berhasil menguji pemahamanmu untuk materi ini. Silakan lanjut bereksplorasi di library.
                                </p>
                                <button
                                    disabled
                                    className="bg-slate-800 text-slate-500 px-10 py-4 rounded-xl font-black text-lg cursor-not-allowed border border-white/5 opacity-60 w-full md:w-auto inline-block"
                                >
                                    Kuis Sudah Diambil
                                </button>
                            </div>
                        ) : (
                            // TAMPILAN JIKA BELUM MENGERJAKAN
                            <div className="animate-in fade-in zoom-in duration-300">
                                <h3 className="text-xl font-bold text-white mb-3 flex justify-center items-center gap-2">
                                    <BookOpen size={24} className="text-indigo-400" />
                                    Siap Menguji Pemahamanmu?
                                </h3>
                                <p className="mb-8 text-indigo-200/70 max-w-lg mx-auto text-sm">
                                    Pastikan kamu sudah menyerap inti dari teks di atas. Saat kuis dimulai, teks ini akan ditutup dan kamu tidak bisa kembali lagi.
                                </p>
                                <button
                                    onClick={handleStartQuiz}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-xl font-black text-lg transition-transform transform hover:scale-105 shadow-[0_0_20px_rgba(79,70,229,0.4)] w-full md:w-auto inline-block"
                                >
                                    Mulai Kuis Sekarang
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}