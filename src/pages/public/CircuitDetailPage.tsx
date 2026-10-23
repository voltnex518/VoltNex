import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Cpu,
  Share2,
  AlertTriangle,
  Sparkles,
  Play,
  Square,
  Layers,
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useToast } from '../../components/common/Toast';
import { DifficultyBadge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { CircuitCanvas } from '../../components/circuit/CircuitCanvas';
import { simulateCircuit } from '../../lib/circuit/simulator';
import { getComponentDefinition } from '../../lib/circuit/components';
import {
  exportCircuitToJson,
  exportCircuitToSvg,
  downloadSvgFile,
  downloadPngFromSvg,
} from '../../lib/circuit/geometry';

export const CircuitDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { circuits } = useData();
  const { success } = useToast();

  const circuit = useMemo(() => {
    return circuits.find((c) => c.slug === slug);
  }, [circuits, slug]);

  // Read-only canvas interactive state
  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [interactiveData, setInteractiveData] = useState(circuit?.circuit_data);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  // Sync interactiveData if circuit changes
  React.useEffect(() => {
    if (circuit?.circuit_data) {
      setInteractiveData(circuit.circuit_data);
    }
  }, [circuit]);

  // Component BOM calculation (grouped by component definition)
  const bomList = useMemo(() => {
    if (!interactiveData) return [];
    const map = new Map<string, { name: string; count: number; refs: string[]; properties: any }>();
    for (const comp of interactiveData.components) {
      const def = getComponentDefinition(comp.typeId);
      const name = def ? def.name : comp.label;
      const key = `${comp.typeId}_${JSON.stringify(comp.properties || {})}`;
      if (!map.has(key)) {
        map.set(key, { name, count: 0, refs: [], properties: comp.properties });
      }
      const item = map.get(key)!;
      item.count += 1;
      item.refs.push(comp.reference);
    }
    return Array.from(map.values());
  }, [interactiveData]);

  // Wiring Netlist table
  const wiringTable = useMemo(() => {
    if (!interactiveData) return [];
    return interactiveData.wires.map((w) => {
      const fromComp = interactiveData.components.find((c) => c.id === w.fromComponentId);
      const toComp = interactiveData.components.find((c) => c.id === w.toComponentId);
      return {
        id: w.id,
        from: `${fromComp?.reference || 'Unknown'} (${w.fromPinId})`,
        to: `${toComp?.reference || 'Unknown'} (${w.toPinId})`,
        color: w.color || '#EF4444',
        routing: w.routing || 'orthogonal',
      };
    });
  }, [interactiveData]);

  // Simulation calculations
  const simulationState = useMemo(() => {
    if (!interactiveData) {
      return {
        isRunning: false,
        isPaused: false,
        powerSourceFound: false,
        groundFound: false,
        hasClosedCircuit: false,
        activeComponentIds: new Set<string>(),
        activeWireIds: new Set<string>(),
        blownComponentIds: new Set<string>(),
        warnings: [],
        metrics: { activeCurrentmA: 0, supplyVoltage: 0, energizedNodeCount: 0 },
      };
    }
    return simulateCircuit(interactiveData.components, interactiveData.wires, isSimulating);
  }, [interactiveData, isSimulating]);

  if (!circuit || !interactiveData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">Circuit Blueprint Not Found</h2>
          <p className="text-xs text-slate-500">
            The requested circuit design may have been renamed, archived, or does not exist.
          </p>
          <Link to="/circuits">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Circuits
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Toggle switch/button in read-only simulation
  const handleToggleInteractive = (compId: string) => {
    const comp = interactiveData.components.find((c) => c.id === compId);
    if (!comp) return;

    if (comp.typeId === 'spst_switch') {
      const isClosed = comp.state?.isClosed ?? comp.properties.isClosed ?? false;
      const next = !isClosed;
      const updated = interactiveData.components.map((c) =>
        c.id === compId
          ? {
              ...c,
              properties: { ...c.properties, isClosed: next },
              state: { ...c.state, isClosed: next },
            }
          : c
      );
      setInteractiveData({ ...interactiveData, components: updated });
    } else if (comp.typeId === 'push_button') {
      const isClosed = comp.state?.isClosed ?? false;
      const next = !isClosed;
      const updated = interactiveData.components.map((c) =>
        c.id === compId ? { ...c, state: { ...c.state, isClosed: next } } : c
      );
      setInteractiveData({ ...interactiveData, components: updated });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Link Copied', 'Public circuit blueprint link copied to clipboard.');
  };

  const handleExportPng = () => {
    if (svgElement) downloadPngFromSvg(svgElement, circuit.title);
  };

  const handleExportSvg = () => {
    if (svgElement) {
      const svgStr = exportCircuitToSvg(svgElement, circuit.title);
      downloadSvgFile(svgStr, circuit.title);
    }
  };

  const handleExportJson = () => {
    exportCircuitToJson(interactiveData, circuit.title);
  };

  // Open in Circuit Studio: clones this circuit locally in /circuits/builder?fork=slug
  const handleOpenInStudio = () => {
    navigate(`/circuits/builder?fork=${encodeURIComponent(circuit.slug)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/circuits"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Circuits Gallery</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenInStudio}
              className="shadow-sm shadow-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              <span>Open in Circuit Studio</span>
            </Button>
          </div>
        </div>

        {/* Blueprint Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              {circuit.category}
            </span>
            <DifficultyBadge difficulty={circuit.difficulty} />
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <Clock className="w-3.5 h-3.5" />
              Est. Build: {circuit.estimated_build_minutes} mins
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            {circuit.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            {circuit.description}
          </p>
        </div>

        {/* Interactive Circuit Schematic Canvas Container */}
        <div className="bg-[#090D16] rounded-3xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* Canvas Top Bar */}
          <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-cyan-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Interactive Read-Only Preview
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">
                {interactiveData.components.length} components • {interactiveData.wires.length} wires
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Simulation Play/Pause button */}
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition ${
                  isSimulating
                    ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                }`}
              >
                {isSimulating ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>Pause Simulation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Simulation</span>
                  </>
                )}
              </button>

              <div className="h-4 w-px bg-slate-800 mx-1" />

              {/* Export Actions */}
              <button
                onClick={handleExportPng}
                title="Download PNG"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                PNG
              </button>
              <button
                onClick={handleExportSvg}
                title="Download SVG"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                SVG
              </button>
              <button
                onClick={handleExportJson}
                title="Download JSON"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                JSON
              </button>
            </div>
          </div>

          {/* Canvas Body */}
          <div className="h-[520px] relative">
            <CircuitCanvas
              data={interactiveData}
              selectedComponentId={selectedCompId}
              selectedWireId={selectedWireId}
              onSelectComponent={setSelectedCompId}
              onSelectWire={setSelectedWireId}
              activeTool="select"
              isSimulating={isSimulating}
              simulationState={simulationState}
              onToggleComponentInteractive={handleToggleInteractive}
              isReadOnly={true}
              onSvgRefReady={setSvgElement}
            />
          </div>

          {/* Canvas Bottom Status Bar */}
          <div className="py-2.5 px-4 bg-slate-950/90 border-t border-slate-800 text-[11px] font-mono flex flex-wrap items-center justify-between gap-3 text-slate-400">
            <div className="flex items-center gap-4">
              <span>
                Circuit Status:{' '}
                <strong className={simulationState.hasClosedCircuit ? 'text-emerald-400' : 'text-slate-300'}>
                  {simulationState.hasClosedCircuit ? 'Energized Loop' : 'Open / Incomplete Loop'}
                </strong>
              </span>
              <span>
                Supply: <strong className="text-white">{simulationState.metrics.supplyVoltage}V</strong>
              </span>
              <span>
                Current: <strong className="text-cyan-400">{simulationState.metrics.activeCurrentmA}mA</strong>
              </span>
            </div>

            <div className="text-slate-500">
              Interactive sandbox: click switches to test logic gates & animations
            </div>
          </div>
        </div>

        {/* Technical Specification: Bill of Materials & Wiring Netlist */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bill of Materials (BOM) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900 font-display">Bill of Materials (BOM)</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2 px-3">Part Name</th>
                    <th className="py-2 px-3">Designators</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bomList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-3 px-3 font-mono text-cyan-600 font-medium">
                        {item.refs.join(', ')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-700">
                        {item.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wiring Netlist Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-600" />
              <h2 className="text-lg font-bold text-slate-900 font-display">Pin-to-Pin Netlist</h2>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-2 px-3">Wire</th>
                    <th className="py-2 px-3">From Pin</th>
                    <th className="py-2 px-3">To Pin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {wiringTable.map((wire, idx) => (
                    <tr key={wire.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 px-3 flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300"
                          style={{ backgroundColor: wire.color }}
                        />
                        <span className="text-slate-500 text-[11px]">Wire {idx + 1}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-900 font-medium">{wire.from}</td>
                      <td className="py-2.5 px-3 text-blue-600 font-medium">{wire.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Build Instructions & Safety Warnings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Instructions */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">Build Instructions</h2>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line space-y-2">
              {circuit.instructions || 'Follow the schematic diagram above to connect all pins in sequence.'}
            </div>
          </div>

          {/* Safety Notes */}
          <div className="bg-amber-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <h2 className="text-lg font-bold font-display">Electrical Safety</h2>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              {circuit.safety_notes ||
                'Ensure all power is disconnected before adjusting physical breadboard wiring. Double-check polarity of electrolytic capacitors, LEDs, and diodes.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
