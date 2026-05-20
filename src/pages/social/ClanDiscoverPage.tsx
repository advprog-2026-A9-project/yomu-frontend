import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Trophy,
  ChevronRight,
  Shield,
  Loader2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAllClans, joinClan, ClanResponse } from '../../services/socialAPI';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard, TierBadge, SkeletonCard } from '../../components/common/UI';

const ClanDiscoverPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clans, setClans] = useState<ClanResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);
  const [isRandom, setIsRandom] = useState(true);
  const previousQuery = useRef(searchQuery);

  const fetchClans = useCallback(async (query?: string, random: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllClans(query, random);
      setClans(data);
    } catch (err) {
      console.error("Error fetching clans:", err);
      setError("Failed to load clans. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch: 10 random clans
    fetchClans('', true);
  }, [fetchClans]);

  // Debounced search
  useEffect(() => {
    if (searchQuery === previousQuery.current) {
      return;
    }

    const timer = setTimeout(() => {
      previousQuery.current = searchQuery;
      if (searchQuery.trim().length === 0) {
        setIsRandom(true);
        fetchClans('', true);
      } else {
        setIsRandom(false);
        fetchClans(searchQuery, false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchClans]);

  const handleRefresh = () => {
    setSearchQuery('');
    previousQuery.current = '';
    setIsRandom(true);
    fetchClans('', true);
  };

  const handleJoin = async (clanId: string) => {
    try {
      setJoiningId(clanId);
      await joinClan({ id: clanId });
      setJoinSuccess(clanId);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to join clan");
    } finally {
      setJoiningId(null);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <AlertCircle size={48} className="text-red-400 opacity-50" />
          <p className="text-indigo-100/60">{error}</p>
          <button onClick={() => fetchClans(searchQuery, isRandom)} className="yomu-button-primary">Retry</button>
        </div>
      );
    }

    if (clans.length === 0) {
      if (searchQuery) {
        return (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 animate-fade-rise">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-indigo-100/20">
              <Search size={32} />
            </div>
            <div className="space-y-1">
              <p className="text-white font-bold text-lg">No results for "{searchQuery}"</p>
              <p className="text-indigo-100/60">Try different keywords or check for typos.</p>
            </div>
            <button onClick={() => setSearchQuery('')} className="text-indigo-400 text-sm font-bold hover:underline">
              Clear Search
            </button>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 animate-fade-rise">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400/50">
            <Shield size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">No Clans Available</h3>
            <p className="text-indigo-100/60 max-w-xs mx-auto">
              It looks like no one has created a clan yet. Start a new legacy today!
            </p>
          </div>
          <button
            onClick={() => navigate('/clan/create')}
            className="yomu-button-primary flex items-center gap-2"
          >
            Create the First Clan
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clans.map((clan) => (
          <GlassCard
            key={clan.id}
            className="group flex flex-col justify-between hover:border-indigo-500/30 transition-all animate-fade-rise cursor-pointer"
            onClick={() => navigate(`/clan/${clan.id}`)}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <TierBadge tier={clan.tier} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{clan.name}</h3>
                <p className="text-sm text-indigo-100/60 mt-1 line-clamp-2 min-h-[40px]">
                  {clan.description || "No description provided."}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Trophy size={14} />
                  {new Intl.NumberFormat().format(clan.score)}
                </div>
                <div className="flex items-center gap-1.5 text-indigo-300">
                  <Users size={14} />
                  {clan.memberCount} / 50
                </div>
              </div>
            </div>

            <div className="mt-6">
              {joinSuccess === clan.id ? (
                <div className="w-full py-3 flex items-center justify-center gap-2 text-emerald-400 font-bold bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <CheckCircle2 size={18} />
                  Request Sent
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJoin(clan.id);
                  }}
                  disabled={joiningId !== null || clan.memberCount >= 50}
                  className={`w-full py-3 flex items-center justify-center gap-2 group/btn rounded-xl font-bold transition-all ${clan.memberCount >= 50
                    ? 'bg-white/5 text-indigo-100/30 border border-white/5 cursor-not-allowed'
                    : 'yomu-button-secondary'
                    }`}
                >
                  {joiningId === clan.id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : clan.memberCount >= 50 ? (
                    <>Full Capacity</>
                  ) : (
                    <>
                      Join Clan
                      <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    );
  };

  return (
    <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
      <Sidebar username={user?.username || 'Pelajar'} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        <header className="space-y-4 animate-fade-rise">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Discover Clans</h1>
              <p className="text-indigo-100/60">
                {isRandom ? 'Showing random clans to join' : `Search results for "${searchQuery}"`}
              </p>
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-100/40" size={18} />
                <input
                  type="text"
                  placeholder="Search clans..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  maxLength={50}
                  className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 w-full md:w-64 transition-all"
                />
              </div>
              <button
                onClick={handleRefresh}
                title="Refresh random clans"
                className="bg-white/5 border border-white/10 p-2.5 rounded-xl text-indigo-100/60 hover:text-white transition-colors hover:bg-white/10"
              >
                <RefreshCcw size={18} className={loading && isRandom ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
};

export default ClanDiscoverPage;
