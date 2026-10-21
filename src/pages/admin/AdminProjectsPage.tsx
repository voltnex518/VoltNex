import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { StatusBadge, DifficultyBadge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminProjectsPage: React.FC = () => {
  const { projects, deleteProject, toggleProjectPublish } = useData();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSummary = p.summary.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSummary) return false;
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      return true;
    });
  }, [projects, search, statusFilter]);

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const res = await toggleProjectPublish(id);
    if (res.success) {
      success(
        'Status Updated',
        `Project is now ${currentStatus === 'published' ? 'Draft' : 'Published'}.`
      );
    } else {
      toastError('Update Failed', res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const res = await deleteProject(deleteTargetId);
    setIsDeleting(false);
    if (res.success) {
      success('Project Deleted', 'The blueprint has been removed.');
      setDeleteTargetId(null);
    } else {
      toastError('Delete Failed', res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Manage Hardware Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author, edit, preview, and toggle draft/publication status for all blueprints.
          </p>
        </div>

        <Link to="/admin/projects/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            New Blueprint
          </Button>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-subtle flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search projects by title or summary..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'published', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl capitalize transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table */}
      {filteredProjects.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Blueprint Title</th>
                  <th className="py-3 px-4 font-semibold">Difficulty</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Featured</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={proj.cover_image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-800 flex-shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 truncate max-w-md">
                            {proj.title}
                          </h4>
                          <span className="text-xs font-mono text-slate-400">
                            /{proj.slug} • {proj.estimated_time}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={proj.difficulty} size="sm" />
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(proj.id, proj.status)}
                        className="cursor-pointer"
                        title="Click to toggle publish status"
                      >
                        <StatusBadge status={proj.status} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      {proj.featured ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Sparkles className="w-3 h-3 fill-amber-500" />
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {proj.status === 'published' && (
                          <Link
                            to={`/projects/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                            title="Public Live Preview"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/projects/edit/${proj.id}`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteTargetId(proj.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No projects found"
          description="You don't have any projects matching the selected filter."
          actionText="Create New Blueprint"
          onAction={() => (window.location.href = '/admin/projects/new')}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Hardware Blueprint"
        message="Are you sure you want to delete this project? This will remove all associated components, assembly instructions, code snippets, and downloadable attachments."
        confirmText="Delete Permanently"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
