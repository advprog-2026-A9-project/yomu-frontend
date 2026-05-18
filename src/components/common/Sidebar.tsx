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
  Menu,
  X,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

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

export default function Sidebar(_props: {
  username?: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Sticky Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur-md lg:hidden w-full">
        <div>
          <h1 className="text-lg font-black tracking-tight text-white">Yomu</h1>
          <p className="text-[10px] text-indigo-100/70">Read. Think. Rise.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-xl border border-white/12 bg-white/[0.04] p-2.5 text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Full-Screen Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/98 p-6 backdrop-blur-xl animate-in fade-in duration-200 lg:hidden overflow-y-auto">
          {/* Drawer Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-xl font-black tracking-tight text-white">Yomu</h1>
              <p className="text-xs text-indigo-100/70">Read. Think. Rise.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-white/12 bg-white/[0.04] p-2.5 text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const active = pathname === item.path;
              const Icon = item.icon;

              if (item.comingSoon) {
                return (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-indigo-100/40 bg-white/[0.01]"
                    aria-disabled="true"
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon size={20} strokeWidth={2.1} className="shrink-0 opacity-50" aria-hidden="true" />
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-200/40 bg-indigo-500/5 px-2 py-0.5 rounded-full border border-indigo-500/10">Soon</span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-semibold transition-all active:scale-[0.98] ${
                    active
                      ? 'bg-gradient-to-r from-indigo-600/35 to-violet-600/35 text-white border border-indigo-500/35 shadow-lg shadow-indigo-600/10'
                      : 'text-indigo-100/80 hover:bg-white/[0.06] hover:text-white border border-transparent'
                  }`}
                >
                  <Icon size={20} strokeWidth={2.1} className="shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Drawer Footer Logout Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            className="mt-8 flex items-center justify-center gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/6 hover:bg-rose-500/12 hover:border-rose-500/40 p-4 text-sm font-bold text-rose-300 transition-all active:scale-[0.98] w-full"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
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

          <button
            type="button"
            onClick={logout}
            className="mt-auto flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/35 p-3 text-sm font-bold text-rose-300 transition active:scale-[0.98] w-full"
          >
            <LogOut size={16} />
            <span className={`${collapsed ? 'hidden' : 'inline'}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
