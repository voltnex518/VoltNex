import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  MousePointer,
  Hand,
  Cable,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Magnet,
  Play,
  Square,
  Save,
  Download,
  Share2,
  Check,
  AlertCircle,
  Loader2,
  Tag,
  Hash,
  EyeOff,
  ChevronDown,
} from 'lucide-react';
import type { CircuitData, PinLabelMode } from '../../types/circuit';
import { useToast } from '../common/Toast';
import {
  exportCircuitToJson,
  exportCircuitToSvg,
  downloadSvgFile,
  downloadPngFromSvg,
} from '../../lib/circuit/geometry';

interface EditorToolbarProps {
  title: string;
  onChangeTitle: (newTitle: string) => void;
  data: CircuitData;
  onChangeData?: (newData: CircuitData) => void;
  activeTool: 'select' | 'pan' | 'wire' | 'delete';
  onChangeTool: (tool: 'select' | 'pan' | 'wire' | 'delete') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitCanvas: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  saveStatus: 'unsaved' | 'saving' | 'saved' | 'error';
  onSave: () => Promise<void>;
  svgRef: SVGSVGElement | null;
  slug?: string;
  isReadOnly?: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  title,
  onChangeTitle,
  data,
  onChangeData,
  activeTool,
  onChangeTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFitCanvas,
  isSimulating,
  onToggleSimulation,
  saveStatus,
  onSave,
  svgRef,
  slug,
  isReadOnly = false,
}) => {
  const { success } = useToast();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const handleShare = () => {
    const url = slug ? `${window.location.origin}/circuits/${slug}` : window.location.href;
    navigator.clipboard.writeText(url);
    success('Link Copied', 'Circuit studio link copied to clipboard.');
  };

  const handleExportJson = () => {
    exportCircuitToJson(data, title);
    setShowExportMenu(false);
  };

  const handleExportSvg = () => {
    if (!svgRef) return;
    const svgStr = exportCircuitToSvg(svgRef, title);
    downloadSvgFile(svgStr, title);
    setShowExportMenu(false);
  };

  const handleExportPng = () => {
    if (!svgRef) return;
    downloadPngFromSvg(svgRef, title);
    setShowExportMenu(false);
  };

  const [showPinLabelMenu, setShowPinLabelMenu] = useState(false);

  const currentPinLabelMode: PinLabelMode = data.settings?.pinLabelMode || 'auto';

  const setPinLabelMode = (mode: PinLabelMode) => {
    onChangeData?.({
      ...data,
      settings: {
        ...data.settings,
        showGrid: data.settings?.showGrid ?? true,
        gridSnap: data.settings?.gridSnap ?? true,
        wireRouting: data.settings?.wireRouting ?? 'orthogonal',
        pinLabelMode: mode,
      },
    });
    setShowPinLabelMenu(false);
  };

  const toggleGrid = () => {
    const showGrid = data.settings?.showGrid ?? true;
    onChangeData?.({
      ...data,
      settings: {
        ...data.settings,
        showGrid: !showGrid,
        gridSnap: data.settings?.gridSnap ?? true,
        wireRouting: data.settings?.wireRouting ?? 'orthogonal',
        pinLabelMode: currentPinLabelMode,
      },
    });
  };

  const toggleSnap = () => {
    const gridSnap = data.settings?.gridSnap ?? true;
    onChangeData?.({
      ...data,
      settings: {
        ...data.settings,
        gridSnap: !gridSnap,
        showGrid: data.settings?.showGrid ?? true,
        wireRouting: data.settings?.wireRouting ?? 'orthogonal',
        pinLabelMode: currentPinLabelMode,
      },
    });
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-slate-300 select-none z-30 flex-shrink-0">
      {/* Left: Branding, Return Button, Inline Title Editor */}
      <div className="flex items-center gap-3">
        <Link
          to="/circuits"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Circuits</span>
        </Link>

        <div className="h-4 w-px bg-slate-800" />

        {/* Title Editor */}
        <div className="flex items-center gap-2">
          {isEditingTitle && !isReadOnly ? (
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => onChangeTitle(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setIsEditingTitle(false);
              }}
              className="bg-slate-950 border border-cyan-500 rounded px-2 py-0.5 text-xs text-white font-semibold focus:outline-none"
            />
          ) : (
            <h1
              onClick={() => !isReadOnly && setIsEditingTitle(true)}
              title={!isReadOnly ? 'Click to rename circuit' : undefined}
              className={`text-xs font-bold text-white tracking-tight flex items-center gap-1.5 ${
                !isReadOnly ? 'hover:text-cyan-400 cursor-pointer' : ''
              }`}
            >
              <span>{title}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
                STUDIO
              </span>
            </h1>
          )}
        </div>
      </div>

      {/* Center: Tools & View Controls */}
      <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800/80 p-1 rounded-xl">
        {/* Tool Selector */}
        {!isReadOnly && (
          <>
            <button
              onClick={() => onChangeTool('select')}
              title="Select Tool (V)"
              className={`p-1.5 rounded-lg transition ${
                activeTool === 'select'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MousePointer className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeTool('pan')}
              title="Pan Tool (H / Middle Click)"
              className={`p-1.5 rounded-lg transition ${
                activeTool === 'pan'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Hand className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeTool('wire')}
              title="Wire Connection Tool (W)"
              className={`p-1.5 rounded-lg transition ${
                activeTool === 'wire'
                  ? 'bg-cyan-500/20 text-cyan-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cable className="w-4 h-4" />
            </button>
            <button
              onClick={() => onChangeTool('delete')}
              title="Delete Element Tool (Del)"
              className={`p-1.5 rounded-lg transition ${
                activeTool === 'delete'
                  ? 'bg-rose-500/20 text-rose-300 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Undo / Redo */}
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />
          </>
        )}

        {/* Zoom & Viewport */}
        <button
          onClick={onZoomOut}
          title="Zoom Out"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomIn}
          title="Zoom In"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onFitCanvas}
          title="Fit Canvas"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Grid and Snap Toggles */}
        <button
          onClick={toggleGrid}
          title="Toggle Background Grid"
          className={`p-1.5 rounded-lg transition ${
            data.settings?.showGrid !== false
              ? 'text-cyan-400'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>
        <button
          onClick={toggleSnap}
          title="Toggle Snap to Grid (10px)"
          className={`p-1.5 rounded-lg transition ${
            data.settings?.gridSnap !== false
              ? 'text-cyan-400'
              : 'text-slate-500 hover:text-slate-400'
          }`}
        >
          <Magnet className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        {/* Pin Label Mode Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowPinLabelMenu(!showPinLabelMenu)}
            title={`Pin Labels: ${currentPinLabelMode.toUpperCase()} (Click to toggle)`}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-mono transition ${
              currentPinLabelMode !== 'hidden'
                ? 'bg-slate-900 border border-slate-700/80 text-cyan-300 hover:bg-slate-800'
                : 'text-slate-500 hover:text-slate-400'
            }`}
          >
            {currentPinLabelMode === 'hidden' ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : currentPinLabelMode === 'numbers' ? (
              <Hash className="w-3.5 h-3.5" />
            ) : (
              <Tag className="w-3.5 h-3.5" />
            )}
            <span className="capitalize text-[11px] font-semibold">{currentPinLabelMode}</span>
            <ChevronDown className="w-3 h-3 text-slate-500" />
          </button>

          {showPinLabelMenu && (
            <div className="absolute right-0 mt-1.5 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-xs font-sans">
              <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800/80 mb-1">
                Pin Labels Display
              </div>
              {(
                [
                  { mode: 'auto', label: 'Auto (Smart)', desc: 'Show on hover & select' },
                  { mode: 'all', label: 'All Labels', desc: 'Always show pin names' },
                  { mode: 'numbers', label: 'Numbers Only', desc: 'Physical / GPIO numbers' },
                  { mode: 'hidden', label: 'Hidden', desc: 'Clean schematic view' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.mode}
                  onClick={() => setPinLabelMode(opt.mode)}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition ${
                    currentPinLabelMode === opt.mode
                      ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs">{opt.label}</div>
                    <div className="text-[10px] text-slate-400">{opt.desc}</div>
                  </div>
                  {currentPinLabelMode === opt.mode && <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Simulation, Save Status, Export & Share Actions */}
      <div className="flex items-center gap-3">
        {/* Simulation Toggle */}
        <button
          onClick={onToggleSimulation}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm ${
            isSimulating
              ? 'bg-rose-600 hover:bg-rose-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isSimulating ? (
            <>
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop Sim</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate</span>
            </>
          )}
        </button>

        {/* Save Status Badge */}
        {!isReadOnly && (
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {saveStatus === 'saving' && (
              <span className="text-cyan-400 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
            {saveStatus === 'saved' && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved
              </span>
            )}
            {saveStatus === 'unsaved' && (
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Unsaved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Save failed
              </span>
            )}
          </div>
        )}

        {/* Save Button */}
        {!isReadOnly && (
          <button
            onClick={onSave}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>
        )}

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl py-1.5 z-50 text-xs">
              <button
                onClick={handleExportPng}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Export as PNG Image
              </button>
              <button
                onClick={handleExportSvg}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Export as Vector SVG
              </button>
              <button
                onClick={handleExportJson}
                className="w-full text-left px-3.5 py-2 text-slate-300 hover:bg-slate-800 hover:text-white transition"
              >
                Download Circuit Data (JSON)
              </button>
            </div>
          )}
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          title="Share Circuit Link"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
