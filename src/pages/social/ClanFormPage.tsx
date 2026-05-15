import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Shield, ChevronLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createClan, updateClan, getClanDetail } from '../../services/socialAPI';
import Sidebar from '../../components/common/Sidebar';
import { GlassCard } from '../../components/common/UI';

const ClanFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      const fetchClan = async () => {
        try {
          const data = await getClanDetail(id);
          setName(data.name);
          setDescription(data.description);
        } catch (err) {
          setError('Failed to fetch clan details');
        } finally {
          setLoading(false);
        }
      };
      fetchClan();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Name and description are required');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEdit && id) {
        await updateClan(id, { name, description });
      } else {
        await createClan({ name, description });
      }

      navigate('/clan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="yomu-shell yomu-grid-noise lg:flex min-h-screen">
      <Sidebar username={user?.username || 'Pelajar'} />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
          <button
            onClick={() => navigate('/clan')}
            className="flex items-center gap-2 text-indigo-100/60 hover:text-white transition-colors group mb-4"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Clan
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Shield size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">
                {isEdit ? 'Edit Clan' : 'Create a New Clan'}
              </h1>
              <p className="text-indigo-100/60">
                {isEdit ? 'Update your clan information' : 'Start your own community and lead it to glory'}
              </p>
            </div>
          </div>

          <GlassCard className="p-6 sm:p-8 animate-fade-rise">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="animate-spin text-indigo-400" size={32} />
                <p className="text-indigo-100/60">Loading clan details...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-start gap-3 text-red-200">
                    <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-indigo-100/80">
                    Clan Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter a legendary name..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-bold text-indigo-100/80">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What is your clan about?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none"
                    disabled={submitting}
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="yomu-button-primary w-full py-4 flex items-center justify-center gap-2 text-base font-bold"
                  >
                    {submitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={20} />
                        {isEdit ? 'Save Changes' : 'Initialize Clan'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default ClanFormPage;
