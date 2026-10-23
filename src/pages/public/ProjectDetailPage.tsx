import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Cpu,
  Layers,
  Code2,
  FolderDown,
  AlertTriangle,
  ShieldAlert,
  ArrowLeft,
  Calendar,
  Share2,
  Check,
  CheckCircle2,
  FileCode,
  FileArchive,
  FileText,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { DifficultyBadge } from '../../components/common/Badge';
import { BOMTable } from '../../components/projects/BOMTable';
import { CircuitViewer } from '../../components/common/CircuitViewer';
import { CodeBlock } from '../../components/common/CodeBlock';
import { Button } from '../../components/common/Button';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProjectBySlug, projects, circuits, recordDownload } = useData();
  const navigate = useNavigate();
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'circuit' | 'code' | 'steps' | 'downloads'>('overview');

  const project = slug ? getProjectBySlug(slug) : undefined;

  // If project is not found or is draft, handle 404
  if (!project || project.status !== 'published') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Blueprint Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
          The requested hardware project may have been moved, archived, or is awaiting publication review.
        </p>
        <Button onClick={() => navigate('/projects')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Projects Library
        </Button>
      </div>
    );
  }

  // Related projects in the same categories
  const relatedProjects = projects
    .filter(
      (p) =>
        p.id !== project.id &&
        p.status === 'published' &&
        p.categories?.some((cat) => project.categories?.some((pc) => pc.id === cat.id))
    )
    .slice(0, 3);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t === 'zip' || t === 'tar' || t === 'gz') return <FileArchive className="w-4 h-4 text-amber-500" />;
    if (t === 'pdf') return <FileText className="w-4 h-4 text-rose-500" />;
    return <FileCode className="w-4 h-4 text-blue-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Available';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/projects" className="hover:text-blue-600 transition">
            Blueprints
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium truncate max-w-xs">{project.title}</span>
        </nav>

        {/* Header Block */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-subtle mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-4 max-w-3xl">
              {/* Category tags & Difficulty */}
              <div className="flex flex-wrap items-center gap-2">
                <DifficultyBadge difficulty={project.difficulty} />
                {project.categories?.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/projects?category=${cat.slug}`}
                    className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200/60 transition"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900 tracking-tight leading-snug">
                {project.title}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed font-sans">
                {project.summary}
              </p>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-mono text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Build Time: {project.estimated_time}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Updated: {new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-emerald-600" />
                  <span>{project.components?.length || 0} Components Required</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="lg:w-72 flex-shrink-0 flex flex-col gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleShare}
                leftIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              >
                {copiedLink ? 'Link Copied to Clipboard!' : 'Share Blueprint'}
              </Button>
              {project.files && project.files.length > 0 && (
                <a
                  href="#downloads-section"
                  onClick={() => setActiveTab('downloads')}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  <FolderDown className="w-4 h-4" />
                  <span>Download Files ({project.files.length})</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Cover Photo */}
        <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md mb-8 aspect-[21/9] max-h-[440px] bg-slate-900">
          <img
            src={project.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=80'}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 overflow-x-auto pb-1">
          {[
            { id: 'overview', label: 'Overview & Specs', icon: Layers },
            { id: 'circuit', label: 'Schematic & Wiring', icon: Cpu },
            { id: 'steps', label: 'Assembly Guide', icon: CheckCircle2 },
            { id: 'code', label: 'Source Code', icon: Code2 },
            { id: 'downloads', label: 'Downloads', icon: FolderDown },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  isActive
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Content Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Markdown Description */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle prose prose-slate max-w-none">
                  <h3 className="text-xl font-bold font-display text-slate-900 mb-4">
                    Architectural Overview
                  </h3>
                  <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-sm sm:text-base">
                    {project.description}
                  </div>
                </div>

                {/* Bill of Materials Table */}
                {project.components && project.components.length > 0 && (
                  <BOMTable components={project.components} />
                )}

                {/* Safety & Troubleshooting Alerts */}
                {project.safety_notes && (
                  <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-600" />
                    <div>
                      <h4 className="text-sm font-bold">Safety Precautions & Voltage Warnings</h4>
                      <p className="text-xs sm:text-sm mt-1 text-amber-800 leading-relaxed font-sans">
                        {project.safety_notes}
                      </p>
                    </div>
                  </div>
                )}

                {project.troubleshooting_notes && (
                  <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-slate-500" />
                    <div>
                      <h4 className="text-sm font-bold">Lab Troubleshooting & Gotchas</h4>
                      <div className="text-xs sm:text-sm mt-1 text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                        {project.troubleshooting_notes}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CIRCUIT & WIRING */}
            {activeTab === 'circuit' && (
              <div className="space-y-6">
                {/* Interactive Circuit Studio Link Banner */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                        Circuit Studio Integration
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white">Interactive Schematic & Pinout Sandbox</h4>
                    <p className="text-xs text-slate-300">
                      Simulate logic states, test component connections, or fork this design into your visual workspace.
                    </p>
                  </div>
                  <Link
                    to={
                      circuits.find((c) => c.slug.includes(project.slug) || project.slug.includes(c.slug))
                        ? `/circuits/${circuits.find((c) => c.slug.includes(project.slug) || project.slug.includes(c.slug))!.slug}`
                        : '/circuits'
                    }
                  >
                    <Button variant="primary" size="sm" className="whitespace-nowrap shadow-md shadow-cyan-500/20">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      <span>Explore In Circuit Studio</span>
                    </Button>
                  </Link>
                </div>

                {project.circuit_diagram_url ? (
                  <CircuitViewer
                    imageUrl={project.circuit_diagram_url}
                    title={project.title}
                    wiringNotes={project.wiring_notes}
                  />
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <Cpu className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      Schematic diagram is being rendered for this blueprint. Check the wiring notes below.
                    </p>
                    {project.wiring_notes && (
                      <p className="text-xs text-slate-700 mt-4 max-w-md mx-auto bg-slate-50 p-4 rounded-xl border">
                        {project.wiring_notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: STEPS */}
            {activeTab === 'steps' && (
              <div className="space-y-6">
                {project.steps && project.steps.length > 0 ? (
                  project.steps.map((step, sIdx) => (
                    <div
                      key={step.id || sIdx}
                      className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle flex flex-col sm:flex-row gap-6"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                        {step.step_number || sIdx + 1}
                      </div>
                      <div className="flex-1 space-y-3">
                        <h4 className="text-lg font-bold text-slate-900">{step.title}</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">{step.content}</p>
                        {step.image_url && (
                          <div className="mt-4 rounded-xl overflow-hidden border border-slate-200 max-h-72 bg-slate-900">
                            <img
                              src={step.image_url}
                              alt={step.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500">
                      Assembly steps are structured in the main blueprint overview.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: CODE */}
            {activeTab === 'code' && (
              <div className="space-y-6">
                {project.code_snippets && project.code_snippets.length > 0 ? (
                  project.code_snippets.map((snip, cIdx) => (
                    <div key={snip.id || cIdx}>
                      <CodeBlock
                        code={snip.code}
                        language={snip.language}
                        filename={snip.filename}
                        title={snip.title}
                      />
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <Code2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      No standalone code snippets attached. Refer to downloadable .ino files.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: DOWNLOADS */}
            {activeTab === 'downloads' && (
              <div id="downloads-section" className="space-y-4">
                {project.files && project.files.length > 0 ? (
                  project.files.map((file, fIdx) => (
                    <div
                      key={file.id || fIdx}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-subtle flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                          {getFileIcon(file.file_type)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">
                            {file.title}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">
                            .{file.file_type.toUpperCase()} • {formatFileSize(file.file_size_bytes)}
                          </span>
                        </div>
                      </div>

                      <a
                        href={file.file_url}
                        download
                        onClick={() => file.id && recordDownload(file.id)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition"
                      >
                        <FolderDown className="w-4 h-4" />
                        <span>Download</span>
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                    <p className="text-sm text-slate-500">
                      No downloadable files currently packaged for this blueprint. Check source code tab for inline code.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            {/* Quick Sourcing Checklist */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Quick Parts Breakdown</span>
              </h3>
              <ul className="space-y-3 text-xs">
                {project.components?.slice(0, 5).map((comp, idx) => (
                  <li key={idx} className="flex items-center justify-between border-b border-slate-100 pb-2 last:border-0">
                    <span className="text-slate-700 font-medium truncate mr-2">{comp.name}</span>
                    <span className="font-mono text-blue-600 font-semibold">{comp.quantity}</span>
                  </li>
                ))}
              </ul>
              {project.components && project.components.length > 5 && (
                <button
                  onClick={() => setActiveTab('overview')}
                  className="mt-4 text-xs font-semibold text-blue-600 hover:underline block text-center w-full"
                >
                  View all {project.components.length} parts in BOM Table
                </button>
              )}
            </div>

            {/* Related Blueprints */}
            {relatedProjects.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Related Blueprints
                </h3>
                <div className="space-y-4">
                  {relatedProjects.map((rel) => (
                    <div
                      key={rel.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-300 transition"
                    >
                      <span className="text-[10px] font-mono font-semibold uppercase text-blue-600">
                        {rel.difficulty}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition mt-1 line-clamp-1">
                        <Link to={`/projects/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rel.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
