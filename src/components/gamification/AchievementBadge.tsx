import { GlassCard, TierBadge } from '../common/UI';

export default function AchievementBadge({
  title,
  rarity,
  description,
}: {
  title: string;
  rarity: string;
  description: string;
}) {
  return (
    <GlassCard className="yomu-card-hover flex h-full flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-bold text-white sm:text-base">{title}</h4>
        <TierBadge tier={rarity} />
      </div>
      <p className="text-xs text-indigo-100/80 sm:text-sm">{description}</p>
    </GlassCard>
  );
}
