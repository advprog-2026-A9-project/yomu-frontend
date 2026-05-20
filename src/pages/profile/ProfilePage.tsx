import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Shield,
  Award,
  Trophy,
  BookOpen,
  Calendar,
  GraduationCap,
  CheckCircle2,
  Pencil,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import { TierBadge } from '../../components/common/UI';
import { getUserProfile, updateMyBio, UserProfile, updateMyProfile, } from '../../services/profileAPI';

const TIER_STYLES: Record<
  string,
  {
    cardClass: string;
    iconClass: string;
    iconColor: string;
  }
> = {
  BRONZE: {
    cardClass: 'tier-bronze',
    iconClass: 'border-amber-700/35 bg-amber-950/20',
    iconColor: '#b45309',
  },
  SILVER: {
    cardClass: 'tier-silver',
    iconClass: 'border-slate-500/35 bg-slate-950/20',
    iconColor: '#cbd5e1',
  },
  GOLD: {
    cardClass: 'tier-gold',
    iconClass: 'border-amber-500/35 bg-amber-950/20',
    iconColor: '#fbbf24',
  },
  DIAMOND: {
    cardClass: 'tier-diamond',
    iconClass: 'border-cyan-500/35 bg-cyan-950/20',
    iconColor: '#22d3ee',
  },
  MYTHIC: {
    cardClass: 'tier-mythic',
    iconClass: 'border-purple-500/40 bg-purple-950/30',
    iconColor: '#c084fc',
  },
  GODLIKE: {
    cardClass: 'tier-godlike',
    iconClass: 'border-red-500/50 bg-red-950/40',
    iconColor: '#f43f5e',
  },
};

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuth();

  const profileUserId = userId || 'me';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Bio editing states
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState('');
  const [savingBio, setSavingBio] = useState(false);
  const [bioError, setBioError] = useState<string | null>(null);

  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState('');
  const [tempOldPassword, setTempOldPassword] = useState('');
  const [tempNewPassword, setTempNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserProfile(profileUserId);
        if (active) {
          setProfile(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err.message || 'Gagal mengambil data profil');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      active = false;
    };
  }, [profileUserId]);

  const handleSaveBio = async () => {
    if (tempBio.length > 100) {
      setBioError('Bio tidak boleh lebih dari 100 karakter');
      return;
    }
    try {
      setSavingBio(true);
      setBioError(null);
      const updated = await updateMyBio(tempBio);
      setProfile(updated);
      setIsEditingBio(false);
    } catch (err: any) {
      setBioError(err.message || 'Gagal memperbarui bio');
    } finally {
      setSavingBio(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setProfileError(null);
      await updateMyProfile({
        displayName: tempDisplayName !== profile?.displayName ? tempDisplayName : undefined,
        oldPassword: tempOldPassword || undefined,
        newPassword: tempNewPassword || undefined,
      });
      const updated = await getUserProfile('me');
      setProfile(updated);
      setIsEditingProfile(false);
      setTempOldPassword('');
      setTempNewPassword('');
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Gagal memperbarui profil');
    } finally {
      setSavingProfile(false);
    }
  };

  if (loading) {
    return (
      <div className="yomu-shell yomu-grid-noise lg:flex">
        <Sidebar username={user?.username || 'Pelajar'} />

        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Header Skeleton */}
          <header className="yomu-glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 animate-pulse">
            <div className="space-y-2">
              <div className="h-3 w-16 bg-white/5 rounded" />
              <div className="h-6 w-32 bg-white/10 rounded-lg" />
            </div>
            <div className="h-7 w-40 bg-white/5 rounded-xl" />
          </header>

          <main className="space-y-6">
            {/* Hero Skeleton */}
            <div className="yomu-glass rounded-2xl p-6 sm:p-8 animate-pulse flex flex-col md:flex-row items-center gap-8">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-white/5 border border-white/10" />
              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-white/5 rounded-lg" />
                  <div className="h-4 w-24 bg-white/5 rounded-lg" />
                </div>
                <div className="h-12 w-full max-w-2xl bg-white/5 rounded-lg" />
                <div className="flex gap-4">
                  <div className="h-6 w-32 bg-white/5 rounded-lg" />
                </div>
              </div>
            </div>

            {/* Stats & Clan Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 flex flex-col space-y-4">
                <div className="h-6 w-36 bg-white/5 rounded-lg animate-pulse" />
                <div className="yomu-glass rounded-2xl p-6 sm:p-8 flex-1 min-h-[146px] bg-white/5 animate-pulse" />
              </div>
              <div className="lg:col-span-2 flex flex-col space-y-4">
                <div className="h-6 w-36 bg-white/5 rounded-lg animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
                  <div className="yomu-glass rounded-2xl p-6 min-h-[146px] bg-white/5 animate-pulse" />
                  <div className="yomu-glass rounded-2xl p-6 min-h-[146px] bg-white/5 animate-pulse" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="yomu-shell yomu-grid-noise lg:flex">
        <Sidebar username={user?.username || 'Pelajar'} />

        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="yomu-glass rounded-2xl p-6 sm:p-8 max-w-md w-full text-center space-y-6 border-red-500/10">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
              !
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Gagal Memuat Profil</h2>
              <p className="text-sm text-indigo-100/60 leading-relaxed">
                {error || 'Terjadi kesalahan saat memuat data profil. Silakan coba beberapa saat lagi.'}
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="yomu-button-primary w-full py-2.5"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwnProfile = user && (profileUserId === 'me' || profile.userId === user.userId || profile.username === user.username);

  return (
    <div className="yomu-shell yomu-grid-noise lg:flex">
      {/* Sidebar navigation */}
      <Sidebar username={user?.username || 'Pelajar'} />

      {/* Main Profile Layout */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">

        {/* Header */}
        <header className="yomu-glass mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-indigo-100/70">User Profile</p>
            <h1 className="text-2xl font-bold text-white">Profil Pengguna</h1>
          </div>
        </header>

        <main className="space-y-6">
          {/* 1. Profile Hero Section */}
          <section className="yomu-glass rounded-2xl p-6 sm:p-8 relative overflow-hidden animate-fade-rise">
            {/* Futuristic background gradients */}
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-indigo-600/10 blur-[80px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-pink-500/5 blur-[80px] rounded-full" />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              {/* Avatar block with premium pulse and border rings */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-2xl blur-md opacity-40 animate-pulse" />
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-slate-900 border border-white/20 flex items-center justify-center font-black text-4xl text-transparent bg-clip-text bg-gradient-to-tr from-indigo-200 to-pink-200 shadow-2xl">
                  {(profile.displayName || profile.username).substring(0, 2).toUpperCase()}

                  {/* Micro-sparkle decor */}
                  <div className="absolute -top-1 -right-1 bg-indigo-500 text-white rounded-full p-1 border border-slate-900">
                    <GraduationCap size={14} />
                  </div>
                </div>
              </div>

              {/* Profile Info block */}
              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none flex flex-wrap items-center justify-center md:justify-start gap-3">
                      {profile.displayName || profile.username}
                    </h1>
                    <p className="text-sm font-semibold text-indigo-400">
                      @{profile.username}
                    </p>
                  </div>
                </div>

                {isEditingBio ? (
                  <div className="space-y-3 w-full max-w-2xl mx-auto md:mx-0">
                    <textarea
                      value={tempBio}
                      onChange={(e) => {
                        setTempBio(e.target.value);
                        setBioError(null);
                      }}
                      placeholder="Tulis bio singkat Anda di sini..."
                      maxLength={100}
                      className="w-full min-h-[80px] p-3 text-sm text-indigo-100 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 resize-none transition-colors"
                    />
                    {bioError && (
                      <p className="text-xs text-red-400 font-semibold">{bioError}</p>
                    )}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className={tempBio.length > 100 ? 'text-red-400' : 'text-indigo-300/40'}>
                        {tempBio.length}/100
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditingBio(false)}
                          className="flex items-center gap-1 bg-white/5 border border-white/5 hover:bg-white/10 text-indigo-200/70 hover:text-white px-3 py-1.5 rounded-xl transition-all"
                          disabled={savingBio}
                        >
                          <X size={12} />
                          <span>Batal</span>
                        </button>
                        <button
                          onClick={handleSaveBio}
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-50"
                          disabled={savingBio || tempBio.length > 100}
                        >
                          {savingBio ? (
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                          <span>{savingBio ? 'Menyimpan...' : 'Simpan'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base text-indigo-100/70 max-w-2xl leading-relaxed mx-auto md:mx-0">
                      {profile.bio || 'Belum ada bio singkat.'}
                    </p>
                    {isOwnProfile && (
                      <div className="flex justify-center md:justify-start">
                        <button
                          onClick={() => {
                            setTempBio(profile.bio || '');
                            setIsEditingBio(true);
                            setBioError(null);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 px-3 py-1.5 transition-all mt-1"
                          title="Edit Bio"
                        >
                          <Pencil size={12} />
                          <span>Edit Bio</span>
                        </button>
                        <button
                          onClick={() => {
                            setTempDisplayName(profile.displayName);
                            setIsEditingProfile(true);
                            setProfileError(null);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 px-3 py-1.5 transition-all mt-1 ml-2"
                          title="Edit Profil"
                        >
                          <Pencil size={12} />
                          <span>Edit Profil</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-semibold text-indigo-200/50 pt-1">
                  <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl px-3 py-1.5">
                    <Calendar size={14} className="text-indigo-400" />
                    <span>Bergabung {profile.joinedDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {isEditingProfile && (
            <section className="yomu-glass rounded-2xl p-6 sm:p-8 space-y-4 animate-fade-rise">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Pencil size={18} className="text-indigo-400" />
                Edit Profil
              </h2>

              {profileError && (
                <p className="text-xs text-red-400 font-semibold">{profileError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-indigo-200/70">Display Name</label>
                  <input
                    type="text"
                    value={tempDisplayName}
                    onChange={(e) => setTempDisplayName(e.target.value)}
                    className="w-full p-3 text-sm text-indigo-100 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-indigo-200/70">Password Lama</label>
                  <input
                    type="password"
                    value={tempOldPassword}
                    onChange={(e) => setTempOldPassword(e.target.value)}
                    placeholder="Isi jika ingin ganti password"
                    className="w-full p-3 text-sm text-indigo-100 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-indigo-200/70">Password Baru</label>
                  <input
                    type="password"
                    value={tempNewPassword}
                    onChange={(e) => setTempNewPassword(e.target.value)}
                    placeholder="Isi jika ingin ganti password"
                    className="w-full p-3 text-sm text-indigo-100 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex items-center gap-1 bg-white/5 border border-white/5 hover:bg-white/10 text-indigo-200/70 hover:text-white px-3 py-1.5 rounded-xl transition-all text-xs font-semibold"
                  disabled={savingProfile}
                >
                  <X size={12} />
                  <span>Batal</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-xs font-semibold disabled:opacity-50"
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={12} />
                  )}
                  <span>{savingProfile ? 'Menyimpan...' : 'Simpan'}</span>
                </button>
              </div>
            </section>
          )}

          {/* 2. Stats Grid & Clan Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column: Clan Card */}
            <div className="lg:col-span-1 flex flex-col space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield size={18} className="text-indigo-400" />
                Clan
              </h2>

              {profile.clanName ? (
                <div className="yomu-glass rounded-2xl p-6 border-white/5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between flex-1 min-h-[146px] animate-fade-rise relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="flex items-center justify-between relative z-10">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                      <Shield size={20} />
                    </div>
                    <TierBadge tier={profile.clanTier!} />
                  </div>

                  <div className="space-y-0.5 relative z-10">
                    <h3 className="font-extrabold text-white text-lg tracking-tight group-hover:text-indigo-300 transition-colors truncate">
                      {profile.clanName}
                    </h3>
                    <p className="text-xs font-semibold text-indigo-200/50">Nama Clan</p>
                  </div>
                </div>
              ) : (
                <div className="yomu-glass rounded-2xl p-6 border-white/5 text-center flex-1 min-h-[146px] flex flex-col justify-center items-center space-y-2 animate-fade-rise">
                  <Shield size={28} className="text-indigo-100/20" />
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-white text-sm">Belum Ada Clan</h3>
                    <p className="text-[10px] text-indigo-100/50 max-w-[180px] mx-auto leading-normal">
                      User ini belum bergabung ke clan manapun saat ini.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Statistics Grid */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Trophy size={18} className="text-amber-400" />
                Statistik Membaca
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">

                {/* Stat 1 */}
                <div className="yomu-glass rounded-2xl p-6 border-white/5 hover:border-white/10 transition-colors animate-fade-rise flex flex-col justify-between">
                  <div className="text-indigo-400 bg-indigo-500/10 p-2 w-fit rounded-lg mb-4">
                    <BookOpen size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-white">{profile.readingStats.completedTexts}</p>
                    <p className="text-xs font-semibold text-indigo-200/50">Teks Selesai Dibaca</p>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="yomu-glass rounded-2xl p-6 border-white/5 hover:border-white/10 transition-colors animate-fade-rise flex flex-col justify-between" style={{ animationDelay: '0.1s' }}>
                  <div className="text-emerald-400 bg-emerald-500/10 p-2 w-fit rounded-lg mb-4">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-3xl font-black text-white">{profile.readingStats.quizAccuracy}%</p>
                    <p className="text-xs font-semibold text-indigo-200/50">Rata-rata Akurasi Kuis</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* 3. Showcase Achievements Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Award size={18} className="text-pink-400" />
                Achievements
              </h2>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            {profile.showcaseAchievements.length === 0 ? (
              <div className="yomu-glass rounded-2xl p-6 sm:p-8 text-center text-indigo-100/40 border-white/5 py-12 italic">
                User ini belum menyematkan achievement.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.showcaseAchievements.map((ach, idx) => {
                  const styles = TIER_STYLES[ach.tier] || TIER_STYLES.BRONZE;

                  return (
                    <div
                      key={ach.id}
                      className={`ach-card relative overflow-hidden rounded-2xl border bg-white/[0.04] p-6 backdrop-blur-md unlocked ${styles.cardClass} showcased border-amber-400/60 shadow-[0_0_25px_rgba(255,198,74,0.15)] ring-1 ring-amber-400/20 group flex items-start gap-4 animate-fade-rise`}
                      style={{ animationDelay: `${idx * 0.1}s` }}
                    >
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border relative z-10 transition-transform duration-300 group-hover:scale-110 ${styles.iconClass}`}>
                        <Trophy size={20} color={styles.iconColor} />
                      </div>

                      <div className="space-y-1 relative z-10 min-w-0 flex-1">
                        <h3 className="font-extrabold text-white text-sm group-hover:text-indigo-200 transition-colors truncate">
                          {ach.name}
                        </h3>
                        <p className="text-xs text-indigo-100/50 font-medium">
                          {ach.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>

      </div>
    </div>
  );
};

export default ProfilePage;
