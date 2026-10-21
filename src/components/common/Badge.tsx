import type { DifficultyLevel, ContentStatus } from '../../types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
  size?: 'sm' | 'md';
}

export const DifficultyBadge: React.FC<DifficultyBadgeProps> = ({ difficulty, size = 'md' }) => {
  const styles = {
    Beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    Intermediate: 'bg-blue-50 text-blue-700 border-blue-200/80',
    Advanced: 'bg-purple-50 text-purple-700 border-purple-200/80',
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${styles[difficulty] || styles.Beginner} ${sizeClass}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          difficulty === 'Beginner'
            ? 'bg-emerald-500'
            : difficulty === 'Intermediate'
            ? 'bg-blue-500'
            : 'bg-purple-500'
        }`}
      />
      {difficulty}
    </span>
  );
};

interface StatusBadgeProps {
  status: ContentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    draft: 'bg-amber-50 text-amber-700 border-amber-200',
    archived: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${
        styles[status] || styles.draft
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === 'published' ? 'bg-emerald-500' : status === 'draft' ? 'bg-amber-500' : 'bg-slate-400'
        }`}
      />
      {status}
    </span>
  );
};
