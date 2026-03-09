import React, { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardByTier } from '../../services/socialAPI';

const tierColors: { [key: string]: string } = {
    'Bronze': 'bg-orange-100 text-orange-800 border-orange-300',
    'Silver': 'bg-gray-100 text-gray-800 border-gray-400',
    'Gold': 'bg-yellow-100 text-yellow-800 border-yellow-400',
    'Diamond': 'bg-blue-100 text-blue-800 border-blue-400',
};

const tierEmojis: { [key: string]: string } = {
    'Bronze': '🥉',
    'Silver': '🥈',
    'Gold': '🥇',
    'Diamond': '💎',
};

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardByTier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getLeaderboard();
            console.log('Leaderboard data:', data);
            setLeaderboard(data);
        } catch (err: any) {
            console.error('Error fetching leaderboard:', err);
            setError(err.message || 'Gagal memuat leaderboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Loading leaderboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-center mb-2">📊 Clan Leaderboard</h1>
                <p className="text-center text-gray-600">
                    Ranking Clan berdasarkan Tier dan Score
                </p>
            </div>

            <div className="space-y-8">
                {leaderboard.map((tierBoard) => (
                    <div key={tierBoard.tier} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className={`px-6 py-4 ${tierColors[tierBoard.tier] || 'bg-gray-100'} border-b-2`}>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <span>{tierEmojis[tierBoard.tier] || '🏆'}</span>
                                <span>{tierBoard.tier} Tier</span>
                                <span className="text-sm font-normal ml-auto">
                                    ({tierBoard.entries.length} clan{tierBoard.entries.length !== 1 ? 's' : ''})
                                </span>
                            </h2>
                        </div>

                        {tierBoard.entries.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Belum ada clan di tier ini
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Clan Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Score
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Members
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {tierBoard.entries.map((entry) => (
                                            <tr
                                                key={entry.clanId}
                                                className={`${
                                                    entry.rank === 1
                                                        ? 'bg-yellow-50 font-semibold'
                                                        : entry.rank === 2
                                                        ? 'bg-gray-50'
                                                        : entry.rank === 3
                                                        ? 'bg-orange-50'
                                                        : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {entry.rank === 1 && '🥇'}
                                                        {entry.rank === 2 && '🥈'}
                                                        {entry.rank === 3 && '🥉'}
                                                        <span className="ml-2 text-lg font-bold">
                                                            #{entry.rank}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {entry.clanName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-semibold">
                                                        {entry.score.toLocaleString()} pts
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        👥 {entry.memberCount}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {leaderboard.every((tb) => tb.entries.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-xl">Belum ada clan di leaderboard</p>
                    <p className="mt-2">Buat clan pertama dan mulai bersaing!</p>
                </div>
            )}
        </div>
    );
}
