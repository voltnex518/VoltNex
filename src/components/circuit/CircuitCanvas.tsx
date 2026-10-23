import React, { useRef, useState, useCallback, useEffect } from 'react';
import type {
  CircuitData,
  CircuitComponentInstance,
  CircuitWire,
  CircuitPin,
  SimulationState,
} from '../../types/circuit';
import { getComponentDefinition } from '../../lib/circuit/components';
import { snapToGrid, getRotatedPinPosition, computeWirePath } from '../../lib/circuit/geometry';
import { ComponentSvg } from './ComponentSvg';
import { WireSvg } from './WireSvg';

interface CircuitCanvasProps {
  data: CircuitData;
  onChangeData?: (newData: CircuitData) => void;
  selectedComponentId: string | null;
  selectedWireId: string | null;
  onSelectComponent: (id: string | null) => void;
  onSelectWire: (id: string | null) => void;
  activeTool: 'select' | 'pan' | 'wire' | 'delete';
  isSimulating: boolean;
  simulationState: SimulationState;
  onToggleComponentInteractive?: (compId: string) => void;
  isReadOnly?: boolean;
  onSvgRefReady?: (svg: SVGSVGElement | null) => void;
}

export const CircuitCanvas: React.FC<CircuitCanvasProps> = ({
  data,
  onChangeData,
  selectedComponentId,
  selectedWireId,
  onSelectComponent,
  onSelectWire,
  activeTool,
  isSimulating,
  simulationState,
  onToggleComponentInteractive,
  isReadOnly = false,
  onSvgRefReady,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    onSvgRefReady?.(svgRef.current);
  }, [onSvgRefReady]);

  // Viewport pan & zoom
  const [viewport, setViewport] = useState(data.viewport || { x: 0, y: 0, zoom: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging a component on canvas
  const [draggedCompId, setDraggedCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Wire drawing mode
  const [wireStart, setWireStart] = useState<{ compId: string; pinId: string } | null>(null);
  const [wirePreviewEnd, setWirePreviewEnd] = useState<{ x: number; y: number } | null>(null);

  // Sync internal viewport with external data if changed from toolbar
  useEffect(() => {
    if (data.viewport) {
      setViewport(data.viewport);
    }
  }, [data.viewport]);

  // Screen to Canvas coordinate translation
  const screenToCanvas = useCallback(
    (screenX: number, screenY: number): { x: number; y: number } => {
      if (!containerRef.current) return { x: screenX, y: screenY };
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = screenX - rect.left;
      const rawY = screenY - rect.top;
      return {
        x: (rawX - viewport.x) / viewport.zoom,
        y: (rawY - viewport.y) / viewport.zoom,
      };
    },
    [viewport]
  );

  // Canvas Mouse Down: Start pan or background deselect
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Pan tool or Spacebar drag initiates panning
    if (e.button === 1 || activeTool === 'pan' || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      return;
    }

    // Left click on background deselects
    if (e.target === svgRef.current || (e.target as HTMLElement).tagName === 'svg') {
      onSelectComponent(null);
      onSelectWire(null);
      if (wireStart) {
        setWireStart(null);
        setWirePreviewEnd(null);
      }
    }
  };

  // Canvas Mouse Move: Dragging components, drawing wire, or panning
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const newVp = {
        ...viewport,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      };
      setViewport(newVp);
      onChangeData?.({ ...data, viewport: newVp });
      return;
    }

    const canvasPos = screenToCanvas(e.clientX, e.clientY);

    // Wire preview tracking
    if (wireStart) {
      setWirePreviewEnd(canvasPos);
    }

    // Component dragging
    if (draggedCompId && !isReadOnly) {
      const gridSize = data.settings?.gridSnap ? 10 : 1;
      const newX = snapToGrid(canvasPos.x - dragOffset.x, gridSize);
      const newY = snapToGrid(canvasPos.y - dragOffset.y, gridSize);

      const updatedComponents = data.components.map((c) =>
        c.id === draggedCompId ? { ...c, x: newX, y: newY } : c
      );

      onChangeData?.({ ...data, components: updatedComponents });
    }
  };

  // Canvas Mouse Up
  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedCompId(null);
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = Math.min(Math.max(viewport.zoom * zoomFactor, 0.3), 3.0);

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    // Zoom centered on cursor
    const newX = cursorX - (cursorX - viewport.x) * (newZoom / viewport.zoom);
    const newY = cursorY - (cursorY - viewport.y) * (newZoom / viewport.zoom);

    const newVp = { x: newX, y: newY, zoom: newZoom };
    setViewport(newVp);
    onChangeData?.({ ...data, viewport: newVp });
  };

  // Start dragging a component
  const handleComponentMouseDown = (e: React.MouseEvent, comp: CircuitComponentInstance) => {
    e.stopPropagation();
    if (activeTool === 'delete') {
      if (!isReadOnly) {
        // Delete component and all connected wires
        const newComps = data.components.filter((c) => c.id !== comp.id);
        const newWires = data.wires.filter(
          (w) => w.fromComponentId !== comp.id && w.toComponentId !== comp.id
        );
        onChangeData?.({ ...data, components: newComps, wires: newWires });
        onSelectComponent(null);
      }
      return;
    }

    onSelectComponent(comp.id);
    onSelectWire(null);

    if (!isReadOnly) {
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      setDraggedCompId(comp.id);
      setDragOffset({ x: canvasPos.x - comp.x, y: canvasPos.y - comp.y });
    }
  };

  // Pin connection handling
  const handlePinClick = (e: React.MouseEvent, comp: CircuitComponentInstance, pin: CircuitPin) => {
    e.stopPropagation();
    if (isReadOnly) return;

    if (!wireStart) {
      // Begin wire connection from this pin
      setWireStart({ compId: comp.id, pinId: pin.id });
      setWirePreviewEnd(screenToCanvas(e.clientX, e.clientY));
    } else {
      // Prevent connecting a pin to itself
      if (wireStart.compId === comp.id && wireStart.pinId === pin.id) {
        setWireStart(null);
        setWirePreviewEnd(null);
        return;
      }

      // Check if duplicate wire already exists between these exact pins
      const duplicate = data.wires.some(
        (w) =>
          (w.fromComponentId === wireStart.compId &&
            w.fromPinId === wireStart.pinId &&
            w.toComponentId === comp.id &&
            w.toPinId === pin.id) ||
          (w.fromComponentId === comp.id &&
            w.fromPinId === pin.id &&
            w.toComponentId === wireStart.compId &&
            w.toPinId === wireStart.pinId)
      );

      if (!duplicate) {
        // Choose intelligent default color based on pin type
        const wireColor =
          pin.type === 'power'
            ? '#EF4444'
            : pin.type === 'ground'
            ? '#0F172A'
            : pin.type === 'analog'
            ? '#F59E0B'
            : '#2563EB';

        const newWire: CircuitWire = {
          id: `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          fromComponentId: wireStart.compId,
          fromPinId: wireStart.pinId,
          toComponentId: comp.id,
          toPinId: pin.id,
          color: wireColor,
          routing: data.settings?.wireRouting || 'orthogonal',
        };

        onChangeData?.({ ...data, wires: [...data.wires, newWire] });
      }

      setWireStart(null);
      setWirePreviewEnd(null);
    }
  };

  // HTML5 Drag and drop from library panel
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    const typeId = e.dataTransfer.getData('application/circuit-component');
    if (!typeId) return;

    const def = getComponentDefinition(typeId);
    if (!def) return;

    const canvasPos = screenToCanvas(e.clientX, e.clientY);
    const gridSize = data.settings?.gridSnap ? 10 : 1;
    const x = snapToGrid(canvasPos.x - def.width / 2, gridSize);
    const y = snapToGrid(canvasPos.y - def.height / 2, gridSize);

    // Auto-generate next reference designator (e.g. R1, R2, D1)
    const existingSameType = data.components.filter((c) => c.typeId === typeId);
    const nextNum = existingSameType.length + 1;
    const reference = `${def.defaultRefPrefix}${nextNum}`;

    const newInstance: CircuitComponentInstance = {
      id: `c_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      typeId,
      reference,
      label: def.name,
      x,
      y,
      rotation: 0,
      properties: { ...def.defaultProperties },
    };

    onChangeData?.({ ...data, components: [...data.components, newInstance] });
    onSelectComponent(newInstance.id);
  };

  // Keyboard Shortcuts: Delete, Duplicate, Rotate, Cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isReadOnly) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedComponentId) {
          const newComps = data.components.filter((c) => c.id !== selectedComponentId);
          const newWires = data.wires.filter(
            (w) => w.fromComponentId !== selectedComponentId && w.toComponentId !== selectedComponentId
          );
          onChangeData?.({ ...data, components: newComps, wires: newWires });
          onSelectComponent(null);
        } else if (selectedWireId) {
          const newWires = data.wires.filter((w) => w.id !== selectedWireId);
          onChangeData?.({ ...data, wires: newWires });
          onSelectWire(null);
        }
      } else if (e.key === 'Escape') {
        setWireStart(null);
        setWirePreviewEnd(null);
        onSelectComponent(null);
        onSelectWire(null);
      } else if (e.key === 'r' || e.key === 'R') {
        if (selectedComponentId) {
          const updated = data.components.map((c) =>
            c.id === selectedComponentId ? { ...c, rotation: (c.rotation + 90) % 360 } : c
          );
          onChangeData?.({ ...data, components: updated });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedComponentId, selectedWireId, data, onChangeData, onSelectComponent, onSelectWire, isReadOnly]);

  // Wire Preview Coordinates when drawing
  const getWirePreviewPath = (): string | null => {
    if (!wireStart || !wirePreviewEnd) return null;
    const startComp = data.components.find((c) => c.id === wireStart.compId);
    if (!startComp) return null;
    const startDef = getComponentDefinition(startComp.typeId);
    if (!startDef) return null;
    const startPin = startDef.pins.find((p) => p.id === wireStart.pinId);
    if (!startPin) return null;

    const fromPos = getRotatedPinPosition(startComp, startPin);
    return computeWirePath(fromPos.x, fromPos.y, wirePreviewEnd.x, wirePreviewEnd.y, 'orthogonal');
  };

  const previewPathD = getWirePreviewPath();

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-hidden select-none bg-[#090D16] ${
        activeTool === 'pan' || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      <svg
        ref={svgRef}
        className="w-full h-full block"
        style={{ touchAction: 'none' }}
      >
        <defs>
          {/* Engineering Minor Dots Pattern */}
          <pattern id="grid-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="#1E293B" />
          </pattern>
          {/* Engineering Major Grid Lines */}
          <pattern id="grid-major" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#grid-dots)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#1E293B" strokeWidth="0.75" />
          </pattern>
        </defs>

        {/* Background Grid */}
        {data.settings?.showGrid !== false && (
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#grid-major)"
            className="pointer-events-none"
          />
        )}

        {/* Main Canvas Viewport Group with Pan and Zoom */}
        <g transform={`translate(${viewport.x}, ${viewport.y}) scale(${viewport.zoom})`}>
          {/* Render All Wires */}
          {data.wires.map((wire) => (
            <WireSvg
              key={wire.id}
              wire={wire}
              components={data.components}
              isSelected={selectedWireId === wire.id}
              isSimulating={isSimulating}
              isActive={simulationState.activeWireIds.has(wire.id)}
              onSelectWire={(w) => {
                if (!isReadOnly) {
                  onSelectWire(w.id);
                  onSelectComponent(null);
                }
              }}
            />
          ))}

          {/* Render Active Wire Preview while drawing */}
          {previewPathD && (
            <path
              d={previewPathD}
              fill="none"
              stroke="#06B6D4"
              strokeWidth="2.5"
              strokeDasharray="4,4"
              className="pointer-events-none"
            />
          )}

          {/* Render All Components */}
          {data.components.map((comp) => {
            const isEnergized = simulationState.activeComponentIds.has(comp.id);
            const isBlown = simulationState.blownComponentIds.has(comp.id);

            return (
              <g
                key={comp.id}
                onMouseDown={(e) => handleComponentMouseDown(e, comp)}
                className="cursor-move"
              >
                <ComponentSvg
                  component={comp}
                  isSelected={selectedComponentId === comp.id}
                  isSimulating={isSimulating}
                  isEnergized={isEnergized}
                  isBlown={isBlown}
                  activePinId={wireStart?.compId === comp.id ? wireStart.pinId : null}
                  onPinClick={(e, pin) => handlePinClick(e, comp, pin)}
                  onToggleInteractive={(e) => {
                    e.stopPropagation();
                    onToggleComponentInteractive?.(comp.id);
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Wire Drawing Mode Hint Banner */}
      {wireStart && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md flex items-center gap-2 pointer-events-none animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping" />
          Click a destination pin to connect wire. Press <kbd className="px-1.5 py-0.5 bg-black/40 rounded">Esc</kbd> to cancel.
        </div>
      )}
    </div>
  );
};
