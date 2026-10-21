import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Category, DifficultyLevel, ProjectFilterState } from '../../types';

interface ProjectFiltersProps {
  categories: Category[];
  filters: ProjectFilterState;
  onChange: (filters: ProjectFilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  categories,
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

  const hasActiveFilters =
    filters.search || filters.category || filters.difficulty || filters.sortBy !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle mb-8">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search Arduino, ESP32, LoRa, robotics, sensors..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-mono text-slate-500 whitespace-nowrap">Sort by:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onChange({ ...filters, sortBy: e.target.value as any })}
            className="bg-slate-50 text-xs font-medium text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 transition"
          >
            <option value="newest">Newest Blueprints</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical (A-Z)</option>
            <option value="time">Estimated Build Time</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-2 rounded-xl transition"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Category:
        </span>
        <button
          onClick={() => onChange({ ...filters, category: '' })}
          className={`px-3 py-1.5 text-xs rounded-xl font-medium transition ${
            !filters.category
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => {
          const isSelected = filters.category === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onChange({ ...filters, category: isSelected ? '' : cat.slug })}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Difficulty Pills & Results Count */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-1">Difficulty:</span>
          {difficulties.map((diff) => {
            const isSelected = filters.difficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => onChange({ ...filters, difficulty: isSelected ? '' : diff })}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium border transition ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>

        <div className="text-xs font-mono text-slate-500">
          Showing <span className="font-bold text-slate-800">{totalResults}</span> blueprints
        </div>
      </div>
    </div>
  );
};
