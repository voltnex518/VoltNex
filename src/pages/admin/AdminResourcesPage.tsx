import React, { useState } from 'react';
import {
  Upload,
  Trash2,
  Edit,
  ExternalLink,
  Plus,
  Save,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Resource } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { useToast } from '../../components/common/Toast';
import { uploadFile, validateUploadFile } from '../../lib/storage';
import { EmptyState } from '../../components/common/EmptyState';

export const AdminResourcesPage: React.FC = () => {
  const { resources, saveResource, deleteResource } = useData();
  const { success, error: toastError } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRes, setEditingRes] = useState<Partial<Resource> | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [technology, setTechnology] = useState('General Electronics');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('zip');
  const [fileSizeBytes, setFileSizeBytes] = useState<number>(0);

  const openCreateModal = () => {
    setEditingRes(null);
    setTitle('');
    setDescription('');
    setTechnology('General Electronics');
    setFileUrl('');
    setFileName('');
    setFileType('zip');
    setFileSizeBytes(0);
    setIsModalOpen(true);
  };

  const openEditModal = (res: Resource) => {
    setEditingRes(res);
    setTitle(res.title);
    setDescription(res.description);
    setTechnology(res.technology);
    setFileUrl(res.file_url);
    setFileName(res.file_name);
    setFileType(res.file_type);
    setFileSizeBytes(res.file_size_bytes || 0);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, 'download');
    if (!validation.isValid) {
      toastError('Validation Failed', validation.error);
      return;
    }

    setIsUploading(true);
    const { url, error } = await uploadFile(file, 'project-downloads');
    setIsUploading(false);

    if (error) {
      toastError('Upload Error', error);
    } else {
      success('File Uploaded', `${validation.sanitizedName} is ready.`);
      setFileUrl(url);
      setFileName(validation.sanitizedName || file.name);
      setFileType(validation.extension || 'bin');
      setFileSizeBytes(file.size);
      if (!title) {
        setTitle(validation.sanitizedName?.replace(/[-_]/g, ' ') || 'New File');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError('Validation Error', 'Title is required.');
      return;
    }
    if (!fileUrl.trim()) {
      toastError('Validation Error', 'Please upload a file or specify a file URL.');
      return;
    }

    setIsSaving(true);
    const res = await saveResource({
      id: editingRes?.id,
      title: title.trim(),
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: description.trim(),
      file_url: fileUrl.trim(),
      file_name: fileName.trim() || 'archive.zip',
      file_type: fileType.toLowerCase(),
      file_size_bytes: fileSizeBytes,
      technology,
      status: 'published',
    });

    setIsSaving(false);
    if (res.success) {
      success('Resource Saved', 'Hardware file has been updated.');
      setIsModalOpen(false);
    } else {
      toastError('Save Error', res.error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const res = await deleteResource(deleteTargetId);
    setIsDeleting(false);
    if (res.success) {
      success('Resource Deleted', 'File record removed.');
      setDeleteTargetId(null);
    } else {
      toastError('Delete Error', res.error);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
            Resources & Hardware Downloads
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload and manage downloadable Arduino code, KiCad project archives, schematics, and pinout PDFs.
          </p>
        </div>

        <Button onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
          Upload Resource
        </Button>
      </div>

      {resources.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-xs font-mono text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold">Resource Title</th>
                  <th className="py-3 px-4 font-semibold">Technology</th>
                  <th className="py-3 px-4 font-semibold">Type & Size</th>
                  <th className="py-3 px-4 font-semibold">Downloads</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-sm">
                      <div className="truncate">{res.title}</div>
                      <span className="text-xs font-mono text-slate-400 truncate block">
                        {res.file_name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {res.technology}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      <span className="uppercase font-bold text-slate-700">.{res.file_type}</span>{' '}
                      • {formatFileSize(res.file_size_bytes)}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-blue-600 font-bold">
                      {res.download_count}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={res.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition"
                          title="Direct Link"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(res)}
                          className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(res.id)}
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
          title="No resources in vault"
          description="Upload your first circuit schematic, PDF guide, or firmware package."
          actionText="Upload File"
          onAction={openCreateModal}
        />
      )}

      {/* Upload & Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRes ? 'Edit Resource' : 'Upload Hardware Resource'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              File Attachment *
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <div className="text-xs font-semibold text-slate-700">
                {isUploading ? 'Uploading to storage...' : fileName || 'Click or drag file to upload'}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Allowed: .ino, .c, .cpp, .py, .zip, .pdf (Max: 50MB)
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Resource Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. ESP32 Deep Sleep Boilerplate"
              className="w-full bg-slate-50 text-sm px-3.5 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                Technology
              </label>
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200"
              >
                <option value="General Electronics">General Electronics</option>
                <option value="Arduino">Arduino</option>
                <option value="ESP32">ESP32</option>
                <option value="Robotics">Robotics</option>
                <option value="IoT">IoT</option>
                <option value="Embedded Systems">Embedded Systems</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                File Extension
              </label>
              <input
                type="text"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                placeholder="zip, pdf, ino..."
                className="w-full bg-slate-50 text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Engineering notes and instructions..."
              className="w-full bg-slate-50 text-xs p-3 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              Direct File URL
            </label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="Storage URL"
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
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Resource"
        message="Are you sure you want to remove this downloadable resource?"
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
};
