import { useState, useEffect, useCallback } from 'react';
import { Award, Lock, Unlock, Star, Trophy, Filter, Search, Inbox } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import { SectionHeader, SkeletonCard, SearchInput, Pagination } from '../../components/common/UI';
import { useAuth } from '../../context/AuthContext';
import { getMyAchievements, type AchievementProgress } from '../../services/gamificationAPI';
import { getShowcase, updateShowcase } from '../../services/gamificationAPI';
import './AchievementsPage.css';

const MAX_SHOWCASE = 3;
const PAGE_SIZE = 9;

type FilterMode = 'all' | 'unlocked' | 'locked';

export default function AchievementsPage() {
  const { user } = useAuth();
  const userId = user?.userId ?? '';

  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showcaseIds, setShowcaseIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const [achData, showcaseData] = await Promise.all([
          getMyAchievements(userId),
          getShowcase(userId).catch(() => [] as string[]),
        ]);
        if (!cancelled) { setAchievements(achData); setShowcaseIds(showcaseData); }
      } catch { /* empty state */ } finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const lockedCount = achievements.filter((a) => !a.unlocked).length;

  const filtered = achievements.filter((a) => {
    if (filter === 'unlocked' && !a.unlocked) return false;
    if (filter === 'locked' && a.unlocked) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.achievementName.toLowerCase().includes(q) || a.milestone.toLowerCase().includes(q);
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleFilterChange(f: FilterMode) { setFilter(f); setCurrentPage(1); }
  function handleSearchChange(q: string) {
    if (q.length <= 50) {
      setSearchQuery(q);
      setCurrentPage(1);
    }
  }

  const toggleShowcase = useCallback(async (achId: string) => {
    const isSelected = showcaseIds.includes(achId);
    let next: string[];
    if (isSelected) {
      next = showcaseIds.filter((id) => id !== achId);
    } else {
      if (showcaseIds.length >= MAX_SHOWCASE) { showToast(`Maksimal ${MAX_SHOWCASE} achievement`); return; }
      next = [...showcaseIds, achId];
    }
    setShowcaseIds(next);
    setSaving(true);
    try {
      await updateShowcase(userId, next);
      showToast(isSelected ? 'Dihapus dari showcase' : 'Ditambahkan ke showcase ✨');
    } catch { setShowcaseIds(showcaseIds); showToast('Gagal menyimpan'); }
    finally { setSaving(false); }
  }, [showcaseIds, userId]);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2500); }

  const showcaseAchs = showcaseIds
    .map((id) => achievements.find((a) => a.achievementId === id))
    .filter(Boolean) as AchievementProgress[];

  const filterBtns: { key: FilterMode; label: string; icon: typeof Filter; count: number }[] = [
    { key: 'all', label: 'Semua', icon: Filter, count: achievements.length },
    { key: 'unlocked', label: 'Unlocked', icon: Unlock, count: unlockedCount },
    { key: 'locked', label: 'Locked', icon: Lock, count: lockedCount },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar username={user?.username ?? ''} />

      <main className="yomu-grid-noise min-h-screen flex-1 p-4 sm:p-8">
        <div className="yomu-container">
          <SectionHeader
            eyebrow="Achievements"
            title="Koleksi Pencapaian"
            description="Kumpulkan pencapaian dan tampilkan 3 terbaik sebagai badge di profil kamu."
          />

          {/* ── Showcase banner ── */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/[0.06] to-indigo-500/[0.06] px-5 py-4">
            <div>
              <h3 className="flex items-center gap-1.5 text-[0.9375rem] font-extrabold text-white">
                <Star size={14} className="text-amber-300/70" />
                Profile Badge Showcase
              </h3>
              <p className="mt-1 text-[0.8125rem] text-indigo-100/60">
                {showcaseIds.length}/{MAX_SHOWCASE} slot terisi —{' '}
                {showcaseIds.length < MAX_SHOWCASE ? 'pilih achievement unlocked' : 'semua slot penuh'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {showcaseAchs.length > 0 ? (
                showcaseAchs.map((a) => (
                  <span
                    key={a.achievementId}
                    className="inline-flex max-w-[10rem] truncate rounded-full border border-amber-400/45 bg-gradient-to-br from-amber-400/[0.12] to-amber-400/[0.04] px-3 py-1 text-xs font-bold text-amber-300/95 transition hover:border-amber-400/60 hover:from-amber-400/[0.18]"
                  >
                    {a.achievementName}
                  </span>
                ))
              ) : (
                <span className="text-xs italic text-amber-300/40">Belum ada badge dipilih</span>
              )}
              {showcaseAchs.length > 0 && showcaseAchs.length < MAX_SHOWCASE && (
                <span className="inline-flex rounded-full border border-dashed border-amber-400/25 bg-amber-400/[0.03] px-3 py-1 text-xs font-semibold text-amber-300/45">
                  + Pilih lagi
                </span>
              )}
            </div>
          </div>

          {/* ── Search + Filters ── */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="min-w-[200px] max-w-xs flex-1">
              <SearchInput value={searchQuery} onChange={handleSearchChange} placeholder="Cari achievement..." />
            </div>
            <div className="flex flex-wrap gap-2">
              {filterBtns.map(({ key, label, icon: Icon, count }) => (
                <button
                  key={key}
                  id={`filter-${key}`}
                  onClick={() => handleFilterChange(key)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-semibold transition
                    ${filter === key
                      ? 'border-indigo-400/50 bg-gradient-to-br from-indigo-500/25 to-violet-500/25 text-indigo-100 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                      : 'border-white/12 bg-white/[0.04] text-indigo-100/70 hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon size={14} />
                  {label}
                  <span className={`inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1 text-[0.6875rem] font-bold ${filter === key ? 'bg-indigo-400/35' : 'bg-white/10'}`}>
                    {count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center">
              <div className="mb-4 flex justify-center opacity-20">
                {searchQuery ? <Search size={48} /> :
                  filter === 'unlocked' ? <Trophy size={48} /> :
                    filter === 'locked' ? <Lock size={48} /> :
                      <Inbox size={48} />}
              </div>
              <h3 className="text-lg font-bold text-white">
                {searchQuery ? 'Tidak ditemukan' : filter === 'unlocked' ? 'Belum ada yang unlocked' : filter === 'locked' ? 'Semua sudah di-unlock!' : 'Coming soon'}
              </h3>
              <p className="mt-1 text-[0.8125rem] text-indigo-100/50">
                {searchQuery
                  ? `Tidak ada achievement cocok dengan "${searchQuery}".`
                  : filter === 'unlocked' ? 'Mulai baca dan selesaikan kuis untuk membuka achievement.' : filter === 'locked' ? 'Keren! Kamu sudah mendapatkan semua.' : 'Under development'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {paginated.map((ach, idx) => (
                  <AchievementCard
                    key={ach.achievementId}
                    achievement={ach}
                    isShowcased={showcaseIds.includes(ach.achievementId)}
                    showcaseFull={showcaseIds.length >= MAX_SHOWCASE}
                    onToggleShowcase={() => toggleShowcase(ach.achievementId)}
                    saving={saving}
                    delay={idx * 60}
                  />
                ))}
              </div>
              <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </>
          )}
        </div>

        {toast && (
          <div className="ach-toast fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-green-400/30 bg-green-900/90 px-5 py-3 text-[0.8125rem] font-semibold text-green-200 shadow-xl backdrop-blur-sm">
            {toast}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Achievement Card ── */

function AchievementCard({
  achievement, isShowcased, showcaseFull, onToggleShowcase, saving, delay,
}: {
  achievement: AchievementProgress; isShowcased: boolean; showcaseFull: boolean;
  onToggleShowcase: () => void; saving: boolean; delay: number;
}) {
  const { unlocked, achievementName, milestone, milestoneType, progressValue, milestoneThreshold } = achievement;
  const pct = milestoneThreshold > 0 ? Math.min(100, (progressValue / milestoneThreshold) * 100) : 0;

  const cardBorder = isShowcased
    ? 'border-amber-400/40 shadow-[0_0_20px_rgba(255,198,74,0.06)]'
    : unlocked
      ? 'border-green-400/20'
      : 'border-white/10 opacity-65 hover:opacity-80';

  return (
    <div
      className={`ach-card ${unlocked ? 'unlocked' : ''} ${isShowcased ? 'showcased' : ''} relative overflow-hidden rounded-2xl border bg-white/[0.04] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-300/35 hover:bg-white/[0.07] ${cardBorder} animate-fade-rise`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Header */}
      <div className="mb-3 flex items-start gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${unlocked ? 'border-green-400/25 bg-gradient-to-br from-green-400/15 to-green-600/[0.08]' : 'border-white/10 bg-white/5'}`}>
          {unlocked ? <Trophy size={20} className="text-green-400" /> : <Lock size={20} className="text-indigo-100/35" />}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-[0.9375rem] font-bold leading-snug text-white">{achievementName}</h4>
          <p className="text-xs text-indigo-100/50">{milestoneType}</p>
        </div>
      </div>

      {/* Description */}
      <p className="mb-3 text-[0.8125rem] leading-relaxed text-indigo-100/65">{milestone}</p>

      {/* Progress */}
      <div className="mb-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className={`h-full rounded-full transition-all duration-500 ${unlocked ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-indigo-400 to-violet-400'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[0.6875rem] font-bold text-indigo-100/60">{progressValue}/{milestoneThreshold}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        {!unlocked ? (
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-indigo-100/45">
            Terkunci
          </span>
        ) : (
          <div /> // Spacer
        )}

        {unlocked && (
          <button
            onClick={onToggleShowcase}
            disabled={saving || (!isShowcased && showcaseFull)}
            title={isShowcased ? 'Hapus dari showcase' : showcaseFull ? 'Slot penuh' : 'Tampilkan di profil'}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.6875rem] font-bold transition disabled:cursor-not-allowed disabled:opacity-40
              ${isShowcased
                ? 'border-amber-400/60 bg-gradient-to-br from-amber-400/20 to-amber-400/10 text-amber-300'
                : 'border-amber-400/30 bg-amber-400/[0.06] text-amber-300/80 hover:border-amber-400/50 hover:bg-amber-400/[0.12]'
              }`}
          >
            <Award size={12} />
            {isShowcased ? 'Ditampilkan' : 'Tampilkan'}
          </button>
        )}
      </div>
    </div>
  );
}
