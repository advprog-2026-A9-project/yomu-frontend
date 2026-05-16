import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface CreateClanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateClanData) => Promise<void>;
  isLoading?: boolean;
}

export interface CreateClanData {
  name: string;
  description: string;
}

export default function CreateClanModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateClanModalProps) {
  const [formData, setFormData] = useState<CreateClanData>({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Clan name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Clan name must be at least 3 characters';
    } else if (formData.name.length > 30) {
      newErrors.name = 'Clan name must be at most 30 characters';
    }

    if (formData.description.length > 200) {
      newErrors.description = 'Description must be at most 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        description: '',
      });
      onClose();
    } catch (error) {
      console.error('Failed to create clan:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="yomu-glass max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create New Clan</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-white/10 rounded-lg transition"
          >
            <X size={20} className="text-indigo-100" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Clan Name */}
          <div>
            <label className="block text-sm font-semibold text-indigo-100 mb-2">
              Clan Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Dragon Slayers"
              maxLength={30}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder-indigo-100/50 transition focus:border-indigo-400/50 focus:outline-none"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-red-300/80">{errors.name}</p>
              <p className="text-xs text-indigo-100/60">{formData.name.length}/30</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-indigo-100 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell others about your clan..."
              maxLength={200}
              rows={3}
              className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-2.5 text-white placeholder-indigo-100/50 transition focus:border-indigo-400/50 focus:outline-none resize-none"
            />
            <div className="mt-1 flex items-center justify-between">
              <p className="text-xs text-red-300/80">{errors.description}</p>
              <p className="text-xs text-indigo-100/60">{formData.description.length}/200</p>
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-indigo-300/20 bg-white/5 p-4 text-sm text-indigo-100/75">
            <p className="font-semibold text-white">Available now</p>
            <p className="mt-1">Create clan currently supports only name and description. Tag, privacy, and emblem options are not available yet.</p>
            {/* TODO: backend endpoint not yet available */}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 font-bold text-indigo-100 transition hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 yomu-button-primary flex items-center justify-center gap-2 py-2.5 disabled:opacity-50"
            >
              <Plus size={18} />
              {isLoading ? 'Creating...' : 'Create Clan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
