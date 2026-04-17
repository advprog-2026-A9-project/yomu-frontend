import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard, getMyClan, LeaderboardByTier, endSeason } from '../../services/socialAPI';

const tierEmojis: { [key: string]: string } = {
    'Bronze': '🥉',
    'Silver': '🥈',
    'Gold': '🥇',
    'Diamond': '💎',
};

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardByTier[]>([]);
    const [myClanData, setMyClanData] = useState<any>(null);
    const [activeTier, setActiveTier] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [isEndingSeason, setIsEndingSeason] = useState(false);
    console.log(localStorage.getItem("role"));
    const isAdmin = false;
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [lbData, myClan] = await Promise.all([
                getLeaderboard(),
                !isAdmin ? getMyClan() : Promise.resolve(null)
            ]);

            setLeaderboard(lbData);
            setMyClanData(myClan);

            if (lbData.length > 0) {
                setActiveTier(lbData[0].tier);
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSeason = async () => {
        if (!window.confirm('Peringatan: Apakah kamu yakin ingin mengakhiri season saat ini? Semua skor mungkin akan direset.')) {
            return;
        }

        try {
            setIsEndingSeason(true);
            await endSeason();
            alert('Season berhasil diakhiri!');
            // Refresh data setelah season berakhir
            await fetchData();
        } catch (err) {
            console.error('Gagal mengakhiri season:', err);
            alert('Terjadi kesalahan saat mengakhiri season.');
        } finally {
            setIsEndingSeason(false);
        }
    };

    // Mencari info ranking user di semua tier
    const userRankInfo = useMemo(() => {
        if (!myClanData) return null;
        for (const tierBoard of leaderboard) {
            const found = tierBoard.entries.find(e => e.clanId === myClanData.id);
            if (found) return { tier: tierBoard.tier, rank: found.rank, score: found.score };
        }
        return null;
    }, [leaderboard, myClanData]);

    const activeEntries = leaderboard.find(t => t.tier === activeTier)?.entries || [];

    if (loading) return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center text-blue-400">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
            {/* Header */}
            <div className="w-full max-w-6xl mx-auto flex flex-col items-center mt-10 mb-12 relative">
                <h1 className="text-5xl font-bold mb-4 text-blue-400">Clan Leaderboard</h1>
                <p className="text-gray-400">Persaingan antar komunitas terkuat di Yomu.</p>

                {/* Tombol End Season Khusus Admin */}
                {isAdmin && (
                    <button
                        onClick={handleEndSeason}
                        disabled={isEndingSeason}
                        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isEndingSeason ? (
                            <span className="animate-pulse">Memproses...</span>
                        ) : (
                            <>
                                <span>⚠️</span> Akhiri Season
                            </>
                        )}
                    </button>
                )}
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* SIDEBAR: Info Clan User (Hanya tampil jika bukan admin) */}
                {!isAdmin && (
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Status Clan Kamu</h2>
                            {myClanData ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Clan Saat Ini</p>
                                        <p className="text-xl font-bold text-blue-400">{myClanData.name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                                            <p className="text-[10px] text-gray-500 uppercase">Tier</p>
                                            <p className="text-lg font-bold">{userRankInfo?.tier || 'Unranked'}</p>
                                        </div>
                                        <div className="bg-gray-900 p-3 rounded-lg border border-gray-700">
                                            <p className="text-[10px] text-gray-500 uppercase">Rank</p>
                                            <p className="text-lg font-bold text-yellow-400">#{userRankInfo?.rank || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-700">
                                        <p className="text-xs text-gray-500">Total Skor</p>
                                        <p className="text-lg font-semibold">{userRankInfo?.score.toLocaleString() || 0} pts</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm mb-4">Kamu belum memiliki clan.</p>
                                    <Link to="/clan`" className="text-blue-400 hover:underline text-sm font-medium">Buat atau Gabung Clan &rarr;</Link>
                                </div>
                            )}
                        </div>

                        <Link to="/" className="block text-center text-gray-500 hover:text-white transition text-sm underline">
                            &larr; Kembali ke Dashboard
                        </Link>
                    </div>
                )}

                {/* MAIN CONTENT: Tabs & Table */}
                {/* Jika Admin, tabel akan mengambil full width (col-span-4). Jika bukan, col-span-3 */}
                <div className={isAdmin ? "lg:col-span-4" : "lg:col-span-3"}>
                    {/* Horizontal Tabs */}
                    <div className="flex space-x-2 mb-6 bg-gray-800 p-1.5 rounded-xl border border-gray-700 overflow-x-auto no-scrollbar">
                        {leaderboard.map((tierBoard) => (
                            <button
                                key={tierBoard.tier}
                                onClick={() => setActiveTier(tierBoard.tier)}
                                className={`flex-1 min-w-[100px] py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2
                                    ${activeTier === tierBoard.tier
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                    : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
                            >
                                <span>{tierEmojis[tierBoard.tier]}</span>
                                {tierBoard.tier}
                            </button>
                        ))}
                    </div>

                    {/* Leaderboard Table */}
                    <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase">
                                    <th className="px-6 py-4 font-semibold">Rank</th>
                                    <th className="px-6 py-4 font-semibold">Clan</th>
                                    <th className="px-6 py-4 font-semibold">Score</th>
                                    <th className="px-6 py-4 font-semibold text-right">Members</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                {activeEntries.length > 0 ? (
                                    activeEntries.map((entry) => {
                                        const isUserClan = entry.clanId === myClanData?.id && !isAdmin;
                                        return (
                                            <tr
                                                key={entry.clanId}
                                                className={`transition-colors ${isUserClan ? 'bg-blue-600/20' : 'hover:bg-gray-700/30'}`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                            <span className="w-8 font-bold text-lg">
                                                                {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`font-bold ${isUserClan ? 'text-blue-400' : 'text-white'}`}>
                                                        {entry.clanName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono font-semibold text-yellow-500">
                                                    {entry.score.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-right text-gray-400 text-sm">
                                                    {entry.memberCount} <span className="text-gray-600">/ 50</span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-gray-500 italic">
                                            Belum ada kompetisi di tier ini.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}