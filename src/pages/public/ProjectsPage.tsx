import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Cpu, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { ProjectFilterState } from '../../types';
import { ProjectCard } from '../../components/projects/ProjectCard';
import { ProjectFilters } from '../../components/projects/ProjectFilters';
import { EmptyState } from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

export const ProjectsPage: React.FC = () => {
  const { projects, categories, isLoading } = useData();
  const [searchParams, setSearchParams] = useSearchParams();

  // Initial filter state from URL parameters
  const [filters, setFilters] = useState<ProjectFilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    difficulty: searchParams.get('difficulty') || '',
    technology: '',
    sortBy: (searchParams.get('sortBy') as any) || 'newest',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Keep URL parameters in sync
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.difficulty) params.set('difficulty', filters.difficulty);
    if (filters.sortBy !== 'newest') params.set('sortBy', filters.sortBy);
    setSearchParams(params, { replace: true });
    setCurrentPage(1); // Reset to page 1 on filter change
  }, [filters, setSearchParams]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: '',
      difficulty: '',
      technology: '',
      sortBy: 'newest',
    });
  };

  // Only public published projects
  const published = useMemo(() => {
    return projects.filter((p) => p.status === 'published');
  }, [projects]);

  // Filtered & Sorted
  const filteredProjects = useMemo(() => {
    return published.filter((proj) => {
      // Search query filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = proj.title.toLowerCase().includes(query);
        const matchesSummary = proj.summary.toLowerCase().includes(query);
        const matchesTags = proj.tags?.some((t) => t.toLowerCase().includes(query));
        const matchesComponents = proj.components?.some((c) => c.name.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesTags && !matchesComponents) {
          return false;
        }
      }

      // Category filter
      if (filters.category) {
        const hasCategory = proj.categories?.some((c) => c.slug === filters.category);
        if (!hasCategory) return false;
      }

      // Difficulty filter
      if (filters.difficulty && proj.difficulty !== filters.difficulty) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (filters.sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      if (filters.sortBy === 'time') {
        return a.estimated_time.localeCompare(b.estimated_time);
      }
      // default: newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [published, filters]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage, itemsPerPage]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold mb-3 border border-blue-200/60">
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware Blueprints & Schematics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Electronics & Robotics Library
          </h1>
          <p className="text-base text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Filter by microcontroller platform, sensors, and build complexity. Follow complete wiring pinouts and upload verified firmware.
          </p>
        </div>

        {/* Filter Toolbar */}
        <ProjectFilters
          categories={categories}
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          totalResults={filteredProjects.length}
        />

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : paginatedProjects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 font-mono text-xs font-semibold">
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            title="No blueprints found"
            description="No electronics blueprints match your filter combination. Try adjusting the search term or resetting the categories."
            actionText="Reset All Filters"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
};
