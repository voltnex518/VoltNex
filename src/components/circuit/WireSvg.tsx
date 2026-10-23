import React from 'react';
import type { CircuitComponentInstance, CircuitWire } from '../../types/circuit';
import { getComponentDefinition } from '../../lib/circuit/components';
import { getRotatedPinPosition, computeWirePath } from '../../lib/circuit/geometry';

interface WireSvgProps {
  wire: CircuitWire;
  components: CircuitComponentInstance[];
  isSelected: boolean;
  isSimulating: boolean;
  isActive: boolean;
  onSelectWire?: (wire: CircuitWire) => void;
}

export const WireSvg: React.FC<WireSvgProps> = ({
  wire,
  components,
  isSelected,
  isSimulating,
  isActive,
  onSelectWire,
}) => {
  const fromComp = components.find((c) => c.id === wire.fromComponentId);
  const toComp = components.find((c) => c.id === wire.toComponentId);
  if (!fromComp || !toComp) return null;

  const fromDef = getComponentDefinition(fromComp.typeId);
  const toDef = getComponentDefinition(toComp.typeId);
  if (!fromDef || !toDef) return null;

  const fromPin = fromDef.pins.find((p) => p.id === wire.fromPinId);
  const toPin = toDef.pins.find((p) => p.id === wire.toPinId);
  if (!fromPin || !toPin) return null;

  const fromPos = getRotatedPinPosition(fromComp, fromPin);
  const toPos = getRotatedPinPosition(toComp, toPin);

  const pathD = computeWirePath(
    fromPos.x,
    fromPos.y,
    toPos.x,
    toPos.y,
    wire.routing || 'orthogonal'
  );

  const wireColor = wire.color || '#EF4444';

  return (
    <g className="cursor-pointer group" onClick={() => onSelectWire?.(wire)}>
      {/* Invisible broad stroke for easy clicking / hit testing */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Selected Halo Outline */}
      {isSelected && (
        <path
          d={pathD}
          fill="none"
          stroke="#06B6D4"
          strokeWidth="6"
          strokeOpacity="0.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Core Wire Path */}
      <path
        d={pathD}
        fill="none"
        stroke={wireColor}
        strokeWidth={isSelected ? '3' : '2.5'}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-colors group-hover:brightness-125"
      />

      {/* Animated Current Pulse during Simulation */}
      {isSimulating && isActive && (
        <path
          d={pathD}
          fill="none"
          stroke="#FDE047"
          strokeWidth="2.5"
          strokeDasharray="6,8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="28"
            to="0"
            dur="0.6s"
            repeatCount="indefinite"
          />
        </path>
      )}

      {/* Connection Endpoint Dots */}
      <circle cx={fromPos.x} cy={fromPos.y} r="3" fill={wireColor} />
      <circle cx={toPos.x} cy={toPos.y} r="3" fill={wireColor} />
    </g>
  );
};
