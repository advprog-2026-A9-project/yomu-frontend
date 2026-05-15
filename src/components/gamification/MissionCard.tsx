import { GlassCard, ProgressBar } from '../common/UI';

export default function MissionCard({
  title,
  progress,
}: {
  title: string;
  progress: number;
}) {
  return (
    <GlassCard className="yomu-card-hover space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h4 className="text-sm font-semibold text-white sm:text-base">{title}</h4>
      </div>

      <ProgressBar value={progress} />

      <div className="flex items-center justify-between text-xs text-indigo-100/80">
        <span>{progress}% selesai</span>
        <button
          type="button"
          className="rounded-lg border border-indigo-300/40 bg-indigo-400/20 px-2 py-1 font-semibold text-indigo-100 transition hover:bg-indigo-400/35"
        >
          Claim
        </button>
      </div>
    </GlassCard>
  );
}
