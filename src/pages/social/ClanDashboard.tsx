import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClan, deleteClan } from '../../services/socialAPI';

interface ClanData {
    id: string;
    name: string;
    description: string;
    leaderUserId: string;
    role: string;
    members: number;
}

function ClanDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    const [draft, setDraft] = useState({
        name: "",
        description: ""
    });
    const [myClan, setMyClan] = useState<ClanData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateClan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!draft.name.trim()) {
            alert("Nama Clan tidak boleh kosong!");
            return;
        }

        try {
            const payloadToSend = {
                name: draft.name,
                description: draft.description,
            };

            const created = await createClan(payloadToSend);
            
            setMyClan({
                id: created.id,
                name: created.name,
                description: created.description,
                leaderUserId: created.leaderUserId,
                role: "Ketua",
                members: 1
            });
            
            
            setIsModalOpen(false);
            setDraft({ name: "", description: "" });
        } catch (error) {
            console.error("Gagal membuat clan", error);
            alert("Terjadi kesalahan saat membuat Clan.");
        }

    };

    const handleDeleteClan = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!myClan?.id || !myClan?.leaderUserId) {
            alert("Data clan tidak ditemukan.");
            return;
        }

        const confirmDelete = confirm("Apakah Anda yakin ingin menghapus Clan ini?");
        if (!confirmDelete) return;

        
        try {
            const payloadToSend = {
                id: myClan.id,
            };

            await deleteClan(payloadToSend);
            
            setMyClan(null);
            
            alert("Clan berhasil dihapus.");

        } catch (error) {
            console.error("Gagal menghapus clan", error);
            alert("Terjadi kesalahan saat menghapus Clan.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6 font-sans text-center relative">
            
            {/* Header Section */}
            <div className="w-full max-w-4xl flex flex-col items-center mt-10">
                <h1 className="text-5xl font-bold mb-4 text-blue-400">Clan Dashboard</h1>
                <p className="text-xl text-gray-400 mb-10 max-w-lg">
                    Bangun komunitasmu, ikuti liga, dan jadilah yang terbaik di Yomu.
                </p>
            </div>

            <div className="w-full max-w-4xl grid gap-8 md:grid-cols-2">
                
                {/* Kolom Kiri: Status Clan Pengguna */}
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg flex flex-col items-center justify-center text-center">
                    <span className="text-4xl mb-4">🛡️</span>
                    <h2 className="text-2xl font-bold mb-2">Clan Saya</h2>
                    
                    {myClan ? (
                        <div className="w-full">
                            <div className="bg-gray-900 p-4 rounded-lg border border-blue-600 mb-4 text-left">
                                <h3 className="text-xl font-bold text-blue-400">{myClan.name}</h3>
                                <p className="text-sm text-gray-300 mt-2 italic">
                                    {myClan.description ? myClan.description : 'Tidak ada deskripsi clan'}
                                </p>
                                <p className="text-sm text-gray-400 mt-3 border-t border-gray-700 pt-2">
                                    Peran: <span className="text-white font-semibold">{myClan.role}</span> | Anggota: {myClan.members}/50
                                </p>
                            </div>
                            <button
                                onClick={handleDeleteClan}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-semibold transition"
                            >
                                {myClan.role === 'Ketua' ? 'Hapus Clan' : 'Keluar Clan'}
                            </button>
                        </div>
                    ) : (
                        <div className="w-full">
                            <p className="text-gray-400 mb-4">Kamu belum bergabung dengan Clan manapun.</p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-semibold transition mb-3"
                            >
                                Buat Clan Baru
                            </button>
                        </div>
                    )}
                </div>

                {/* Kolom Kanan: Daftar Clan yang Tersedia (Tetap Sama) */}
                <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-lg flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-center">Eksplorasi Clan</h2>
                    <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center">
                            <div className="text-left">
                                <h4 className="font-bold text-white">Naga Hitam</h4>
                                <p className="text-xs text-gray-400">45/50 Anggota</p>
                            </div>
                            <button className="px-4 py-2 bg-blue-800 hover:bg-blue-700 rounded-md text-sm font-semibold transition">
                                Gabung
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Tombol Kembali ke Home */}
            <div className="mt-10">
                <Link to="/" className="text-gray-400 hover:text-white underline transition">
                    &larr; Kembali ke Home
                </Link>
            </div>

            {/* OVERLAY MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-white text-left">Buat Clan Baru</h2>
                        
                        <form onSubmit={handleCreateClan} className="flex flex-col gap-4">
                            <div className="text-left">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Nama Clan</label>
                                <input
                                    type="text"
                                    value={draft.name}
                                    onChange={(e) => setDraft({...draft, name: e.target.value})}
                                    placeholder="Masukkan nama clan..."
                                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

                            <div className="text-left">
                                <label className="block text-sm font-medium text-gray-400 mb-1">Deskripsi Clan</label>
                                <input
                                    type="text"
                                    value={draft.description}
                                    onChange={(e) => setDraft({...draft, description: e.target.value})}
                                    placeholder="Masukkan deskripsi clan..."
                                    className="w-full p-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:outline-none focus:border-blue-500"
                                    autoFocus
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClanDashboard;