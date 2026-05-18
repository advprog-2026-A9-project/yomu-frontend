import { useState, useEffect } from 'react';
import { createText, updateText, getAllCategories } from '../../services/readingAPI';
import type { CategoryResponse, ReadingTextResponse } from '../../types/reading';

interface ReadingFormProps {
    initialData?: ReadingTextResponse | null; // Jika ada isinya, form berubah menjadi mode Edit
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CreateReadingForm({ initialData, onSuccess, onCancel }: ReadingFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [categoryId, setCategoryId] = useState<number | ''>('');

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [status, setStatus] = useState<string>('');

    // Fetch daftar kategori
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);

                // Jika mode EDIT, cari ID kategori yang cocok dengan categoryName dari initialData
                if (initialData) {
                    const existingCat = data.find(c => c.name === initialData.categoryName);
                    if (existingCat) setCategoryId(existingCat.id);
                }
                // Jika mode CREATE, otomatis pilih kategori pertama
                else if (data.length > 0) {
                    setCategoryId(data[0].id);
                }
            } catch (err) {
                console.error("Gagal mengambil daftar kategori:", err);
            }
        };

        fetchCategories();
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (categoryId === '') {
            alert('Tunggu sebentar, kategori sedang dimuat atau belum dipilih...');
            return;
        }

        try {
            setStatus('Saving...');
            if (initialData) {
                // Mode Edit: Tembak API PUT
                await updateText(initialData.id, {
                    title,
                    content,
                    categoryId: Number(categoryId),
                });
            } else {
                // Mode Create: Tembak API POST
                await createText({
                    title,
                    content,
                    categoryId: Number(categoryId),
                });
            }
            setStatus('');
            onSuccess(); // Panggil fungsi refresh data di komponen induk
        } catch (err: unknown) {
            alert('Gagal menyimpan teks: ' + (err instanceof Error ? err.message : 'Unknown error'));
            setStatus('Error');
        }
    };

    const isEditMode = !!initialData;

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/80 backdrop-blur-md p-6 rounded-2xl border border-indigo-500/30 max-w-2xl mx-auto shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                <span className="bg-indigo-500 w-2 h-8 rounded-full"></span>
                {isEditMode ? 'Edit Teks Bacaan' : 'Buat Teks Bacaan Baru'}
            </h2>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-indigo-100/80">Judul Teks</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-900/50 text-white border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="Masukkan judul bacaan..."
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-indigo-100/80">Kategori</label>
                <select
                    value={categoryId}
                    onChange={e => setCategoryId(Number(e.target.value))}
                    className="w-full p-3 rounded-lg bg-slate-900/50 text-white border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    required
                >
                    {categories.length === 0 ? (
                        <option value="" disabled>Memuat Kategori...</option>
                    ) : (
                        categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))
                    )}
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-bold mb-2 text-indigo-100/80">Isi Bacaan</label>
                <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full p-3 rounded-lg bg-slate-900/50 text-white border border-white/10 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none h-48 resize-y transition-all"
                    placeholder="Tulis atau paste isi teks bacaan di sini..."
                    required
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-bold transition-colors"
                    disabled={status === 'Saving...'}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors flex items-center"
                    disabled={status === 'Saving...'}
                >
                    {status === 'Saving...' ? 'Menyimpan...' : (isEditMode ? 'Update Teks' : 'Simpan Teks')}
                </button>
            </div>
        </form>
    );
}