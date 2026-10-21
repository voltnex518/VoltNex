import React, { useState } from 'react';
import { Maximize2, Download, Cpu, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface CircuitViewerProps {
  imageUrl: string;
  title: string;
  wiringNotes?: string;
}

export const CircuitViewer: React.FC<CircuitViewerProps> = ({
  imageUrl,
  title,
  wiringNotes,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="text-sm font-semibold text-slate-800">Schematic & Pinout Diagram</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Maximize2 className="w-3.5 h-3.5" />}
          >
            Expand View
          </Button>
          <a
            href={imageUrl}
            download={`${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-circuit.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            Download
          </a>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative bg-slate-900 overflow-hidden flex items-center justify-center p-4 min-h-[300px] max-h-[460px]">
        <img
          src={imageUrl}
          alt={`${title} Circuit Diagram`}
          className="max-h-[400px] w-auto object-contain rounded-lg shadow-md transition-transform duration-200"
          loading="lazy"
        />
        <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-[11px] text-slate-300 px-2.5 py-1 rounded-md border border-slate-800">
          Click Expand for High-Res View
        </div>
      </div>

      {/* Wiring Notes */}
      {wiringNotes && (
        <div className="p-5 bg-blue-50/40 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2">
            Wiring & Pin Connection Notes
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed font-sans">{wiringNotes}</p>
        </div>
      )}

      {/* Expanded Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setZoomLevel(1);
        }}
        title={`${title} — Circuit Schematic`}
        maxWidth="4xl"
      >
        <div className="flex flex-col items-center">
          {/* Zoom controls */}
          <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-600">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition text-xs font-sans"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full bg-slate-950 rounded-xl p-4 overflow-auto max-h-[70vh] flex items-center justify-center">
            <img
              src={imageUrl}
              alt={`${title} Full Circuit Diagram`}
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
              className="max-w-none transition-transform duration-150"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
