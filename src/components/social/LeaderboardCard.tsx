import { GlassCard, TierBadge } from '../common/UI';

type Item = {
  name: string;
  score: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
};

export default function LeaderboardCard({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <GlassCard className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">League Leaderboard</h3>
          <span className="text-xs text-indigo-100/80">Top Clans</span>
        </div>
        <div className="rounded-xl border border-dashed border-white/20 p-6 text-center text-sm text-indigo-100/70">
          No leaderboard data yet.
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">League Leaderboard</h3>
        <span className="text-xs text-indigo-100/80">Top Clans</span>
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-white/70">#{idx + 1}</span>
              <span className="text-sm font-semibold text-white">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <TierBadge tier={item.tier} />
              <span className="text-xs font-mono text-indigo-100">{item.score.toLocaleString()}</span>
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}
