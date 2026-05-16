import { Users, Zap, TrendingUp } from 'lucide-react';

interface ClanPreviewCardProps {
  id: string;
  name: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  memberCount: number;
  totalScore: number;
  activityLevel: 'Low' | 'Medium' | 'High';
  description: string;
  emblem?: string;
  onJoin?: () => void;
  onPreview?: () => void;
  isJoined?: boolean;
}

const tierColors = {
  Bronze: { bg: 'bg-orange-500/20', border: 'border-orange-400/30', text: 'text-orange-300', badge: 'bg-orange-500/30 text-orange-200' },
  Silver: { bg: 'bg-gray-400/20', border: 'border-gray-400/30', text: 'text-gray-200', badge: 'bg-gray-400/30 text-gray-100' },
  Gold: { bg: 'bg-yellow-500/20', border: 'border-yellow-400/30', text: 'text-yellow-300', badge: 'bg-yellow-500/30 text-yellow-200' },
  Diamond: { bg: 'bg-cyan-400/20', border: 'border-cyan-400/30', text: 'text-cyan-300', badge: 'bg-cyan-500/30 text-cyan-100' },
};

const activityColors = {
  Low: 'text-red-300/80',
  Medium: 'text-yellow-300/80',
  High: 'text-green-300/80',
};

export default function ClanPreviewCard({
  id,
  name,
  tier,
  memberCount,
  totalScore,
  activityLevel,
  description,
  emblem,
  onJoin,
  onPreview,
  isJoined = false,
}: ClanPreviewCardProps) {
  const tierStyle = tierColors[tier];
  const activityStyle = activityColors[activityLevel];

  return (
    <div className={`yomu-glass group rounded-2xl border p-6 transition hover:shadow-lg hover:shadow-indigo-600/20 ${tierStyle.border}`}>
      {/* Header with Emblem & Tier */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          {emblem ? (
            <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-xl">
              {emblem}
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-lg font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold truncate text-white">{name}</h3>
            <p className="text-xs text-indigo-100/70">Clan</p>
          </div>
        </div>
        <span className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold border ${tierStyle.badge}`}>
          {tier}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-indigo-100/80 mb-4 line-clamp-2">
        {description || 'A great clan to join and compete with!'}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5 py-4 border-t border-b border-white/10">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Users size={14} className="text-indigo-300/80" />
          </div>
          <p className="text-sm font-bold text-white">{memberCount}</p>
          <p className="text-[10px] text-indigo-100/70">Members</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap size={14} className="text-yellow-300/80" />
          </div>
          <p className="text-sm font-bold text-yellow-300">{totalScore.toLocaleString()}</p>
          <p className="text-[10px] text-indigo-100/70">Score</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp size={14} className={activityStyle} />
          </div>
          <p className={`text-sm font-bold ${activityStyle}`}>{activityLevel}</p>
          <p className="text-[10px] text-indigo-100/70">Activity</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {!isJoined ? (
          <button
            onClick={onJoin}
            className="flex-1 yomu-button-primary py-2 text-sm"
          >
            Join Clan
          </button>
        ) : (
          <div className="flex-1 rounded-lg border border-green-400/30 bg-green-500/20 py-2 text-center text-sm font-bold text-green-200">
            ✓ Joined
          </div>
        )}
        <button
          onClick={onPreview}
          className="flex-1 yomu-button-secondary py-2 text-sm"
        >
          Preview
        </button>
      </div>
    </div>
  );
}
