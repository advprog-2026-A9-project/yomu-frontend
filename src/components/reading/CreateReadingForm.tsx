import { useState } from 'react';
import { createText } from '../../services/readingTextAPI';

interface CreateReadingFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export default function CreateReadingForm({ onSuccess, onCancel }: CreateReadingFormProps) {
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategoryId, setNewCategoryId] = useState<number>(1);
    const [status, setStatus] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setStatus('Saving...');
            await createText({
                title: newTitle,
                content: newContent,
                categoryId: newCategoryId,
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
            <h2 className="text-2xl font-bold mb-4 text-blue-300">Buat Teks Baru</h2>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300">Judul Teks</label>
                <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300">ID Kategori (Misal: 1 untuk Edukasi)</label>
                <input
                    type="number"
                    value={newCategoryId}
                    onChange={e => setNewCategoryId(Number(e.target.value))}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none"
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-bold mb-2 text-gray-300">Isi Bacaan</label>
                <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:border-blue-500 outline-none h-32"
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