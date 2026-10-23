import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  Cpu,
  Share2,
  Sparkles,
  ArrowRight,
  Plus,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/Toast';
import { DifficultyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Arduino',
  'ESP32 and ESP8266',
  'Robotics',
  'Sensors',
  'IoT',
  'Power electronics',
  'LED circuits',
  'Motor control',
  'Beginner electronics',
];

export const CircuitsPage: React.FC = () => {
  const { circuits } = useData();
  const { success } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'buildTime'>('newest');

  // Filter published circuits only
  const publishedCircuits = useMemo(() => {
    return circuits.filter((c) => c.status === 'published');
  }, [circuits]);

  // Featured circuits
  const featuredCircuits = useMemo(() => {
    return publishedCircuits.filter((c) => c.featured);
  }, [publishedCircuits]);

  // Filtered and sorted circuits
  const filteredCircuits = useMemo(() => {
    return publishedCircuits
      .filter((c) => {
        const matchesCategory =
          selectedCategory === 'All' ||
          c.category.toLowerCase() === selectedCategory.toLowerCase();

        const matchesDifficulty =
          selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;

        const matchesSearch =
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          c.description.toLowerCase().includes(search.toLowerCase()) ||
          c.category.toLowerCase().includes(search.toLowerCase()) ||
          c.circuit_data.components.some(
            (comp) =>
              comp.label.toLowerCase().includes(search.toLowerCase()) ||
              comp.reference.toLowerCase().includes(search.toLowerCase())
          );

        return matchesCategory && matchesDifficulty && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return a.estimated_build_minutes - b.estimated_build_minutes;
      });
  }, [publishedCircuits, selectedCategory, selectedDifficulty, search, sortBy]);

  const handleShare = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/circuits/${slug}`;
    navigator.clipboard.writeText(url);
    success('Link Copied', 'Public circuit blueprint link copied to clipboard.');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200/60 text-blue-700 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Interactive Engineering Blueprints</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
              VoltNex Circuit Studio
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Discover verified schematics, inspect component pinouts, and simulate interactive
              circuit behaviors in real time. Fork any design directly into the visual builder.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/circuits/builder">
              <Button variant="primary" className="shadow-md shadow-blue-500/20">
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Launch Circuit Studio</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Section */}
        {featuredCircuits.length > 0 && selectedCategory === 'All' && !search && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <h2 className="text-lg font-bold text-slate-900 font-display">Featured Blueprints</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCircuits.map((circ) => (
                <div
                  key={circ.id}
                  onClick={() => navigate(`/circuits/${circ.slug}`)}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Schematic Canvas Preview Thumbnail */}
                  <div className="h-44 bg-[#090D16] relative flex items-center justify-center p-4 border-b border-slate-800/80 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    
                    {/* Visual preview representation */}
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                        <Cpu className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono text-cyan-300 font-semibold">
                        {circ.circuit_data.components.length} Components • {circ.circuit_data.wires.length} Wires
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 z-10">
                      <DifficultyBadge difficulty={circ.difficulty} />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-blue-600">
                        {circ.category}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mt-1 line-clamp-1">
                        {circ.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {circ.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {circ.estimated_build_minutes} mins
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleShare(circ.slug, e)}
                          title="Share Link"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                          Inspect <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search circuits by title, component, or sensor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
              />
            </div>

            {/* Sorting & Difficulty Selectors */}
            <div className="flex items-center gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 transition shadow-sm"
              >
                <option value="All">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 transition shadow-sm"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="buildTime">Sort: Build Time</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Circuit Cards Grid */}
        {filteredCircuits.length === 0 ? (
          <EmptyState
            title="No Circuits Found"
            description="No electronic circuit blueprints matched your selected category and query."
            actionText="Reset Search & Filters"
            onAction={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedDifficulty('All');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCircuits.map((circ) => (
              <div
                key={circ.id}
                onClick={() => navigate(`/circuits/${circ.slug}`)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-blue-500/40 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                {/* Visual Thumbnail */}
                <div className="h-40 bg-[#090D16] relative flex items-center justify-center p-4 border-b border-slate-800">
                  <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      {circ.circuit_data.components.length} components • {circ.circuit_data.wires.length} wires
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <DifficultyBadge difficulty={circ.difficulty} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-semibold">
                      {circ.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition mt-1 line-clamp-1">
                      {circ.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {circ.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {circ.estimated_build_minutes} mins
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleShare(circ.slug, e)}
                        title="Copy Share Link"
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
