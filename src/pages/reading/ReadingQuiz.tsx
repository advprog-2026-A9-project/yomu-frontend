import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { HelpCircle, CheckCircle2, Award, ArrowLeft } from 'lucide-react';
import { getQuestionsByReadingId, submitQuiz, getCompletionStatus } from '../../services/readingAPI';
import type { QuizQuestionResponse, QuizSubmissionResponse } from '../../types/reading';

export default function ReadingQuiz() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState<QuizQuestionResponse[]>([]);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState<QuizSubmissionResponse | null>(null);

    useEffect(() => {
        const fetchQuestionsAndCheckStatus = async () => {
            if (!id) return;
            try {
                setLoading(true);

                // CEK KEAMANAN: Apakah Pelajar sudah mengerjakan kuis ini?
                const status = await getCompletionStatus(id);
                if (status.completed) {
                    alert('Kamu sudah menyelesaikan kuis untuk materi ini. Mengalihkan kembali ke halaman bacaan...');
                    navigate(`/readings/${id}`);
                    return; // Hentikan fungsi di sini, jangan fetch soal kuis
                }

                // Jika belum selesai, baru ambil daftar soal kuis
                const data = await getQuestionsByReadingId(id);
                setQuestions(data);
                setError('');
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Gagal mengambil soal kuis.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestionsAndCheckStatus();
    }, [id, navigate]);

    const handleOptionSelect = (questionId: number, optionId: number) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleSubmit = async () => {
        if (!id) return;
        if (Object.keys(answers).length < questions.length) {
            alert('Harap jawab semua pertanyaan sebelum mengumpulkan kuis!');
            return;
        }
        if (!window.confirm('Yakin dengan jawabanmu? Kuis ini tidak bisa diulang.')) return;

        try {
            setSubmitting(true);
            const submissionResult = await submitQuiz(id, { answers });
            setResult(submissionResult);
            setError('');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat mengirim jawaban.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex justify-center items-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <HelpCircle size={48} className="text-indigo-500 animate-spin" />
                    <div className="text-xl text-indigo-400 font-bold tracking-widest">Menyiapkan Kuis...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6">
                <div className="bg-slate-900 border border-red-500/30 p-8 rounded-3xl max-w-md text-center shadow-2xl">
                    <h2 className="text-2xl font-bold mb-4 text-red-400">Tidak Dapat Memulai Kuis</h2>
                    <p className="mb-8 text-indigo-100/70">{error}</p>
                    <button
                        onClick={() => navigate('/readings')}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-bold transition w-full"
                    >
                        Kembali ke Library
                    </button>
                </div>
            </div>
        );
    }

    // TAMPILAN HASIL (SCORE)
    if (result) {
        // 1. Tentukan Tema Warna & Pesan Berdasarkan Skor
        let bgGlow, iconColor, scoreColor, titleText;

        if (result.score >= 80) {
            bgGlow = 'bg-green-500';
            iconColor = 'text-green-400';
            scoreColor = 'text-green-400';
            titleText = 'Luar Biasa! 🎉';
        } else if (result.score >= 50) {
            bgGlow = 'bg-amber-500';
            iconColor = 'text-amber-400';
            scoreColor = 'text-amber-400';
            titleText = 'Bagus! Tingkatkan Lagi! 📈';
        } else {
            bgGlow = 'bg-red-500';
            iconColor = 'text-red-400';
            scoreColor = 'text-red-400';
            titleText = 'Jangan Menyerah! 💪';
        }

        return (
            <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden">
                {/* Latar Belakang Gamifikasi */}
                <div className={`absolute inset-0 opacity-20 blur-3xl ${bgGlow}`}></div>

                <div className="bg-slate-900/80 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] max-w-lg w-full text-center shadow-2xl border border-white/10 relative z-10">
                    <Award size={80} className={`mx-auto mb-6 ${iconColor}`} />

                    <h2 className="text-3xl font-black text-white mb-2">
                        {titleText}
                    </h2>
                    <p className="text-indigo-200/70 mb-8 font-medium">Skor Literasimu:</p>

                    <div className={`text-8xl font-black mb-8 drop-shadow-lg ${scoreColor}`}>
                        {result.score}
                    </div>

                    <p className="mb-10 text-sm text-slate-400 px-4">
                        {result.message || 'Hasil ini telah dikirim ke Modul Liga Clan dan Achievement.'}
                    </p>

                    {/* DUA TOMBOL NAVIGASI */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/readings')}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-bold transition-all w-full shadow-lg flex justify-center items-center gap-2"
                        >
                            <ArrowLeft size={18} /> Kembali ke Library
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-slate-800 hover:bg-slate-700 text-indigo-200 px-8 py-4 rounded-2xl font-bold transition-all w-full border border-white/5"
                        >
                            Ke Dashboard Utama
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // TAMPILAN PENGERJAAN KUIS
    const progressPercentage = Math.round((Object.keys(answers).length / questions.length) * 100);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto space-y-6">

                {/* Header Status & Progress Bar */}
                <div className="bg-slate-900 border border-white/10 p-6 rounded-3xl sticky top-4 z-20 shadow-2xl backdrop-blur-md">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h1 className="text-xl font-bold text-white flex items-center gap-2">
                                <HelpCircle size={20} className="text-indigo-400" />
                                Evaluasi Pemahaman
                            </h1>
                            <p className="text-xs text-indigo-200/60 mt-1">Pilih jawaban paling tepat berdasarkan teks.</p>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black text-indigo-400">{Object.keys(answers).length}</span>
                            <span className="text-sm font-bold text-slate-500"> / {questions.length}</span>
                        </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div
                            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                {questions.length === 0 ? (
                    <div className="text-center text-slate-500 my-20">Admin belum menambahkan soal untuk teks ini.</div>
                ) : (
                    <div className="space-y-6">
                        {questions.map((q, index) => (
                            <div key={q.id} className="bg-slate-900/60 p-6 md:p-8 rounded-3xl border border-white/5 shadow-lg">
                                <h3 className="text-lg font-bold mb-6 text-white leading-relaxed flex items-start gap-3">
                                    <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 text-sm">
                                        {index + 1}
                                    </span>
                                    <span className="pt-1">{q.questionText}</span>
                                </h3>

                                <div className="space-y-3 pl-0 md:pl-11">
                                    {q.options.map(opt => {
                                        const isSelected = answers[q.id] === opt.id;
                                        return (
                                            <button
                                                key={opt.id}
                                                onClick={() => handleOptionSelect(q.id, opt.id)}
                                                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4 ${
                                                    isSelected
                                                        ? 'bg-indigo-500/10 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.2)]'
                                                        : 'bg-slate-800/50 border-transparent hover:border-indigo-500/30 hover:bg-slate-800'
                                                }`}
                                            >
                                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                                    isSelected ? 'border-indigo-500' : 'border-slate-500'
                                                }`}>
                                                    {isSelected && <CheckCircle2 size={16} className="text-indigo-400" />}
                                                </div>
                                                <span className={`${isSelected ? 'text-white font-semibold' : 'text-slate-300'}`}>
                                                    {opt.optionText}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        <div className="pt-6 pb-12">
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || Object.keys(answers).length < questions.length}
                                className={`w-full md:w-auto md:min-w-[300px] mx-auto block px-8 py-4 rounded-2xl font-black text-lg transition-all shadow-xl ${
                                    submitting || Object.keys(answers).length < questions.length
                                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5'
                                        : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:-translate-y-1 shadow-[0_10px_20px_rgba(79,70,229,0.3)]'
                                }`}
                            >
                                {submitting ? 'Memproses...' : 'Kumpulkan & Lihat Hasil'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}