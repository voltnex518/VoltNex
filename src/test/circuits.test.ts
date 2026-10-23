import { describe, it, expect } from 'vitest';
import {
  COMPONENT_DEFINITIONS,
  getComponentDefinition,
  CATEGORIES,
} from '../lib/circuit/components';
import {
  snapToGrid,
  getRotatedPinPosition,
  computeWirePath,
  exportCircuitToSvg,
} from '../lib/circuit/geometry';
import { simulateCircuit } from '../lib/circuit/simulator';
import type {
  CircuitComponentInstance,
  CircuitWire,
  CircuitData,
} from '../types/circuit';
import { MOCK_CIRCUITS } from '../data/mockCircuits';

describe('Circuit Components Library', () => {
  it('contains at least 25 distinct component definitions across all categories', () => {
    expect(COMPONENT_DEFINITIONS.length).toBeGreaterThanOrEqual(25);
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(7);
  });

  it('retrieves component definitions by ID with valid pins and dimensions', () => {
    const arduino = getComponentDefinition('arduino_uno');
    expect(arduino).toBeDefined();
    expect(arduino?.category).toBe('microcontrollers');
    expect(arduino?.pins.length).toBeGreaterThan(10);

    const led = getComponentDefinition('led');
    expect(led).toBeDefined();
    expect(led?.category).toBe('semiconductors');
    expect(led?.pins).toHaveLength(2);

    const battery = getComponentDefinition('battery_9v');
    expect(battery).toBeDefined();
    expect(battery?.category).toBe('power');
  });

  it('returns undefined for non-existent component types safely', () => {
    const nonExistent = getComponentDefinition('quantum_flux_gate');
    expect(nonExistent).toBeUndefined();
  });
});

describe('Circuit Geometry & Routing Engine', () => {
  it('snaps arbitrary coordinates to 10px grid points', () => {
    expect(snapToGrid(12)).toBe(10);
    expect(snapToGrid(16)).toBe(20);
    expect(snapToGrid(105, 20)).toBe(100);
    expect(snapToGrid(112, 20)).toBe(120);
  });

  it('calculates rotated pin positions correctly', () => {
    const comp: CircuitComponentInstance = {
      id: 'r1',
      typeId: 'resistor',
      reference: 'R1',
      label: 'Resistor',
      x: 100,
      y: 100,
      rotation: 0,
      properties: { resistance: 330 },
    };

    const def = getComponentDefinition('resistor')!;
    const p1 = def.pins[0]; // (0, 20)
    const pos0 = getRotatedPinPosition(comp, p1);
    expect(pos0.x).toBe(100);
    expect(pos0.y).toBe(120);

    // Rotate 90 degrees
    const comp90: CircuitComponentInstance = {
      ...comp,
      rotation: 90,
    };
    const pos90 = getRotatedPinPosition(comp90, p1);
    expect(typeof pos90.x).toBe('number');
    expect(typeof pos90.y).toBe('number');
  });

  it('generates straight, curved, and orthogonal Manhattan wire paths', () => {
    const straight = computeWirePath(10, 20, 100, 200, 'straight');
    expect(straight).toBe('M 10 20 L 100 200');

    const curved = computeWirePath(0, 0, 100, 100, 'curved');
    expect(curved).toContain('M 0 0 C');

    const ortho = computeWirePath(0, 0, 100, 100, 'orthogonal');
    expect(ortho).toBe('M 0 0 L 50 0 L 50 100 L 100 100');
  });
});

describe('Circuit Simulation Engine', () => {
  it('flags missing power sources and ground nodes', () => {
    const resistorOnly: CircuitComponentInstance[] = [
      {
        id: 'r1',
        typeId: 'resistor',
        reference: 'R1',
        label: 'Resistor',
        x: 100,
        y: 100,
        rotation: 0,
        properties: { resistance: 1000 },
      },
    ];

    const sim = simulateCircuit(resistorOnly, [], true);
    expect(sim.warnings.some((w) => w.message.includes('No power source'))).toBe(true);
    expect(sim.warnings.some((w) => w.message.includes('No ground reference'))).toBe(true);
    expect(sim.hasClosedCircuit).toBe(false);
  });

  it('detects duplicate reference designators', () => {
    const dupes: CircuitComponentInstance[] = [
      {
        id: 'r1',
        typeId: 'resistor',
        reference: 'R1',
        label: 'Resistor',
        x: 100,
        y: 100,
        rotation: 0,
        properties: {},
      },
      {
        id: 'r2',
        typeId: 'resistor',
        reference: 'R1',
        label: 'Duplicate Resistor',
        x: 200,
        y: 100,
        rotation: 0,
        properties: {},
      },
    ];

    const sim = simulateCircuit(dupes, [], true);
    expect(sim.warnings.some((w) => w.message.includes('Duplicate reference designator'))).toBe(true);
  });

  it('simulates a closed loop with 9V Battery, Resistor, and LED with accurate current', () => {
    const components: CircuitComponentInstance[] = [
      {
        id: 'bat1',
        typeId: 'battery_9v',
        reference: 'BT1',
        label: '9V Battery',
        x: 100,
        y: 100,
        rotation: 0,
        properties: { voltage: 9.0 },
      },
      {
        id: 'res1',
        typeId: 'resistor',
        reference: 'R1',
        label: 'Resistor',
        x: 240,
        y: 100,
        rotation: 0,
        properties: { resistance: 330 },
      },
      {
        id: 'led1',
        typeId: 'led',
        reference: 'D1',
        label: 'Red LED',
        x: 380,
        y: 100,
        rotation: 0,
        properties: { forwardVoltage: 2.0, maxCurrent: 0.03 },
      },
    ];

    // Wire 1: BT1:pos -> R1:p1
    // Wire 2: R1:p2 -> D1:anode
    // Wire 3: D1:cathode -> BT1:neg
    const wires: CircuitWire[] = [
      {
        id: 'w1',
        fromComponentId: 'bat1',
        fromPinId: 'pos',
        toComponentId: 'res1',
        toPinId: 'p1',
        color: '#EF4444',
        routing: 'orthogonal',
      },
      {
        id: 'w2',
        fromComponentId: 'res1',
        fromPinId: 'p2',
        toComponentId: 'led1',
        toPinId: 'anode',
        color: '#22C55E',
        routing: 'orthogonal',
      },
      {
        id: 'w3',
        fromComponentId: 'led1',
        fromPinId: 'cathode',
        toComponentId: 'bat1',
        toPinId: 'neg',
        color: '#0F172A',
        routing: 'orthogonal',
      },
    ];

    const sim = simulateCircuit(components, wires, true);

    expect(sim.hasClosedCircuit).toBe(true);
    expect(sim.activeComponentIds.has('bat1')).toBe(true);
    expect(sim.activeComponentIds.has('res1')).toBe(true);
    expect(sim.activeComponentIds.has('led1')).toBe(true);

    // Current = (9V - 2V) / 330 ohm = 7 / 330 = 0.0212 A = ~21.2 mA
    expect(sim.metrics.activeCurrentmA).toBeGreaterThan(15);
    expect(sim.metrics.activeCurrentmA).toBeLessThan(25);
    expect(sim.blownComponentIds.size).toBe(0);
  });

  it('triggers LED overcurrent hazard warning when current exceeds 30mA (e.g., 9V battery with 10 ohm resistor)', () => {
    const components: CircuitComponentInstance[] = [
      {
        id: 'bat1',
        typeId: 'battery_9v',
        reference: 'BT1',
        label: '9V Battery',
        x: 100,
        y: 100,
        rotation: 0,
        properties: { voltage: 9.0 },
      },
      {
        id: 'res1',
        typeId: 'resistor',
        reference: 'R1',
        label: 'Small Resistor',
        x: 240,
        y: 100,
        rotation: 0,
        properties: { resistance: 10 },
      },
      {
        id: 'led1',
        typeId: 'led',
        reference: 'D1',
        label: 'Red LED',
        x: 380,
        y: 100,
        rotation: 0,
        properties: { forwardVoltage: 2.0, maxCurrent: 0.03 },
      },
    ];

    const wires: CircuitWire[] = [
      {
        id: 'w1',
        fromComponentId: 'bat1',
        fromPinId: 'pos',
        toComponentId: 'res1',
        toPinId: 'p1',
        color: '#EF4444',
        routing: 'orthogonal',
      },
      {
        id: 'w2',
        fromComponentId: 'res1',
        fromPinId: 'p2',
        toComponentId: 'led1',
        toPinId: 'anode',
        color: '#22C55E',
        routing: 'orthogonal',
      },
      {
        id: 'w3',
        fromComponentId: 'led1',
        fromPinId: 'cathode',
        toComponentId: 'bat1',
        toPinId: 'neg',
        color: '#0F172A',
        routing: 'orthogonal',
      },
    ];

    const sim = simulateCircuit(components, wires, true);

    expect(sim.warnings.some((w) => w.type === 'hazard' || w.message.includes('excessive current'))).toBe(true);
    expect(sim.blownComponentIds.has('led1')).toBe(true);
  });

  it('respects switch toggle states: open breaks the circuit, closed energizes it', () => {
    const componentsOpen: CircuitComponentInstance[] = [
      {
        id: 'bat1',
        typeId: 'battery_9v',
        reference: 'BT1',
        label: '9V Battery',
        x: 100,
        y: 100,
        rotation: 0,
        properties: { voltage: 9.0 },
      },
      {
        id: 'sw1',
        typeId: 'spst_switch',
        reference: 'SW1',
        label: 'Toggle Switch',
        x: 250,
        y: 100,
        rotation: 0,
        properties: { isClosed: false },
      },
      {
        id: 'res1',
        typeId: 'resistor',
        reference: 'R1',
        label: 'Resistor',
        x: 380,
        y: 100,
        rotation: 0,
        properties: { resistance: 470 },
      },
    ];

    const wires: CircuitWire[] = [
      {
        id: 'w1',
        fromComponentId: 'bat1',
        fromPinId: 'pos',
        toComponentId: 'sw1',
        toPinId: 'p1',
        color: '#EF4444',
        routing: 'orthogonal',
      },
      {
        id: 'w2',
        fromComponentId: 'sw1',
        fromPinId: 'p2',
        toComponentId: 'res1',
        toPinId: 'p1',
        color: '#3B82F6',
        routing: 'orthogonal',
      },
      {
        id: 'w3',
        fromComponentId: 'res1',
        fromPinId: 'p2',
        toComponentId: 'bat1',
        toPinId: 'neg',
        color: '#0F172A',
        routing: 'orthogonal',
      },
    ];

    const simOpen = simulateCircuit(componentsOpen, wires, true);
    expect(simOpen.hasClosedCircuit).toBe(false);

    // Now close switch
    const componentsClosed = componentsOpen.map((c) =>
      c.id === 'sw1' ? { ...c, properties: { ...c.properties, isClosed: true } } : c
    );
    const simClosed = simulateCircuit(componentsClosed, wires, true);
    expect(simClosed.hasClosedCircuit).toBe(true);
  });
});

describe('Circuit Data Serialization & Pre-built Templates', () => {
  it('serializes and deserializes CircuitData correctly without data loss', () => {
    const circuit = MOCK_CIRCUITS[0];
    const jsonStr = JSON.stringify(circuit.circuit_data);
    const parsed: CircuitData = JSON.parse(jsonStr);

    expect(parsed.version).toBe(1);
    expect(parsed.components.length).toBe(circuit.circuit_data.components.length);
    expect(parsed.wires.length).toBe(circuit.circuit_data.wires.length);
  });

  it('all mock template circuits load and have valid components and pins', () => {
    for (const mock of MOCK_CIRCUITS) {
      expect(mock.id).toBeTruthy();
      expect(mock.slug).toBeTruthy();
      expect(mock.category).toBeTruthy();
      expect(mock.circuit_data.components.length).toBeGreaterThan(0);

      // Verify every component references a known definition
      for (const comp of mock.circuit_data.components) {
        const def = getComponentDefinition(comp.typeId);
        expect(def, `Component type ${comp.typeId} must exist`).toBeDefined();
      }

      // Verify all wires link valid components
      const compIds = new Set(mock.circuit_data.components.map((c) => c.id));
      for (const wire of mock.circuit_data.wires) {
        expect(compIds.has(wire.fromComponentId)).toBe(true);
        expect(compIds.has(wire.toComponentId)).toBe(true);
      }
    }
  });

  it('exports standalone SVG with VoltNex branding watermark', () => {
    const svgMock = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgMock.setAttribute('width', '800');
    svgMock.setAttribute('height', '600');
    const svgOutput = exportCircuitToSvg(svgMock, 'Test Blueprint');

    expect(svgOutput).toContain('VoltNex Labs • Test Blueprint');
    expect(svgOutput).toContain('http://www.w3.org/2000/svg');
  });
});
