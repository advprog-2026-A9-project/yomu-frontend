import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestionsByReadingId, submitQuiz } from '../../services/readingTextAPI';
import type { QuizQuestionResponse, QuizSubmissionResponse } from '../../services/readingTextAPI';

export default function ReadingQuiz() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<QuizQuestionResponse[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    // Status State
    const [loading, setLoading] = useState<boolean>(true);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getQuestionsByReadingId(id);
                setQuestions(data);
                setError('');
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Gagal mengambil soal kuis.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [id]);

    const handleOptionSelect = (questionId: number, optionId: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async () => {
        if (!id) return;

        // Validasi simpel: pastikan semua soal dijawab
        if (Object.keys(answers).length < questions.length) {
            alert('Harap jawab semua pertanyaan sebelum mengumpulkan kuis!');
            return;
        }

        if (!window.confirm('Apakah kamu yakin dengan jawabanmu? Kamu tidak bisa mengulang kuis ini.')) return;

        try {
            setSubmitting(true);
            const submissionResult = await submitQuiz(id, { answers });
            setResult(submissionResult);
            setError('');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengumpulkan kuis.');
        } finally {
            setSubmitting(false);
        }
    };

    // Tampilan saat menunggu data soal
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex justify-center items-center">
                <div className="animate-bounce text-2xl text-blue-400 font-bold">Menyiapkan Kuis...</div>
            </div>
        );
    }

    // Tampilan jika ada error (misal: soal tidak ada atau sudah pernah dikerjakan)
    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-10">
                <div className="bg-red-900/50 border border-red-500 p-8 rounded-xl max-w-lg text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-red-300">Akses Ditolak</h2>
                    <p className="mb-8 text-gray-300">{error}</p>
                    <button
                        onClick={() => navigate('/readings')}
                        className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-bold transition w-full"
                    >
                        Kembali ke Perpustakaan
                    </button>
                </div>
            </div>
        );
    }

    // Tampilan HASIL KUIS (setelah submit berhasil)
    if (result) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center p-10">
                <div className={`p-10 rounded-2xl max-w-lg text-center shadow-2xl border ${result.passed ? 'bg-green-900/40 border-green-500' : 'bg-red-900/40 border-red-500'}`}>
                    <h2 className="text-4xl font-black mb-4">
                        {result.passed ? 'Luar Biasa! 🎉' : 'Jangan Menyerah! 💪'}
                    </h2>
                    <p className="text-lg text-gray-300 mb-6">Skor Akhir Kamu:</p>
                    <div className={`text-7xl font-black mb-8 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        {result.score}
                    </div>
                    <p className="mb-8 text-gray-400">
                        {result.message || 'Hasil ini telah dikirim ke Modul Liga Clan dan Achievement.'}
                    </p>
                    <button
                        onClick={() => navigate('/readings')}
                        className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full font-bold transition w-full shadow-lg"
                    >
                        Kembali ke Daftar Teks
                    </button>
                </div>
            </div>
        );
    }

    // Tampilan PENGERJAAN KUIS
    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 p-6 md:p-10 font-sans">
            <div className="max-w-3xl mx-auto">
                <div className="bg-blue-900/30 border border-blue-800 p-6 rounded-xl mb-8 flex justify-between items-center shadow-inner">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-300">Uji Pemahaman</h1>
                        <p className="text-sm text-blue-200/70">Pilih jawaban yang paling tepat.</p>
                    </div>
                    <div className="bg-gray-800 px-4 py-2 rounded-lg font-bold text-gray-300 border border-gray-700">
                        {Object.keys(answers).length} / {questions.length} Dijawab
                    </div>
                </div>

                {questions.length === 0 ? (
                    <div className="text-center text-gray-400 my-20">Admin belum menambahkan soal untuk teks ini.</div>
                ) : (
                    <div className="space-y-8">
                        {questions.map((q, index) => (
                            <div key={q.id} className="bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border border-gray-700">
                                <h3 className="text-xl font-semibold mb-6 text-white leading-relaxed">
                                    <span className="text-blue-400 mr-2">{index + 1}.</span> {q.questionText}
                                </h3>

                                <div className="space-y-3">
                                    {q.options.map(opt => {
                                        const isSelected = answers[q.id] === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleOptionSelect(q.id, opt.id)}
                                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                                                    isSelected
                                                        ? 'bg-blue-600 border-blue-400 shadow-md shadow-blue-900/50'
                                                        : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                                                }`}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                                                        isSelected ? 'border-white' : 'border-gray-400'
                                                    }`}>
                                                        {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                                                    </div>
                                                    <span className={isSelected ? 'text-white font-medium' : 'text-gray-300'}>
                                                        {opt.optionText}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 pb-12 text-center">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || Object.keys(answers).length < questions.length}
                                className={`px-12 py-4 rounded-full font-extrabold text-lg transition shadow-xl ${
                                    submitting || Object.keys(answers).length < questions.length
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-600 hover:bg-green-500 text-white hover:scale-105'
                                }`}
                            >
                                {submitting ? 'Mengirim Jawaban...' : 'Kumpulkan Kuis'}
                            </button>
                            {Object.keys(answers).length < questions.length && (
                                <p className="text-yellow-500/80 text-sm mt-4 font-medium">
                                    Pastikan semua soal telah dijawab sebelum mengumpulkan.
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}