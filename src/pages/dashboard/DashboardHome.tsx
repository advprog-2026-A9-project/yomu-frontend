import { Link } from 'react-router-dom';
import { Award, MessageSquare, Shield, Target, Plus, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard, ProgressBar, SkeletonCard } from '../../components/common/UI';
import MissionCard from '../../components/gamification/MissionCard';
import ReadingCard from '../../components/reading/ReadingCard';
import { getMyClan, MyClanResponse } from '../../services/socialAPI';
import { useAuth } from '../../context/AuthContext';
import { getTodayMissions, DailyMissionProgress } from '../../services/gamificationAPI';

type Activity = {
  title: string;
  timestamp: string;
  type: 'achievement' | 'mission' | 'clan' | 'forum';
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

  const [missions, setMissions] = useState<DailyMissionProgress[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) return;

      try {
        setClanLoading(true);
        setMissionsLoading(true);

        const [clanData, missionData] = await Promise.all([
          getMyClan(),
          getTodayMissions(user.username),
        ]);

        setMyClan(clanData);
        setMissions(missionData);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setClanLoading(false);
        setMissionsLoading(false);
      }
    };
    fetchData();
  }, [user?.userId]);

  const isLoadingAny = clanLoading || missionsLoading || parentLoading;

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
            {/* Streak removed */}
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
                    reward={`${mission.rewardScore} Score`}
                    progress={(() => {
                      const target = mission.missionType === 'achieve_accuracy'
                        ? (mission.accuracyThreshold ?? 0)
                        : (mission.targetCount ?? 0);
                      return target > 0 ? Math.min(100, Math.round((mission.progressValue / target) * 100)) : 0;
                    })()}
                  />
                ))
              )}
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-3">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Continue Reading Queue</h2>
                <Link to="/readings" className="text-sm text-indigo-200 hover:text-white">
                  Buka library
                </Link>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ReadingCard title="Logika Argumentasi di Media Sosial" category="Critical Reading" progress={82} />
                <ReadingCard title="Analisis Data dan Klaim Statistik" category="Data Literacy" progress={41} />
                <ReadingCard title="Struktur Naratif dalam Jurnalisme" category="Literacy" progress={15} />
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-3">
              <GlassCard className="min-h-[200px] flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Activity Feed</h2>
                  <Link to="/forum" className="text-xs text-indigo-200 hover:text-white">
                    Buka forum
                  </Link>
                </div>

                <div className="flex-1">
                  {isLoadingAny ? (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 animate-pulse">
                          <div className="h-4 w-1/2 rounded bg-white/20 mb-2" />
                          <div className="h-3 w-1/4 rounded bg-white/10" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {activities.map((activity) => {
                        const Icon = iconForActivity(activity.type);
                        return (
                          <div key={activity.title} className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <p className="flex items-center gap-2 text-sm font-semibold text-white">
                              <Icon size={16} className="text-indigo-100/90" />
                              {activity.title}
                            </p>
                            <p className="mt-1 text-xs text-indigo-100/70">{activity.timestamp}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
