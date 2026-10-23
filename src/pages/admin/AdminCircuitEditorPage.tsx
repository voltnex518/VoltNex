import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Zap,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/Toast';
import { Button } from '../../components/common/Button';

const CATEGORIES = [
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

export const AdminCircuitEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { circuits, saveCircuit } = useData();
  const { success, error: toastError } = useToast();

  const isEdit = Boolean(id);
  const existingCircuit = isEdit ? circuits.find((c) => c.id === id) : null;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Arduino');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [estimatedBuildMinutes, setEstimatedBuildMinutes] = useState(30);
  const [instructions, setInstructions] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingCircuit) {
      setTitle(existingCircuit.title);
      setSlug(existingCircuit.slug);
      setDescription(existingCircuit.description);
      setCategory(existingCircuit.category);
      setDifficulty(existingCircuit.difficulty);
      setEstimatedBuildMinutes(existingCircuit.estimated_build_minutes);
      setInstructions(existingCircuit.instructions || '');
      setSafetyNotes(existingCircuit.safety_notes || '');
      setStatus(existingCircuit.status);
      setFeatured(existingCircuit.featured);
    }
  }, [existingCircuit]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEdit || !slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toastError('Validation Error', 'Title is required.');
      return;
    }

    setIsSubmitting(true);
    const res = await saveCircuit({
      id: isEdit ? id : undefined,
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      category,
      difficulty,
      estimated_build_minutes: Number(estimatedBuildMinutes) || 30,
      instructions: instructions.trim(),
      safety_notes: safetyNotes.trim(),
      status,
      featured,
      circuit_data: existingCircuit?.circuit_data || {
        version: 1,
        components: [],
        wires: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      },
    });
    setIsSubmitting(false);

    if (res.success && res.data) {
      success('Circuit Saved', `Blueprint "${res.data.title}" saved successfully.`);
      navigate('/admin/circuits');
    } else {
      toastError('Save Failed', res.error || 'Failed to save circuit.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/circuits"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              {isEdit ? 'Edit Circuit Blueprint' : 'Create New Circuit'}
            </h1>
            <span className="text-xs text-slate-500">
              Configure metadata, documentation, and schematic wiring.
            </span>
          </div>
        </div>

        {isEdit && (
          <Link to={`/circuits/builder?id=${id}`}>
            <Button variant="outline" size="sm" className="shadow-sm">
              <Zap className="w-4 h-4 mr-1.5 text-cyan-600" />
              <span>Open in Circuit Studio</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Main Edit Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Circuit Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. ESP32 Weather Station Node"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="esp32-weather-station-node"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Summary Description *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief overview explaining what this circuit accomplishes and why makers should build it..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Estimated Build Time (minutes)
              </label>
              <input
                type="number"
                min="5"
                value={estimatedBuildMinutes}
                onChange={(e) => setEstimatedBuildMinutes(parseInt(e.target.value, 10) || 15)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Instructions & Safety Notes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
            Educational Documentation
          </h2>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Build Instructions
            </label>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Step 1. Place the Arduino on the breadboard...&#10;Step 2. Connect the 5V rail..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">
              Electrical Safety Warnings
            </label>
            <textarea
              rows={3}
              value={safetyNotes}
              onChange={(e) => setSafetyNotes(e.target.value)}
              placeholder="Caution: Never connect high current loads directly to microcontroller GPIO pins..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Publication & Visibility */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 font-mono">
            Publication Status
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft (Hidden from public)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span>Feature on Circuit Gallery Hero</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link to="/admin/circuits">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isEdit ? 'Save Changes' : 'Create & Open Studio'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
};
