import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, CheckCircle, HelpCircle, Save } from 'lucide-react';
import { getQuestionsByReadingId, addQuestionToReading, deleteQuestion, getReadingById } from '../../services/readingAPI';
import type { QuizQuestionResponse, ReadingTextResponse } from '../../types/reading';

export default function AdminQuizBuilderPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [readingInfo, setReadingInfo] = useState<ReadingTextResponse | null>(null);
    const [questions, setQuestions] = useState<QuizQuestionResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // State untuk Form Pembuatan Soal Baru
    const [newQuestionText, setNewQuestionText] = useState('');
    const [options, setOptions] = useState([
        { optionText: '', isCorrect: true }, // Default minimal 2 opsi
        { optionText: '', isCorrect: false }
    ]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        if (!id) return;
        try {
            setLoading(true);
            const [readingData, questionsData] = await Promise.all([
                getReadingById(id),
                getQuestionsByReadingId(id)
            ]);
            setReadingInfo(readingData);
            setQuestions(questionsData);
        } catch (err) {
            console.error("Gagal mengambil data kuis:", err);
            alert("Gagal memuat data kuis atau bacaan tidak ditemukan.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // Handler untuk Dinamis Opsi Jawaban
    const handleAddOption = () => {
        setOptions([...options, { optionText: '', isCorrect: false }]);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length <= 2) {
            alert("Minimal harus ada 2 opsi jawaban!");
            return;
        }
        const newOptions = options.filter((_, i) => i !== index);
        // Pastikan tetap ada 1 jawaban benar jika yang dihapus adalah jawaban benar
        if (options[index].isCorrect && newOptions.length > 0) {
            newOptions[0].isCorrect = true;
        }
        setOptions(newOptions);
    };

    const handleOptionTextChange = (index: number, text: string) => {
        const newOptions = [...options];
        newOptions[index].optionText = text;
        setOptions(newOptions);
    };

    const handleSetCorrectOption = (index: number) => {
        const newOptions = options.map((opt, i) => ({
            ...opt,
            isCorrect: i === index // Hanya satu jawaban yang benar
        }));
        setOptions(newOptions);
    };

    const handleSubmitQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;

        // Validasi
        if (options.some(opt => opt.optionText.trim() === '')) {
            alert("Semua kolom opsi jawaban harus diisi!");
            return;
        }

        try {
            setIsSubmitting(true);
            await addQuestionToReading(id, {
                questionText: newQuestionText,
                options: options
            });

            alert("Pertanyaan berhasil ditambahkan!");
            setNewQuestionText('');
            setOptions([
                { optionText: '', isCorrect: true },
                { optionText: '', isCorrect: false }
            ]);
            fetchData(); // Refresh daftar soal
        } catch (err: unknown) {
            alert("Gagal menambahkan soal: " + (err instanceof Error ? err.message : "Unknown Error"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteQuestion = async (questionId: number) => {
        if (!id) return;
        if (!window.confirm("Yakin ingin menghapus pertanyaan ini beserta opsinya?")) return;

        try {
            await deleteQuestion(id, questionId);
            fetchData(); // Refresh daftar soal
        } catch (err: unknown) {
            alert("Gagal menghapus soal: " + (err instanceof Error ? err.message : "Unknown Error"));
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-1 text-white max-w-5xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-wrap items-center gap-4 border-b border-white/10 pb-6">
                <button
                    onClick={() => navigate('/admin/readings')}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
                >
                    <ArrowLeft size={20} className="text-indigo-300" />
                </button>
                <div>
                    <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold mb-1">Quiz Builder</p>
                    <h1 className="text-2xl font-bold tracking-tight text-white">{readingInfo?.title || 'Loading...'}</h1>
                </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* BAGIAN KIRI: DAFTAR SOAL YANG SUDAH ADA */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <HelpCircle size={18} className="text-indigo-400" />
                        Daftar Soal Saat Ini ({questions.length})
                    </h2>

                    {questions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-indigo-100/40">
                            Belum ada soal untuk bacaan ini. Silakan buat di form sebelah kanan.
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                            {questions.map((q, idx) => (
                                <div key={q.id} className="rounded-xl border border-white/10 bg-slate-900/50 p-4 shadow-lg group relative">
                                    <button
                                        onClick={() => handleDeleteQuestion(q.id)}
                                        className="absolute top-4 right-4 text-red-400/50 hover:text-red-400 transition-colors"
                                        title="Hapus Soal"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    <p className="font-bold text-indigo-100 mb-3 pr-8">
                                        {idx + 1}. {q.questionText}
                                    </p>
                                    <ul className="space-y-2">
                                        {q.options.map((opt) => (
                                            <li key={opt.id} className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-3 py-2 rounded-lg">
                                                <div className={`w-2 h-2 rounded-full ${opt.id === q.options.find(o => o.id)?.id /* NOTE: Asumsi dari backend, idealnya ada flag isCorrect di response, tapi jika tidak ada kita tampilkan saja daftarnya */ ? 'bg-indigo-500' : 'bg-slate-600'}`}></div>
                                                {opt.optionText}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* BAGIAN KANAN: FORM TAMBAH SOAL BARU */}
                <div className="rounded-2xl border border-indigo-500/30 bg-slate-800/80 p-6 shadow-2xl backdrop-blur-md h-fit">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Plus size={18} className="text-green-400" />
                        Buat Pertanyaan Baru
                    </h2>

                    <form onSubmit={handleSubmitQuestion} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-indigo-100/80">Pertanyaan</label>
                            <textarea
                                value={newQuestionText}
                                onChange={e => setNewQuestionText(e.target.value)}
                                className="w-full p-3 rounded-lg bg-slate-900/50 text-white border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-24 resize-y transition-all"
                                placeholder="Tulis pertanyaan di sini..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold mb-3 text-indigo-100/80">Opsi Jawaban (Pilih radio button untuk jawaban benar)</label>
                            <div className="space-y-3">
                                {options.map((opt, idx) => (
                                    <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl border transition-all ${opt.isCorrect ? 'border-green-500/50 bg-green-500/10' : 'border-white/10 bg-slate-900/50'}`}>
                                        {/* Radio Button Kunci Jawaban */}
                                        <div
                                            className="cursor-pointer p-2"
                                            onClick={() => handleSetCorrectOption(idx)}
                                            title="Jadikan Jawaban Benar"
                                        >
                                            {opt.isCorrect ? (
                                                <CheckCircle size={20} className="text-green-400" />
                                            ) : (
                                                <div className="w-5 h-5 rounded-full border-2 border-slate-500"></div>
                                            )}
                                        </div>

                                        {/* Input Teks Opsi */}
                                        <input
                                            type="text"
                                            value={opt.optionText}
                                            onChange={e => handleOptionTextChange(idx, e.target.value)}
                                            className="flex-1 bg-transparent text-sm text-white outline-none"
                                            placeholder={`Opsi ${idx + 1}`}
                                            required
                                        />

                                        {/* Tombol Hapus Opsi */}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveOption(idx)}
                                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                            disabled={options.length <= 2}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddOption}
                                className="mt-3 text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1"
                            >
                                <Plus size={14} /> Tambah Opsi Lainnya
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 transition-all disabled:opacity-50"
                        >
                            {isSubmitting ? 'Menyimpan...' : (
                                <>
                                    <Save size={18} /> Simpan Pertanyaan ke Database
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}