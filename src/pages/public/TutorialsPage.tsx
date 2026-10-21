import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Search, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DifficultyBadge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';

export const TutorialsPage: React.FC = () => {
  const { tutorials } = useData();
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const published = useMemo(() => {
    return tutorials.filter((t) => t.status === 'published');
  }, [tutorials]);

  const filteredTutorials = useMemo(() => {
    return published.filter((tut) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = tut.title.toLowerCase().includes(q);
        const matchesSummary = tut.summary.toLowerCase().includes(q);
        const matchesTags = tut.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesTags) return false;
      }
      if (selectedDifficulty && tut.difficulty !== selectedDifficulty) {
        return false;
      }
      return true;
    });
  }, [published, search, selectedDifficulty]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 text-xs font-mono font-semibold mb-3 border border-cyan-200/60">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Maker Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Embedded & Robotics Tutorials
          </h1>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            In-depth guides on microcontroller concurrency, bus communication protocols, low-noise power supplies, and sensor signal conditioning.
          </p>
        </div>

        {/* Search & Difficulty Filter */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle mb-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search tutorials (FreeRTOS, I2C, SPI, Interrupts)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
              const isSelected = (lvl === 'All' && !selectedDifficulty) || selectedDifficulty === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => setSelectedDifficulty(lvl === 'All' ? '' : lvl)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl transition ${
                    isSelected
                      ? 'bg-cyan-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tutorial Cards Grid */}
        {filteredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutorials.map((tut) => (
              <article
                key={tut.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle hover:shadow-elevated hover:border-cyan-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    <img
                      src={tut.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                      alt={tut.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <DifficultyBadge difficulty={tut.difficulty} size="sm" />
                    </div>
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 text-xs text-slate-200 px-2 py-0.5 rounded-md font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>{tut.read_time}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      <Link to={`/tutorials/${tut.slug}`}>{tut.title}</Link>
                    </h3>
                    <p className="text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                      {tut.summary}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {tut.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-cyan-600">
                  <Link
                    to={`/tutorials/${tut.slug}`}
                    className="inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No tutorials matched"
            description="We could not find guides matching your search query. Try searching for Arduino, ESP32, or SPI."
            actionText="Clear Filter"
            onAction={() => {
              setSearch('');
              setSelectedDifficulty('');
            }}
          />
        )}
      </div>
    </div>
  );
};
