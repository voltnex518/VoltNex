import React, { useState, useMemo } from 'react';
import {
  FolderDown,
  Search,
  FileCode,
  FileArchive,
  FileText,
  Download,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../components/common/Toast';

export const ResourcesPage: React.FC = () => {
  const { resources, recordDownload } = useData();
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const publishedResources = useMemo(() => {
    return resources.filter((r) => r.status === 'published');
  }, [resources]);

  // Unique technologies
  const techOptions = useMemo(() => {
    const list = new Set(publishedResources.map((r) => r.technology).filter(Boolean));
    return Array.from(list);
  }, [publishedResources]);

  const filteredResources = useMemo(() => {
    return publishedResources.filter((res) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = res.title.toLowerCase().includes(q);
        const matchesDesc = res.description.toLowerCase().includes(q);
        const matchesFilename = res.file_name.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesFilename) return false;
      }
      if (techFilter && res.technology !== techFilter) return false;
      if (typeFilter && res.file_type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      return true;
    });
  }, [publishedResources, search, techFilter, typeFilter]);

  const getFileIcon = (fileType: string) => {
    const t = fileType.toLowerCase();
    if (t === 'zip' || t === 'tar' || t === 'gz') {
      return <FileArchive className="w-5 h-5 text-amber-500" />;
    }
    if (t === 'pdf') {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    return <FileCode className="w-5 h-5 text-blue-500" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDownload = (id: string, fileName: string) => {
    recordDownload(id);
    success('Download Initiated', `Downloading ${fileName}...`);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-mono font-semibold mb-3 border border-blue-200/60">
            <FolderDown className="w-3.5 h-3.5" />
            <span>Open Hardware Vault</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 tracking-tight">
            Source Code, Schematics & CAD
          </h1>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            Directly download compiled Arduino libraries, KiCad schematics, pinout reference sheets, and 3D printable mechanical archives.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle mb-10 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search resources, firmware templates, pinouts, CAD bundles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 text-sm text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Technology filter */}
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="bg-slate-50 text-xs font-medium text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Technologies</option>
              {techOptions.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>

            {/* File Type filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-50 text-xs font-medium text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">All File Types</option>
              <option value="pdf">PDF Documents</option>
              <option value="zip">ZIP Packages</option>
              <option value="ino">Arduino Sketches (.ino)</option>
              <option value="cpp">C++ Source (.cpp)</option>
            </select>

            {(search || techFilter || typeFilter) && (
              <button
                onClick={() => {
                  setSearch('');
                  setTechFilter('');
                  setTypeFilter('');
                }}
                className="text-xs text-rose-600 hover:text-rose-700 px-2 py-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-subtle hover:shadow-elevated hover:border-blue-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {getFileIcon(res.file_type)}
                    </div>
                    <span className="text-[11px] font-mono font-semibold px-2 py-1 rounded bg-slate-100 text-slate-600 uppercase">
                      {res.technology}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 line-clamp-2 leading-snug">
                    {res.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="font-mono">
                    <span className="font-bold text-slate-700 uppercase">.{res.file_type}</span>
                    <span className="mx-1.5">•</span>
                    <span>{formatFileSize(res.file_size_bytes)}</span>
                  </div>

                  <a
                    href={res.file_url}
                    download={res.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleDownload(res.id, res.file_name)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-semibold bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resources found"
            description="We could not find any files matching your search filters. Try clearing your filters."
            actionText="Reset Filters"
            onAction={() => {
              setSearch('');
              setTechFilter('');
              setTypeFilter('');
            }}
          />
        )}
      </div>
    </div>
  );
};
