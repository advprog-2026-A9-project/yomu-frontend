import React from 'react';
import { Zap, Shield, Users, Trophy, Gift } from 'lucide-react';

interface BenefitItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function BenefitsSection() {
  const benefits: BenefitItem[] = [
    {
      icon: <Zap size={28} className="text-yellow-300" />,
      title: 'Score Boosts',
      description: 'Earn multipliers and boosts when completing reading challenges with your clan.',
    },
    {
      icon: <Trophy size={28} className="text-orange-300" />,
      title: 'League Competition',
      description: 'Compete with other clans in ranked seasons and climb the leaderboard together.',
    },
    {
      icon: <Users size={28} className="text-blue-300" />,
      title: 'Social Learning',
      description: 'Share progress, discuss books, and learn from fellow clan members.',
    },
    {
      icon: <Shield size={28} className="text-emerald-300" />,
      title: 'Clan Achievements',
      description: 'Unlock exclusive clan-wide achievements and team milestones.',
    },
    {
      icon: <Gift size={28} className="text-pink-300" />,
      title: 'Exclusive Rewards',
      description: 'Earn special badges, cosmetics, and bonuses exclusive to clan members.',
    },
    {
      icon: <Trophy size={28} className="text-cyan-300" />,
      title: 'Leaderboard Dominance',
      description: 'Track your clan\'s rank and celebrate victories with your team.',
    },
  ];

  return (
    <div className="yomu-container py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black sm:text-4xl text-white">Why Join a Clan?</h2>
        <p className="mt-3 text-indigo-100/85">Level up your learning experience with these exclusive benefits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="yomu-glass group rounded-2xl border border-white/10 p-6 transition hover:border-indigo-400/30 hover:shadow-lg hover:shadow-indigo-600/20"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 group-hover:bg-white/20 transition">
              {benefit.icon}
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">{benefit.title}</h3>
            <p className="text-sm text-indigo-100/80">{benefit.description}</p>
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="mt-12 grid grid-cols-3 gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
        <div>
          <p className="text-4xl font-black text-indigo-200">50K+</p>
          <p className="mt-2 text-sm text-indigo-100/70">Members in Clans</p>
        </div>
        <div>
          <p className="text-4xl font-black text-indigo-200">1.2K+</p>
          <p className="mt-2 text-sm text-indigo-100/70">Active Clans</p>
        </div>
        <div>
          <p className="text-4xl font-black text-indigo-200">$50K+</p>
          <p className="mt-2 text-sm text-indigo-100/70">Rewards Distributed</p>
        </div>
      </div>
    </div>
  );
}
