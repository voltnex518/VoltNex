import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Button } from '../../components/common/Button';
import { StatusBadge, DifficultyBadge } from '../../components/common/Badge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminCircuitsPage: React.FC = () => {
  const { circuits, deleteCircuit, toggleCircuitPublish, toggleCircuitFeatured } = useData();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCircuits = useMemo(() => {
    return circuits.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesTitle = c.title.toLowerCase().includes(q);
        const matchesDesc = c.description.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }
      if (statusFilter !== 'all' && c.status !== statusFilter) return false;
      return true;
    });
  }, [circuits, search, statusFilter]);

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const res = await toggleCircuitPublish(id);
    if (res.success) {
      success(
        'Status Updated',
        `Circuit is now ${currentStatus === 'published' ? 'Draft' : 'Published'}.`
      );
    } else {
      toastError('Update Failed', res.error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    const res = await toggleCircuitFeatured(id);
    if (res.success) {
      success('Updated', 'Featured flag toggled.');
    } else {
      toastError('Update Failed', res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const res = await deleteCircuit(deleteTargetId);
    setIsDeleting(false);
    if (res.success) {
      success('Circuit Deleted', 'The schematic has been removed.');
      setDeleteTargetId(null);
    } else {
      toastError('Delete Failed', res.error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
            Circuit Blueprints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, simulate, and publish interactive hardware circuit designs for makers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/circuits/builder">
            <Button variant="outline" size="sm">
              <Zap className="w-4 h-4 mr-1.5 text-cyan-600" />
              <span>Launch Studio</span>
            </Button>
          </Link>
          <Link to="/admin/circuits/new">
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>New Circuit</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search circuits by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Circuit Records Table */}
      {filteredCircuits.length === 0 ? (
        <EmptyState
          title="No Circuits Found"
          description="No circuit blueprints found. Create your first circuit design in Circuit Studio!"
          actionText="Create Blueprint"
          onAction={() => navigate('/admin/circuits/new')}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="py-3 px-4">Title & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Complexity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCircuits.map((circ) => (
                  <tr key={circ.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 text-cyan-400 flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold">
                          {circ.circuit_data.components.length}p
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 line-clamp-1">{circ.title}</h4>
                            <button
                              onClick={() => handleToggleFeatured(circ.id)}
                              title="Toggle featured flag"
                              className={`px-1.5 py-0.5 rounded text-[10px] font-semibold flex items-center gap-0.5 transition ${
                                circ.featured
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                              }`}
                            >
                              <Sparkles className="w-2.5 h-2.5" />
                              {circ.featured ? 'Featured' : 'Standard'}
                            </button>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                            /{circ.slug} • {circ.estimated_build_minutes} mins
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">{circ.category}</td>

                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={circ.difficulty} />
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleTogglePublish(circ.id, circ.status)}
                        title="Click to toggle publish status"
                        className="transition hover:opacity-80"
                      >
                        <StatusBadge status={circ.status} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/circuits/builder?id=${circ.id}`}
                          title="Open in Visual Circuit Studio"
                          className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition"
                        >
                          <Zap className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/admin/circuits/edit/${circ.id}`}
                          title="Edit Blueprint Metadata"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <a
                          href={`/circuits/${circ.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View Live Circuit"
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setDeleteTargetId(circ.id)}
                          title="Delete Circuit"
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Circuit Blueprint"
        message="Are you sure you want to permanently delete this circuit schematic? This action cannot be undone."
        confirmText="Delete Permanently"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
