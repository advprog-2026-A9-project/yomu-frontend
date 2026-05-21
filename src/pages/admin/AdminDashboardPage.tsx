import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, LogOut, Shield, Trophy, Library, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/common/UI';

const navItems = [
  { to: '/admin/league', label: 'Liga', icon: Trophy },
  { to: '/admin/achievements', label: 'Achievement', icon: LayoutDashboard },
  { to: '/admin/daily-missions', label: 'Daily Mission', icon: CalendarDays },
  { to: '/admin/readings', label: 'Reading Mgmt', icon: Library },
  { to: '/admin/discussions', label: 'Discussion Mgmt', icon: MessageSquare },
];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.22),transparent_48%),radial-gradient(circle_at_bottom_left,_rgba(251,191,36,0.14),transparent_52%),linear-gradient(160deg,#050816_0%,#0b1020_48%,#090b16_100%)] text-white">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 md:px-6 lg:flex-row lg:items-start">

          {/* Sidebar Admin */}
          <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:w-72">
            <GlassCard className="space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Admin panel</p>
                <h1 className="mt-2 text-2xl font-black text-white">Yomu Console</h1>
                <p className="mt-2 text-sm text-indigo-100/70">
                  Pusat kendali utama untuk manajemen konten literasi, interaksi forum, dan sistem gamifikasi.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-indigo-400/20 p-2 text-indigo-200">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-indigo-100/50">Admin logged in</p>
                    <p className="text-sm font-semibold text-white">{user?.username ?? 'Admin'}</p>
                  </div>
                </div>
              </div>

              <nav className="space-y-2">
                {navItems.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                                isActive || location.pathname.startsWith(to)
                                    ? 'border-indigo-300/50 bg-indigo-500/20 text-indigo-50'
                                    : 'border-white/10 bg-white/5 text-indigo-100/75 hover:border-white/20 hover:bg-white/10'
                            }`
                        }
                    >
                      <Icon size={16} />
                      {label}
                    </NavLink>
                ))}
              </nav>

              <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
              >
                <LogOut size={14} />
                Logout
              </button>
            </GlassCard>
          </aside>

          {/* Main Content Area */}
          <main className="min-w-0 flex-1 pb-10">
            <Outlet />
          </main>

        </div>
      </div>
  );
}