import { GlassCard, ProgressBar } from '../common/UI';

export default function MissionCard({
  title,
  description,
  reward,
  progress,
}: {
  title: string;
  description: string;
  reward: string;
  progress: number;
}) {
  return (
    <GlassCard className="yomu-card-hover flex flex-col justify-between space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white sm:text-base leading-tight">{title}</h4>
        <p className="text-[11px] leading-relaxed text-indigo-100/60 line-clamp-2">{description}</p>
      </div>

      <div className="space-y-3">
        <ProgressBar value={progress} />

        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-100/80">
          <span>{progress}% selesai</span>
          <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 text-indigo-300 border border-indigo-400/20">{reward}</span>
        </div>
      </div>
    </GlassCard>
  );
}
