import type { ReactNode } from 'react';

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <span className="yomu-badge">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm text-indigo-100/80 sm:text-base">{description}</p>
    </div>
  );
}

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={`yomu-card ${className}`.trim()}>{children}</article>;
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const normalized = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`yomu-progress-track ${className}`.trim()}>
      <div className="yomu-progress-fill" style={{ width: `${normalized}%` }} />
    </div>
  );
}

export function TierBadge({
  tier,
}: {
  tier: string;
}) {
  const normalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  
  const tierStyles: Record<string, string> = {
    Bronze: 'border-orange-700/60 bg-orange-500/20 text-orange-200',
    Silver: 'border-slate-400/60 bg-slate-300/20 text-slate-100',
    Gold: 'border-amber-400/70 bg-amber-400/20 text-amber-100',
    Platinum: 'border-cyan-400/70 bg-cyan-400/20 text-cyan-100',
    Diamond: 'border-indigo-400/70 bg-indigo-400/20 text-indigo-100',
  };

  const style = tierStyles[normalizedTier] || 'border-white/20 bg-white/5 text-white';

  return <span className={`yomu-badge ${style}`}>{normalizedTier}</span>;
}

export function SkeletonCard() {
  return (
    <div className="yomu-card animate-pulse">
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-4 h-8 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-3 w-full rounded bg-white/10" />
      <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
    </div>
  );
}
