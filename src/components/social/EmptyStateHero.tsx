import React from 'react';

interface EmptyStateHeroProps {
  headline: string;
  subheadline: string;
  ctas: Array<{
    label: string;
    onClick: () => void;
    variant: 'primary' | 'secondary';
    icon?: React.ReactNode;
  }>;
}

export default function EmptyStateHero({ headline, subheadline, ctas }: EmptyStateHeroProps) {
  return (
    <div className="yomu-glass relative overflow-hidden rounded-3xl border border-indigo-200/20 px-6 py-16 sm:px-12 sm:py-24">
      {/* Background Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/10 pointer-events-none" />
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-2xl text-center">
        {/* Illustration/Icon */}
        <div className="mb-6 flex justify-center">
          <div className="text-7xl drop-shadow-lg">⚔️</div>
        </div>

        {/* Headline */}
        <h1 className="text-4xl font-black sm:text-5xl bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-200 bg-clip-text text-transparent">
          {headline}
        </h1>

        {/* Subheadline */}
        <p className="mt-4 text-lg text-indigo-100/85 max-w-lg mx-auto">
          {subheadline}
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row items-center justify-center">
          {ctas.map((cta, idx) => (
            <button
              key={idx}
              onClick={cta.onClick}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition ${
                cta.variant === 'primary'
                  ? 'yomu-button-primary'
                  : 'yomu-button-secondary'
              }`}
            >
              {cta.icon}
              {cta.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
