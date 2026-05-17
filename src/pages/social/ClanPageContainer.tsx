import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getMyClan,
  getClanDetail,
  leaveClan,
  deleteClan,
  kickMember,
  getClanRequests,
  acceptClanRequest,
  rejectClanRequest,
  rejectAllClanRequests,
  seedClanRequests,
  ClanJoinRequestResponse
} from '../../services/socialAPI';
import ClanPage, { Clan } from './ClanPage';
import { SkeletonCard } from '../../components/common/UI';
import Sidebar from '../../components/common/Sidebar';

const ClanPageContainer: React.FC = () => {
  const { user, loading: authLoading, setClanInfo } = useAuth();
  const navigate = useNavigate();

  const [clan, setClan] = useState<Clan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requests, setRequests] = useState<ClanJoinRequestResponse[]>([]);
  const [totalRequests, setTotalRequests] = useState<number>(0);

  const fetchClanData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // First, get the summary to check if user has a clan
      const summary = await getMyClan();

      if (summary && summary.id) {
        // If has clan, fetch full details
        const detail = await getClanDetail(summary.id);

        // Map backend detail to frontend Clan interface
        const mappedClan: Clan = {
          id: detail.id,
          name: detail.name,
          description: detail.description,
          leaderUserId: detail.leaderUserId,
          tier: detail.tier.toUpperCase() as any,
          rank: detail.rank,
          score: detail.score,
          memberCount: detail.memberCount,
          maxMembers: detail.maxMembers,
          members: detail.members.map(m => ({
            ...m,
            role: m.role as any
          })),
          activeBuffs: detail.activeBuffs,
          debuffs: detail.debuffs
        };

        setClan(mappedClan);

        if (detail.leaderUserId === user.userId) {
          const fetchedRequests = await getClanRequests(detail.id, 0, 50); // Fetch first 50 requests
          setRequests(fetchedRequests.content);
          setTotalRequests(fetchedRequests.totalElements);
        }
      } else {
        setClan(null);
        setRequests([]);
        setTotalRequests(0);
      }
    } catch (err) {
      console.error("Error fetching clan data:", err);
      setError("Failed to load clan data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchClanData();
    }
  }, [user, authLoading]);

  const handleCreateClan = () => {
    navigate('/clan/create');
  };

  const handleDiscoverClans = () => {
    navigate('/discover-clans');
  };

  const handleEditClan = () => {
    if (clan) {
      navigate(`/clan/${clan.id}/edit`);
    }
  };

  const handleDeleteClan = async () => {
    if (!clan) return;

    try {
      await deleteClan({ id: clan.id });
      setClanInfo(null, null);
      setClan(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete clan");
    }
  };

  const handleLeaveClan = async () => {
    if (!clan) return;

    try {
      await leaveClan({ id: clan.id });
      setClanInfo(null, null);
      setClan(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to leave clan");
    }
  };

  if (authLoading || (loading && !error)) {
    return (
      <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
        <Sidebar username={user?.username || 'Pelajar'} />
        <div className="flex-1 p-6 space-y-6">
          <div className="h-48 w-full animate-pulse bg-white/5 rounded-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
        <Sidebar username={user?.username || 'Pelajar'} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="yomu-card max-w-md w-full text-center space-y-4">
            <h2 className="text-xl font-bold text-red-400">Error</h2>
            <p className="text-indigo-100/70">{error}</p>
            <button
              onClick={fetchClanData}
              className="yomu-button-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleKickMember = async (memberId: string) => {
    if (!clan) return;

    try {
      await kickMember(clan.id, memberId);
      fetchClanData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to kick member");
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    if (!clan) return;
    try {
      await acceptClanRequest(clan.id, requestId);
      fetchClanData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to accept request");
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    if (!clan) return;
    try {
      await rejectClanRequest(clan.id, requestId);
      fetchClanData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject request");
    }
  };

  const handleRejectAllRequests = async () => {
    if (!clan) return;
    try {
      await rejectAllClanRequests(clan.id);
      fetchClanData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject all requests");
    }
  };

  const handleSeedRequests = async () => {
    if (!clan) return;
    try {
      await seedClanRequests(clan.id, 100);
      fetchClanData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to seed requests");
    }
  };

  return (
    <ClanPage
      clan={clan}
      currentUserId={user?.userId || ''}
      username={user?.username || 'Pelajar'}
      onCreateClan={handleCreateClan}
      onDiscoverClans={handleDiscoverClans}
      onEditClan={handleEditClan}
      onDeleteClan={handleDeleteClan}
      onLeaveClan={handleLeaveClan}
      onKickMember={handleKickMember}
      requests={requests}
      totalRequests={totalRequests}
      onAcceptRequest={handleAcceptRequest}
      onRejectRequest={handleRejectRequest}
      onRejectAllRequests={handleRejectAllRequests}
      onSeedRequests={handleSeedRequests}
    />
  );
}

export default ClanPageContainer;
