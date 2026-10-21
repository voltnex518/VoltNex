import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import type { Project, DifficultyLevel, ContentStatus } from '../../types';
import { Button } from '../../components/common/Button';
import { useToast } from '../../components/common/Toast';
import { uploadFile, validateUploadFile } from '../../lib/storage';

export const AdminProjectEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, categories, saveProject } = useData();
  const { success, error: toastError } = useToast();

  const isEditing = Boolean(id);
  const existingProject = isEditing ? projects.find((p) => p.id === id) : undefined;

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Beginner');
  const [estimatedTime, setEstimatedTime] = useState('2-3 Hours');
  const [status, setStatus] = useState<ContentStatus>('draft');
  const [featured, setFeatured] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [circuitDiagramUrl, setCircuitDiagramUrl] = useState('');
  const [wiringNotes, setWiringNotes] = useState('');
  const [troubleshootingNotes, setTroubleshootingNotes] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');

  // Dynamic Sub-items
  const [components, setComponents] = useState<{ name: string; quantity: string; notes: string }[]>([]);
  const [steps, setSteps] = useState<{ title: string; content: string; image_url: string }[]>([]);
  const [codeSnippets, setCodeSnippets] = useState<{ title: string; filename: string; language: string; code: string }[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  // Load existing project into state
  useEffect(() => {
    if (existingProject) {
      setTitle(existingProject.title);
      setSlug(existingProject.slug);
      setSummary(existingProject.summary);
      setDescription(existingProject.description);
      setCoverImage(existingProject.cover_image);
      setDifficulty(existingProject.difficulty);
      setEstimatedTime(existingProject.estimated_time);
      setStatus(existingProject.status);
      setFeatured(existingProject.featured);
      setSelectedCategories(existingProject.categories?.map((c) => c.id) || []);
      setCircuitDiagramUrl(existingProject.circuit_diagram_url || '');
      setWiringNotes(existingProject.wiring_notes || '');
      setTroubleshootingNotes(existingProject.troubleshooting_notes || '');
      setSafetyNotes(existingProject.safety_notes || '');

      setComponents(
        existingProject.components?.map((c) => ({
          name: c.name,
          quantity: c.quantity,
          notes: c.notes || '',
        })) || []
      );
      setSteps(
        existingProject.steps?.map((s) => ({
          title: s.title,
          content: s.content,
          image_url: s.image_url || '',
        })) || []
      );
      setCodeSnippets(
        existingProject.code_snippets?.map((cs) => ({
          title: cs.title,
          filename: cs.filename,
          language: cs.language,
          code: cs.code,
        })) || []
      );
    }
  }, [existingProject]);

  // Slug generator
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Image upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'cover' | 'circuit') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateUploadFile(file, 'media');
    if (!validation.isValid) {
      toastError('Invalid Image File', validation.error);
      return;
    }

    const { url, error } = await uploadFile(file, 'project-media');

    if (error) {
      toastError('Upload Failed', error);
    } else {
      success('Image Uploaded', 'The image is ready.');
      if (field === 'cover') setCoverImage(url);
      if (field === 'circuit') setCircuitDiagramUrl(url);
    }
  };

  const handleSave = async (targetStatus?: ContentStatus) => {
    if (!title.trim()) {
      toastError('Validation Error', 'Project title is required.');
      return;
    }
    if (!summary.trim()) {
      toastError('Validation Error', 'Project summary is required.');
      return;
    }

    setIsSaving(true);
    const chosenCategories = categories.filter((c) => selectedCategories.includes(c.id));

    const payload: Partial<Project> = {
      id: existingProject?.id,
      title: title.trim(),
      slug: slug.trim(),
      summary: summary.trim(),
      description: description.trim(),
      cover_image: coverImage || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      difficulty,
      estimated_time: estimatedTime,
      status: targetStatus || status,
      featured,
      circuit_diagram_url: circuitDiagramUrl,
      wiring_notes: wiringNotes,
      troubleshooting_notes: troubleshootingNotes,
      safety_notes: safetyNotes,
      categories: chosenCategories,
      components: components.map((c, i) => ({ ...c, display_order: i + 1 })),
      steps: steps.map((s, i) => ({ ...s, step_number: i + 1 })),
      code_snippets: codeSnippets.map((cs, i) => ({ ...cs, display_order: i + 1 })),
    };

    const res = await saveProject(payload);
    setIsSaving(false);

    if (res.success) {
      success('Blueprint Saved', 'Changes have been recorded to the database.');
      navigate('/admin/projects');
    } else {
      toastError('Save Error', res.error);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
              {isEditing ? `Edit Blueprint: ${title || 'Project'}` : 'Author New Blueprint'}
            </h1>
            <span className="text-xs font-mono text-slate-400">
              Draft & publish with verified hardware components
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave('draft')}
            isLoading={isSaving}
          >
            Save Draft
          </Button>
          <Button
            size="sm"
            onClick={() => handleSave('published')}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Publish Blueprint
          </Button>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-6">
        <h3 className="text-base font-bold font-display text-slate-900 border-b pb-3">
          1. Core Blueprint Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Project Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. ESP32 Dual-Core IoT Weather Station"
              className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              URL Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="esp32-weather-station"
              className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Estimated Build Time
            </label>
            <input
              type="text"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(e.target.value)}
              placeholder="e.g. 3-4 Hours"
              className="w-full bg-slate-50 text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Featured on Homepage
            </label>
            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Feature in top carousel / grid</span>
              </label>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Summary (Search & Card Abstract) *
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short 1-2 sentence engineering brief explaining what the build does..."
              className="w-full bg-slate-50 text-sm p-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Detailed Description & Architecture
            </label>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Technical deep dive, algorithm analysis, hardware interfaces..."
              className="w-full bg-slate-50 text-sm p-4 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Categories Selector */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-2">
              Hardware Domains / Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCategories(selectedCategories.filter((c) => c !== cat.id));
                      } else {
                        setSelectedCategories([...selectedCategories, cat.id]);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs rounded-xl font-medium border transition ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Image Upload / URL */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Cover Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://... or upload below"
                className="flex-1 bg-slate-50 text-sm px-4 py-2 rounded-xl border border-slate-200"
              />
              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer border border-slate-200">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'cover')}
                  className="hidden"
                />
              </label>
            </div>
            {coverImage && (
              <div className="mt-3 w-40 h-24 rounded-xl overflow-hidden border border-slate-200">
                <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bill of Materials Builder */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              2. Bill of Materials & Components Sourcing
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Add individual sensors, microcontrollers, passives, and battery modules.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setComponents([...components, { name: '', quantity: '1', notes: '' }])}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Component
          </Button>
        </div>

        {components.map((comp, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="text"
              placeholder="Component Name (e.g. Bosch BME280)"
              value={comp.name}
              onChange={(e) => {
                const updated = [...components];
                updated[idx].name = e.target.value;
                setComponents(updated);
              }}
              className="flex-1 bg-white text-xs px-3 py-2 rounded-lg border border-slate-200"
            />
            <input
              type="text"
              placeholder="Qty (e.g. 1 unit)"
              value={comp.quantity}
              onChange={(e) => {
                const updated = [...components];
                updated[idx].quantity = e.target.value;
                setComponents(updated);
              }}
              className="w-24 bg-white text-xs px-3 py-2 rounded-lg border border-slate-200"
            />
            <input
              type="text"
              placeholder="Notes / Specs (e.g. I2C address 0x76)"
              value={comp.notes}
              onChange={(e) => {
                const updated = [...components];
                updated[idx].notes = e.target.value;
                setComponents(updated);
              }}
              className="flex-1 bg-white text-xs px-3 py-2 rounded-lg border border-slate-200"
            />
            <button
              type="button"
              onClick={() => setComponents(components.filter((_, i) => i !== idx))}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition"
              title="Remove component"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Circuit Diagram & Wiring Notes */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
        <h3 className="text-base font-bold font-display text-slate-900 border-b pb-3">
          3. Schematic & Pin Connections
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Circuit Diagram Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={circuitDiagramUrl}
                onChange={(e) => setCircuitDiagramUrl(e.target.value)}
                placeholder="URL to schematic or upload file"
                className="flex-1 bg-slate-50 text-sm px-4 py-2 rounded-xl border border-slate-200"
              />
              <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer border border-slate-200">
                <Upload className="w-4 h-4" />
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'circuit')}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              Pinout & Wiring Connection Instructions
            </label>
            <textarea
              rows={3}
              value={wiringNotes}
              onChange={(e) => setWiringNotes(e.target.value)}
              placeholder="e.g. Wire SDA to GPIO 21, SCL to GPIO 22, VCC to 3.3V..."
              className="w-full bg-slate-50 text-sm p-4 rounded-xl border border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Assembly Steps Builder */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              4. Assembly Step-by-Step Instructions
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Document breadboard layout, soldering, calibration, and enclosure mounting.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setSteps([...steps, { title: '', content: '', image_url: '' }])}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Step
          </Button>
        </div>

        {steps.map((st, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-blue-600">Step {idx + 1}</span>
              <button
                type="button"
                onClick={() => setSteps(steps.filter((_, i) => i !== idx))}
                className="text-xs text-rose-500 hover:text-rose-700"
              >
                Delete Step
              </button>
            </div>
            <input
              type="text"
              placeholder="Step Title"
              value={st.title}
              onChange={(e) => {
                const updated = [...steps];
                updated[idx].title = e.target.value;
                setSteps(updated);
              }}
              className="w-full bg-white text-xs px-3 py-2 rounded-lg border border-slate-200 font-semibold"
            />
            <textarea
              rows={2}
              placeholder="Step detailed instructions..."
              value={st.content}
              onChange={(e) => {
                const updated = [...steps];
                updated[idx].content = e.target.value;
                setSteps(updated);
              }}
              className="w-full bg-white text-xs p-3 rounded-lg border border-slate-200"
            />
          </div>
        ))}
      </div>

      {/* Code Snippets Builder */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-5">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="text-base font-bold font-display text-slate-900">
              5. Embedded Source Code Snippets
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste firmware source code with syntax highlighting (.ino, .c, .cpp, .py).
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              setCodeSnippets([
                ...codeSnippets,
                { title: 'Main Loop', filename: 'firmware.ino', language: 'cpp', code: '' },
              ])
            }
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Code Snippet
          </Button>
        </div>

        {codeSnippets.map((cs, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-600">Snippet #{idx + 1}</span>
              <button
                type="button"
                onClick={() => setCodeSnippets(codeSnippets.filter((_, i) => i !== idx))}
                className="text-xs text-rose-500 hover:text-rose-700"
              >
                Remove Snippet
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Snippet Title"
                value={cs.title}
                onChange={(e) => {
                  const updated = [...codeSnippets];
                  updated[idx].title = e.target.value;
                  setCodeSnippets(updated);
                }}
                className="bg-white text-xs px-3 py-2 rounded-lg border border-slate-200 font-semibold"
              />
              <input
                type="text"
                placeholder="Filename (e.g. main.cpp)"
                value={cs.filename}
                onChange={(e) => {
                  const updated = [...codeSnippets];
                  updated[idx].filename = e.target.value;
                  setCodeSnippets(updated);
                }}
                className="bg-white text-xs px-3 py-2 rounded-lg border border-slate-200 font-mono"
              />
              <select
                value={cs.language}
                onChange={(e) => {
                  const updated = [...codeSnippets];
                  updated[idx].language = e.target.value;
                  setCodeSnippets(updated);
                }}
                className="bg-white text-xs px-3 py-2 rounded-lg border border-slate-200 font-mono"
              >
                <option value="cpp">C / C++ (Arduino INO)</option>
                <option value="python">Python / MicroPython</option>
                <option value="bash">Bash / Shell Script</option>
                <option value="json">JSON Config</option>
              </select>
            </div>
            <textarea
              rows={8}
              placeholder="// Paste source code here..."
              value={cs.code}
              onChange={(e) => {
                const updated = [...codeSnippets];
                updated[idx].code = e.target.value;
                setCodeSnippets(updated);
              }}
              className="w-full bg-[#0B132B] text-slate-100 font-mono text-xs p-4 rounded-xl border border-slate-700 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Safety & Troubleshooting */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-subtle space-y-4">
        <h3 className="text-base font-bold font-display text-slate-900 border-b pb-3">
          6. Safety & Troubleshooting Notes
        </h3>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
            Safety Precautions (Lithium-ion handling, thermal warnings)
          </label>
          <textarea
            rows={2}
            value={safetyNotes}
            onChange={(e) => setSafetyNotes(e.target.value)}
            placeholder="e.g. Ensure battery reverse polarity protection is observed..."
            className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
            Troubleshooting Notes & Common Pitfalls
          </label>
          <textarea
            rows={2}
            value={troubleshootingNotes}
            onChange={(e) => setTroubleshootingNotes(e.target.value)}
            placeholder="e.g. If sensor timeout occurs, verify I2C pull-ups..."
            className="w-full bg-slate-50 text-sm p-3 rounded-xl border border-slate-200"
          />
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/projects')}
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleSave()}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Save Blueprint
        </Button>
      </div>
    </div>
  );
};
