import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  ChartColumnBig,
  MessageSquareText,
  Shield,
  Target,
  type LucideIcon,
} from 'lucide-react';
import AchievementBadge from '../../components/gamification/AchievementBadge';
import { GlassCard, SectionHeader, TierBadge } from '../../components/common/UI';

const features = [
  { icon: BookOpen, title: 'Bacaan & Kuis', desc: 'Konten adaptif untuk melatih pemahaman dan analisis informasi.' },
  { icon: Award, title: 'Achievement System', desc: 'Badge berlapis rarity untuk menjaga konsistensi belajar.' },
  { icon: Target, title: 'Daily Missions', desc: 'Misi harian dengan poin tinggi dan streak booster.' },
  { icon: Shield, title: 'Clan & League', desc: 'Kolaborasi tim dan kompetisi antar clan.' },
  { icon: ChartColumnBig, title: 'Leaderboard', desc: 'Pantau ranking clan dan komunitas secara real-time.' },
  { icon: MessageSquareText, title: 'Forum Diskusi', desc: 'Diskusi kontekstual dengan nested reply yang terstruktur.' },
] as { icon: LucideIcon; title: string; desc: string }[];

const howItWorks = [
  'Pilih bacaan sesuai level dan minatmu',
  'Baca teks dengan mode fokus yang nyaman',
  'Kerjakan kuis analitik berbasis konteks',
  'Dapatkan poin dan achievement eksklusif',
  'Naik liga bersama clan dan rebut podium',
];

export default function LandingPage() {
  return (
    <div className="yomu-shell yomu-grid-noise pb-16">
      <header className="yomu-container pt-8">
        <nav className="yomu-glass flex items-center justify-between rounded-2xl px-4 py-3 sm:px-6">
          <div>
            <p className="text-xl font-black tracking-tight text-white">Yomu</p>
            <p className="text-xs text-indigo-100/70">Literasi berbasis gamifikasi</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="yomu-button-secondary px-4 py-2 text-xs sm:text-sm">
              Login
            </Link>
            <Link to="/register" className="yomu-button-primary px-4 py-2 text-xs sm:text-sm">
              Mulai Belajar
            </Link>
          </div>
        </nav>
      </header>

      <main className="yomu-container mt-12 space-y-20">
        <section className="grid items-center gap-8 lg:grid-cols-2">
          <div className="animate-fade-rise">
            <span className="yomu-badge">Platform Literasi Modern</span>
            <h1 className="yomu-title mt-4">Belajar membaca kritis dengan sistem gamifikasi sosial.</h1>
            <p className="yomu-subtitle mt-4 max-w-xl">
              Yomu menggabungkan pengalaman belajar yang engaging seperti game, komunitas kolaboratif seperti platform chat,
              dan tampilan fokus seperti workspace produktif.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="yomu-button-primary">
                Mulai Belajar
              </Link>
              <a href="#how-it-works" className="yomu-button-secondary">
                Lihat Demo
              </a>
            </div>
          </div>

          <div className="relative">
            <GlassCard className="relative overflow-hidden">
              <p className="text-xs text-indigo-100/70">Live Clan Preview</p>
              <h3 className="mt-2 text-xl font-bold text-white flex items-center gap-2">
                <Shield size={20} className="text-indigo-400" />
                Clan Aether
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-indigo-100/70">Clan Score</p>
                  <p className="text-2xl font-black text-white">42,840</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="text-xs text-indigo-100/70">Tier</p>
                  <p className="text-2xl font-black text-amber-400">Gold</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span>Leaderboard Clan</span>
                  <span>#2 / 48</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500" />
                </div>
              </div>
            </GlassCard>

            <div className="animate-float-up absolute -left-3 -top-4 rounded-xl border border-yellow-300/40 bg-yellow-300/20 px-3 py-2 text-xs font-semibold text-yellow-100">
              +150 Poin Daily Mission
            </div>
            <div className="animate-float-up absolute -bottom-5 right-3 rounded-xl border border-cyan-300/40 bg-cyan-300/20 px-3 py-2 text-xs font-semibold text-cyan-100 [animation-delay:700ms]">
              Clan Aether naik ke Silver
            </div>
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="Fitur Utama"
            title="Semua alat belajar kritis dalam satu ekosistem"
            description="Dirancang untuk pelajar dan admin dengan alur yang konsisten, progresif, dan terukur."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item) => (
              <GlassCard key={item.title} className="yomu-card-hover">
                <item.icon size={26} strokeWidth={2.1} className="text-indigo-100" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm text-indigo-100/80">{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="Gamification Engine"
            title="Poin, tier, buff, dan competition yang bikin belajar konsisten"
            description="Progression system dibuat transparan agar user paham target, reward, dan strategi belajar."
          />
          <div className="grid gap-4 lg:grid-cols-4">
            {(['Bronze', 'Silver', 'Gold', 'Diamond'] as const).map((tier) => (
              <GlassCard key={tier} className="space-y-3">
                <TierBadge tier={tier} />
                <p className="text-sm text-indigo-100/85">Tier {tier} membuka misi dan multiplier baru.</p>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"
                    style={{ width: tier === 'Bronze' ? '35%' : tier === 'Silver' ? '60%' : tier === 'Gold' ? '80%' : '100%' }}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader
            eyebrow="Social Learning"
            title="Belajar jadi lebih hidup lewat komunitas"
            description="Forum diskusi, nested replies, dan kolaborasi clan mengubah membaca jadi pengalaman sosial yang aktif."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            <GlassCard className="lg:col-span-2">
              <p className="text-sm font-semibold text-indigo-100">Forum Preview</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                  <p className="font-semibold">Apakah argumen penulis valid tanpa data pembanding?</p>
                  <p className="mt-1 text-sm text-indigo-100/75">12 komentar • 4 nested reply</p>
                </div>
                <div className="ml-6 rounded-xl border border-indigo-300/20 bg-indigo-300/10 p-3 text-sm text-indigo-50">
                  Menurutku tidak cukup valid, karena hanya satu sumber dan tidak ada counter-example.
                </div>
              </div>
            </GlassCard>
            <AchievementBadge
              title="Community Catalyst"
              rarity="Gold"
              description="Aktif memberi insight berkualitas dalam 7 diskusi berturut-turut."
            />
          </div>
        </section>

        <section id="how-it-works">
          <SectionHeader
            eyebrow="How It Works"
            title="Dari membaca sampai naik liga, semua terarah"
            description="Proses yang sederhana tapi penuh feedback loop agar engagement tetap tinggi."
          />
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {howItWorks.map((step, idx) => (
              <li key={step} className="yomu-card yomu-card-hover">
                <p className="text-xs text-indigo-200">Step {idx + 1}</p>
                <p className="mt-2 text-sm font-semibold">{step}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-indigo-200/20 bg-gradient-to-r from-indigo-600/30 to-violet-600/30 px-6 py-10 text-center shadow-2xl">
          <p className="yomu-badge">Siap Mulai?</p>
          <h3 className="mt-4 text-3xl font-extrabold">Bangun kebiasaan membaca kritis, satu misi per hari.</h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-indigo-100/90">
            Gabung ribuan pelajar yang sudah meningkatkan kemampuan analisis bacaan melalui sistem liga clan, achievement, dan komunitas.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="yomu-button-primary">
              Daftar Gratis
            </Link>
            <Link to="/login" className="yomu-button-secondary">
              Login Pelajar/Admin
            </Link>
          </div>
        </section>
      </main>

      <footer className="yomu-container mt-16">
        <div className="yomu-glass flex flex-col gap-6 rounded-2xl px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-black">Yomu</p>
            <p className="text-xs text-indigo-100/70">Belajar kritis, berkembang strategis.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-indigo-100/80">
            <Link to="/">Home</Link>
            <Link to="/readings">Bacaan</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/discussion-test">Forum</Link>
          </div>
          <p className="text-xs text-indigo-100/60">© {new Date().getFullYear()} Yomu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
