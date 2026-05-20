import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Sparkles,
  Trophy,
  Users,
  Shield,
  Activity,
} from 'lucide-react';
import { GlassCard, TierBadge, Modal, SearchInput, Pagination } from '../../components/common/UI';
import {
  ClanDetailResponse,
  ClanResponse,
  LeaderboardByTier,
  SeasonEndResponse,
  SeasonStatusResponse,
  endSeason,
  getAllClans,
  getClanDetail,
  getCurrentSeason,
  getLeaderboard,
} from '../../services/socialAPI';
import {
  SortDirection,
  SortKey,
  badgeClassForModifier,
  formatNumber,
  sortClans,
} from './adminShared';

const ITEMS_PER_PAGE = 10;

export default function AdminLeaguePage() {
  const [clans, setClans] = useState<ClanResponse[]>([]);
  const [clansLoading, setClansLoading] = useState(true);
  const [clanDetail, setClanDetail] = useState<ClanDetailResponse | null>(null);
  const [selectedClanId, setSelectedClanId] = useState<string | null>(null);
  const [clanSortKey, setClanSortKey] = useState<SortKey>('tier');
  const [clanSortDirection, setClanSortDirection] = useState<SortDirection>('desc');
  const [seasonStatus, setSeasonStatus] = useState<SeasonStatusResponse | null>(null);
  const [leaderboards, setLeaderboards] = useState<LeaderboardByTier[]>([]);
  const [seasonResult, setSeasonResult] = useState<SeasonEndResponse | null>(null);
  const [seasonBusy, setSeasonBusy] = useState(false);
  const [seasonConfirm, setSeasonConfirm] = useState(false);
  const [seasonError, setSeasonError] = useState<string | null>(null);

  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSortedClans = useMemo(() => {
    let filtered = clans.filter((clan) =>
      clan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clan.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return sortClans(filtered, clanSortKey, clanSortDirection);
  }, [clans, searchQuery, clanSortKey, clanSortDirection]);

  const totalPages = Math.ceil(filteredSortedClans.length / ITEMS_PER_PAGE);
  const paginatedClans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSortedClans.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSortedClans, currentPage]);

  const loadLeagueData = async () => {
    try {
      setClansLoading(true);
      setSeasonError(null);
      const [clanList, seasonData, leaderboardData] = await Promise.all([
        getAllClans(),
        getCurrentSeason(),
        getLeaderboard(),
      ]);

      setClans(clanList);
      setSeasonStatus(seasonData);
      setLeaderboards(leaderboardData);
    } catch (error) {
      setSeasonError(error instanceof Error ? error.message : 'Gagal memuat data liga');
    } finally {
      setClansLoading(false);
    }
  };

  useEffect(() => {
    void loadLeagueData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (!selectedClanId) {
      setClanDetail(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        const detail = await getClanDetail(selectedClanId);
        setClanDetail(detail);
      } catch {
        setClanDetail(null);
      }
    };

    void fetchDetail();
  }, [selectedClanId]);

  const handleSeasonEnd = async () => {
    try {
      setSeasonBusy(true);
      setSeasonError(null);
      const result = await endSeason();
      setSeasonResult(result);
      setSeasonStatus({ seasonNumber: result.newSeasonNumber, status: 'Active' });
      await loadLeagueData();
    } catch (error) {
      setSeasonError(error instanceof Error ? error.message : 'Gagal memproses season');
    } finally {
      setSeasonBusy(false);
      setSeasonConfirm(false);
    }
  };

  const leaderboardRows = leaderboards.flatMap((tierBoard) =>
    tierBoard.entries.slice(0, 3).map((entry) => ({
      ...entry,
    })),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <GlassCard>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Season Control</p>
              <h2 className="mt-2 text-2xl font-black text-white">League Operations</h2>
              <p className="mt-2 max-w-2xl text-sm text-indigo-100/70">
                Monitor rankings and process season cycles.
              </p>
            </div>
            <button type="button" onClick={loadLeagueData} className="yomu-button-secondary gap-2 text-xs">
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-100/50">Current season</p>
              <p className="mt-2 text-3xl font-black text-white">{seasonStatus?.seasonNumber ?? '—'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-100/50">Status</p>
              <p className="mt-2 text-3xl font-black text-emerald-300">{seasonStatus?.status ?? 'Active'}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-indigo-100/50">Total Clans</p>
              <p className="mt-2 text-3xl font-black text-white">{formatNumber(clans.length)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4">
            {seasonConfirm ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-amber-50">
                  This will process promotions and relegations. Confirm?
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSeasonEnd}
                    disabled={seasonBusy}
                    className="yomu-button-primary gap-2"
                  >
                    {seasonBusy ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Confirm End Season
                  </button>
                  <button type="button" onClick={() => setSeasonConfirm(false)} className="yomu-button-secondary">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" onClick={() => setSeasonConfirm(true)} className="yomu-button-primary gap-2">
                <Sparkles size={16} />
                Trigger End of Season
              </button>
            )}
          </div>

          {seasonError && (
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
              <AlertCircle size={16} />
              <span>{seasonError}</span>
            </div>
          )}

          {seasonResult && (
            <div className="mt-5 space-y-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-emerald-100/60">Season processed</p>
                  <h3 className="text-lg font-bold text-white">Season {seasonResult.processedSeasonNumber} completed</h3>
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-50">
                  New season {seasonResult.newSeasonNumber}
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="text-emerald-100/60">Promoted</p>
                  <p className="mt-1 text-xl font-black text-white">{seasonResult.promotedClans.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="text-emerald-100/60">Relegated</p>
                  <p className="mt-1 text-xl font-black text-white">{seasonResult.relegatedClans.length}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                  <p className="text-emerald-100/60">Unchanged</p>
                  <p className="mt-1 text-xl font-black text-white">{seasonResult.unchangedClans.length}</p>
                </div>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-300">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Current rankings</p>
              <h3 className="text-xl font-bold text-white">Top Clans by Tier</h3>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {leaderboardRows.length === 0 ? (
              <div className="py-10 text-center text-sm text-indigo-100/40">No ranking data available</div>
            ) : (
              leaderboardRows.slice(0, 6).map((entry) => (
                <div key={`${entry.tier}-${entry.clanId}`} className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-xs font-bold text-indigo-300">
                        #{entry.rank}
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-100/40">{entry.tier}</p>
                        <p className="font-bold text-white group-hover:text-indigo-200 transition-colors">{entry.clanName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-amber-300">{formatNumber(entry.score)}</p>
                      <p className="text-[10px] text-indigo-100/40">Points</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Clan discovery</p>
            <h3 className="text-xl font-bold text-white">Active Clans Database</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setClanSortKey('tier');
                setClanSortDirection((prev) => (clanSortKey === 'tier' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
              }}
              className="yomu-button-secondary gap-2 text-xs"
            >
              Sort Tier <ArrowUpDown size={14} />
            </button>
            <button
              type="button"
              onClick={() => {
                setClanSortKey('score');
                setClanSortDirection((prev) => (clanSortKey === 'score' ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
              }}
              className="yomu-button-secondary gap-2 text-xs"
            >
              Sort Score <ArrowUpDown size={14} />
            </button>
          </div>
        </div>

        <div className="mt-6 max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search clans by name..."
          />
        </div>

        {clansLoading ? (
          <div className="mt-6 space-y-3">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 animate-pulse rounded-2xl bg-white/5" />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-white/5 text-[10px] uppercase tracking-[0.24em] text-indigo-100/50">
                  <tr>
                    <th className="px-6 py-4">Clan</th>
                    <th className="px-6 py-4">Tier</th>
                    <th className="px-6 py-4">Score</th>
                    <th className="px-6 py-4">Modifiers</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedClans.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-indigo-100/40">No clans found</td>
                    </tr>
                  ) : (
                    paginatedClans.map((clan) => (
                      <tr key={clan.id} className="group bg-slate-950/20 transition hover:bg-white/5">
                        <td className="px-6 py-5">
                          <p className="font-bold text-white group-hover:text-indigo-200 transition-colors">{clan.name}</p>
                          <p className="mt-1 max-w-xs text-xs text-indigo-100/50 line-clamp-1">{clan.description || 'No description'}</p>
                        </td>
                        <td className="px-6 py-5">
                          <TierBadge tier={clan.tier} />
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <p className="font-black text-amber-300">{formatNumber(clan.effectiveScore ?? clan.score)}</p>
                            {typeof clan.effectiveScore === 'number' && clan.effectiveScore !== clan.score && (
                              <p className="text-[10px] text-indigo-100/40">Raw {formatNumber(clan.score)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-wrap gap-2">
                            {[...(clan.activeBuffs ?? []), ...(clan.debuffs ?? [])].length === 0 ? (
                              <span className="text-xs text-indigo-100/30">None</span>
                            ) : (
                              [...(clan.activeBuffs ?? []), ...(clan.debuffs ?? [])].slice(0, 2).map((modifier, index) => (
                                <span
                                  key={`${modifier.name}-${index}`}
                                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-bold ${badgeClassForModifier(modifier.multiplier)}`}
                                >
                                  {modifier.multiplier}
                                </span>
                              ))
                            )}
                            {[...(clan.activeBuffs ?? []), ...(clan.debuffs ?? [])].length > 2 && (
                              <span className="text-[10px] text-indigo-100/40">+{([...(clan.activeBuffs ?? []), ...(clan.debuffs ?? [])].length - 2)} more</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedClanId(clan.id)}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/10"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </GlassCard>

      {/* Clan Detail Modal */}
      <Modal
        isOpen={!!selectedClanId}
        onClose={() => setSelectedClanId(null)}
        title={clanDetail?.name ?? 'Clan Details'}
      >
        {clanDetail ? (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-100/40">About Clan</p>
              <p className="mt-2 text-sm leading-relaxed text-indigo-100/70">
                {clanDetail.description || 'No description provided.'}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                  <Shield size={16} />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-indigo-100/40">Tier</p>
                <div className="mt-1 flex justify-center"><TierBadge tier={clanDetail.tier} /></div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300">
                  <Trophy size={16} />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-indigo-100/40">Rank</p>
                <p className="mt-1 text-xl font-black text-white">#{clanDetail.rank}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
                  <Activity size={16} />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-indigo-100/40">Score</p>
                <p className="mt-1 text-xl font-black text-white">{formatNumber(clanDetail.score)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300">
                  <Users size={16} />
                </div>
                <p className="text-[10px] uppercase tracking-wider text-indigo-100/40">Members</p>
                <p className="mt-1 text-xl font-black text-white">{clanDetail.memberCount}/{clanDetail.maxMembers}</p>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-100/40">Member Roster</p>
                <div className="max-h-[300px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                  {clanDetail.members.map((member) => (
                    <div key={member.username} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-white">{member.username}</p>
                        <p className="text-[10px] text-indigo-100/40">{member.role}</p>
                      </div>
                      <div className={`h-2 w-2 rounded-full ${member.isOnline ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' : 'bg-white/10'}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-100/40">Active Buffs</p>
                  <div className="flex flex-wrap gap-2">
                    {clanDetail.activeBuffs.length === 0 ? (
                      <span className="text-xs text-indigo-100/30 italic">No active buffs</span>
                    ) : (
                      clanDetail.activeBuffs.map((mod) => (
                        <span key={mod.name} className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300">
                          {mod.name} {mod.multiplier}
                        </span>
                      ))
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-100/40">Active Debuffs</p>
                  <div className="flex flex-wrap gap-2">
                    {clanDetail.debuffs.length === 0 ? (
                      <span className="text-xs text-indigo-100/30 italic">No active debuffs</span>
                    ) : (
                      clanDetail.debuffs.map((mod) => (
                        <span key={mod.name} className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-300">
                          {mod.name} {mod.multiplier}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-indigo-400" size={32} />
            <p className="mt-4 text-sm text-indigo-100/40">Loading database records...</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
