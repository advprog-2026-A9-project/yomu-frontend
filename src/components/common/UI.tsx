import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <span className="yomu-badge">{eyebrow}</span>
      <h2 className="mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">{title}</h2>
      <p className="mt-3 text-sm text-indigo-100/80 sm:text-base">{description}</p>
    </div>
  );
}

export function GlassCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <article className={`yomu-card ${className}`.trim()}>{children}</article>;
}

export function ProgressBar({
  value,
  max = 100,
  className = '',
}: {
  value: number;
  max?: number;
  className?: string;
}) {
  const normalized = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`yomu-progress-track ${className}`.trim()}>
      <div className="yomu-progress-fill" style={{ width: `${normalized}%` }} />
    </div>
  );
}

export function TierBadge({
  tier,
}: {
  tier: string;
}) {
  const normalizedTier = tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase();
  
  const tierStyles: Record<string, string> = {
    Bronze: 'border-orange-700/60 bg-orange-500/20 text-orange-200',
    Silver: 'border-slate-400/60 bg-slate-300/20 text-slate-100',
    Gold: 'border-amber-400/70 bg-amber-400/20 text-amber-100',
    Platinum: 'border-cyan-400/70 bg-cyan-400/20 text-cyan-100',
    Diamond: 'border-indigo-400/70 bg-indigo-400/20 text-indigo-100',
  };

  const style = tierStyles[normalizedTier] || 'border-white/20 bg-white/5 text-white';

  return <span className={`yomu-badge ${style}`}>{normalizedTier}</span>;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`yomu-card animate-pulse ${className}`.trim()}>
      <div className="h-4 w-24 rounded bg-white/10" />
      <div className="mt-4 h-8 w-2/3 rounded bg-white/10" />
      <div className="mt-3 h-3 w-full rounded bg-white/10" />
      <div className="mt-2 h-3 w-4/5 rounded bg-white/10" />
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-2xl scale-100 transform overflow-hidden rounded-3xl border border-white/10 bg-[#0b1020] p-6 shadow-2xl animate-in zoom-in-95 duration-200 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-black text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-indigo-100/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)] sm:px-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-indigo-100/50">
        Page {currentPage} of {totalPages}
        </p>
        <div className="flex items-center gap-2 sm:justify-end">
          <button
            type="button"
            aria-label="Previous page"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex max-w-full items-center gap-1 overflow-x-auto pb-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`h-9 w-9 shrink-0 rounded-xl border text-sm font-bold transition ${
                  page === currentPage
                    ? 'border-indigo-400/50 bg-indigo-500/20 text-indigo-100 shadow-[0_0_0_1px_rgba(129,140,248,0.18)]'
                    : 'border-white/10 bg-white/5 text-indigo-100/50 hover:border-white/20 hover:bg-white/10 hover:text-indigo-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next page"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-100/30" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-indigo-100/30 focus:border-indigo-400/50 focus:outline-none transition"
      />
    </div>
  );
}
