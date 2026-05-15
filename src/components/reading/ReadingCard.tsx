import { GlassCard, ProgressBar } from '../common/UI';

export default function ReadingCard({
  title,
  category,
  progress,
}: {
  title: string;
  category: string;
  progress: number;
}) {
  return (
    <GlassCard className="yomu-card-hover space-y-3">
      <span className="yomu-badge">{category}</span>
      <h4 className="text-base font-bold text-white">{title}</h4>
      <ProgressBar value={progress} />
      <div className="flex items-center justify-between text-xs text-indigo-100/80">
        <span>{progress}% terbaca</span>
        <button type="button" className="yomu-button-secondary px-3 py-1.5 text-xs">
          Continue
        </button>
      </div>
    </GlassCard>
  );
}
