import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  ArrowLeft,
  Calendar,
  Share2,
  Check,
  ChevronRight,
  AlertTriangle,
  Cpu,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DifficultyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const TutorialDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getTutorialBySlug, projects } = useData();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);

  const tutorial = slug ? getTutorialBySlug(slug) : undefined;

  if (!tutorial || tutorial.status !== 'published') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Tutorial Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          The requested guide may have been relocated or is currently in draft review.
        </p>
        <Button onClick={() => navigate('/tutorials')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Tutorials
        </Button>
      </div>
    );
  }

  // Related projects
  const relatedProjects = projects.filter((p) => p.status === 'published').slice(0, 3);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {}
  };

  return (
    <article className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/tutorials" className="hover:text-blue-600 transition">
            Tutorials
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium truncate">{tutorial.title}</span>
        </nav>

        {/* Article Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-subtle mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <DifficultyBadge difficulty={tutorial.difficulty} />
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <Clock className="w-3.5 h-3.5 text-cyan-600" />
              <span>{tutorial.read_time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{new Date(tutorial.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-snug">
            {tutorial.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 mt-4 leading-relaxed font-sans">
            {tutorial.summary}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="flex flex-wrap gap-1.5">
              {tutorial.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-mono bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            >
              {copiedLink ? 'Copied URL!' : 'Share Guide'}
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        {tutorial.cover_image && (
          <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md mb-10 aspect-[16/9] bg-slate-900">
            <img
              src={tutorial.cover_image}
              alt={tutorial.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-subtle mb-12">
          <div className="text-slate-800 leading-relaxed space-y-6 text-sm sm:text-base font-sans whitespace-pre-line">
            {tutorial.content}
          </div>
        </div>

        {/* Related Projects Callout */}
        {relatedProjects.length > 0 && (
          <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase mb-2">
              <Cpu className="w-4 h-4" />
              <span>Apply Your Knowledge</span>
            </div>
            <h3 className="text-xl font-bold font-display">
              Tested Blueprints Using These Concepts
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Ready to wire up circuits? Follow these complete assembly blueprints with downloadable firmware.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              {relatedProjects.map((p) => (
                <Link
                  key={p.id}
                  to={`/projects/${p.slug}`}
                  className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/60 transition group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase text-cyan-400">
                      {p.difficulty}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition mt-1 line-clamp-2">
                      {p.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mt-3">
                    {p.estimated_time} build
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
