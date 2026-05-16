import { BarChart3 } from 'lucide-react';
import { GlassCard } from '../common/UI';

export default function ClanComparisonChart({
  myClan,
  compareClan,
  metric,
}: {
  myClan: { name: string; value: number };
  compareClan: { name: string; value: number };
  metric: string;
}) {
  const max = Math.max(myClan.value, compareClan.value) * 1.1;
  const myPercent = (myClan.value / max) * 100;
  const comparePercent = (compareClan.value / max) * 100;

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 size={18} className="text-indigo-200" />
        <h3 className="font-bold text-white">{metric}</h3>
      </div>

      {/* My Clan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">{myClan.name}</p>
          <p className="text-sm font-mono font-bold text-yellow-200">
            {myClan.value.toLocaleString()}
          </p>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
            style={{ width: `${myPercent}%` }}
          />
        </div>
      </div>

      {/* Compare Clan */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-300">{compareClan.name}</p>
          <p className="text-sm font-mono font-bold text-slate-300">
            {compareClan.value.toLocaleString()}
          </p>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-slate-500/50"
            style={{ width: `${comparePercent}%` }}
          />
        </div>
      </div>
    </GlassCard>
  );
}
