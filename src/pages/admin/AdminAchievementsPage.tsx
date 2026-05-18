import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Edit, Loader2, Plus, RefreshCw, Save, ShieldAlert, Trash2, Filter } from 'lucide-react';
import { GlassCard, Modal, Pagination, SearchInput } from '../../components/common/UI';
import {
  AchievementAdminPayload,
  AchievementAdminRecord,
  createAchievement,
  deleteAchievement,
  getAchievements,
  updateAchievement,
} from '../../services/adminAPI';
import { achievementTypes } from './adminShared';

type AchievementSortKey = 'name' | 'milestoneThreshold' | 'earnedCount';
type SortDirection = 'asc' | 'desc';

const defaultForm: AchievementAdminPayload = {
  name: '',
  milestone: '',
  milestoneType: achievementTypes[0].value,
  milestoneThreshold: 1,
  tier: '',
};

const ITEMS_PER_PAGE = 8;

function sortAchievements(rows: AchievementAdminRecord[], key: AchievementSortKey, direction: SortDirection) {
  return [...rows].sort((a, b) => {
    let comparison = 0;

    if (key === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = (a[key] ?? 0) - (b[key] ?? 0);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export default function AdminAchievementsPage() {
  const [rows, setRows] = useState<AchievementAdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<AchievementSortKey>('earnedCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [form, setForm] = useState<AchievementAdminPayload>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AchievementAdminRecord | null>(null);
  
  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           row.milestone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === 'all' || row.milestoneType === filterType;
      return matchesSearch && matchesFilter;
    });

    return sortAchievements(filtered, sortKey, sortDirection);
  }, [rows, searchQuery, filterType, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / ITEMS_PER_PAGE);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedRows, currentPage]);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAchievements();
      setRows(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Gagal memuat achievement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAchievements();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  const startEdit = (row: AchievementAdminRecord) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      milestone: row.milestone,
      milestoneType: row.milestoneType,
      milestoneThreshold: row.milestoneThreshold,
      tier: row.tier ?? '',
    });
    setIsModalOpen(true);
  };

  const clearForm = () => {
    setEditingId(null);
    setForm(defaultForm);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError(null);

      if (editingId) {
        await updateAchievement(editingId, form);
      } else {
        await createAchievement(form);
      }

      clearForm();
      await loadAchievements();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gagal menyimpan achievement');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setSaving(true);
      setError(null);
      await deleteAchievement(pendingDelete.id);
      setPendingDelete(null);
      await loadAchievements();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus achievement');
    } finally {
      setSaving(false);
    }
  };

  const toggleSort = (key: AchievementSortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('desc');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Achievement management</p>
            <h2 className="mt-2 text-2xl font-black text-white">Badge Progression</h2>
            <p className="mt-2 text-sm text-indigo-100/70">
              Configure milestone logic and monitor player progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(true)} 
              className="yomu-button-primary gap-2"
            >
              <Plus size={18} />
              Create Achievement
            </button>
            <button type="button" onClick={loadAchievements} className="yomu-button-secondary gap-2">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <SearchInput 
              value={searchQuery} 
              onChange={setSearchQuery} 
              placeholder="Search by name or description..." 
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-400/50 focus:outline-none transition"
            >
              <option value="all" className="bg-[#0b1020]">All Types</option>
              {achievementTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-[#0b1020]">
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-[0.24em] text-indigo-100/50">
              <tr>
                <th className="px-6 py-4">
                  <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort('name')}>
                    Name
                  </button>
                </th>
                <th className="px-6 py-4">Milestone</th>
                <th className="px-6 py-4 text-center">
                  <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort('milestoneThreshold')}>
                    Threshold
                  </button>
                </th>
                <th className="px-6 py-4 text-center">
                  <button type="button" className="inline-flex items-center gap-2" onClick={() => toggleSort('earnedCount')}>
                    Earned
                  </button>
                </th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-indigo-100/60">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-indigo-400" />
                      <p>Loading achievements...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-indigo-100/60">
                    No achievements found match your criteria
                  </td>
                </tr>
              ) : (
                paginatedRows.map((achievement) => (
                  <tr key={achievement.id} className="group bg-slate-950/20 transition hover:bg-white/5">
                    <td className="px-6 py-5">
                      <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{achievement.name}</p>
                      <p className="mt-1 text-xs text-indigo-100/50 line-clamp-1">{achievement.milestone}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-200 border border-indigo-500/20">
                          {achievementTypes.find((t) => t.value === achievement.milestoneType)?.label || achievement.milestoneType}
                        </span>
                        {achievement.tier && (
                          <span className={`rounded-full px-2.5 py-1 text-[11px] font-black border ${
                            achievement.tier.toUpperCase() === 'BRONZE' ? 'bg-amber-700/10 text-amber-500 border-amber-700/20' :
                            achievement.tier.toUpperCase() === 'SILVER' ? 'bg-slate-400/10 text-slate-300 border-slate-400/20' :
                            achievement.tier.toUpperCase() === 'GOLD' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                            achievement.tier.toUpperCase() === 'DIAMOND' ? 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20' :
                            achievement.tier.toUpperCase() === 'MYTHIC' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                            'bg-red-500/10 text-red-400 border-red-500/20'
                          }`}>
                            {achievement.tier.toUpperCase()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-mono text-white">{achievement.milestoneThreshold}</td>
                    <td className="px-6 py-5 text-center">
                      <span className="font-bold text-emerald-400">{achievement.earnedCount}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button 
                          type="button" 
                          onClick={() => startEdit(achievement)} 
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-indigo-100/70 transition hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(achievement)}
                          className="rounded-xl border border-rose-400/20 bg-rose-500/5 p-2 text-rose-300 transition hover:bg-rose-500/20 hover:text-rose-100"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {filteredAndSortedRows.length > 0 && (
          <div className="border-t border-white/5 p-6">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}
      </GlassCard>

      {/* Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={clearForm} 
        title={editingId ? 'Edit Achievement' : 'Create Achievement'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                placeholder="e.g. Speed Reader"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Milestone Threshold</label>
              <input
                type="number"
                min={1}
                value={form.milestoneThreshold}
                onChange={(e) => setForm((prev) => ({ ...prev, milestoneThreshold: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-indigo-100/70">Description / Milestone</label>
            <textarea
              value={form.milestone}
              onChange={(e) => setForm((prev) => ({ ...prev, milestone: e.target.value }))}
              className="h-32 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
              placeholder="What does the user need to do?"
              required
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Milestone Type</label>
              <select
                value={form.milestoneType}
                onChange={(e) => setForm((prev) => ({ ...prev, milestoneType: e.target.value }))}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
              >
                {achievementTypes.map((item) => (
                  <option key={item.value} value={item.value} className="bg-[#0b1020]">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Tier (Optional)</label>
              <select
                value={form.tier ?? ''}
                onChange={(e) => setForm((prev) => ({ ...prev, tier: e.target.value || '' }))}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
              >
                <option value="" className="bg-[#0b1020]">None (No Tier)</option>
                <option value="BRONZE" className="bg-[#0b1020]">Bronze</option>
                <option value="SILVER" className="bg-[#0b1020]">Silver</option>
                <option value="GOLD" className="bg-[#0b1020]">Gold</option>
                <option value="DIAMOND" className="bg-[#0b1020]">Diamond</option>
                <option value="MYTHIC" className="bg-[#0b1020]">Mythic</option>
                <option value="GODLIKE" className="bg-[#0b1020]">Godlike</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-100">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              disabled={saving} 
              className="yomu-button-primary flex-1 gap-2 py-3"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : editingId ? <Save size={18} /> : <Plus size={18} />}
              {editingId ? 'Update Achievement' : 'Create Achievement'}
            </button>
            <button 
              type="button" 
              onClick={clearForm} 
              className="yomu-button-secondary py-3"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title="Delete Achievement"
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-300/30 bg-amber-500/10 p-5">
            <div className="flex items-start gap-4 text-amber-50">
              <ShieldAlert className="mt-1 shrink-0" size={24} />
              <div>
                <p className="font-bold">Are you sure you want to delete this?</p>
                <p className="mt-2 text-sm text-amber-100/80">
                  Deleting <span className="font-black text-white">{pendingDelete?.name}</span> is permanent and cannot be undone.
                </p>
                {pendingDelete && pendingDelete.earnedCount > 0 && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-rose-300">
                    Warning: This has already been earned by {pendingDelete.earnedCount} users.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={confirmDelete} 
              disabled={saving} 
              className="yomu-button-primary flex-1 bg-rose-600 hover:bg-rose-700 border-rose-500/50 gap-2"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              Confirm Delete
            </button>
            <button 
              type="button" 
              onClick={() => setPendingDelete(null)} 
              className="yomu-button-secondary flex-1"
            >
              Keep Achievement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
