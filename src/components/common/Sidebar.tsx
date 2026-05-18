import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Gauge,
  MessageSquare,
  Settings,
  Shield,
  Trophy,
  User,
  type LucideIcon,
} from 'lucide-react';

type MenuItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  comingSoon?: boolean;
};

const menuItems: MenuItem[] = [
  { label: 'Dashboard', path: '/', icon: Gauge },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Bacaan', path: '/readings', icon: BookOpen },
  { label: 'Achievements', path: '/achievements', icon: Award },
  { label: 'Clan', path: '/clan', icon: Shield },
  { label: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  { label: 'Forum', path: '/discussion-test', icon: MessageSquare },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar({
  username,
}: {
  username: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <aside
      className={`sticky top-0 hidden h-screen shrink-0 border-r border-white/10 bg-slate-950/70 backdrop-blur lg:flex ${collapsed ? 'w-[92px]' : 'w-[270px]'
        } transition-all duration-300`}
      aria-label="Navigasi utama"
    >
      <div className="flex w-full flex-col p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className={`${collapsed ? 'hidden' : 'block'}`}>
            <h1 className="text-xl font-black tracking-tight text-white">Yomu</h1>
            <p className="text-xs text-indigo-100/70">Read. Think. Rise.</p>
          </div>
          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs text-white"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            if (item.comingSoon) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium text-indigo-100/45"
                  aria-disabled="true"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={2.1} className="shrink-0 opacity-60" aria-hidden="true" />
                    <span className={`${collapsed ? 'hidden' : 'inline'}`}>{item.label}</span>
                  </div>
                  {!collapsed && <span className="text-[10px] uppercase tracking-[0.2em] text-indigo-200/50">Soon</span>}
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${active
                  ? 'bg-indigo-500/30 text-white shadow-lg shadow-indigo-600/20'
                  : 'text-indigo-100/80 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon size={18} strokeWidth={2.1} className="shrink-0" aria-hidden="true" />
                <span className={`${collapsed ? 'hidden' : 'inline'}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-3">
          <p className="truncate text-sm font-semibold text-white">{username}</p>
          <p className="text-xs text-indigo-100/70 truncate">Yomu Member</p>
        </div>
      </div>
    </aside>
  );
}
