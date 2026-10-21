import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Save,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Tutorial, DifficultyLevel, ContentStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { StatusBadge, DifficultyBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminTutorialsPage: React.FC = () => {
  const { tutorials, saveTutorial, deleteTutorial, toggleTutorialPublish } = useData();
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTut, setEditingTut] = useState<Partial<Tutorial> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [readTime, setReadTime] = useState('10 min read');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [tagsInput, setTagsInput] = useState('');

  const openCreateModal = () => {
    setEditingTut(null);
    setTitle('');
    setSlug('');
    setSummary('');
    setContent('');
    setCoverImage('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80');
    setDifficulty('Beginner');
    setReadTime('8 min read');
    setStatus('published');
    setTagsInput('Arduino, Tutorial, Hardware');
    setIsModalOpen(true);
  };

  const openEditModal = (tut: Tutorial) => {
    setEditingTut(tut);
    setTitle(tut.title);
    setSlug(tut.slug);
    setSummary(tut.summary);
    setContent(tut.content);
    setCoverImage(tut.cover_image);
    setDifficulty(tut.difficulty);
    setReadTime(tut.read_time);
    setStatus(tut.status);
    setTagsInput(tut.tags?.join(', ') || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError('Validation Error', 'Title is required.');
      return;
    }

    setIsSaving(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const res = await saveTutorial({
      id: editingTut?.id,
      title: title.trim(),
      slug: slug.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary: summary.trim(),
      content: content.trim(),
      cover_image: coverImage,
      difficulty,
      read_time: readTime,
      status,
      tags,
    });

    setIsSaving(false);
    if (res.success) {
      success('Tutorial Saved', 'Article has been updated successfully.');
      setIsModalOpen(false);
    } else {
      toastError('Save Error', res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const res = await deleteTutorial(deleteTargetId);
    setIsDeleting(false);
    if (res.success) {
      success('Tutorial Deleted', 'Guide has been removed.');
      setDeleteTargetId(null);
    } else {
      toastError('Delete Error', res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Tutorials & Engineering Guides
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author structured step-by-step technical guides, firmware theory, and pinout physics.
          </p>
        </div>

        <Button onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          New Tutorial
        </Button>
      </div>

      {tutorials.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Difficulty</th>
                  <th className="py-3 px-4 font-semibold">Read Time</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tutorials.map((tut) => (
                  <tr key={tut.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-md">
                      <div>{tut.title}</div>
                      <span className="text-xs font-mono text-slate-400">/{tut.slug}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <DifficultyBadge difficulty={tut.difficulty} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      {tut.read_time}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleTutorialPublish(tut.id)}
                        title="Click to toggle publish status"
                      >
                        <StatusBadge status={tut.status} />
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {tut.status === 'published' && (
                          <Link
                            to={`/tutorials/${tut.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-cyan-600 rounded-lg hover:bg-cyan-50 transition"
                            title="Preview Tutorial"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <button
                          onClick={() => openEditModal(tut)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(tut.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
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
          title="No tutorials authored"
          description="Create your first tutorial guide to educate makers."
          actionText="Create Tutorial"
          onAction={openCreateModal}
        />
      )}

      {/* Editor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTut ? 'Edit Engineering Tutorial' : 'Author New Tutorial'}
        maxWidth="2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. ESP32 FreeRTOS Multitasking Guide"
              className="w-full bg-slate-50 text-sm px-3.5 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="10 min read"
                className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary..."
              className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Article Content (Markdown)
            </label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="# Article Title&#10;&#10;Detailed explanations and code..."
              className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ESP32, FreeRTOS, C++, RTOS"
              className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Tutorial
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Tutorial"
        message="Are you sure you want to permanently delete this tutorial article?"
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
