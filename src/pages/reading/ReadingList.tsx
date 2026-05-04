import { useEffect, useState } from 'react';
import { getAllTexts, deleteText } from '../../services/readingTextAPI';
import type { ReadingTextResponse } from '../../services/readingTextAPI';
import { useAuth } from '../../context/AuthContext';
import CreateReadingForm from '../../components/reading/CreateReadingForm';
import { Link } from 'react-router-dom';

export default function ReadingList() {
    const [readings, setReadings] = useState<ReadingTextResponse[]>([]);
    const [status, setStatus] = useState<string>('Loading...');
    const [showForm, setShowForm] = useState(false);
    const { isAdmin, loading } = useAuth();

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

    const handleFormSuccess = () => {
        setShowForm(false);
        fetchReadings();
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
            <h1 className="text-4xl font-bold mb-6 text-blue-400 text-center">Yomu Library</h1>

            <div className="flex justify-center mb-8">
                <span className={`px-4 py-2 rounded-full font-semibold ${
                    status === 'Success' ? 'bg-green-900 text-green-300'
                        : status.startsWith('Error') ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                }`}>
                    Backend Status: {status}
                </span>
            </div>

            {/* Tombol Tambah Teks (Hanya Admin) */}
            {!loading && isAdmin && !showForm && (
                <div className="flex justify-center mb-6 max-w-6xl mx-auto">
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded shadow-lg transition"
                    >
                        + Tambah Teks Bacaan Baru
                    </button>
                </div>
            )}

            {/* Form Pembuatan Teks */}
            {!loading && isAdmin && showForm && (
                <CreateReadingForm
                    onSuccess={handleFormSuccess}
                    onCancel={() => setShowForm(false)}
                />
            )}

            {/* Daftar Teks Bacaan */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
                {readings.length === 0 && status === 'Success' ? (
                    <p className="text-gray-400 col-span-full text-center">Belum ada teks bacaan tersedia.</p>
                ) : (
                    readings.map((book) => (
                        <div key={book.id} className="...">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-2">{book.title}</h2>
                                {/* ... */}
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                {/* Tombol untuk masuk ke detail bacaan */}
                                <Link
                                    to={`/reading/${book.id}`}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-center text-white font-semibold py-2 px-4 rounded transition"
                                >
                                    Baca & Mulai Kuis
                                </Link>

                                {!loading && isAdmin && (
                                    <button
                                        onClick={() => handleDelete(book.id)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition"
                                    >
                                        Hapus Teks
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}