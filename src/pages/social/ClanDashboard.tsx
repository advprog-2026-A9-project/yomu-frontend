import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createClan, deleteClan, getMyClan, leaveClan, updateClan } from '../../services/socialAPI';
import { useAuth } from "../../context/AuthContext.tsx";

interface MemberData {
    userId: string;
    username: string;
    role: string;
}

interface ClanData {
    id: string;
    name: string;
    description: string;
    leaderUserId: string;
    role: string;
}

function ClanDashboard() {
    const navigate = useNavigate();
    const [myClan, setMyClan] = useState<ClanData | null>(null);
    const [members, setMembers] = useState<MemberData[]>([]);
    const { isAuthenticated, loading } = useAuth();
    // State Modal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    // State Form Draft
    const [draft, setDraft] = useState({
        name: "",
        description: ""
    });

    const loadData = useCallback(async () => {
        try {
            const response = await getMyClan();

            if (response) {
                setMyClan({
                    id: response.id,
                    name: response.name,
                    description: response.description,
                    leaderUserId: response.leaderUserId,
                    role: response.role === 'KETUA' ? 'Ketua' : 'Anggota',
                });

                if (response.members && Array.isArray(response.members)) {
                    setMembers(response.members);
                }
            } else {
                setMyClan(null);
                setMembers([]);
            }
        } catch (error) {
            console.error("❌ Gagal mengambil data clan", error);
        }
    }, []);

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        void loadData();
    }, [isAuthenticated, loading, navigate, loadData]);

    const handleCreateClan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!draft.name.trim()) return alert("Nama clan wajib diisi!");

        try {
            await createClan(draft);
            setIsCreateModalOpen(false);
            setDraft({ name: "", description: "" });
            loadData();
        } catch (error) {
            alert("Gagal membuat clan.");
        }
    };

    const handleUpdateClan = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!myClan) return;
        if (!draft.name.trim()) return alert("Nama clan tidak boleh kosong!");

        try {
            await updateClan(myClan.id, draft);
            setIsUpdateModalOpen(false);
            alert("Informasi clan berhasil diperbarui!");
            loadData();
        } catch (error) {
            console.error(error);
            alert("Gagal memperbarui clan.");
        }
    };

    const handleFinalAction = async () => {
        if (!myClan) return;
        const isLeader = myClan.role === 'Ketua';

        try {
            if (isLeader) {
                await deleteClan({ id: myClan.id });
                alert("Clan berhasil dihapus.");
            } else {
                await leaveClan({ id: myClan.id });
                alert("Berhasil keluar dari clan.");
            }
            setIsConfirmModalOpen(false);
            setMyClan(null);
            setMembers([]);
        } catch (error) {
            alert("Gagal memproses permintaan.");
        }
    };

    const openUpdateModal = () => {
        if (!myClan) return;
        setDraft({ name: myClan.name, description: myClan.description });
        setIsUpdateModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="text-center mt-10 mb-12">
                    <h1 className="text-5xl font-bold text-blue-400 tracking-tight">Clan Dashboard</h1>
                    <p className="text-gray-400 mt-2 text-lg">Kelola komunitas dan perkuat aliansimu.</p>
                </header>

                {!myClan ? (
                    /* VIEW: Belum Punya Clan */
                    <div className="flex flex-col items-center bg-gray-800 p-12 rounded-2xl border border-gray-700 shadow-xl max-w-2xl mx-auto text-center">
                        <span className="text-6xl mb-6">🛡️</span>
                        <h2 className="text-3xl font-bold mb-4">Kamu belum memiliki Clan</h2>
                        <button
                            onClick={() => { setDraft({name:"", description:""}); setIsCreateModalOpen(true); }}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition-all transform hover:scale-105 shadow-lg shadow-blue-600/20"
                        >
                            Buat Clan Sekarang
                        </button>
                    </div>
                ) : (
                    /* VIEW: Overview Clan & Member List */
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Kolom Info Clan */}
                        <div className="lg:col-span-1 bg-gray-800 p-6 rounded-xl border border-blue-900/30 flex flex-col h-fit shadow-lg">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold break-words">{myClan.name}</h2>
                            </div>

                            <div className="space-y-4 flex-grow">
                                <div className="border-b py-2 border-gray-700">
                                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Deskripsi Clan</label>
                                    <p className="text-sm text-gray-300 italic mt-2 leading-relaxed">
                                        {myClan.description ? `${myClan.description}` : 'Tidak ada deskripsi clan.'}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center px-1">
                                    <span className="text-sm text-gray-400 font-medium">Anggota</span>
                                    <span className="text-sm text-white font-bold">{members.length} / 50</span>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-700 space-y-3">
                                {myClan.role === 'Ketua' && (
                                    <button
                                        onClick={openUpdateModal}
                                        className="w-full py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition font-bold text-sm"
                                    >
                                        EDIT INFORMASI
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsConfirmModalOpen(true)}
                                    className={`w-full py-2.5 rounded-lg transition font-bold text-sm border ${
                                        myClan.role === 'Ketua'
                                            ? 'bg-red-600/10 text-red-500 border-red-600/20 hover:bg-red-600 hover:text-white'
                                            : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-red-600/20 hover:text-red-400'
                                    }`}
                                >
                                    {myClan.role === 'Ketua' ? 'HAPUS CLAN' : 'KELUAR DARI CLAN'}
                                </button>
                            </div>
                        </div>

                        {/* Kolom Member List */}
                        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                Daftar Anggota
                            </h3>
                            <div className="overflow-hidden rounded-xl border border-gray-700">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-900 text-gray-400 text-[11px] uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Member</th>
                                        <th className="px-6 py-4">Role</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                    {members.map((m) => (
                                        <tr key={m.userId} className="hover:bg-gray-700/30 transition">
                                            <td className="px-6 py-4 font-semibold text-gray-200">{m.username}</td>
                                            <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tight ${
                                                        m.role === 'KETUA'
                                                            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                                    }`}>
                                                        {m.role}
                                                    </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link to="/" className="text-gray-500 hover:text-white transition text-sm font-medium">
                        &larr; Kembali ke Home
                    </Link>
                </div>
            </div>

            {/* MODAL: CREATE CLAN */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-2">Buat Clan Baru</h2>
                        <p className="text-gray-400 text-sm mb-6">Mulai komunitasmu dan jadilah yang terkuat.</p>

                        <form onSubmit={handleCreateClan} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Nama Clan</label>
                                <input
                                    type="text"
                                    value={draft.name}
                                    onChange={(e) => setDraft({...draft, name: e.target.value})}
                                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition text-white"
                                    placeholder="Nama clan..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={draft.description}
                                    onChange={(e) => setDraft({...draft, description: e.target.value})}
                                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition resize-none text-white"
                                    placeholder="Ceritakan tentang clan kamu..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold transition text-sm">Batal</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition text-sm text-white">Buat Clan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: UPDATE CLAN */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-2">Update Informasi Clan</h2>
                        <p className="text-gray-400 text-sm mb-6">Sesuaikan nama atau visi komunitasmu.</p>

                        <form onSubmit={handleUpdateClan} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Nama Clan</label>
                                <input
                                    type="text"
                                    value={draft.name}
                                    onChange={(e) => setDraft({...draft, name: e.target.value})}
                                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition text-white"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest mb-2">Deskripsi</label>
                                <textarea
                                    rows={3}
                                    value={draft.description}
                                    onChange={(e) => setDraft({...draft, description: e.target.value})}
                                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-blue-500 outline-none transition resize-none text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setIsUpdateModalOpen(false)} className="px-6 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 font-bold transition text-sm">Batal</button>
                                <button type="submit" className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold transition text-sm text-white">Simpan Perubahan</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: KONFIRMASI AKSI (DELETE/LEAVE) */}
            {isConfirmModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 p-8 rounded-2xl border border-red-900/50 w-full max-w-sm shadow-2xl text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            {myClan?.role === 'Ketua' ? 'Hapus Clan?' : 'Keluar Clan?'}
                        </h2>
                        <p className="text-gray-400 text-sm mb-8">
                            {myClan?.role === 'Ketua'
                                ? "Tindakan ini permanen. Semua data clan dan daftar anggota akan dihapus selamanya."
                                : "Kamu akan kehilangan akses ke fitur clan ini. Kamu bisa bergabung kembali nanti."}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleFinalAction}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold transition shadow-lg shadow-red-600/20"
                            >
                                Ya, Saya Yakin
                            </button>
                            <button
                                onClick={() => setIsConfirmModalOpen(false)}
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition text-gray-300"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ClanDashboard;