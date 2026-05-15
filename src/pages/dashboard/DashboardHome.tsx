import { Link } from 'react-router-dom';
import { Award, MessageSquare, Shield, Target, Plus, Search, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard, ProgressBar, SkeletonCard } from '../../components/common/UI';
import MissionCard from '../../components/gamification/MissionCard';
import AchievementBadge from '../../components/gamification/AchievementBadge';
import ReadingCard from '../../components/reading/ReadingCard';
import LeaderboardCard from '../../components/social/LeaderboardCard';
import { getLeaderboard, getMyClan, MyClanResponse } from '../../services/socialAPI';

type Activity = {
  title: string;
  timestamp: string;
  type: 'achievement' | 'mission' | 'clan' | 'forum';
};

type LeaderboardItem = {
  name: string;
  score: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
};

const dailyMissions = [
  { title: 'Selesaikan 1 bacaan tingkat menengah', progress: 70 },
  { title: 'Posting insight di forum bacaan', progress: 45 },
  { title: 'Jawab 5 soal kuis akurasi tinggi', progress: 60 },
];

const achievements = [
  { title: 'Critical Thinker I', rarity: 'Silver' as const, description: 'Mendapat skor 90+ pada 3 kuis berturut-turut.' },
  { title: 'Debate Initiator', rarity: 'Gold' as const, description: 'Membuat thread diskusi dengan 20+ tanggapan.' },
  { title: 'Clan Vanguard', rarity: 'Diamond' as const, description: 'Mendorong clan naik 1 tier dalam satu season.' },
];

const activities: Activity[] = [
  { title: 'Achievement unlocked: Debate Initiator', timestamp: '5 menit lalu', type: 'achievement' },
  { title: 'Mission completed: Analisis editorial teknologi', timestamp: '18 menit lalu', type: 'mission' },
  { title: 'Clan Aether dipromosikan ke Gold', timestamp: '1 jam lalu', type: 'clan' },
  { title: 'Balasan forum baru di topik argumentasi', timestamp: '2 jam lalu', type: 'forum' },
];

function iconForActivity(type: Activity['type']): LucideIcon {
  if (type === 'achievement') return Award;
  if (type === 'mission') return Target;
  if (type === 'clan') return Shield;
  return MessageSquare;
}

export default function DashboardHome({
  username,
  loading: parentLoading,
}: {
  username: string;
  loading: boolean;
}) {
  const [myClan, setMyClan] = useState<MyClanResponse | null>(null);
  const [clanLoading, setClanLoading] = useState(true);
  const [leaderboardItems, setLeaderboardItems] = useState<LeaderboardItem[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClan = async () => {
      try {
        setClanLoading(true);
        setLeaderboardLoading(true);

        const [clanData, leaderboardData] = await Promise.all([
          getMyClan(),
          getLeaderboard(),
        ]);

        setMyClan(clanData);
        setLeaderboardItems(
          leaderboardData
            .flatMap((tierBoard) => tierBoard.entries.map((entry) => ({
              name: entry.clanName,
              score: entry.score,
              tier: tierBoard.tier as LeaderboardItem['tier'],
            })))
            .sort((a, b) => b.score - a.score)
            .slice(0, 4)
        );
      } catch (err) {
        console.error("Gagal mengambil data clan:", err);
        setLeaderboardError(err instanceof Error ? err.message : 'Gagal memuat leaderboard');
        setLeaderboardItems([]);
        setMyClan(null);
      } finally {
        setClanLoading(false);
        setLeaderboardLoading(false);
      }
    };
    fetchClan();
  }, []);

  if (parentLoading) {
    return (
      <div className="yomu-shell yomu-grid-noise">
        <div className="yomu-container py-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="yomu-shell yomu-grid-noise lg:flex">
      <Sidebar username={username} />

      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <header className="yomu-glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-100/70">Welcome back</p>
            <h1 className="text-2xl font-bold text-white">Welcome back, {username} 👋</h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="yomu-badge">Streak 14 hari</span>
          </div>
        </header>

        <main className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-3">
            <GlassCard className="xl:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-indigo-100/70">Continue Reading</p>
                  <h2 className="mt-1 text-xl font-bold">Mendeteksi Bias dalam Artikel Berita</h2>
                  <p className="mt-2 max-w-xl text-sm text-indigo-100/80">
                    Lanjutkan bacaan terakhirmu. Fokus hari ini: membedakan fakta, opini, dan framing informasi.
                  </p>
                </div>
                <Link to="/readings" className="yomu-button-primary">
                  Continue
                </Link>
              </div>
              <ProgressBar value={68} className="mt-5" />
            </GlassCard>

            <GlassCard>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-indigo-100/70">Clan Status</p>
                {myClan && <Shield size={14} className="text-indigo-300" />}
              </div>

              {clanLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-6 w-3/4 rounded bg-white/10" />
                  <div className="h-4 w-full rounded bg-white/5" />
                </div>
              ) : myClan ? (
                <>
                  <h3 className="text-xl font-bold text-white truncate">{myClan.name}</h3>
                  <p className="mt-2 text-sm text-indigo-100/80 truncate">
                    {myClan.role === 'KETUA' ? 'Leader' : 'Member'} • {myClan.members?.length || 0} Anggota
                  </p>
                  <div className="mt-4 flex gap-3">
                    <Link
                      to="/clan"
                      className="text-xs font-bold uppercase tracking-wider text-indigo-200 hover:text-white transition-colors"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-white/90">Belum Ada Clan</h3>
                  <p className="mt-1 text-xs text-indigo-100/70">Bergabunglah untuk naik liga.</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/clan"
                      className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500/20 py-2 text-xs font-bold text-indigo-100 border border-indigo-400/30 hover:bg-indigo-500/30 transition-all"
                    >
                      <Plus size={14} />
                      Buat Clan
                    </Link>
                    <Link
                      to="/discover-clans"
                      className="flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-xs font-bold text-indigo-100 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Search size={14} />
                      Cari Clan
                    </Link>
                  </div>
                </>
              )}
            </GlassCard>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Daily Missions</h2>
              <Link to="/missions" className="text-sm text-indigo-200 hover:text-white">
                Lihat semua
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {dailyMissions.map((mission) => (
                <MissionCard key={mission.title} {...mission} />
              ))}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="space-y-4 xl:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Achievement Showcase</h2>
                <Link to="/achievements" className="text-sm text-indigo-200 hover:text-white">
                  Lihat koleksi
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {achievements.map((achievement) => (
                  <AchievementBadge key={achievement.title} {...achievement} />
                ))}
              </div>
            </div>
            {leaderboardLoading ? (
              <SkeletonCard />
            ) : leaderboardError ? (
              <GlassCard>
                <p className="text-sm font-semibold text-white">Leaderboard unavailable</p>
                <p className="mt-2 text-sm text-indigo-100/75">{leaderboardError}</p>
              </GlassCard>
            ) : (
              <LeaderboardCard items={leaderboardItems} />
            )}
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Continue Reading Queue</h2>
                <Link to="/readings" className="text-sm text-indigo-200 hover:text-white">
                  Buka library
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <ReadingCard title="Logika Argumentasi di Media Sosial" category="Critical Reading" progress={82} />
                <ReadingCard title="Analisis Data dan Klaim Statistik" category="Data Literacy" progress={41} />
              </div>
            </div>

            <GlassCard>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Activity Feed</h2>
                <Link to="/discussion-test" className="text-xs text-indigo-200 hover:text-white">
                  Buka forum
                </Link>
              </div>

              {activities.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 p-4 text-sm text-indigo-100/70">
                  Belum ada aktivitas baru. Coba selesaikan misi hari ini.
                </div>
              ) : (
                <ul className="space-y-3">
                  {activities.map((activity) => {
                    const Icon = iconForActivity(activity.type);

                    return (
                      <li key={activity.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <p className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Icon size={16} className="text-indigo-100/90" aria-hidden="true" />
                          {activity.title}
                        </p>
                        <p className="mt-1 text-xs text-indigo-100/70">{activity.timestamp}</p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </GlassCard>
          </section>
        </main>
      </div>
    </div>
  );
}
