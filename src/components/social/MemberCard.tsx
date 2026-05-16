import { Award, Flame, TrendingUp } from 'lucide-react';
import { GlassCard } from '../common/UI';

type Role = 'Leader' | 'Officer' | 'Member';

export default function MemberCard({
  username,
  role,
  level,
  contribution,
  streak,
  isOnline,
}: {
  username: string;
  role: Role;
  level: number;
  contribution: number;
  streak: number;
  isOnline?: boolean;
}) {
  const roleColor: Record<Role, string> = {
    Leader: 'from-amber-400 to-yellow-400',
    Officer: 'from-violet-400 to-indigo-400',
    Member: 'from-slate-400 to-gray-400',
  };

  return (
    <GlassCard className="yomu-card-hover space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-full bg-gradient-to-br ${roleColor[role]} shadow-lg relative`}
          >
            {isOnline && (
              <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-slate-950 bg-emerald-400" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{username}</p>
            <p className="text-xs text-indigo-100/70">{role}</p>
          </div>
        </div>
        <span className="rounded-lg bg-yellow-400/20 px-2 py-1 text-xs font-bold text-yellow-200">
          Lvl {level}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="flex items-center gap-1 text-indigo-200/80">
            <TrendingUp size={14} />
            Contribution
          </div>
          <p className="mt-1 font-mono font-bold text-white">{contribution}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
          <div className="flex items-center gap-1 text-orange-200/80">
            <Flame size={14} />
            Streak
          </div>
          <p className="mt-1 font-mono font-bold text-white">{streak}d</p>
        </div>
      </div>
    </GlassCard>
  );
}
