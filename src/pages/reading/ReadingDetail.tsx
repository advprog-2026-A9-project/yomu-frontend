import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReadingById } from '../../services/readingTextAPI';
import type { ReadingTextResponse } from '../../services/readingTextAPI';

export default function ReadingDetail() {
    const { id } = useParams<{ id: string }>(); // Mengambil parameter :id dari URL
    const navigate = useNavigate();

    const [reading, setReading] = useState<ReadingTextResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getReadingById(id);
                setReading(data);
                setError('');
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    const handleStartQuiz = () => {
        // Navigasi ke halaman kuis.
        // Ini memastikan teks bacaan hilang dari layar (memenuhi aturan strict Modul Reading)
        navigate(`/readings/${id}/quiz`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex justify-center items-center">
                <div className="animate-pulse text-xl text-blue-400 font-semibold">Memuat teks bacaan...</div>
            </div>
        );
    }

    if (error || !reading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-10">
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-6 rounded-xl max-w-lg text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-2">Waduh!</h2>
                    <p className="mb-6">{error || 'Teks bacaan tidak ditemukan.'}</p>
                    <button
                        onClick={() => navigate('/readings')}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-semibold transition"
                    >
                        Kembali ke Daftar Bacaan
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6 md:p-10 font-sans">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/readings')}
                    className="mb-6 text-gray-400 hover:text-blue-400 font-medium transition flex items-center gap-2"
                >
                    ← Kembali ke Perpustakaan
                </button>

                <div className="bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-700">
                    <div className="mb-8 border-b border-gray-700 pb-6">
                        <span className="inline-block px-3 py-1 mb-4 text-sm font-bold bg-blue-900 text-blue-200 rounded-full">
                            {reading.categoryName}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                            {reading.title}
                        </h1>
                    </div>

                    {/* Area Konten Teks */}
                    <div className="prose prose-invert max-w-none text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
                        {reading.content}
                    </div>

                    {/* Area CTA (Call to Action) Kuis */}
                    <div className="mt-16 p-8 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-800/50 rounded-2xl text-center shadow-inner">
                        <h3 className="text-xl font-bold text-blue-200 mb-3">Siap Menguji Pemahamanmu?</h3>
                        <p className="mb-6 text-blue-100/70 max-w-lg mx-auto">
                            Pastikan kamu sudah memahami isi teks di atas. Saat kuis dimulai, kamu tidak bisa lagi kembali melihat teks bacaan ini.
                        </p>
                        <button
                            onClick={handleStartQuiz}
                            className="bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-extrabold text-lg transition-transform transform hover:scale-105 shadow-xl hover:shadow-green-900/50"
                        >
                            Mulai Kuis Sekarang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}