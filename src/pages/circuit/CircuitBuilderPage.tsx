import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  CircuitData,
  CircuitComponentInstance,
} from '../../types/circuit';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { simulateCircuit } from '../../lib/circuit/simulator';
import { getComponentDefinition } from '../../lib/circuit/components';
import { snapToGrid } from '../../lib/circuit/geometry';
import { EditorToolbar } from '../../components/circuit/EditorToolbar';
import { ComponentPalette } from '../../components/circuit/ComponentPalette';
import { CircuitCanvas } from '../../components/circuit/CircuitCanvas';
import { PropertiesInspector } from '../../components/circuit/PropertiesInspector';

const LOCAL_DRAFT_KEY = 'voltnex_circuit_builder_draft';

const DEFAULT_BLANK_CIRCUIT: CircuitData = {
  version: 1,
  viewport: { x: 80, y: 80, zoom: 1 },
  settings: { gridSnap: true, showGrid: true, wireRouting: 'orthogonal' },
  components: [
    {
      id: 'comp_bat_init',
      typeId: 'battery_9v',
      reference: 'BT1',
      label: '9V Battery',
      x: 120,
      y: 140,
      rotation: 0,
      properties: { voltage: 9.0 },
    },
    {
      id: 'comp_sw_init',
      typeId: 'spst_switch',
      reference: 'SW1',
      label: 'SPST Switch',
      x: 280,
      y: 90,
      rotation: 0,
      properties: { isClosed: true },
      state: { isClosed: true },
    },
    {
      id: 'comp_res_init',
      typeId: 'resistor',
      reference: 'R1',
      label: '330Ω Resistor',
      x: 440,
      y: 95,
      rotation: 0,
      properties: { resistance: 330, unit: 'Ω' },
    },
    {
      id: 'comp_led_init',
      typeId: 'led',
      reference: 'D1',
      label: 'Red LED',
      x: 600,
      y: 180,
      rotation: 0,
      properties: { color: 'red', forwardVoltage: 2.0 },
    },
  ],
  wires: [
    {
      id: 'w_init_1',
      fromComponentId: 'comp_bat_init',
      fromPinId: 'pos',
      toComponentId: 'comp_sw_init',
      toPinId: 'p1',
      color: '#EF4444',
      routing: 'orthogonal',
    },
    {
      id: 'w_init_2',
      fromComponentId: 'comp_sw_init',
      fromPinId: 'p2',
      toComponentId: 'comp_res_init',
      toPinId: 'p1',
      color: '#EF4444',
      routing: 'orthogonal',
    },
    {
      id: 'w_init_3',
      fromComponentId: 'comp_res_init',
      fromPinId: 'p2',
      toComponentId: 'comp_led_init',
      toPinId: 'anode',
      color: '#EF4444',
      routing: 'orthogonal',
    },
    {
      id: 'w_init_4',
      fromComponentId: 'comp_led_init',
      fromPinId: 'cathode',
      toComponentId: 'comp_bat_init',
      toPinId: 'neg',
      color: '#0F172A',
      routing: 'orthogonal',
    },
  ],
};

export const CircuitBuilderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { circuits, saveCircuit } = useData();
  const { isAdmin } = useAuth();
  const { success, error: toastError } = useToast();

  const circuitId = searchParams.get('id');
  const forkSlug = searchParams.get('fork');

  // Circuit metadata state
  const [circuitRecordId, setCircuitRecordId] = useState<string | null>(circuitId);
  const [title, setTitle] = useState('VoltNex Interactive Circuit');
  const [category, setCategory] = useState('Beginner electronics');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [estimatedBuildMinutes, setEstimatedBuildMinutes] = useState(25);
  const [instructions, setInstructions] = useState('');
  const [safetyNotes, setSafetyNotes] = useState('');
  const [circuitSlug, setCircuitSlug] = useState('');

  // Main interactive circuit data & history stack
  const [circuitData, setCircuitData] = useState<CircuitData>(DEFAULT_BLANK_CIRCUIT);
  const [history, setHistory] = useState<CircuitData[]>([DEFAULT_BLANK_CIRCUIT]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Editor interaction state
  const [activeTool, setActiveTool] = useState<'select' | 'pan' | 'wire' | 'delete'>('select');
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [selectedWireId, setSelectedWireId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved' | 'error'>('saved');
  const [isSimulating, setIsSimulating] = useState(true);

  // SVG export reference
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  // Load circuit from ID, fork slug, or local draft
  useEffect(() => {
    if (circuitId) {
      const existing = circuits.find((c) => c.id === circuitId);
      if (existing) {
        setCircuitRecordId(existing.id);
        setTitle(existing.title);
        setCategory(existing.category);
        setDifficulty(existing.difficulty);
        setEstimatedBuildMinutes(existing.estimated_build_minutes);
        setInstructions(existing.instructions || '');
        setSafetyNotes(existing.safety_notes || '');
        setCircuitSlug(existing.slug);
        setCircuitData(existing.circuit_data);
        setHistory([existing.circuit_data]);
        setHistoryIndex(0);
        return;
      }
    } else if (forkSlug) {
      const source = circuits.find((c) => c.slug === forkSlug);
      if (source) {
        setCircuitRecordId(null);
        setTitle(`${source.title} (Custom Clone)`);
        setCategory(source.category);
        setDifficulty(source.difficulty);
        setEstimatedBuildMinutes(source.estimated_build_minutes);
        setInstructions(source.instructions || '');
        setSafetyNotes(source.safety_notes || '');
        setCircuitData(source.circuit_data);
        setHistory([source.circuit_data]);
        setHistoryIndex(0);
        success('Circuit Loaded', `Duplicated "${source.title}" into your local studio.`);
        return;
      }
    }

    // Try loading local draft if available
    try {
      const savedDraft = localStorage.getItem(LOCAL_DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed.circuit_data && parsed.title) {
          setTitle(parsed.title);
          setCircuitData(parsed.circuit_data);
          setHistory([parsed.circuit_data]);
          setHistoryIndex(0);
        }
      }
    } catch {
      // Ignore parse errors and use default
    }
  }, [circuitId, forkSlug, circuits, success]);

  // Push new state to undo/redo history stack
  const updateDataWithHistory = useCallback(
    (newData: CircuitData) => {
      setCircuitData(newData);
      setSaveStatus('unsaved');

      const updatedHistory = history.slice(0, historyIndex + 1);
      if (updatedHistory.length >= 25) {
        updatedHistory.shift();
      }
      updatedHistory.push(newData);
      setHistory(updatedHistory);
      setHistoryIndex(updatedHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Undo / Redo handlers
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCircuitData(history[prevIndex]);
      setSaveStatus('unsaved');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCircuitData(history[nextIndex]);
      setSaveStatus('unsaved');
    }
  };

  // Zoom helpers
  const handleZoomIn = () => {
    const currentVp = circuitData.viewport || { x: 0, y: 0, zoom: 1 };
    const newZoom = Math.min(currentVp.zoom * 1.2, 3.0);
    setCircuitData({ ...circuitData, viewport: { ...currentVp, zoom: newZoom } });
  };

  const handleZoomOut = () => {
    const currentVp = circuitData.viewport || { x: 0, y: 0, zoom: 1 };
    const newZoom = Math.max(currentVp.zoom * 0.8, 0.3);
    setCircuitData({ ...circuitData, viewport: { ...currentVp, zoom: newZoom } });
  };

  const handleFitCanvas = () => {
    setCircuitData({
      ...circuitData,
      viewport: { x: 50, y: 50, zoom: 1 },
    });
  };

  // Add component directly from palette (click or touch)
  const handleAddComponentFromPalette = (typeId: string) => {
    const def = getComponentDefinition(typeId);
    if (!def) return;

    const existingSame = circuitData.components.filter((c) => c.typeId === typeId);
    const reference = `${def.defaultRefPrefix}${existingSame.length + 1}`;

    const newComp: CircuitComponentInstance = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      typeId,
      reference,
      label: def.name,
      x: snapToGrid(200 + Math.random() * 80),
      y: snapToGrid(150 + Math.random() * 80),
      rotation: 0,
      properties: { ...def.defaultProperties },
    };

    updateDataWithHistory({
      ...circuitData,
      components: [...circuitData.components, newComp],
    });
    setSelectedComponentId(newComp.id);
  };

  // Toggle switch or button in simulation
  const handleToggleInteractive = (compId: string) => {
    const comp = circuitData.components.find((c) => c.id === compId);
    if (!comp) return;

    if (comp.typeId === 'spst_switch') {
      const isCurrentlyClosed = comp.state?.isClosed ?? comp.properties.isClosed ?? false;
      const nextState = !isCurrentlyClosed;
      const updated = circuitData.components.map((c) =>
        c.id === compId
          ? {
              ...c,
              properties: { ...c.properties, isClosed: nextState },
              state: { ...c.state, isClosed: nextState },
            }
          : c
      );
      updateDataWithHistory({ ...circuitData, components: updated });
    } else if (comp.typeId === 'push_button') {
      const isCurrentlyClosed = comp.state?.isClosed ?? false;
      const nextState = !isCurrentlyClosed;
      const updated = circuitData.components.map((c) =>
        c.id === compId ? { ...c, state: { ...c.state, isClosed: nextState } } : c
      );
      updateDataWithHistory({ ...circuitData, components: updated });
    }
  };

  // Simulation state evaluated dynamically on circuitData
  const simulationState = simulateCircuit(circuitData.components, circuitData.wires, isSimulating);

  // Save handler (Admin publishes/updates in Supabase, visitors save to local draft)
  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      if (isAdmin) {
        const slug =
          circuitSlug ||
          title
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const res = await saveCircuit({
          id: circuitRecordId || undefined,
          title,
          slug,
          category,
          difficulty,
          estimated_build_minutes: estimatedBuildMinutes,
          circuit_data: circuitData,
          instructions,
          safety_notes: safetyNotes,
          status: 'published',
        });

        if (res.success && res.data) {
          setCircuitRecordId(res.data.id);
          setCircuitSlug(res.data.slug);
          setSaveStatus('saved');
          success('Circuit Published', `Blueprint "${title}" saved to VoltNex platform.`);
        } else {
          setSaveStatus('error');
          toastError('Save Failed', res.error || 'Could not persist circuit to database.');
        }
      } else {
        // Save to local draft store
        localStorage.setItem(
          LOCAL_DRAFT_KEY,
          JSON.stringify({
            title,
            circuit_data: circuitData,
            savedAt: new Date().toISOString(),
          })
        );
        setSaveStatus('saved');
        success('Draft Saved', 'Circuit design saved to your browser local workspace.');
      }
    } catch {
      setSaveStatus('error');
      toastError('Save Error', 'An unexpected error occurred while saving.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#090D16] text-slate-100 overflow-hidden font-sans">
      {/* Top Editor Toolbar */}
      <EditorToolbar
        title={title}
        onChangeTitle={(newTitle) => {
          setTitle(newTitle);
          setSaveStatus('unsaved');
        }}
        data={circuitData}
        onChangeData={updateDataWithHistory}
        activeTool={activeTool}
        onChangeTool={setActiveTool}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitCanvas={handleFitCanvas}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        saveStatus={saveStatus}
        onSave={handleSave}
        svgRef={svgElement}
        slug={circuitSlug}
      />

      {/* Main Studio Body: Palette, Canvas, Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Component Library */}
        <ComponentPalette onAddComponent={handleAddComponentFromPalette} />

        {/* Central Interactive Engineering Canvas */}
        <div className="flex-1 relative h-full">
          <CircuitCanvas
            data={circuitData}
            onChangeData={updateDataWithHistory}
            selectedComponentId={selectedComponentId}
            selectedWireId={selectedWireId}
            onSelectComponent={setSelectedComponentId}
            onSelectWire={setSelectedWireId}
            activeTool={activeTool}
            isSimulating={isSimulating}
            simulationState={simulationState}
            onToggleComponentInteractive={handleToggleInteractive}
            onSvgRefReady={setSvgElement}
          />
        </div>

        {/* Right Properties Inspector & Simulation Meter */}
        <PropertiesInspector
          data={circuitData}
          onChangeData={updateDataWithHistory}
          selectedComponentId={selectedComponentId}
          selectedWireId={selectedWireId}
          onSelectComponent={setSelectedComponentId}
          onSelectWire={setSelectedWireId}
          isSimulating={isSimulating}
          simulationState={simulationState}
          onStartSimulation={() => setIsSimulating(true)}
          onPauseSimulation={() => setIsSimulating(false)}
          onStopSimulation={() => setIsSimulating(false)}
        />
      </div>
    </div>
  );
};
