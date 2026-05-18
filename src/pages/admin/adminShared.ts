import { ClanResponse } from '../../services/socialAPI';

export type SortKey = 'tier' | 'score';
export type SortDirection = 'asc' | 'desc';

const tierRank: Record<string, number> = {
  BRONZE: 1,
  SILVER: 2,
  GOLD: 3,
  DIAMOND: 4,
};

export const CLAN_MAX_MEMBERS = 50;

export const achievementTypes = [
  { label: 'Readings completed', value: 'readings_completed' },
  { label: 'Quizzes passed', value: 'quizzes_passed' },
  { label: 'Accuracy above', value: 'accuracy_above' },
  { label: 'Clan promoted', value: 'clan_promoted' },
  { label: 'Ranking achieved', value: 'ranking_achieved' },
];

export const missionTypes = [
  { label: 'Read n articles', value: 'read_n_articles' },
  { label: 'Complete n quizzes', value: 'complete_n_quizzes' },
  { label: 'Achieve accuracy', value: 'achieve_accuracy' },
];

export function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

export function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function badgeClassForModifier(multiplier: string) {
  if (multiplier.startsWith('x0')) {
    return 'border-red-400/30 bg-red-500/15 text-red-100';
  }
  return 'border-emerald-400/30 bg-emerald-500/15 text-emerald-100';
}

export function sortClans(clans: ClanResponse[], sortKey: SortKey, sortDirection: SortDirection) {
  return [...clans].sort((left, right) => {
    let comparison = 0;

    if (sortKey === 'tier') {
      comparison =
        (tierRank[left.tier.toUpperCase()] ?? 0) -
        (tierRank[right.tier.toUpperCase()] ?? 0);
    } else {
      comparison = (left.effectiveScore ?? left.score) - (right.effectiveScore ?? right.score);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });
}
