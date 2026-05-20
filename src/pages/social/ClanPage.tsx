import React, { useState } from 'react';
import {
  Shield,
  Users,
  Trophy,
  Edit2,
  LogOut,
  Trash2,
  Crown,
  AlertCircle,
  Plus,
  Search,
  UserMinus,
  Check,
  X
} from 'lucide-react';
import { TierBadge } from '../../components/common/UI';
import Sidebar from '../../components/common/Sidebar';
import { ClanJoinRequestResponse } from '../../services/socialAPI';
import { useNavigate } from 'react-router-dom';

// Types based on Backend DTOs
export interface ClanMember {
  username: string;
  role: 'KETUA' | 'ANGGOTA' | 'LEADER' | 'MEMBER';
  contribution: number;
  streak: number;
  isOnline: boolean;
}

export interface ClanModifier {
  name: string;
  multiplier: string;
  type: string;
  duration: string;
  description: string;
}

export interface Clan {
  id: string;
  name: string;
  description: string;
  leaderUsername: string;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'DIAMOND';
  rank: number;
  score: number;
  memberCount: number;
  maxMembers: number;
  members: ClanMember[];
  activeBuffs: ClanModifier[];
  debuffs: ClanModifier[];
}

interface ClanPageProps {
  clan: Clan | null;
  currentUsername: string;
  username: string;
  showManagementControls?: boolean;
  onCreateClan: () => void;
  onDiscoverClans: () => void;
  onEditClan?: () => void;
  onDeleteClan?: () => void;
  onLeaveClan?: () => void;
  onKickMember?: (memberUsername: string) => void;
  requests?: ClanJoinRequestResponse[];
  totalRequests?: number;
  onAcceptRequest?: (id: number) => void;
  onRejectRequest?: (id: number) => void;
  onRejectAllRequests?: () => void;
}

const ClanPage: React.FC<ClanPageProps> = ({
  clan,
  currentUsername,
  username,
  onCreateClan,
  onDiscoverClans,
  onEditClan,
  onDeleteClan,
  onLeaveClan,
  onKickMember,
  showManagementControls = true,
  requests = [],
  totalRequests = 0,
  onAcceptRequest,
  onRejectRequest,
  onRejectAllRequests
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToKick, setMemberToKick] = useState<ClanMember | null>(null);

  // Helper to format score
  const formatScore = (score: number) => {
    return new Intl.NumberFormat().format(score);
  };

  const formatRemainingTime = (durationStr: string): string => {
    if (!durationStr || !durationStr.startsWith('Until ')) {
      return durationStr;
    }
    try {
      const endStr = durationStr.substring(6); // Remove "Until "
      const endTime = new Date(endStr).getTime();
      const now = Date.now();
      const diff = endTime - now;
      if (diff <= 0) {
        return 'Expired';
      }
      const totalMinutes = Math.floor(diff / 60000);
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (hours > 0) {
        return `${hours}h ${minutes}m left`;
      }
      if (minutes > 0) {
        return `${minutes}m left`;
      }
      return 'Less than 1m left';
    } catch (e) {
      return durationStr;
    }
  };

  const confirmKick = () => {
    if (memberToKick && onKickMember) {
      onKickMember(memberToKick.username);
      setMemberToKick(null);
    }
  };

  // State A: User has no clan
  if (!clan) {
    return (
      <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
        <Sidebar username={username} />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-8 animate-fade-rise">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full animate-pulse" />
              <Shield size={64} className="text-indigo-400 relative z-10" />
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-white">Join the Ranks</h1>
              <p className="text-indigo-100/70 leading-relaxed">
                You haven't joined a clan yet. Collaborate with others, earn exclusive buffs, and climb the global leaderboards together!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={onCreateClan}
                className="yomu-button-primary flex items-center gap-2 group"
                id="btn-create-clan"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Create Clan
              </button>
              <button
                onClick={onDiscoverClans}
                className="yomu-button-secondary flex items-center gap-2"
                id="btn-discover-clans"
              >
                <Search size={18} />
                Discover Clans
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // State B: User has a clan
  const isLeader = currentUsername === clan.leaderUsername;

  return (
    <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
      <Sidebar username={username} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 overflow-y-auto">
        {/* 1. Clan Header */}
        <header className="yomu-glass rounded-3xl p-6 sm:p-8 relative overflow-hidden animate-fade-rise">
          {/* Subtle background element */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />

          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-white tracking-tight">{clan.name}</h1>
                <TierBadge tier={clan.tier} />
              </div>

              <p className="max-w-3xl text-sm leading-relaxed text-indigo-100/70">
                {clan.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm font-medium">
                <div className="flex items-center gap-2 text-indigo-100/80">
                  <Trophy size={18} className="text-amber-400" />
                  <span className="text-white">{formatScore(clan.score)}</span>
                  <span className="text-indigo-100/50">Points</span>
                </div>
                <div className="flex items-center gap-2 text-indigo-100/80">
                  <Users size={18} className="text-indigo-400" />
                  <span className="text-white">{clan.memberCount} / {clan.maxMembers}</span>
                  <span className="text-indigo-100/50">Members</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {showManagementControls ? (
                isLeader ? (
                  <>
                    <button
                      onClick={onEditClan}
                      className="yomu-button-primary py-2.5 px-4 text-xs"
                      id="btn-edit-clan"
                    >
                      <Edit2 size={14} className="mr-2" />
                      Edit Clan
                    </button>

                    {showDeleteConfirm ? (
                      <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1.5 animate-fade-rise">
                        <span className="text-[10px] font-bold text-red-200 uppercase">Confirm?</span>
                        <button
                          onClick={onDeleteClan}
                          className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                          title="Confirm Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-[10px] font-bold text-indigo-200 hover:text-white px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="yomu-button-secondary py-2.5 px-4 text-xs border-red-500/20 hover:bg-red-500/10 text-red-100"
                        id="btn-delete-clan-init"
                      >
                        <Trash2 size={14} className="mr-2" />
                        Delete
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={onLeaveClan}
                    className="yomu-button-secondary py-2.5 px-4 text-xs"
                    id="btn-leave-clan"
                  >
                    <LogOut size={14} className="mr-2" />
                    Leave Clan
                  </button>
                )
              ) : null}
            </div>
          </div>
        </header>

        {/* 2. Active Buffs / Debuffs */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">Active Modifiers</h2>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {clan.activeBuffs.length === 0 && clan.debuffs.length === 0 ? (
              <p className="text-sm text-indigo-100/50 italic py-2">No active buffs or debuffs</p>
            ) : (
              <>
                {clan.activeBuffs.map((buff, idx) => (
                  <div
                    key={`buff-${idx}`}
                    className="flex-shrink-0 flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 min-w-[180px] bg-emerald-500/5 border-emerald-500/20 text-emerald-100 hover:-translate-y-0.5 hover:shadow-lg hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:shadow-emerald-500/10 animate-fade-rise"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg"><Shield size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{buff.name}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-mono font-bold">
                          {buff.multiplier}
                        </span>
                        <span className="text-[10px] text-indigo-100/50 font-medium">{formatRemainingTime(buff.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {clan.debuffs.map((debuff, idx) => (
                  <div
                    key={`debuff-${idx}`}
                    className="flex-shrink-0 flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 min-w-[180px] bg-red-500/5 border-red-500/20 text-red-100 hover:-translate-y-0.5 hover:shadow-lg hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-red-500/10 animate-fade-rise"
                    style={{ animationDelay: `${(clan.activeBuffs.length + idx) * 0.1}s` }}
                  >
                    <div className="text-red-400 bg-red-500/10 p-1.5 rounded-lg"><AlertCircle size={16} /></div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold">{debuff.name}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-red-500/20 text-red-300 px-1 py-0.2 rounded font-mono font-bold">
                          {debuff.multiplier}
                        </span>
                        <span className="text-[10px] text-indigo-100/50 font-medium">{formatRemainingTime(debuff.duration)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* 2.5 Join Requests (Leader Only) */}
        {showManagementControls && isLeader && requests.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Join Requests</h2>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-amber-100/80 bg-amber-500/20 px-2 py-1 rounded-lg">
                  {totalRequests} Pending
                </span>
                <button
                  onClick={onRejectAllRequests}
                  className="text-xs font-bold bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 border border-red-500/20"
                >
                  <X size={14} />
                  Reject All
                </button>
              </div>
            </div>

            <div className="yomu-glass rounded-2xl overflow-hidden border-white/5 relative">
              <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 text-indigo-100 border border-white/10 flex items-center justify-center font-bold text-sm">
                      {req.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-sm text-white block">{req.username}</span>
                      <span className="text-xs text-indigo-100/50 block">Requested to join</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAcceptRequest?.(req.id)}
                      className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors"
                      title="Accept"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => onRejectRequest?.(req.id)}
                      className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
              </div>
              {requests.length > 5 && (
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
              )}
            </div>
            {totalRequests > requests.length && (
              <p className="text-xs text-indigo-100/50 text-center mt-2">
                Showing {requests.length} of {totalRequests} requests. Reject or accept some to see more.
              </p>
            )}
          </section>
        )}

        {/* 3. Member List */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Clan Members</h2>
            <span className="text-xs font-medium text-indigo-100/60 bg-white/5 px-2 py-1 rounded-lg">
              {clan.members.length} Members
            </span>
          </div>

          <div className="yomu-glass rounded-2xl overflow-hidden border-white/5">
            {/* Top 10 members */}
            <div className="divide-y divide-white/5">
              {clan.members.slice(0, 10).map((member) => (
                <MemberRow
                  key={member.username}
                  member={member}
                  isMe={member.username === currentUsername}
                  clanLeaderUsername={clan.leaderUsername}
                  isClanLeader={isLeader}
                  canManageMembers={showManagementControls}
                  onKick={() => setMemberToKick(member)}
                />
              ))}
            </div>

            {/* Scrollable container for remaining members */}
            {clan.members.length > 10 && (
              <div className="relative">
                <div className="max-h-[400px] overflow-y-auto divide-y divide-white/5 scrollbar-thin">
                  {clan.members.slice(10).map((member) => (
                    <MemberRow
                      key={member.username}
                      member={member}
                      isMe={member.username === currentUsername}
                      clanLeaderUsername={clan.leaderUsername}
                      isClanLeader={isLeader}
                      canManageMembers={showManagementControls}
                      onKick={() => setMemberToKick(member)}
                    />
                  ))}
                </div>
                {/* Fade-out hint */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none" />
              </div>
            )}
          </div>
        </section>

        {/* Footer actions for Leader (duplicated for visibility at bottom) */}
        {showManagementControls && isLeader && (
          <div className="flex justify-end pt-4">
            <button
              onClick={onLeaveClan}
              className="text-xs font-bold text-red-300/50 hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <LogOut size={14} />
              Leave as Leader
            </button>
          </div>
        )}
      </main>

      {/* Kick Member Modal */}
      {memberToKick && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMemberToKick(null)}
          />
          <div className="yomu-glass rounded-3xl p-8 max-w-sm w-full relative z-10 border-white/10 animate-fade-rise">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-400 mx-auto mb-6">
              <UserMinus size={32} />
            </div>

            <div className="text-center space-y-3 mb-8">
              <h2 className="text-2xl font-black text-white">Kick Member?</h2>
              <p className="text-indigo-100/60 leading-relaxed">
                Are you sure you want to remove <span className="text-white font-bold">{memberToKick.username}</span> from the clan?
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmKick}
                className="yomu-button-primary bg-gradient-to-r from-red-500 to-rose-600 hover:shadow-red-600/30"
              >
                Yes, Kick Member
              </button>
              <button
                onClick={() => setMemberToKick(null)}
                className="yomu-button-secondary border-white/10"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MemberRow: React.FC<{
  member: ClanMember;
  isMe: boolean;
  clanLeaderUsername: string;
  isClanLeader: boolean;
  canManageMembers?: boolean;
  onKick?: (memberUsername: string) => void
}> = ({ member, isMe, clanLeaderUsername, isClanLeader, canManageMembers = true, onKick }) => {
  const isMemberLeader = member.username === clanLeaderUsername;
  const navigate = useNavigate();

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on a button (like the kick button)
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    navigate(`/profile/${member.username}`);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`flex items-center justify-between p-4 transition-colors hover:bg-white/[0.02] cursor-pointer ${isMemberLeader ? 'bg-indigo-500/[0.03]' : ''} ${isMe ? 'ring-1 ring-inset ring-indigo-500/20' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${isMemberLeader ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-indigo-100 border border-white/10'}`}>
          {member.username.substring(0, 2).toUpperCase()}
        </div>

        <div className="flex items-center gap-3">
          <span className={`font-bold text-sm ${isMe ? 'text-indigo-300' : 'text-white'}`}>
            {member.username} {isMe && '(You)'}
          </span>
          {isMemberLeader ? (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/20">
              <Crown size={10} />
              Leader
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20">
              Member
            </span>
          )}
        </div>
      </div>

      {canManageMembers && isClanLeader && !isMe && !isMemberLeader && (
        <button
          onClick={() => onKick?.(member.username)}
          className="p-2 hover:bg-red-500/10 rounded-lg text-red-400/50 hover:text-red-400 transition-all group"
          title={`Kick ${member.username}`}
        >
          <UserMinus size={16} className="group-hover:scale-110 transition-transform" />
        </button>
      )}
    </div>
  );
};

export default ClanPage;
