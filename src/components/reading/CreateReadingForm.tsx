import { useState, useEffect } from 'react';
import { createText, getAllCategories } from '../../services/readingTextAPI';
import type { CategoryResponse } from '../../services/readingTextAPI';

interface CreateReadingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CreateReadingForm({ onSuccess, onCancel }: CreateReadingFormProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategoryId, setNewCategoryId] = useState<number | ''>(''); // Kosong saat awal

    // State baru untuk menampung daftar kategori dari backend
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [status, setStatus] = useState<string>('');

    // Fetch daftar kategori saat form pertama kali dimunculkan
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getAllCategories();
                setCategories(data);
                // Secara otomatis pilih kategori pertama sebagai default jika data ada
                if (data.length > 0) {
                    setNewCategoryId(data[0].id);
                }
            } catch (err) {
                console.error("Gagal mengambil daftar kategori:", err);
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newCategoryId === '') {
            alert('Tunggu sebentar, kategori sedang dimuat...');
            return;
        }

        try {
            setStatus('Saving...');
            await createText({
                title: newTitle,
                content: newContent,
                categoryId: Number(newCategoryId),
            });
            setStatus('');
            onSuccess(); // Panggil fungsi refresh data di komponen induk
        } catch (err: unknown) {
            alert('Gagal membuat teks: ' + (err instanceof Error ? err.message : 'Unknown error'));
            setStatus('Error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-2xl mx-auto mb-8 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Buat Teks Bacaan Baru</h2>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300">Judul Teks</label>
                <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                    placeholder="Masukkan judul bacaan..."
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300">Kategori</label>
                {/* Ubah Input Text menjadi Select Dropdown.
                    Sekarang Admin tinggal memilih nama, sedangkan sistem akan otomatis mengirim ID-nya!
                */}
                <select
                    value={newCategoryId}
                    onChange={e => setNewCategoryId(Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
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

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300">Isi Bacaan</label>
                <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none h-40 resize-y"
                    placeholder="Tulis atau paste isi teks bacaan di sini..."
                    required
                />
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold transition"
                    disabled={status === 'Saving...'}
                >
                    Batal
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold transition flex items-center"
                    disabled={status === 'Saving...'}
                >
                    {status === 'Saving...' ? 'Menyimpan...' : 'Simpan Teks'}
                </button>
            </div>
        </form>
    );
}