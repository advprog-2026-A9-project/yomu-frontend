import { AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { GlassCard } from '../common/UI';

type EventType = 'promotion' | 'demotion' | 'buff' | 'achievement';

const eventConfig: Record<EventType, { icon: any; color: string }> = {
  promotion: { icon: CheckCircle, color: 'text-emerald-400' },
  demotion: { icon: AlertCircle, color: 'text-red-400' },
  buff: { icon: Zap, color: 'text-yellow-400' },
  achievement: { icon: CheckCircle, color: 'text-indigo-400' },
};

export default function ActivityItem({
  type,
  title,
  description,
  timestamp,
}: {
  type: EventType;
  title: string;
  description?: string;
  timestamp: string;
}) {
  const { icon: Icon, color } = eventConfig[type];

  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className={`mt-1 shrink-0 ${color}`} aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-white">{title}</p>
        {description && (
          <p className="text-xs text-indigo-100/75">{description}</p>
        )}
        <p className="mt-1 text-xs text-indigo-100/60">{timestamp}</p>
      </div>
    </div>
  );
}
