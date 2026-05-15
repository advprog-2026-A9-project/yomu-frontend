import { ArrowDown, ArrowUp, Trophy } from 'lucide-react';
import { GlassCard, TierBadge } from '../common/UI';

type TrendType = 'up' | 'down' | 'stable';

export default function LeaderboardRow({
  rank,
  name,
  score,
  tier,
  trend,
  streak,
  highlight,
}: {
  rank: number;
  name: string;
  score: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  trend?: TrendType;
  streak?: number;
  highlight?: boolean;
}) {
  const medalEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3 transition ${
        highlight
          ? 'bg-indigo-400/20 shadow-lg shadow-indigo-600/20'
          : 'bg-white/5 hover:bg-white/10'
      }`}
    >
      {/* Rank */}
      <div className="shrink-0 text-center">
        {medalEmoji ? (
          <span className="text-lg">{medalEmoji}</span>
        ) : (
          <span className="font-mono text-sm font-bold text-indigo-100/80">#{rank}</span>
        )}
      </div>

      {/* Name & Tier */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-white">{name}</p>
        <TierBadge tier={tier} />
      </div>

      {/* Score */}
      <div className="shrink-0 text-right">
        <p className="font-mono text-sm font-bold text-yellow-200">{score.toLocaleString()}</p>
      </div>

      {/* Trend */}
      {trend && (
        <div className="shrink-0">
          {trend === 'up' && <ArrowUp size={16} className="text-emerald-400" />}
          {trend === 'down' && <ArrowDown size={16} className="text-red-400" />}
          {trend === 'stable' && <Trophy size={16} className="text-slate-400" />}
        </div>
      )}

      {/* Streak */}
      {streak && (
        <div className="shrink-0 rounded-lg bg-orange-400/20 px-2 py-1">
          <p className="text-xs font-bold text-orange-200">🔥 {streak}</p>
        </div>
      )}
    </div>
  );
}
