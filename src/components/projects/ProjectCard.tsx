import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Cpu, ArrowUpRight, Sparkles } from 'lucide-react';
import type { Project } from '../../types';
import { DifficultyBadge } from '../common/Badge';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle hover:shadow-elevated hover:border-blue-200 transition-all duration-300 flex flex-col h-full">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={project.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <DifficultyBadge difficulty={project.difficulty} size="sm" />
          {project.featured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-slate-950 shadow-sm">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              Featured
            </span>
          )}
        </div>

        {/* Estimated Build Time Badge */}
        <div className="absolute bottom-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/60 text-slate-200 text-xs font-mono flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{project.estimated_time}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Categories / Tags */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.categories?.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            <Link to={`/projects/${project.slug}`} className="focus:outline-none">
              {project.title}
            </Link>
          </h3>

          <p className="text-sm text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 font-mono">
            <Cpu className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.components?.length || 0} Components</span>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 group-hover:translate-x-0.5 transition-transform"
          >
            <span>View Blueprint</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
