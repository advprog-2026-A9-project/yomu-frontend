import { Link } from 'react-router-dom';
import { Award, MessageSquare, Shield, Target, Plus, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard, ProgressBar, SkeletonCard } from '../../components/common/UI';
import MissionCard from '../../components/gamification/MissionCard';
import AchievementBadge from '../../components/gamification/AchievementBadge';
import ReadingCard from '../../components/reading/ReadingCard';
import LeaderboardCard from '../../components/social/LeaderboardCard';
import { getLeaderboard, getMyClan, MyClanResponse } from '../../services/socialAPI';
import { useAuth } from '../../context/AuthContext';
import { getTodayMissions, getMyAchievements, DailyMissionProgress, AchievementProgress } from '../../services/gamificationAPI';

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

// Hardcoded activity feed remains for now as backend doesn't have it yet

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
  const { user } = useAuth();
  const [myClan, setMyClan] = useState<MyClanResponse | null>(null);
  const [clanLoading, setClanLoading] = useState(true);
  const [leaderboardItems, setLeaderboardItems] = useState<LeaderboardItem[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  const [missions, setMissions] = useState<DailyMissionProgress[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);
  const [myAchievements, setMyAchievements] = useState<AchievementProgress[]>([]);
  const [achievementsLoading, setAchievementsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;

      try {
        setClanLoading(true);
        setLeaderboardLoading(true);
        setMissionsLoading(true);
        setAchievementsLoading(true);

        const [clanData, leaderboardData, missionData, achievementData] = await Promise.all([
          getMyClan(),
          getLeaderboard(),
          getTodayMissions(user.userId),
          getMyAchievements(user.userId)
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
        setMissions(missionData);
        setMyAchievements(achievementData);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
        setLeaderboardError(err instanceof Error ? err.message : 'Gagal memuat data');
      } finally {
        setClanLoading(false);
        setLeaderboardLoading(false);
        setMissionsLoading(false);
        setAchievementsLoading(false);
      }
    };
    fetchData();
  }, [user?.userId]);

  const isLoadingAny = clanLoading || missionsLoading || achievementsLoading || leaderboardLoading || parentLoading;

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
            {isLoadingAny ? (
              <div className="h-6 w-20 animate-pulse rounded-lg bg-white/10" />
            ) : (
              <span className="yomu-badge">Streak 14 hari</span>
            )}
          </div>
        </header>

        <main className="space-y-6">
          <section className="grid gap-4 xl:grid-cols-3">
            <GlassCard className="xl:col-span-2 min-h-[160px] flex flex-col justify-between">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs text-indigo-100/70">Continue Reading</p>
                  {isLoadingAny ? (
                    <div className="mt-3 space-y-3">
                      <div className="h-8 w-2/3 animate-pulse rounded-lg bg-white/10" />
                      <div className="space-y-2">
                        <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="mt-1 text-xl font-bold">Mendeteksi Bias dalam Artikel Berita</h2>
                      <p className="mt-2 max-w-xl text-sm text-indigo-100/80">
                        Lanjutkan bacaan terakhirmu. Fokus hari ini: membedakan fakta, opini, dan framing informasi.
                      </p>
                    </>
                  )}
                </div>
                {!isLoadingAny && (
                  <Link to="/readings" className="yomu-button-primary">
                    Continue
                  </Link>
                )}
              </div>
              <div className="mt-5">
                {isLoadingAny ? (
                  <div className="h-2 w-full animate-pulse rounded-full bg-white/10" />
                ) : (
                  <ProgressBar value={68} />
                )}
              </div>
            </GlassCard>

            <GlassCard className="min-h-[160px] flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-indigo-100/70">Clan Status</p>
                {myClan && <Shield size={14} className="text-indigo-300" />}
              </div>

              {clanLoading ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="h-7 w-1/2 animate-pulse rounded-lg bg-white/10" />
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-9 w-full animate-pulse rounded-lg bg-white/10" />
                    <div className="h-9 w-full animate-pulse rounded-lg bg-white/10" />
                  </div>
                </div>
              ) : myClan ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white truncate">{myClan.name}</h3>
                    <p className="mt-2 text-sm text-indigo-100/80 truncate">
                      {myClan.role === 'KETUA' ? 'Leader' : 'Member'} • {myClan.members?.length || 0} Anggota
                    </p>
                  </div>
                  <div className="mt-4">
                    <Link
                      to="/clan"
                      className="text-xs font-bold uppercase tracking-wider text-indigo-200 hover:text-white transition-colors"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white/90">Belum Ada Clan</h3>
                    <p className="mt-1 text-xs text-indigo-100/70">Bergabunglah untuk naik liga.</p>
                  </div>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      to="/discover-clans"
                      className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500/20 py-2 text-xs font-bold text-indigo-100 border border-indigo-400/30 hover:bg-indigo-500/30 transition-all"
                    >
                      Jelajahi Clan
                    </Link>
                    <Link
                      to="/clan/create"
                      className="flex items-center justify-center gap-2 rounded-lg bg-indigo-500/20 py-2 text-xs font-bold text-indigo-100 border border-indigo-400/30 hover:bg-indigo-500/30 transition-all"
                    >
                      <Plus size={14} />
                      Buat Clan
                    </Link>
                  </div>
                </div>
              )}
            </GlassCard>
          </section>

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-bold">Daily Missions</h2>
              <p className="text-xs text-indigo-100/50">Selesaikan tugas harian untuk mendapatkan poin clan.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {missionsLoading ? (
                <>
                  <SkeletonCard className="h-40" key="mission-s1" />
                  <SkeletonCard className="h-40" key="mission-s2" />
                  <SkeletonCard className="h-40" key="mission-s3" />
                </>
              ) : missions.length === 0 ? (
                <div className="lg:col-span-3 rounded-2xl border border-dashed border-white/10 p-8 text-center text-indigo-100/40">
                  Belum ada misi aktif hari ini.
                </div>
              ) : (
                missions.map((mission) => (
                  <MissionCard
                    key={mission.dailyMissionId}
                    title={mission.dailyMissionName}
                    description={mission.milestone}
                    reward={mission.rewardDescription}
                    progress={mission.targetCount > 0 ? Math.min(100, Math.round((mission.progressValue / mission.targetCount) * 100)) : 0}
                  />
                ))
              )}
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
                {achievementsLoading ? (
                  <>
                    <SkeletonCard className="h-28" key="ach-s1" />
                    <SkeletonCard className="h-28" key="ach-s2" />
                    <SkeletonCard className="h-28" key="ach-s3" />
                  </>
                ) : myAchievements.length === 0 ? (
                  <div className="md:col-span-3 rounded-2xl border border-dashed border-white/10 p-6 text-center text-indigo-100/40">
                    Belum ada achievement yang terbuka.
                  </div>
                ) : (
                  myAchievements
                    .filter(a => a.unlocked)
                    .slice(0, 3)
                    .map((achievement) => (
                      <AchievementBadge
                        key={achievement.achievementId}
                        title={achievement.achievementName}
                        rarity={achievement.milestoneThreshold >= 100 ? 'Diamond' : achievement.milestoneThreshold >= 50 ? 'Gold' : 'Silver'}
                        description={achievement.milestone}
                      />
                    ))
                )}
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

            <GlassCard className="min-h-[280px] flex flex-col">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Activity Feed</h2>
                <Link to="/discussion-test" className="text-xs text-indigo-200 hover:text-white">
                  Buka forum
                </Link>
              </div>

              <div className="flex-1">
                {isLoadingAny ? (
                  <ul className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 animate-pulse">
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded bg-white/20" />
                          <div className="h-4 w-2/3 rounded bg-white/20" />
                        </div>
                        <div className="mt-2 h-3 w-24 rounded bg-white/10" />
                      </li>
                    ))}
                  </ul>
                ) : activities.length === 0 ? (
                  <div className="h-full flex items-center justify-center rounded-xl border border-dashed border-white/20 p-4 text-center text-sm text-indigo-100/40">
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
              </div>
            </GlassCard>
          </section>
        </main>
      </div>
    </div>
  );
}
