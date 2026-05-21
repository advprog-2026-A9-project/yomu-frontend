import { Link } from 'react-router-dom';
import { Award, MessageSquare, Shield, Target, Plus, BookOpen, type LucideIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard, SkeletonCard } from '../../components/common/UI';
import MissionCard from '../../components/gamification/MissionCard';
import { getMyClan, MyClanResponse } from '../../services/socialAPI';
import { useAuth } from '../../context/AuthContext';
import { getTodayMissions, DailyMissionProgress } from '../../services/gamificationAPI';
import { getAllTexts } from '../../services/readingAPI'; // Pastikan fungsi ini tersedia di API service kamu

type Activity = {
  title: string;
  timestamp: string;
  type: 'achievement' | 'mission' | 'clan' | 'forum';
};

// Hardcoded activity feed sementara karena backend event belum fully integrated
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

  // States
  const [myClan, setMyClan] = useState<MyClanResponse | null>(null);
  const [clanLoading, setClanLoading] = useState(true);

  const [missions, setMissions] = useState<DailyMissionProgress[]>([]);
  const [missionsLoading, setMissionsLoading] = useState(true);

  const [recentReadings, setRecentReadings] = useState<any[]>([]);
  const [readingsLoading, setReadingsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.username) return;

      try {
        setClanLoading(true);
        setMissionsLoading(true);
        setReadingsLoading(true);

        // Fetch semua data secara paralel agar loading lebih cepat
        const [clanData, missionData, readingsData] = await Promise.all([
          getMyClan().catch(() => null),
          getTodayMissions(user.username).catch(() => []),
          getAllTexts().catch(() => []) // Fetch data bacaan terbaru dari backend
        ]);

        setMyClan(clanData);
        setMissions(missionData);

        // Ambil maksimal 3 bacaan terbaru (diasumsikan array dibalik atau sudah terurut dari backend)
        setRecentReadings(readingsData ? readingsData.slice(0, 3) : []);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setClanLoading(false);
        setMissionsLoading(false);
        setReadingsLoading(false);
      }
    };

    fetchData();
  }, [user?.username]);

  const isLoadingAny = clanLoading || missionsLoading || readingsLoading || parentLoading;

  return (
      <div className="yomu-shell yomu-grid-noise lg:flex">
        <Sidebar username={username} />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Header */}
          <header className="yomu-glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-indigo-100/70">Welcome back</p>
              <h1 className="text-2xl font-bold text-white">Welcome back, {username} 👋</h1>
            </div>
          </header>

          <main className="space-y-6">

            {/* Baris 1: Clan Status & Activity Feed */}
            <section className="grid gap-4 xl:grid-cols-3">
              {/* Clan Status (1 Kolom) */}
              <GlassCard className="xl:col-span-1 min-h-[160px] flex flex-col">
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
                      <div className="space-y-2 mt-4">
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

              {/* Activity Feed (2 Kolom) */}
              <GlassCard className="xl:col-span-2 min-h-[160px] flex flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold">Activity Feed</h2>
                  <Link to="/forum" className="text-xs text-indigo-200 hover:text-white transition-colors">
                    Buka forum →
                  </Link>
                </div>

                <div className="flex-1">
                  {isLoadingAny ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-3 animate-pulse">
                              <div className="h-4 w-1/2 rounded bg-white/20 mb-2" />
                              <div className="h-3 w-1/4 rounded bg-white/10" />
                            </div>
                        ))}
                      </div>
                  ) : (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {activities.map((activity) => {
                          const Icon = iconForActivity(activity.type);
                          return (
                              <div key={activity.title} className="rounded-xl border border-white/10 bg-white/5 p-3 flex flex-col justify-center">
                                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                                  <Icon size={16} className="text-indigo-100/90 shrink-0" />
                                  <span className="truncate">{activity.title}</span>
                                </p>
                                <p className="mt-1 text-xs text-indigo-100/70 ml-6">{activity.timestamp}</p>
                              </div>
                          );
                        })}
                      </div>
                  )}
                </div>
              </GlassCard>
            </section>

            {/* Baris 2: Bacaan Terbaru */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Bacaan Terbaru</h2>
                  <p className="text-xs text-indigo-100/50 mt-1">Eksplorasi literasi dan asah pemahamanmu.</p>
                </div>
                <Link to="/readings" className="text-sm font-semibold text-indigo-300 hover:text-white transition-colors">
                  Lihat semua modul →
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {readingsLoading ? (
                    <>
                      <SkeletonCard className="h-40" key="reading-s1" />
                      <SkeletonCard className="h-40" key="reading-s2" />
                      <SkeletonCard className="h-40" key="reading-s3" />
                    </>
                ) : recentReadings.length === 0 ? (
                    <div className="lg:col-span-3 rounded-2xl border border-dashed border-white/10 p-8 text-center text-indigo-100/40">
                      Belum ada bacaan tersedia di sistem saat ini.
                    </div>
                ) : (
                    recentReadings.map((reading) => (
                        <GlassCard
                            key={reading.id}
                            className="flex flex-col justify-between group hover:border-indigo-400/40 transition-all"
                        >
                          <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                        {reading.category?.name || 'Reading'}
                      </span>
                            <h3 className="mt-2 text-lg font-bold text-white line-clamp-2 group-hover:text-indigo-100 transition-colors">
                              {reading.title}
                            </h3>
                          </div>
                          <div className="mt-6">
                            <Link
                                to={`/readings/${reading.id}`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500/20 py-2.5 text-sm font-bold text-indigo-100 border border-indigo-500/30 hover:bg-indigo-500/40 transition-all"
                            >
                              <BookOpen size={16} />
                              Mulai Membaca
                            </Link>
                          </div>
                        </GlassCard>
                    ))
                )}
              </div>
            </section>

            {/* Baris 3: Daily Missions */}
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

          </main>
        </div>
      </div>
  );
}