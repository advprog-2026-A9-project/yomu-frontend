import { ChevronUp, ChevronDown } from 'lucide-react';
import { GlassCard, ProgressBar, TierBadge } from '../common/UI';

export default function PromotionProgress({
  currentRank,
  currentTier,
  nextTierAt,
  relegationAt,
  clanScore,
}: {
  currentRank: number;
  currentTier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  nextTierAt: number;
  relegationAt: number;
  clanScore: number;
}) {
  const safeZoneStart = Math.ceil(nextTierAt * 0.5);

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Tier Progress</h3>
        <TierBadge tier={currentTier} />
      </div>

      {/* Status Text */}
      <div className="text-sm text-indigo-100/80">
        {currentRank <= 3 ? (
          <p className="flex items-center gap-2 text-emerald-200">
            <ChevronUp size={16} />
            On track for promotion!
          </p>
        ) : currentRank <= safeZoneStart ? (
          <p className="text-slate-200">In safe zone</p>
        ) : (
          <p className="flex items-center gap-2 text-orange-200">
            <ChevronDown size={16} />
            Approaching relegation zone
          </p>
        )}
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-indigo-100/70">
          <span>Promotion Zone</span>
          <span className="font-mono font-bold">Rank {currentRank}</span>
          <span>Relegation Zone</span>
        </div>

        <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-white/10">
          {/* Promotion Zone */}
          <div className="bg-emerald-400/70" style={{ width: '30%' }} />
          {/* Safe Zone */}
          <div className="bg-slate-400/50" style={{ width: '40%' }} />
          {/* Relegation Zone */}
          <div className="bg-red-400/50" style={{ width: '30%' }} />
        </div>

        <div className="flex justify-between text-xs text-indigo-100/60">
          <span>Top 3</span>
          <span>#{Math.ceil(nextTierAt * 0.8)}</span>
          <span>#{Math.ceil(nextTierAt * 1.2)}</span>
        </div>
      </div>

      {/* Score info */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3">
        <p className="text-xs text-indigo-100/70">Total Clan Score</p>
        <p className="mt-1 font-mono text-lg font-bold text-white">
          {clanScore.toLocaleString()}
        </p>
      </div>
    </GlassCard>
  );
}
