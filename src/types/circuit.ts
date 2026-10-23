import type { DifficultyLevel, ContentStatus } from './index';

export type ComponentCategory =
  | 'microcontrollers'
  | 'power'
  | 'passive'
  | 'semiconductors'
  | 'inputs'
  | 'outputs'
  | 'sensors';

export type PinType = 'power' | 'ground' | 'digital' | 'analog' | 'passive' | 'signal';

export interface CircuitPin {
  id: string;
  name: string;
  x: number;
  y: number;
  type: PinType;
  description?: string;
}

export interface CircuitComponentDefinition {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  symbolType: string;
  width: number;
  height: number;
  pins: CircuitPin[];
  defaultProperties: Record<string, any>;
  defaultRefPrefix: string;
}

export interface CircuitComponentInstance {
  id: string;
  typeId: string;
  reference: string;
  label: string;
  x: number;
  y: number;
  rotation: number; // 0, 90, 180, 270
  properties: Record<string, any>;
  state?: {
    isClosed?: boolean;
    isEnergized?: boolean;
    currentmA?: number;
    voltageDrop?: number;
    isBlown?: boolean;
    val?: number;
    [key: string]: any;
  };
}

export type WireRoutingStyle = 'orthogonal' | 'curved' | 'straight';

export interface CircuitWire {
  id: string;
  fromComponentId: string;
  fromPinId: string;
  toComponentId: string;
  toPinId: string;
  color: string;
  routing?: WireRoutingStyle;
}

export interface CircuitViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface CircuitDataSettings {
  gridSnap: boolean;
  showGrid: boolean;
  wireRouting: WireRoutingStyle;
}

export interface CircuitData {
  version: number;
  components: CircuitComponentInstance[];
  wires: CircuitWire[];
  viewport: CircuitViewport;
  settings?: CircuitDataSettings;
}

export interface Circuit {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: DifficultyLevel;
  estimated_build_minutes: number;
  cover_image_path?: string;
  circuit_data: CircuitData;
  instructions?: string;
  safety_notes?: string;
  status: ContentStatus;
  featured: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface SimulationWarning {
  type: 'hazard' | 'warning' | 'info';
  message: string;
  componentId?: string;
}

export interface SimulationState {
  isRunning: boolean;
  isPaused: boolean;
  powerSourceFound: boolean;
  groundFound: boolean;
  hasClosedCircuit: boolean;
  activeComponentIds: Set<string>;
  activeWireIds: Set<string>;
  blownComponentIds: Set<string>;
  warnings: SimulationWarning[];
  metrics: {
    activeCurrentmA: number;
    supplyVoltage: number;
    energizedNodeCount: number;
  };
}
