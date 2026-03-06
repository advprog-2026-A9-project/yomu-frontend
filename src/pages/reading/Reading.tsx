import { useEffect, useState } from 'react';
// Pastikan createText sudah di-import
import { getAllTexts, deleteText, createText, ReadingTextResponse } from '../../services/readingTextAPI';

function Reading() {
    const [readings, setReadings] = useState<ReadingTextResponse[]>([]);
    const [status, setStatus] = useState<string>('Loading...');

    // State untuk Form Tambah Data
    const [showForm, setShowForm] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newCategoryId, setNewCategoryId] = useState<number>(1); // Default ID 1 (Edukasi)

    const isAdmin = localStorage.getItem('role') === 'ADMIN';

    const fetchReadings = async () => {
        try {
            setStatus('Loading...');
            const data = await getAllTexts();
            setReadings(data);
            setStatus('Success');
        } catch (err: unknown) {
            setStatus('Error: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    useEffect(() => {
        fetchReadings();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus teks bacaan ini?')) return;
        try {
            await deleteText(id);
            fetchReadings();
        } catch (err: unknown) {
            alert('Gagal menghapus: ' + (err instanceof Error ? err.message : 'Unknown error'));
        }
    };

    // Fungsi Submit Form
    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Mencegah halaman reload
        try {
            setStatus('Saving...');
            await createText({
                title: newTitle,
                content: newContent,
                categoryId: newCategoryId
            });

            // Reset form dan sembunyikan
            setNewTitle('');
            setNewContent('');
            setShowForm(false);

            // Ambil data terbaru dari backend
            fetchReadings();
        } catch (err: unknown) {
            alert('Gagal membuat teks: ' + (err instanceof Error ? err.message : 'Unknown error'));
            setStatus('Error saving data');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
            <h1 className="text-4xl font-bold mb-6 text-blue-400 text-center">Yomu Library</h1>

            {/* Indikator Status */}
            <div className="flex justify-center mb-8">
                <span className={`px-4 py-2 rounded-full font-semibold ${
                    status === 'Success' ? 'bg-green-900 text-green-300'
                        : status.startsWith('Error') ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                }`}>
                    Backend Status: {status}
                </span>
            </div>

            {/* Tombol Buka Form (Hanya Admin) */}
            {isAdmin && !showForm && (
                <div className="flex justify-center mb-6 max-w-6xl mx-auto">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded shadow-lg transition">
                        + Tambah Teks Bacaan Baru
                    </button>
                </div>
            )}

            {/* Form Tambah Teks (Hanya Admin) */}
            {isAdmin && showForm && (
                <form onSubmit={handleCreateSubmit} className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-2xl mx-auto mb-8 shadow-xl">
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
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-bold transition">
                            Batal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-bold transition">
                            Simpan Teks
                        </button>
                    </div>
                </form>
            )}

            {/* Grid Teks Bacaan */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {readings.length === 0 && status === 'Success' ? (
                    <p className="text-gray-400 col-span-full text-center">Belum ada teks bacaan tersedia.</p>
                ) : (
                    readings.map((book) => (
                        <div key={book.id} className="p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between hover:bg-gray-750 transition">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{book.title}</h2>
                                <span className="inline-block px-2 py-1 mb-3 text-xs font-semibold bg-blue-900 text-blue-200 rounded">
                                    {book.categoryName}
                                </span>
                                <p className="text-gray-400 text-sm line-clamp-3 mb-4">{book.content}</p>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                                >
                                    Hapus Teks
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Reading;