import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Trophy,
  Shield,
  Users,
  Medal,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  Info,
  Star,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLeaderboard, LeaderboardByTier } from '../../services/socialAPI';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard } from '../../components/common/UI';

const TIER_INFO: Record<string, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  scoringTitle: string;
  scoringDesc: string;
}> = {
  DIAMOND: {
    label: 'Diamond',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
    icon: <Sparkles size={16} className="text-cyan-300" />,
    scoringTitle: 'Weighted Average',
    scoringDesc: 'Score is calculated using a weighted average between consistency (60%) and peak performance (40%). Rewarding clans where all members contribute steadily.',
  },
  GOLD: {
    label: 'Gold',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    icon: <Star size={16} className="text-yellow-400" />,
    scoringTitle: 'Diminishing Returns',
    scoringDesc: 'Higher-scoring clans receive progressively smaller score gains (logarithmic scaling). This prevents runaway leaders and keeps competition tight.',
  },
  SILVER: {
    label: 'Silver',
    color: 'text-slate-300',
    bgColor: 'bg-slate-400/10',
    borderColor: 'border-slate-400/20',
    icon: <TrendingUp size={16} className="text-slate-300" />,
    scoringTitle: 'Contribution Bonus',
    scoringDesc: 'Base points are amplified by +5% per quiz contribution completed. More active participation from members means a bigger score multiplier for your clan!',
  },
  BRONZE: {
    label: 'Bronze',
    color: 'text-amber-600',
    bgColor: 'bg-amber-700/10',
    borderColor: 'border-amber-700/20',
    icon: <Zap size={16} className="text-amber-600" />,
    scoringTitle: 'Direct Scoring',
    scoringDesc: 'Points earned from quizzes and missions are added directly to your clan score. Simple and straightforward — every point counts!',
  },
};

const ClanLeaderboardPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<LeaderboardByTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTier, setActiveTier] = useState<string>('BRONZE');
  const [showScoringInfo, setShowScoringInfo] = useState(false);
  const hasAutoSelectedTier = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getLeaderboard();
      setData(result);
    } catch (err) {
      setError('Failed to load leaderboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch logic on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-select tier once when data and user are loaded
  useEffect(() => {
    if (data.length > 0 && !hasAutoSelectedTier.current && !authLoading) {
      if (user?.clanTier) {
        const userTier = user.clanTier.toUpperCase();
        if (data.some(d => d.tier.toUpperCase() === userTier)) {
          setActiveTier(userTier);
        } else {
          setActiveTier(data[0]?.tier.toUpperCase() ?? 'BRONZE');
        }
      } else {
        setActiveTier(data[0]?.tier.toUpperCase() ?? 'BRONZE');
      }
      hasAutoSelectedTier.current = true;
    }
  }, [data, user?.clanTier, authLoading]);

  const userClanId = user?.clanId;

  const currentTierData = data.find(d => d.tier.toUpperCase() === activeTier.toUpperCase());
  const userEntry = currentTierData?.userEntry;
  const filteredEntries = currentTierData?.entries || [];

  const isUserInTop50 = userClanId && filteredEntries.some(e => e.clanId === userClanId);

  const tiers = ['DIAMOND', 'GOLD', 'SILVER', 'BRONZE'];

  const tierMeta = TIER_INFO[activeTier] || TIER_INFO.BRONZE;

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Medal className="text-yellow-400" size={24} />;
    if (rank === 2) return <Medal className="text-slate-300" size={24} />;
    if (rank === 3) return <Medal className="text-amber-600" size={24} />;
    return <span className="text-indigo-100/40 font-bold w-6 text-center">{rank}</span>;
  };

  const RankRow = ({ entry, isUserClan }: { entry: any, isUserClan?: boolean }) => (
    <GlassCard
      key={entry.clanId}
      className={`group grid grid-cols-12 items-center px-6 py-4 transition-all hover:border-indigo-500/30 ${isUserClan ? 'ring-2 ring-indigo-500/50 bg-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.15)] z-10' : (entry.rank <= 3 ? 'bg-indigo-500/[0.03]' : '')
        }`}
    >
      <div className="col-span-1 flex items-center">
        {getRankIcon(entry.rank)}
      </div>

      <div className="col-span-6 md:col-span-7 flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold bg-white/5 border border-white/10 text-indigo-100 group-hover:scale-110 transition-transform ${entry.rank === 1 ? 'border-yellow-500/30 bg-yellow-500/5' : ''
          }`}>
          <Shield size={20} className={entry.rank === 1 ? 'text-yellow-400' : 'text-indigo-400'} />
        </div>
        <div>
          <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
            {entry.clanName}
            {isUserClan && <span className="text-[10px] bg-indigo-500 px-1.5 py-0.5 rounded">YOU</span>}
            {entry.rank === 1 && (
              <span className="text-[10px] bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black px-1.5 py-0.5 rounded flex items-center gap-0.5">
                <Trophy size={8} /> #1
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2 md:hidden mt-1">
            <span className="text-[10px] text-indigo-100/40 flex items-center gap-1">
              <Users size={10} /> {entry.memberCount}
            </span>
          </div>
        </div>
      </div>

      <div className="col-span-3 md:col-span-2 text-right">
        <span className="font-black text-amber-400 tabular-nums">
          {new Intl.NumberFormat().format(entry.score)}
        </span>
      </div>

      <div className="col-span-2 text-right hidden md:block">
        <span className="text-xs font-bold text-indigo-100/60 flex items-center justify-end gap-1.5">
          <Users size={14} className="text-indigo-400/50" />
          {entry.memberCount}
        </span>
      </div>
    </GlassCard>
  );

  return (
    <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
      <Sidebar username={user?.username || 'Pelajar'} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-rise">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                <Trophy size={28} />
              </div>
              <h1 className="text-3xl font-black text-white">Global Standings</h1>
            </div>
            <p className="text-indigo-100/60">Climb the ranks and prove your clan's dominance</p>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
            {tiers.map(tier => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${activeTier === tier
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-indigo-100/40 hover:text-indigo-100/60'
                  }`}
              >
                {TIER_INFO[tier]?.icon}
                {tier}
              </button>
            ))}
          </div>
        </header>

        {/* Tier Scoring Explanation */}
        <GlassCard className={`${tierMeta.borderColor} ${tierMeta.bgColor} animate-fade-rise`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg ${tierMeta.bgColor} mt-0.5`}>
                {tierMeta.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-bold ${tierMeta.color}`}>{tierMeta.label} Tier — {tierMeta.scoringTitle}</h4>
                  <button
                    onClick={() => setShowScoringInfo(!showScoringInfo)}
                    className="text-indigo-100/30 hover:text-indigo-100/60 transition-colors"
                  >
                    <Info size={14} />
                  </button>
                </div>
                {showScoringInfo && (
                  <p className="text-xs text-indigo-100/50 leading-relaxed mt-1">
                    {tierMeta.scoringDesc}
                  </p>
                )}
                {!showScoringInfo && (
                  <p className="text-[11px] text-indigo-100/30">
                    Click <Info size={10} className="inline" /> to learn how scoring works in this tier
                  </p>
                )}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Champion Achievement Banner */}
        <GlassCard className="border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 via-amber-500/5 to-orange-500/5 animate-fade-rise" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
              <Trophy size={24} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-yellow-200 flex items-center gap-2">
                <Sparkles size={14} className="text-yellow-400" />
                Season Champion Achievement
              </h4>
              <p className="text-xs text-yellow-100/50 leading-relaxed mt-0.5">
                The <span className="font-bold text-yellow-300">#1 clan</span> on the leaderboard at the end of the season earns the exclusive <span className="font-bold text-yellow-300">"Season Champion"</span> achievement for <span className="text-yellow-300 font-bold">all members</span>. Lead your clan to victory!
              </p>
            </div>
            <div className="hidden md:flex items-center gap-1 text-[10px] font-black tracking-wider text-yellow-400/60 uppercase">
              <Star size={12} /> Exclusive
            </div>
          </div>
        </GlassCard>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 w-full bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="yomu-glass rounded-3xl p-12 text-center space-y-4">
            <AlertCircle size={48} className="mx-auto text-red-400 opacity-50" />
            <p className="text-indigo-100/60 font-medium">{error}</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="yomu-glass rounded-3xl p-20 text-center space-y-4">
            <Shield size={48} className="mx-auto text-indigo-100/10" />
            <p className="text-indigo-100/40 font-medium">No clans found in {activeTier} tier</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-rise" style={{ animationDelay: '0.2s' }}>
            {/* Header Labels */}
            <div className="grid grid-cols-12 px-6 text-[10px] font-black uppercase tracking-widest text-indigo-100/40">
              <div className="col-span-1">Rank</div>
              <div className="col-span-6 md:col-span-7">Clan Name</div>
              <div className="col-span-3 md:col-span-2 text-right">Score</div>
              <div className="col-span-2 text-right hidden md:block">Members</div>
            </div>

            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <RankRow
                  key={entry.clanId}
                  entry={entry}
                  isUserClan={entry.clanId === userClanId}
                />
              ))}

              {/* Show user's clan separately if not in Top 50 */}
              {userEntry && !isUserInTop50 && (
                <>
                  <div className="flex items-center justify-center py-4">
                    <div className="h-px bg-white/10 flex-1" />
                    <span className="px-6 text-[10px] font-black text-indigo-100/20 tracking-[0.2em] uppercase">Your Position</span>
                    <div className="h-px bg-white/10 flex-1" />
                  </div>
                  <RankRow entry={userEntry} isUserClan={true} />
                </>
              )}
            </div>
          </div>
        )}

        {/* Promotion/Demotion Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 animate-fade-rise" style={{ animationDelay: '0.3s' }}>
          <GlassCard className="border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                <ChevronUp size={18} />
              </div>
              <h4 className="font-bold text-emerald-100">Promotion Zone</h4>
            </div>
            <p className="text-xs text-emerald-100/60 leading-relaxed">
              Top 20% of clans in this tier will be promoted to the next tier at the end of the season.
            </p>
          </GlassCard>

          <GlassCard className="border-red-500/20 bg-red-500/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-500/20 rounded-lg text-red-400">
                <ChevronDown size={18} />
              </div>
              <h4 className="font-bold text-red-100">Demotion Risk</h4>
            </div>
            <p className="text-xs text-red-100/60 leading-relaxed">
              Bottom 20% of clans are at risk of being moved to the lower tier. Stay active to maintain your rank!
            </p>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default ClanLeaderboardPage;
