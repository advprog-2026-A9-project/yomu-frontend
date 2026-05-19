import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AlertCircle, Edit, Loader2, Plus, RefreshCw, Save, ShieldAlert, Trash2, Filter, Calendar } from 'lucide-react';
import { GlassCard, Modal, Pagination, SearchInput } from '../../components/common/UI';
import {
  DailyMissionAdminPayload,
  DailyMissionAdminRecord,
  createDailyMission,
  deleteDailyMission,
  getDailyMissions,
  updateDailyMission,
  selectDailyMissions,
  randomizeDailyMissions,
} from '../../services/adminAPI';
import { formatDate, missionTypes } from './adminShared';

type MissionSortKey = 'name' | 'targetCount' | 'active';
type SortDirection = 'asc' | 'desc';

const defaultForm: DailyMissionAdminPayload = {
  name: '',
  milestone: '',
  missionType: missionTypes[0].value,
  targetCount: 1,
  accuracyThreshold: 80,
  requiredCount: 1,
  rewardScore: 50,
  activeFrom: null,
  activeUntil: null,
};

const ITEMS_PER_PAGE = 8;

function sortMissions(rows: DailyMissionAdminRecord[], key: MissionSortKey, direction: SortDirection) {
  return [...rows].sort((a, b) => {
    let comparison = 0;

    if (key === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (key === 'active') {
      comparison = Number(a.active) - Number(b.active);
    } else {
      comparison = (a[key] ?? 0) - (b[key] ?? 0);
    }

    return direction === 'asc' ? comparison : -comparison;
  });
}

export default function AdminDailyMissionsPage() {
  const [rows, setRows] = useState<DailyMissionAdminRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<MissionSortKey>('targetCount');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [form, setForm] = useState<DailyMissionAdminPayload>(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DailyMissionAdminRecord | null>(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMissionIds, setSelectedMissionIds] = useState<string[]>([]);
  const [rotationBusy, setRotationBusy] = useState(false);

  const filteredAndSortedRows = useMemo(() => {
    let filtered = rows.filter((row) => {
      const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.milestone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || row.missionType === filterType;
      const matchesActive = filterActive === 'all' ||
        (filterActive === 'active' && row.active) ||
        (filterActive === 'inactive' && !row.active);
      return matchesSearch && matchesType && matchesActive;
    });

    return sortMissions(filtered, sortKey, sortDirection);
  }, [rows, searchQuery, filterType, filterActive, sortKey, sortDirection]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / ITEMS_PER_PAGE);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedRows.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedRows, currentPage]);

  const loadMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDailyMissions();
      setRows(data);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Gagal memuat daily mission');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMissions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterActive]);

  const todayMissions = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    return rows.filter((m) => {
      if (!m.activeFrom || !m.activeUntil) return false;
      return m.activeFrom.includes(today) && m.activeUntil.includes(today) && m.active;
    });
  }, [rows]);

  const handleRandomize = async () => {
    try {
      setRotationBusy(true);
      setError(null);
      await randomizeDailyMissions();
      await loadMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal merotasi misi');
    } finally {
      setRotationBusy(false);
    }
  };

  const handleSaveSelection = async () => {
    if (selectedMissionIds.length !== 3) {
      setError('Harus memilih tepat 3 misi harian');
      return;
    }

    try {
      setRotationBusy(true);
      setError(null);
      await selectDailyMissions(selectedMissionIds);
      setSelectedMissionIds([]);
      await loadMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menetapkan misi');
    } finally {
      setRotationBusy(false);
    }
  };

  const toggleMissionSelection = (id: string) => {
    setSelectedMissionIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const startEdit = (row: DailyMissionAdminRecord) => {
    setEditingId(row.id);
    setForm({
      name: row.name,
      milestone: row.milestone,
      missionType: row.missionType,
      targetCount: row.targetCount,
      accuracyThreshold: row.accuracyThreshold,
      requiredCount: row.requiredCount,
      rewardScore: row.rewardScore,
      activeFrom: row.activeFrom,
      activeUntil: row.activeUntil,
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
        await updateDailyMission(editingId, form);
      } else {
        await createDailyMission(form);
      }

      clearForm();
      await loadMissions();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Gagal menyimpan daily mission');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    try {
      setSaving(true);
      setError(null);
      await deleteDailyMission(pendingDelete.id);
      setPendingDelete(null);
      await loadMissions();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Gagal menghapus mission');
    } finally {
      setSaving(false);
    }
  };

  const toggleSort = (key: MissionSortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDirection('desc');
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Rotation management</p>
              <h2 className="mt-2 text-2xl font-black text-white">Active Missions</h2>
              <p className="mt-2 text-sm text-indigo-100/70">
                Current active missions for today. Max 3 missions.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRandomize}
              disabled={rotationBusy}
              className="yomu-button-secondary gap-2 border-indigo-400/30 text-indigo-200"
            >
              {rotationBusy ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Randomize Today
            </button>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {todayMissions.length === 0 ? (
              <div className="md:col-span-3 rounded-2xl border border-white/5 bg-white/5 p-8 text-center text-indigo-100/40">
                No missions are scheduled for today.
              </div>
            ) : (
              todayMissions.map((m) => (
                <div key={m.id} className="rounded-2xl border border-indigo-400/20 bg-indigo-500/5 p-4 transition hover:bg-indigo-500/10">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">{m.missionType}</p>
                  <p className="mt-1 font-bold text-white line-clamp-1">{m.name}</p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-indigo-100/50">
                    <span>
                      Target:{' '}
                      {m.missionType === 'achieve_accuracy'
                        ? `>= ${m.accuracyThreshold}% (${m.requiredCount}x)`
                        : `${m.targetCount}`}
                    </span>
                    <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-indigo-300">{m.rewardScore} Score</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Manual Selection</p>
          <h3 className="mt-2 text-lg font-bold text-white">Select for Today</h3>
          <p className="mt-1 text-xs text-indigo-100/60">
            Pick 3 missions from the list below and save.
          </p>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-100/40 uppercase tracking-widest">
              <span>Selected</span>
              <span>{selectedMissionIds.length} / 3</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-indigo-400 transition-all duration-500"
                style={{ width: `${(selectedMissionIds.length / 3) * 100}%` }}
              />
            </div>

            <ul className="mt-4 space-y-2">
              {selectedMissionIds.map(id => {
                const m = rows.find(r => r.id === id);
                return (
                  <li key={id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-white">
                    <span className="truncate pr-2">{m?.name || 'Loading...'}</span>
                    <button
                      onClick={() => toggleMissionSelection(id)}
                      className="text-indigo-400 hover:text-indigo-200"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
              {selectedMissionIds.length === 0 && (
                <li className="py-8 text-center text-xs italic text-indigo-100/30">No missions selected</li>
              )}
            </ul>

            <button
              type="button"
              onClick={handleSaveSelection}
              disabled={selectedMissionIds.length !== 3 || rotationBusy}
              className="mt-4 w-full yomu-button-primary py-2.5 text-sm gap-2"
            >
              {rotationBusy ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Apply Selection
            </button>
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-indigo-100/50">Daily mission management</p>
            <h2 className="mt-2 text-2xl font-black text-white">Mission Rotation</h2>
            <p className="mt-2 text-sm text-indigo-100/70">
              Control mission active schedule and reward distribution.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="yomu-button-primary gap-2"
            >
              <Plus size={18} />
              Create Mission
            </button>
            <button type="button" onClick={loadMissions} className="yomu-button-secondary gap-2">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
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
              {missionTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-[#0b1020]">
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-indigo-400/50 focus:outline-none transition"
            >
              <option value="all" className="bg-[#0b1020]">All Status</option>
              <option value="active" className="bg-[#0b1020]">Active Only</option>
              <option value="inactive" className="bg-[#0b1020]">Inactive Only</option>
            </select>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-[0.24em] text-indigo-100/50">
              <tr>
                <th className="px-6 py-4 w-10">Select</th>
                <th className="px-6 py-4">
                  <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-2">Name</button>
                </th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">
                  <button type="button" onClick={() => toggleSort('targetCount')} className="inline-flex items-center gap-2">Target</button>
                </th>
                <th className="px-6 py-4">
                  <button type="button" onClick={() => toggleSort('active')} className="inline-flex items-center gap-2">Status</button>
                </th>
                <th className="px-6 py-4">Schedule</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-indigo-100/60">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-indigo-400" />
                      <p>Loading daily missions...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-indigo-100/60">
                    No missions found match your criteria
                  </td>
                </tr>
              ) : (
                paginatedRows.map((mission) => (
                  <tr key={mission.id} className={`group bg-slate-950/20 transition hover:bg-white/5 ${selectedMissionIds.includes(mission.id) ? 'bg-indigo-500/10 border-l-2 border-indigo-400' : ''}`}>
                    <td className="px-6 py-5">
                      <input
                        type="checkbox"
                        checked={selectedMissionIds.includes(mission.id)}
                        onChange={() => toggleMissionSelection(mission.id)}
                        disabled={!selectedMissionIds.includes(mission.id) && selectedMissionIds.length >= 3}
                        className="h-4 w-4 rounded border-white/10 bg-white/5 text-indigo-500 focus:ring-indigo-500/50 accent-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-bold text-white group-hover:text-indigo-300 transition-colors">{mission.name}</p>
                      <p className="mt-1 text-xs text-indigo-100/50 line-clamp-1">{mission.milestone}</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-200 border border-indigo-500/20">
                        {mission.missionType}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center text-xs font-mono text-white">
                      {mission.missionType === 'achieve_accuracy'
                        ? `>= ${mission.accuracyThreshold}% (${mission.requiredCount}x)`
                        : `${mission.targetCount}`}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${mission.active
                          ? 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300'
                          : 'border-white/10 bg-white/5 text-indigo-100/40'
                          }`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${mission.active ? 'animate-pulse bg-emerald-400' : 'bg-indigo-100/30'}`} />
                        {mission.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-indigo-100/60">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={12} className="text-indigo-100/30" />
                          <span>{formatDate(mission.activeFrom)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3" />
                          <span>{formatDate(mission.activeUntil)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(mission)}
                          className="rounded-xl border border-white/10 bg-white/5 p-2 text-indigo-100/70 transition hover:bg-white/10 hover:text-white"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(mission)}
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
        title={editingId ? 'Edit Daily Mission' : 'Create Daily Mission'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                placeholder="e.g. Daily Reading"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Mission Type</label>
              <select
                value={form.missionType}
                onChange={(e) => setForm((prev) => ({ ...prev, missionType: e.target.value }))}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
              >
                {missionTypes.map((item) => (
                  <option key={item.value} value={item.value} className="bg-[#0b1020]">
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-indigo-100/70">Milestone Description</label>
            <textarea
              value={form.milestone}
              onChange={(e) => setForm((prev) => ({ ...prev, milestone: e.target.value }))}
              className="h-24 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
              placeholder="What should the user do?"
              required
            />
          </div>

          {form.missionType === 'achieve_accuracy' ? (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-100/70">Accuracy Threshold (%)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.accuracyThreshold ?? 80}
                  onChange={(e) => setForm((prev) => ({ ...prev, accuracyThreshold: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-100/70">Required Count (times)</label>
                <input
                  type="number"
                  min={1}
                  value={form.requiredCount ?? 1}
                  onChange={(e) => setForm((prev) => ({ ...prev, requiredCount: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-100/70">Reward Score</label>
                <input
                  type="number"
                  min={1}
                  value={form.rewardScore}
                  onChange={(e) => setForm((prev) => ({ ...prev, rewardScore: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-100/70">Target Count</label>
                <input
                  type="number"
                  min={1}
                  value={form.targetCount ?? 1}
                  onChange={(e) => setForm((prev) => ({ ...prev, targetCount: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-indigo-100/70">Reward Score</label>
                <input
                  type="number"
                  min={1}
                  value={form.rewardScore}
                  onChange={(e) => setForm((prev) => ({ ...prev, rewardScore: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition"
                  required
                />
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Active From</label>
              <input
                type="datetime-local"
                value={form.activeFrom ? form.activeFrom.slice(0, 16) : ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    activeFrom: e.target.value ? new Date(e.target.value).toISOString() : null,
                  }))
                }
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition [color-scheme:dark]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-indigo-100/70">Active Until</label>
              <input
                type="datetime-local"
                value={form.activeUntil ? form.activeUntil.slice(0, 16) : ''}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    activeUntil: e.target.value ? new Date(e.target.value).toISOString() : null,
                  }))
                }
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-white focus:border-indigo-400/50 focus:outline-none transition [color-scheme:dark]"
              />
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
              {editingId ? 'Update Mission' : 'Create Mission'}
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
        title="Delete Mission"
      >
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-300/30 bg-amber-500/10 p-5">
            <div className="flex items-start gap-4 text-amber-50">
              <ShieldAlert className="mt-1 shrink-0" size={24} />
              <div>
                <p className="font-bold">Are you sure you want to delete this?</p>
                <p className="mt-2 text-sm text-amber-100/80">
                  Deleting <span className="font-black text-white">{pendingDelete?.name}</span> is permanent.
                </p>
                {pendingDelete?.active && (
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-rose-300">
                    Warning: This mission is currently active for users.
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
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
