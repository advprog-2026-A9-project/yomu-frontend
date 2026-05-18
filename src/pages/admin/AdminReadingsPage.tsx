import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, Layers, HelpCircle, AlertTriangle, X } from 'lucide-react';
import { getAllTexts, deleteText, getAllCategories, deleteCategory, createCategory } from '../../services/readingAPI';
import type { ReadingTextResponse, CategoryResponse } from '../../types/reading';
import CreateReadingForm from '../../components/reading/CreateReadingForm'; // Sesuaikan path jika error

type DeleteTarget = {
    type: 'TEXT' | 'CATEGORY';
    id: number;
    name: string;
} | null;

export default function AdminReadingsPage() {
    const navigate = useNavigate();
    const [texts, setTexts] = useState<ReadingTextResponse[]>([]);
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // State Form Teks
    const [showForm, setShowForm] = useState(false);
    const [selectedText, setSelectedText] = useState<ReadingTextResponse | null>(null);

    // State Form Kategori Baru
    const [newCategoryName, setNewCategoryName] = useState('');
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    // State Delete Modal
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [textsData, categoriesData] = await Promise.all([
                getAllTexts(),
                getAllCategories()
            ]);
            setTexts(textsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error("Gagal mengambil data admin reading:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            setIsCreatingCategory(true);
            await createCategory(newCategoryName);
            setNewCategoryName('');
            fetchData(); // Refresh data Kategori
        } catch (err: unknown) {
            alert("Gagal menambah kategori: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);

        try {
            if (deleteTarget.type === 'TEXT') {
                await deleteText(deleteTarget.id);
            } else if (deleteTarget.type === 'CATEGORY') {
                await deleteCategory(deleteTarget.id);
            }
            setDeleteTarget(null);
            fetchData();
        } catch (err: unknown) {
            alert("Gagal menghapus: " + (err instanceof Error ? err.message : "Unknown error"));
        } finally {
            setIsDeleting(false);
        }
    };

    const affectedTexts = deleteTarget?.type === 'CATEGORY'
        ? texts.filter(t => t.categoryName === deleteTarget.name)
        : [];

    const handleEditClick = (text: ReadingTextResponse) => {
        setSelectedText(text);
        setShowForm(true);
    };

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 p-1 text-white relative">
            {/* DELETE MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fadeIn">
                    <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white" disabled={isDeleting}>
                            <X size={20} />
                        </button>
                        <div className="flex items-center gap-3 mb-4 text-red-400">
                            <AlertTriangle size={28} />
                            <h3 className="text-xl font-bold">Peringatan Penghapusan</h3>
                        </div>
                        <p className="text-sm text-indigo-100/80 mb-4">
                            Anda yakin ingin menghapus {deleteTarget.type === 'TEXT' ? 'artikel' : 'kategori'} <strong className="text-white">"{deleteTarget.name}"</strong>?
                        </p>

                        {deleteTarget.type === 'CATEGORY' && (
                            <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl mb-6">
                                <p className="text-xs text-red-200 mb-2">Menghapus kategori ini akan <b>MENGHAPUS SEMUA ARTIKEL BACAAN</b> di bawah ini:</p>
                                {affectedTexts.length === 0 ? (
                                    <p className="text-xs italic text-slate-400 border border-dashed border-slate-700 p-2 rounded text-center">Aman dihapus. Tidak ada artikel terikat.</p>
                                ) : (
                                    <ul className="list-disc list-inside text-xs text-white max-h-32 overflow-y-auto pl-4 space-y-1">
                                        {affectedTexts.map(t => <li key={t.id}>{t.title}</li>)}
                                    </ul>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-bold" disabled={isDeleting}>Batal</button>
                            <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold" disabled={isDeleting}>
                                {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reading Module Management</h1>
                    <p className="text-sm text-indigo-100/60">Kelola teks bacaan, kategori, serta rancang kuis.</p>
                </div>
                {!showForm && categories.length > 0 && (
                    <button
                        onClick={() => { setSelectedText(null); setShowForm(true); }}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-500 transition-all"
                    >
                        <Plus size={16} /> Tambah Bacaan Baru
                    </button>
                )}
            </div>

            {/* FORM TEKS */}
            {showForm && (
                <div className="mb-6 animate-fadeIn">
                    <CreateReadingForm
                        initialData={selectedText}
                        onSuccess={() => { setShowForm(false); setSelectedText(null); fetchData(); }}
                        onCancel={() => { setShowForm(false); setSelectedText(null); }}
                    />
                </div>
            )}

            <div className="grid gap-8 lg:grid-cols-3">

                {/* TABEL TEKS */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <BookOpen size={18} className="text-indigo-400" /> Daftar Artikel
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="border-b border-white/10 text-xs font-bold uppercase text-indigo-100/60">
                                <th className="py-3 px-4">Judul Artikel</th>
                                <th className="py-3 px-4">Kategori</th>
                                <th className="py-3 px-4 text-center">Aksi & Kuis</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                            {texts.length === 0 ? (
                                <tr><td colSpan={3} className="py-8 text-center text-indigo-100/40">Belum ada artikel.</td></tr>
                            ) : (
                                texts.map((text) => (
                                    <tr key={text.id} className="hover:bg-white/5 group">
                                        <td className="py-4 px-4 font-semibold text-white">{text.title}</td>
                                        <td className="py-4 px-4"><span className="bg-indigo-500/10 px-2 py-1 text-xs text-indigo-400 rounded ring-1 ring-indigo-500/20">{text.categoryName}</span></td>
                                        <td className="py-4 px-4">
                                            <div className="flex justify-center gap-2">
                                                <button onClick={() => navigate(`/admin/readings/${text.id}/quiz-builder`)} className="flex gap-1 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs text-indigo-300 hover:bg-slate-700">
                                                    <HelpCircle size={14} /> Quiz Builder
                                                </button>
                                                <button onClick={() => handleEditClick(text)} className="rounded-lg bg-slate-800 p-1.5 text-amber-400 hover:bg-slate-700"><Edit2 size={14} /></button>
                                                <button onClick={() => setDeleteTarget({ type: 'TEXT', id: text.id, name: text.title })} className="rounded-lg bg-slate-800 p-1.5 text-red-400 hover:bg-red-500/20"><Trash2 size={14} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MANAJEMEN KATEGORI */}
                <div className="rounded-2xl border border-white/10 bg-slate-900/40 p-6 shadow-xl h-fit space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Layers size={18} className="text-purple-400" /> Manajemen Kategori
                    </h2>

                    {/* Form Tambah Kategori */}
                    <form onSubmit={handleCreateCategory} className="flex gap-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={e => setNewCategoryName(e.target.value)}
                            placeholder="Nama kategori baru..."
                            className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isCreatingCategory}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                            <Plus size={18} />
                        </button>
                    </form>

                    {/* List Kategori */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {categories.length === 0 ? (
                            <p className="text-xs text-center text-slate-500 italic">Kategori kosong. Silakan tambah baru.</p>
                        ) : (
                            categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-sm font-medium text-white group">
                                    <span>{cat.name}</span>
                                    <button onClick={() => setDeleteTarget({ type: 'CATEGORY', id: cat.id, name: cat.name })} className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:bg-red-500/20 rounded">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}