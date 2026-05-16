import { GlassCard, TierBadge } from '../common/UI';

export default function BuffCard({
  name,
  multiplier,
  type,
  duration,
  description,
}: {
  name: string;
  multiplier: string;
  type: 'buff' | 'debuff';
  duration?: string;
  description?: string;
}) {
  const isBuff = type === 'buff';

  return (
    <GlassCard
      className={`yomu-card-hover space-y-3 border-l-4 ${
        isBuff
          ? 'border-l-emerald-400 bg-emerald-400/5'
          : 'border-l-red-400 bg-red-400/5'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h4 className="font-semibold text-white">{name}</h4>
          <p className={`text-xs font-mono font-bold ${isBuff ? 'text-emerald-200' : 'text-red-200'}`}>
            {multiplier}
          </p>
        </div>
        {duration && (
          <span className="rounded-lg bg-white/10 px-2 py-1 text-xs text-indigo-100/70">
            {duration}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-indigo-100/75">{description}</p>
      )}

      {/* Glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl blur-lg ${
          isBuff ? 'bg-emerald-400/10' : 'bg-red-400/10'
        }`}
        style={{ pointerEvents: 'none' }}
      />
    </GlassCard>
  );
}
