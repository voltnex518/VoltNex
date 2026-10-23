import React, { useState } from 'react';
import {
  Trash2,
  Copy,
  RotateCw,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Activity,
  Zap,
} from 'lucide-react';
import type {
  CircuitData,
  CircuitComponentInstance,
  CircuitWire,
  SimulationState,
  WireRoutingStyle,
} from '../../types/circuit';
import { getComponentDefinition } from '../../lib/circuit/components';

interface PropertiesInspectorProps {
  data: CircuitData;
  onChangeData?: (newData: CircuitData) => void;
  selectedComponentId: string | null;
  selectedWireId: string | null;
  onSelectComponent: (id: string | null) => void;
  onSelectWire: (id: string | null) => void;
  isSimulating: boolean;
  simulationState: SimulationState;
  onStartSimulation: () => void;
  onPauseSimulation: () => void;
  onStopSimulation: () => void;
  isReadOnly?: boolean;
}

const WIRE_COLORS = [
  { label: 'Red (Power / VCC)', color: '#EF4444' },
  { label: 'Black (Ground / GND)', color: '#0F172A' },
  { label: 'Blue (Digital Signal)', color: '#2563EB' },
  { label: 'Green (I/O Data)', color: '#10B981' },
  { label: 'Yellow (Analog / Clock)', color: '#F59E0B' },
  { label: 'Violet (Control)', color: '#8B5CF6' },
];

export const PropertiesInspector: React.FC<PropertiesInspectorProps> = ({
  data,
  onChangeData,
  selectedComponentId,
  selectedWireId,
  onSelectComponent,
  onSelectWire,
  isSimulating,
  simulationState,
  onStartSimulation,
  onPauseSimulation,
  onStopSimulation,
  isReadOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'simulation' | 'validation'>('properties');

  const selectedComp = data.components.find((c) => c.id === selectedComponentId);
  const selectedWire = data.wires.find((w) => w.id === selectedWireId);
  const selectedDef = selectedComp ? getComponentDefinition(selectedComp.typeId) : null;

  // Update selected component properties
  const handleUpdateComponent = (patch: Partial<CircuitComponentInstance>) => {
    if (!selectedComp || isReadOnly) return;
    const updated = data.components.map((c) => (c.id === selectedComp.id ? { ...c, ...patch } : c));
    onChangeData?.({ ...data, components: updated });
  };

  const handleUpdateProps = (propKey: string, value: any) => {
    if (!selectedComp || isReadOnly) return;
    const updatedProps = { ...selectedComp.properties, [propKey]: value };
    handleUpdateComponent({ properties: updatedProps });
  };

  // Update selected wire properties
  const handleUpdateWire = (patch: Partial<CircuitWire>) => {
    if (!selectedWire || isReadOnly) return;
    const updated = data.wires.map((w) => (w.id === selectedWire.id ? { ...w, ...patch } : w));
    onChangeData?.({ ...data, wires: updated });
  };

  // Delete component or wire
  const handleDeleteSelected = () => {
    if (isReadOnly) return;
    if (selectedComp) {
      const newComps = data.components.filter((c) => c.id !== selectedComp.id);
      const newWires = data.wires.filter(
        (w) => w.fromComponentId !== selectedComp.id && w.toComponentId !== selectedComp.id
      );
      onChangeData?.({ ...data, components: newComps, wires: newWires });
      onSelectComponent(null);
    } else if (selectedWire) {
      const newWires = data.wires.filter((w) => w.id !== selectedWire.id);
      onChangeData?.({ ...data, wires: newWires });
      onSelectWire(null);
    }
  };

  // Duplicate component
  const handleDuplicateComponent = () => {
    if (!selectedComp || isReadOnly) return;
    const def = getComponentDefinition(selectedComp.typeId);
    if (!def) return;

    const existingSame = data.components.filter((c) => c.typeId === selectedComp.typeId);
    const newRef = `${def.defaultRefPrefix}${existingSame.length + 1}`;

    const newComp: CircuitComponentInstance = {
      ...selectedComp,
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      reference: newRef,
      x: selectedComp.x + 30,
      y: selectedComp.y + 30,
    };

    onChangeData?.({ ...data, components: [...data.components, newComp] });
    onSelectComponent(newComp.id);
  };

  // Rotate component
  const handleRotate = () => {
    if (!selectedComp || isReadOnly) return;
    handleUpdateComponent({ rotation: (selectedComp.rotation + 90) % 360 });
  };

  return (
    <aside className="w-80 h-full bg-slate-900 border-l border-slate-800 flex flex-col flex-shrink-0 text-slate-300 select-none">
      {/* Tabs Header */}
      <div className="flex items-center border-b border-slate-800 p-1.5 bg-slate-950/60">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'properties'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Inspector
        </button>
        <button
          onClick={() => setActiveTab('simulation')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition relative ${
            activeTab === 'simulation'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Simulation
          {isSimulating && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-2 right-2 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('validation')}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition relative ${
            activeTab === 'validation'
              ? 'bg-slate-800 text-cyan-400 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Audit
          {simulationState.warnings.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] ml-1">
              {simulationState.warnings.length}
            </span>
          )}
        </button>
      </div>

      {/* Main Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: PROPERTIES */}
        {activeTab === 'properties' && (
          <>
            {selectedComp && selectedDef ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      {selectedDef.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{selectedComp.label}</h3>
                  </div>
                  {!isReadOnly && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleRotate}
                        title="Rotate 90° (R)"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleDuplicateComponent}
                        title="Duplicate"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleDeleteSelected}
                        title="Delete (Del)"
                        className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Reference Designator & Label */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Reference</label>
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={selectedComp.reference}
                      onChange={(e) => handleUpdateComponent({ reference: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Orientation</label>
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-cyan-400 font-mono">
                      {selectedComp.rotation}°
                    </div>
                  </div>
                </div>

                {/* Specific Component Property Editors */}
                {selectedComp.typeId === 'resistor' && (
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Resistance (Ω)
                    </label>
                    <input
                      type="number"
                      disabled={isReadOnly}
                      value={selectedComp.properties.resistance || 220}
                      onChange={(e) => handleUpdateProps('resistance', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                )}

                {selectedComp.typeId === 'led' && (
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">LED Color</label>
                    <select
                      disabled={isReadOnly}
                      value={selectedComp.properties.color || 'red'}
                      onChange={(e) => handleUpdateProps('color', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="red">Red (630nm, 2.0V)</option>
                      <option value="green">Green (525nm, 2.2V)</option>
                      <option value="blue">Blue (470nm, 3.2V)</option>
                      <option value="yellow">Yellow (590nm, 2.1V)</option>
                      <option value="amber">Amber (610nm, 2.1V)</option>
                      <option value="white">Cool White (3.3V)</option>
                    </select>
                  </div>
                )}

                {(selectedComp.typeId === 'battery_9v' || selectedComp.typeId === 'power_supply_dc') && (
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Output Voltage (V)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      disabled={isReadOnly}
                      value={selectedComp.properties.voltage || 5.0}
                      onChange={(e) => handleUpdateProps('voltage', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                )}

                {selectedComp.typeId === 'spst_switch' && (
                  <div>
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">Switch State</label>
                    <button
                      onClick={() =>
                        handleUpdateComponent({
                          properties: {
                            ...selectedComp.properties,
                            isClosed: !selectedComp.properties.isClosed,
                          },
                          state: { ...selectedComp.state, isClosed: !selectedComp.properties.isClosed },
                        })
                      }
                      className={`w-full py-2 rounded-xl text-xs font-bold transition ${
                        selectedComp.properties.isClosed
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-rose-600 hover:bg-rose-500 text-white'
                      }`}
                    >
                      {selectedComp.properties.isClosed ? 'SWITCH CLOSED (ON)' : 'SWITCH OPEN (OFF)'}
                    </button>
                  </div>
                )}

                {selectedComp.typeId === 'potentiometer' && (
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Wiper Ratio</span>
                      <span className="text-cyan-400">{selectedComp.properties.valuePercent || 50}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      disabled={isReadOnly}
                      value={selectedComp.properties.valuePercent || 50}
                      onChange={(e) => handleUpdateProps('valuePercent', parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                )}

                {/* Connected Pins Summary */}
                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Pin Configuration ({selectedDef.pins.length})
                  </span>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedDef.pins.map((pin) => {
                      const hasWire = data.wires.some(
                        (w) =>
                          (w.fromComponentId === selectedComp.id && w.fromPinId === pin.id) ||
                          (w.toComponentId === selectedComp.id && w.toPinId === pin.id)
                      );
                      return (
                        <div
                          key={pin.id}
                          className="flex items-center justify-between px-2.5 py-1 rounded bg-slate-950/80 text-[11px] font-mono"
                        >
                          <span className="text-slate-300 font-semibold">{pin.name}</span>
                          <span className={hasWire ? 'text-emerald-400 text-[10px]' : 'text-slate-500 text-[10px]'}>
                            {hasWire ? 'Connected' : 'NC (Floating)'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : selectedWire ? (
              /* Selected Wire Inspector */
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                      Circuit Connection
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">Wire Segment</h3>
                  </div>
                  {!isReadOnly && (
                    <button
                      onClick={handleDeleteSelected}
                      title="Delete Wire"
                      className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Routing Style */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-1">Route Style</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['orthogonal', 'curved', 'straight'] as WireRoutingStyle[]).map((style) => (
                      <button
                        key={style}
                        disabled={isReadOnly}
                        onClick={() => handleUpdateWire({ routing: style })}
                        className={`py-1.5 rounded text-xs capitalize font-medium transition ${
                          selectedWire.routing === style || (!selectedWire.routing && style === 'orthogonal')
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Wire Color Picker */}
                <div>
                  <label className="text-[11px] font-mono text-slate-400 block mb-2">Wire Color</label>
                  <div className="space-y-2">
                    {WIRE_COLORS.map((opt) => (
                      <button
                        key={opt.color}
                        disabled={isReadOnly}
                        onClick={() => handleUpdateWire({ color: opt.color })}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs transition ${
                          selectedWire.color === opt.color
                            ? 'bg-slate-800 ring-1 ring-cyan-400 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span
                          className="w-4 h-4 rounded-full border border-slate-700"
                          style={{ backgroundColor: opt.color }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Nothing Selected: General Settings & Canvas Instructions */
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                    Workspace Overview
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5">Circuit Studio Canvas</h3>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>• Click any component or wire to inspect its electrical properties.</p>
                  <p>• Drag parts from the left library to place on the canvas.</p>
                  <p>• Click any pin to draw a connecting wire to another pin.</p>
                  <p>• Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-[10px]">R</kbd> to rotate, <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded font-mono text-[10px]">Del</kbd> to remove.</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                    Canvas Metrics
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Placed Components</span>
                      <span className="text-white font-bold font-mono text-base">{data.components.length}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Active Wires</span>
                      <span className="text-cyan-400 font-bold font-mono text-base">{data.wires.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB 2: SIMULATION */}
        {activeTab === 'simulation' && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                Deterministic Engine
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Circuit Simulation</h3>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {!isSimulating ? (
                <button
                  onClick={onStartSimulation}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-md transition"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Simulation</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={onPauseSimulation}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition"
                  >
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </button>
                  <button
                    onClick={onStopSimulation}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 text-xs font-bold transition"
                  >
                    <Square className="w-4 h-4 fill-current" />
                  </button>
                </>
              )}
            </div>

            {/* Electrical Readings */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Supply Voltage:
                </span>
                <span className="text-white font-bold">{simulationState.metrics.supplyVoltage} V</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Loop Current:
                </span>
                <span className="text-cyan-400 font-bold">{simulationState.metrics.activeCurrentmA} mA</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Closed Loop:</span>
                <span className={simulationState.hasClosedCircuit ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {simulationState.hasClosedCircuit ? 'Active Circuit' : 'Open Circuit'}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
              <p className="font-semibold text-slate-300">Educational Simulation Note:</p>
              <p>
                Calculates deterministic DC node connectivity, diode thresholds, and series loop current. Interactive switches and buttons toggle live circuit animations.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT & VALIDATION */}
        {activeTab === 'validation' && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400">
                Rule Checker
              </span>
              <h3 className="text-sm font-bold text-white mt-0.5">Electrical Design Audit</h3>
            </div>

            {simulationState.warnings.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                <div>
                  <h4 className="font-bold">No Structural Errors Detected</h4>
                  <p className="text-[11px] text-emerald-400/80 mt-0.5">
                    Circuit passes fundamental connectivity and safety checks.
                  </p>
                </div>
              </div>
            ) : (
              simulationState.warnings.map((w, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border text-xs leading-relaxed space-y-1 ${
                    w.type === 'hazard'
                      ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                      : w.type === 'warning'
                      ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                      : 'bg-blue-950/40 border-blue-800/60 text-blue-200'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{w.type}</span>
                  </div>
                  <p className="text-[11px]">{w.message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
