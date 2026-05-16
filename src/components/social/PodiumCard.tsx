import { GlassCard, TierBadge } from '../common/UI';

export default function PodiumCard({
  rank,
  name,
  score,
  tier,
}: {
  rank: 1 | 2 | 3;
  name: string;
  score: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
}) {
  const podiumStyles = {
    1: 'lg:col-span-1 lg:row-span-2 shadow-2xl shadow-amber-400/30',
    2: 'lg:col-span-1 lg:order-first',
    3: 'lg:col-span-1 lg:order-last',
  };

  const medalEmoji = { 1: '🥇', 2: '🥈', 3: '🥉' }[rank];
  const heights = { 1: 'h-full', 2: 'h-32', 3: 'h-32' };

  return (
    <GlassCard className={`yomu-card-hover ${podiumStyles[rank]} flex flex-col items-center justify-center gap-4 p-6 text-center ${heights[rank]}`}>
      <span className="text-5xl">{medalEmoji}</span>

      <div className="space-y-2">
        <h3 className="text-lg font-bold text-white sm:text-xl">{name}</h3>
        <TierBadge tier={tier} />
      </div>

      <p className="font-mono text-sm font-bold text-yellow-200 sm:text-base">
        {score.toLocaleString()} pts
      </p>

      <div className={`text-2xl font-black ${rank === 1 ? 'text-amber-300' : rank === 2 ? 'text-slate-300' : 'text-orange-300'}`}>
        Rank #{rank}
      </div>
    </GlassCard>
  );
}
