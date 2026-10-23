import type {
  CircuitComponentInstance,
  CircuitWire,
  SimulationState,
  SimulationWarning,
} from '../../types/circuit';
import { getComponentDefinition } from './components';

export function simulateCircuit(
  components: CircuitComponentInstance[],
  wires: CircuitWire[],
  isRunning: boolean = false
): SimulationState {
  const warnings: SimulationWarning[] = [];
  const activeComponentIds = new Set<string>();
  const activeWireIds = new Set<string>();
  const blownComponentIds = new Set<string>();

  // 1. Check duplicate reference designators
  const refCounts = new Map<string, number>();
  for (const c of components) {
    refCounts.set(c.reference, (refCounts.get(c.reference) || 0) + 1);
  }
  for (const [ref, count] of refCounts.entries()) {
    if (count > 1) {
      warnings.push({
        type: 'warning',
        message: `Duplicate reference designator "${ref}" detected on ${count} components.`,
      });
    }
  }

  // 2. Identify power sources and ground nodes
  let powerSourceFound = false;
  let groundFound = false;
  let supplyVoltage = 0;

  // Map wire connections: pinKey -> list of connected pinKeys
  // pinKey format: `${componentId}:${pinId}`
  const netGraph = new Map<string, { wireId: string; targetKey: string }[]>();

  const addEdge = (a: string, b: string, wireId: string) => {
    if (!netGraph.has(a)) netGraph.set(a, []);
    if (!netGraph.has(b)) netGraph.set(b, []);
    netGraph.get(a)!.push({ wireId, targetKey: b });
    netGraph.get(b)!.push({ wireId, targetKey: a });
  };

  for (const wire of wires) {
    const fromKey = `${wire.fromComponentId}:${wire.fromPinId}`;
    const toKey = `${wire.toComponentId}:${wire.toPinId}`;
    addEdge(fromKey, toKey, wire.id);
  }

  // Find source pins and ground pins
  const powerSourcePins: { key: string; voltage: number; compId: string }[] = [];
  const groundPins: { key: string; compId: string }[] = [];

  for (const comp of components) {
    if (comp.typeId === 'battery_9v') {
      powerSourceFound = true;
      const v = Number(comp.properties.voltage) || 9.0;
      supplyVoltage = Math.max(supplyVoltage, v);
      powerSourcePins.push({ key: `${comp.id}:pos`, voltage: v, compId: comp.id });
      groundPins.push({ key: `${comp.id}:neg`, compId: comp.id });
      groundFound = true;
    } else if (comp.typeId === 'power_supply_dc') {
      powerSourceFound = true;
      const v = Number(comp.properties.voltage) || 5.0;
      supplyVoltage = Math.max(supplyVoltage, v);
      powerSourcePins.push({ key: `${comp.id}:vcc`, voltage: v, compId: comp.id });
      groundPins.push({ key: `${comp.id}:gnd`, compId: comp.id });
      groundFound = true;
    } else if (comp.typeId === 'voltage_source') {
      powerSourceFound = true;
      const v = Number(comp.properties.voltage) || 5.0;
      supplyVoltage = Math.max(supplyVoltage, v);
      powerSourcePins.push({ key: `${comp.id}:vcc`, voltage: v, compId: comp.id });
    } else if (comp.typeId === 'ground') {
      groundFound = true;
      groundPins.push({ key: `${comp.id}:gnd`, compId: comp.id });
    } else if (comp.typeId === 'arduino_uno') {
      // Board can provide 5V and 3.3V power rails
      powerSourceFound = true;
      supplyVoltage = Math.max(supplyVoltage, 5.0);
      powerSourcePins.push({ key: `${comp.id}:p5v`, voltage: 5.0, compId: comp.id });
      powerSourcePins.push({ key: `${comp.id}:p3v3`, voltage: 3.3, compId: comp.id });
      groundPins.push({ key: `${comp.id}:gnd_bot1`, compId: comp.id });
      groundPins.push({ key: `${comp.id}:gnd_bot2`, compId: comp.id });
      groundPins.push({ key: `${comp.id}:gnd_top`, compId: comp.id });
      groundFound = true;
    } else if (comp.typeId === 'esp32_devkit') {
      powerSourceFound = true;
      supplyVoltage = Math.max(supplyVoltage, 3.3);
      powerSourcePins.push({ key: `${comp.id}:p3v3`, voltage: 3.3, compId: comp.id });
      groundPins.push({ key: `${comp.id}:gnd`, compId: comp.id });
      groundFound = true;
    }
  }

  // Check general structural requirements
  if (components.length > 0 && !powerSourceFound) {
    warnings.push({
      type: 'warning',
      message: 'No power source detected. Add a Battery, DC Power Supply, or Microcontroller board.',
    });
  }

  if (components.length > 0 && !groundFound) {
    warnings.push({
      type: 'warning',
      message: 'No ground reference detected. Add a Ground (GND) or connect to negative battery terminal.',
    });
  }

  // 3. Trace electrical loops
  // Helper to get connected set of pins reachable through wires only
  const getWireReachablePins = (startKey: string): { keys: Set<string>; wires: Set<string> } => {
    const reachable = new Set<string>();
    const usedWires = new Set<string>();
    const queue = [startKey];
    reachable.add(startKey);

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const neighbors = netGraph.get(curr) || [];
      for (const { wireId, targetKey } of neighbors) {
        usedWires.add(wireId);
        if (!reachable.has(targetKey)) {
          reachable.add(targetKey);
          queue.push(targetKey);
        }
      }
    }
    return { keys: reachable, wires: usedWires };
  };

  const groundPinsSet = new Set<string>(groundPins.map((g) => g.key));
  const groundReachable = new Set<string>();
  const groundWires = new Set<string>();
  for (const gp of groundPins) {
    const { keys, wires: w } = getWireReachablePins(gp.key);
    keys.forEach((k) => groundReachable.add(k));
    w.forEach((id) => groundWires.add(id));
  }

  const compMap = new Map<string, CircuitComponentInstance>();
  for (const comp of components) {
    compMap.set(comp.id, comp);
  }

  let hasClosedCircuit = false;
  let totalCurrentmA = 0;

  // BFS Queue State for full circuit tracing through wires and component internals
  interface PathState {
    currentPinKey: string;
    resistance: number;
    voltageDrop: number;
    traversedWires: string[];
    traversedComps: string[];
    ledsInPath: { id: string; ref: string; maxmA: number }[];
  }

  for (const src of powerSourcePins) {
    const queue: PathState[] = [
      {
        currentPinKey: src.key,
        resistance: 0,
        voltageDrop: 0,
        traversedWires: [],
        traversedComps: [],
        ledsInPath: [],
      },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const { currentPinKey, resistance, voltageDrop, traversedWires, traversedComps, ledsInPath } = current;

      // If we reached ground from positive, a complete electrical loop is closed!
      if (groundPinsSet.has(currentPinKey) && traversedComps.length > 0) {
        hasClosedCircuit = true;
        activeComponentIds.add(src.compId);
        traversedComps.forEach((cid) => activeComponentIds.add(cid));
        traversedWires.forEach((wid) => activeWireIds.add(wid));

        const effectiveV = Math.max(src.voltage - voltageDrop, 0);
        const currentA = effectiveV / Math.max(resistance, 1);
        const currentmA = Math.round(currentA * 1000 * 10) / 10;
        totalCurrentmA += currentmA;

        // Check for LED overcurrent
        for (const led of ledsInPath) {
          if (currentmA > led.maxmA) {
            blownComponentIds.add(led.id);
            warnings.push({
              type: 'hazard',
              message: `LED ${led.ref} may receive excessive current (${currentmA}mA > ${led.maxmA}mA max)! Add a 220Ω - 330Ω series resistor to avoid burning it out.`,
              componentId: led.id,
            });
          }
        }

        // Check for near-short circuits
        if (resistance < 2 && ledsInPath.length === 0) {
          warnings.push({
            type: 'hazard',
            message: `Potential direct short circuit or near-zero resistance loop detected on power rail (${src.voltage}V).`,
          });
        }
        continue;
      }

      // 1. Follow wires from this pin
      const wireNeighbors = netGraph.get(currentPinKey) || [];
      for (const { wireId, targetKey } of wireNeighbors) {
        if (!traversedWires.includes(wireId)) {
          queue.push({
            currentPinKey: targetKey,
            resistance,
            voltageDrop,
            traversedWires: [...traversedWires, wireId],
            traversedComps,
            ledsInPath,
          });
        }
      }

      // 2. Pass internally through component pins
      const [compId, pinId] = currentPinKey.split(':');
      const comp = compMap.get(compId);

      if (comp && compId !== src.compId && !traversedComps.includes(compId)) {
        if (comp.typeId === 'resistor') {
          const rVal = Number(comp.properties.resistance) || 220;
          const nextPin = pinId === 'p1' ? 'p2' : 'p1';
          queue.push({
            currentPinKey: `${compId}:${nextPin}`,
            resistance: resistance + rVal,
            voltageDrop,
            traversedWires,
            traversedComps: [...traversedComps, compId],
            ledsInPath,
          });
        } else if (comp.typeId === 'spst_switch') {
          const isClosed = comp.state?.isClosed ?? comp.properties.isClosed ?? false;
          if (isClosed) {
            const nextPin = pinId === 'p1' ? 'p2' : 'p1';
            queue.push({
              currentPinKey: `${compId}:${nextPin}`,
              resistance,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          }
        } else if (comp.typeId === 'push_button') {
          const isPressed = comp.state?.isClosed ?? false;
          if (isPressed) {
            const nextPin = pinId === 'p1' ? 'p2' : 'p1';
            queue.push({
              currentPinKey: `${compId}:${nextPin}`,
              resistance,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          }
        } else if (comp.typeId === 'led') {
          if (pinId === 'anode') {
            const vf = Number(comp.properties.forwardVoltage) || 2.0;
            const maxAllowed = Number(comp.properties.maxCurrentmA) || 30;
            queue.push({
              currentPinKey: `${compId}:cathode`,
              resistance: resistance + 2, // small internal LED dynamic resistance
              voltageDrop: voltageDrop + vf,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath: [...ledsInPath, { id: comp.id, ref: comp.reference, maxmA: maxAllowed }],
            });
          } else if (pinId === 'cathode') {
            // Reverse biased LED
            warnings.push({
              type: 'warning',
              message: `LED ${comp.reference} is reverse-biased (Cathode connected to positive voltage). It will not emit light.`,
              componentId: comp.id,
            });
          }
        } else if (comp.typeId === 'diode') {
          if (pinId === 'anode') {
            const vf = Number(comp.properties.forwardVoltage) || 0.7;
            queue.push({
              currentPinKey: `${compId}:cathode`,
              resistance: resistance + 1,
              voltageDrop: voltageDrop + vf,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          }
        } else if (comp.typeId === 'dc_motor') {
          const nextPin = pinId === 'pos' ? 'neg' : 'pos';
          queue.push({
            currentPinKey: `${compId}:${nextPin}`,
            resistance: resistance + 25,
            voltageDrop,
            traversedWires,
            traversedComps: [...traversedComps, compId],
            ledsInPath,
          });
        } else if (comp.typeId === 'piezo_buzzer') {
          if (pinId === 'pos') {
            queue.push({
              currentPinKey: `${compId}:neg`,
              resistance: resistance + 100,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          }
        } else if (comp.typeId === 'inductor') {
          const nextPin = pinId === 'p1' ? 'p2' : 'p1';
          queue.push({
            currentPinKey: `${compId}:${nextPin}`,
            resistance: resistance + 0.5,
            voltageDrop,
            traversedWires,
            traversedComps: [...traversedComps, compId],
            ledsInPath,
          });
        } else if (comp.typeId === 'potentiometer') {
          const totalR = Number(comp.properties.totalResistance) || 10000;
          const pct = Math.max(0, Math.min(100, Number(comp.properties.valuePercent) || 50));
          const r1 = Math.round((totalR * pct) / 100);
          const r2 = Math.round((totalR * (100 - pct)) / 100);

          if (pinId === 't1') {
            queue.push({
              currentPinKey: `${compId}:wiper`,
              resistance: resistance + r1,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          } else if (pinId === 't2') {
            queue.push({
              currentPinKey: `${compId}:wiper`,
              resistance: resistance + r2,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          } else if (pinId === 'wiper') {
            queue.push({
              currentPinKey: `${compId}:t1`,
              resistance: resistance + r1,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
            queue.push({
              currentPinKey: `${compId}:t2`,
              resistance: resistance + r2,
              voltageDrop,
              traversedWires,
              traversedComps: [...traversedComps, compId],
              ledsInPath,
            });
          }
        }
      }
    }
  }

  // Also check active state for IC and sensor modules (e.g., OLED, HC-SR04, ESP32)
  for (const comp of components) {
    if (
      comp.typeId === 'oled_i2c' ||
      comp.typeId === 'lcd_16x2_i2c' ||
      comp.typeId === 'hc_sr04' ||
      comp.typeId === 'dht11' ||
      comp.typeId === 'pir_sensor'
    ) {
      const vccKey = `${comp.id}:vcc`;
      const gndKey = `${comp.id}:gnd`;
      // If VCC connects to any power source pin and GND connects to ground
      const { keys: vccReach } = getWireReachablePins(vccKey);
      const { keys: gndReach } = getWireReachablePins(gndKey);
      const hasPower = powerSourcePins.some((ps) => vccReach.has(ps.key));
      const hasGround = groundPins.some((gp) => gndReach.has(gp.key));

      if (hasPower && hasGround) {
        activeComponentIds.add(comp.id);
        hasClosedCircuit = true;
      }
    }
  }

  // 4. Check for unconnected component pins
  for (const comp of components) {
    const def = getComponentDefinition(comp.typeId);
    if (!def) continue;

    const unconnected = def.pins.filter((pin) => {
      const pinKey = `${comp.id}:${pin.id}`;
      return !netGraph.has(pinKey) || netGraph.get(pinKey)!.length === 0;
    });

    if (unconnected.length === def.pins.length && def.pins.length > 0) {
      warnings.push({
        type: 'info',
        message: `${comp.label || comp.reference} is completely disconnected. Connect its pins with wires.`,
        componentId: comp.id,
      });
    }
  }

  return {
    isRunning,
    isPaused: false,
    powerSourceFound,
    groundFound,
    hasClosedCircuit,
    activeComponentIds,
    activeWireIds,
    blownComponentIds,
    warnings,
    metrics: {
      activeCurrentmA: Math.round(totalCurrentmA * 10) / 10,
      supplyVoltage,
      energizedNodeCount: activeComponentIds.size,
    },
  };
}
