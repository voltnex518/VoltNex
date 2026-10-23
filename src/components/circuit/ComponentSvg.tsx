import React from 'react';
import type { CircuitComponentInstance, CircuitPin } from '../../types/circuit';
import { getComponentDefinition } from '../../lib/circuit/components';

interface ComponentSvgProps {
  component: CircuitComponentInstance;
  isSelected: boolean;
  isSimulating: boolean;
  isBlown?: boolean;
  isEnergized?: boolean;
  activePinId?: string | null;
  onPinMouseDown?: (e: React.MouseEvent, pin: CircuitPin) => void;
  onPinClick?: (e: React.MouseEvent, pin: CircuitPin) => void;
  onToggleInteractive?: (e: React.MouseEvent) => void;
}

// Convert resistor value into standard 4-band EIA color codes
function getResistorColorBands(ohms: number): { b1: string; b2: string; mult: string; tol: string } {
  const colorMap: Record<number, string> = {
    0: '#000000', // Black
    1: '#8B4513', // Brown
    2: '#EF4444', // Red
    3: '#F97316', // Orange
    4: '#EAB308', // Yellow
    5: '#22C55E', // Green
    6: '#3B82F6', // Blue
    7: '#A855F7', // Violet
    8: '#6B7280', // Grey
    9: '#FFFFFF', // White
  };

  const str = Math.round(ohms).toString();
  const digit1 = parseInt(str[0] || '2', 10);
  const digit2 = parseInt(str[1] || '2', 10);
  const exponent = Math.max(0, str.length - 2);

  return {
    b1: colorMap[digit1] || '#EF4444',
    b2: colorMap[digit2] || '#EF4444',
    mult: colorMap[exponent] || '#8B4513',
    tol: '#EAB308', // Gold 5%
  };
}

export const ComponentSvg: React.FC<ComponentSvgProps> = ({
  component,
  isSelected,
  isSimulating,
  isBlown,
  isEnergized,
  activePinId,
  onPinMouseDown,
  onPinClick,
  onToggleInteractive,
}) => {
  const def = getComponentDefinition(component.typeId);
  if (!def) return null;

  const width = def.width;
  const height = def.height;
  const rotation = component.rotation || 0;

  // Render specific visual package for each component type
  const renderVisual = () => {
    switch (component.typeId) {
      case 'arduino_uno':
        return (
          <g>
            {/* PCB Body */}
            <rect
              x="0"
              y="0"
              width={width}
              height={height}
              rx="8"
              fill="#00878F"
              stroke="#006369"
              strokeWidth="2"
            />
            {/* USB Port */}
            <rect x="0" y="15" width="28" height="22" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <rect x="4" y="19" width="20" height="14" fill="#1E293B" />
            {/* DC Barrel Jack */}
            <rect x="0" y="115" width="32" height="28" rx="2" fill="#1E293B" />
            {/* ATmega328P Chip */}
            <rect x="80" y="55" width="85" height="42" rx="2" fill="#1E293B" stroke="#334155" strokeWidth="1" />
            <text x="122" y="77" fill="#94A3B8" fontSize="8" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
              ATmega328P
            </text>
            {/* Crystal Oscillator */}
            <rect x="68" y="105" width="20" height="12" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            {/* Onboard LEDs */}
            <circle cx="170" cy="55" r="2.5" fill={isEnergized ? '#22C55E' : '#14532D'} />
            <text x="175" y="57" fill="#E2E8F0" fontSize="6" fontFamily="sans-serif">ON</text>
            <circle cx="170" cy="65" r="2.5" fill={isEnergized ? '#EAB308' : '#713F12'} />
            <text x="175" y="67" fill="#E2E8F0" fontSize="6" fontFamily="sans-serif">L</text>
            {/* Silkscreen Labels */}
            <text x="110" y="30" fill="#FFFFFF" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              ARDUINO
            </text>
            <text x="110" y="42" fill="#E2E8F0" fontSize="8" fontFamily="sans-serif">
              UNO R3
            </text>
            {/* Top Header Strip */}
            <rect x="15" y="0" width="198" height="10" fill="#1E293B" />
            {/* Bottom Header Strip */}
            <rect x="15" y="150" width="175" height="10" fill="#1E293B" />
          </g>
        );

      case 'esp32_devkit':
        return (
          <g>
            {/* PCB */}
            <rect x="0" y="0" width={width} height={height} rx="6" fill="#1E293B" stroke="#334155" strokeWidth="2" />
            {/* Metal RF Shield */}
            <rect x="40" y="25" width="120" height="95" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1" />
            <rect x="45" y="30" width="110" height="85" fill="#CBD5E1" opacity="0.3" />
            <text x="100" y="65" fill="#0F172A" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              ESP-WROOM-32
            </text>
            <text x="100" y="80" fill="#334155" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              Wi-Fi + BT SoC
            </text>
            {/* Micro-USB Port */}
            <rect x="85" y="140" width="30" height="10" rx="2" fill="#94A3B8" />
            {/* Pin headers top & bottom */}
            <rect x="10" y="0" width="180" height="8" fill="#0F172A" />
            <rect x="10" y="142" width="180" height="8" fill="#0F172A" />
            {/* Power LED */}
            <circle cx="28" cy="130" r="3" fill={isEnergized ? '#EF4444' : '#7F1D1D'} />
          </g>
        );

      case 'battery_9v':
        return (
          <g>
            {/* Battery Body */}
            <rect x="5" y="15" width="70" height="95" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <rect x="5" y="15" width="70" height="35" rx="6" fill="#0284C7" />
            {/* Snap Terminals */}
            <rect x="18" y="3" width="14" height="12" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            <circle cx="55" cy="9" r="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            {/* Labels */}
            <text x="25" y="28" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">
              +
            </text>
            <text x="55" y="28" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
              −
            </text>
            <text x="40" y="70" fill="#FFFFFF" fontSize="14" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              9V
            </text>
            <text x="40" y="85" fill="#94A3B8" fontSize="8" textAnchor="middle">
              ALKALINE
            </text>
          </g>
        );

      case 'power_supply_dc': {
        const v = component.properties.voltage || 5.0;
        return (
          <g>
            <rect x="0" y="0" width={width} height={height} rx="8" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
            {/* 7-Segment style LED readout */}
            <rect x="15" y="12" width="70" height="30" rx="4" fill="#090D16" />
            <text x="50" y="33" fill="#06B6D4" fontSize="16" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {Number(v).toFixed(1)}V
            </text>
            {/* Terminal binding posts */}
            <circle cx="25" cy="60" r="7" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="75" cy="60" r="7" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          </g>
        );
      }

      case 'ground':
        return (
          <g>
            <line x1="25" y1="0" x2="25" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="10" y1="25" x2="40" y2="25" stroke="#94A3B8" strokeWidth="3" />
            <line x1="15" y1="32" x2="35" y2="32" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="20" y1="39" x2="30" y2="39" stroke="#94A3B8" strokeWidth="2" />
          </g>
        );

      case 'voltage_source':
        return (
          <g>
            <circle cx="25" cy="25" r="16" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
            <text x="25" y="30" fill="#EF4444" fontSize="11" fontWeight="bold" textAnchor="middle">
              +5V
            </text>
            <line x1="25" y1="41" x2="25" y2="50" stroke="#EF4444" strokeWidth="2.5" />
          </g>
        );

      case 'resistor': {
        const ohms = Number(component.properties.resistance) || 220;
        const bands = getResistorColorBands(ohms);
        return (
          <g>
            {/* Wire Leads */}
            <line x1="0" y1="20" x2="20" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="20" x2="80" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Ceramic Resistor Body */}
            <rect x="20" y="8" width="40" height="24" rx="6" fill="#D4A373" stroke="#A7764A" strokeWidth="1.5" />
            {/* Color Bands */}
            <rect x="27" y="8" width="4" height="24" fill={bands.b1} />
            <rect x="35" y="8" width="4" height="24" fill={bands.b2} />
            <rect x="43" y="8" width="4" height="24" fill={bands.mult} />
            <rect x="52" y="8" width="3" height="24" fill={bands.tol} />
          </g>
        );
      }

      case 'led': {
        const color = component.properties.color || 'red';
        const colorMap: Record<string, { main: string; glow: string }> = {
          red: { main: '#EF4444', glow: 'rgba(239, 68, 68, 0.7)' },
          green: { main: '#22C55E', glow: 'rgba(34, 197, 94, 0.7)' },
          blue: { main: '#3B82F6', glow: 'rgba(59, 130, 246, 0.7)' },
          yellow: { main: '#EAB308', glow: 'rgba(234, 179, 8, 0.7)' },
          amber: { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.7)' },
          white: { main: '#F8FAFC', glow: 'rgba(248, 250, 252, 0.9)' },
        };
        const palette = colorMap[color] || colorMap.red;

        return (
          <g>
            {/* Wire Leads */}
            <line x1="15" y1="45" x2="15" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="45" y1="45" x2="45" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Glow Filter when energized */}
            {isEnergized && !isBlown && (
              <circle
                cx="30"
                cy="25"
                r="30"
                fill={palette.glow}
                filter="blur(10px)"
                opacity="0.8"
                className="animate-pulse"
              />
            )}
            {/* Blown/Burnout smoke if overcurrent */}
            {isBlown && (
              <circle cx="30" cy="25" r="22" fill="#1E293B" opacity="0.85" />
            )}
            {/* Dome Lens */}
            <path
              d="M 12 45 A 18 20 0 0 1 48 45 Z"
              fill={isBlown ? '#334155' : palette.main}
              stroke="#E2E8F0"
              strokeWidth="1.5"
              opacity={isEnergized ? 1 : 0.65}
            />
            {/* Flange Rim Base */}
            <rect x="9" y="44" width="42" height="4" rx="1.5" fill={isBlown ? '#1E293B' : palette.main} />
            {/* Optical Highlight */}
            <ellipse cx="24" cy="20" rx="4" ry="7" fill="#FFFFFF" opacity={isEnergized ? 0.75 : 0.3} />
          </g>
        );
      }

      case 'spst_switch': {
        const isClosed = component.state?.isClosed ?? component.properties.isClosed ?? false;
        return (
          <g onClick={onToggleInteractive} className="cursor-pointer">
            {/* Terminals */}
            <circle cx="10" cy="25" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
            <circle cx="60" cy="25" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
            {/* Lead wires to boundary */}
            <line x1="0" y1="25" x2="10" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="60" y1="25" x2="70" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Toggle Lever */}
            {isClosed ? (
              <line x1="10" y1="25" x2="60" y2="25" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
            ) : (
              <line x1="10" y1="25" x2="52" y2="8" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            )}
            <text x="35" y="45" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle">
              {isClosed ? 'CLOSED (ON)' : 'OPEN (OFF)'}
            </text>
          </g>
        );
      }

      case 'push_button': {
        const isPressed = component.state?.isClosed ?? false;
        return (
          <g onClick={onToggleInteractive} className="cursor-pointer">
            <rect x="10" y="10" width="40" height="40" rx="4" fill="#334155" stroke="#64748B" strokeWidth="1.5" />
            {/* Plunger circle */}
            <circle
              cx="30"
              cy="30"
              r={isPressed ? 12 : 14}
              fill={isPressed ? '#16A34A' : '#DC2626'}
              stroke="#FFFFFF"
              strokeWidth="1.5"
            />
            {/* Pins */}
            <line x1="0" y1="30" x2="10" y2="30" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="50" y1="30" x2="60" y2="30" stroke="#94A3B8" strokeWidth="2.5" />
          </g>
        );
      }

      case 'dc_motor':
        return (
          <g>
            {/* Motor Casing */}
            <circle cx="40" cy="35" r="28" fill="#1E293B" stroke="#0284C7" strokeWidth="2.5" />
            {/* Rotor Shaft */}
            <circle cx="40" cy="35" r="6" fill="#CBD5E1" />
            {/* Spinning Rotor Propeller Blades */}
            <g
              transform="translate(40, 35)"
              className={isEnergized && isSimulating ? 'animate-spin origin-center' : ''}
              style={{ transformOrigin: '40px 35px' }}
            >
              <line x1="-20" y1="0" x2="20" y2="0" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
              <line x1="0" y1="-20" x2="0" y2="20" stroke="#06B6D4" strokeWidth="4" strokeLinecap="round" />
            </g>
            {/* Lead Terminals */}
            <line x1="20" y1="63" x2="20" y2="80" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="60" y1="63" x2="60" y2="80" stroke="#94A3B8" strokeWidth="2.5" />
          </g>
        );

      case 'piezo_buzzer':
        return (
          <g>
            <circle cx="35" cy="35" r="28" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            <circle cx="35" cy="35" r="10" fill="#0F172A" />
            <circle cx="35" cy="35" r="4" fill="#64748B" />
            {/* Sound Wave Ripple Effect when active */}
            {isEnergized && isSimulating && (
              <g className="animate-ping" opacity="0.6">
                <circle cx="35" cy="35" r="32" fill="none" stroke="#F59E0B" strokeWidth="2" />
              </g>
            )}
            <line x1="20" y1="63" x2="20" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="50" y1="63" x2="50" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
          </g>
        );

      case 'hc_sr04':
        return (
          <g>
            {/* PCB */}
            <rect x="0" y="0" width={width} height={height - 10} rx="4" fill="#00878F" stroke="#005B60" strokeWidth="1.5" />
            {/* Ultrasonic Transducers (Emitters / Receivers) */}
            <circle cx="30" cy="30" r="22" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <circle cx="30" cy="30" r="14" fill="#94A3B8" />
            <circle cx="80" cy="30" r="22" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
            <circle cx="80" cy="30" r="14" fill="#94A3B8" />
            <text x="55" y="15" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
              HC-SR04
            </text>
            {/* Pins */}
            <rect x="15" y={height - 10} width="80" height="10" fill="#1E293B" />
          </g>
        );

      case 'oled_i2c':
        return (
          <g>
            <rect x="0" y="0" width={width} height={height} rx="4" fill="#0F172A" stroke="#2563EB" strokeWidth="1.5" />
            {/* OLED Glass Screen */}
            <rect x="10" y="16" width="75" height="58" rx="2" fill="#030712" stroke="#1E293B" strokeWidth="1" />
            <text x="16" y="34" fill="#06B6D4" fontSize="8" fontFamily="monospace" fontWeight="bold">
              VoltNex Labs
            </text>
            <text x="16" y="48" fill="#38BDF8" fontSize="7" fontFamily="monospace">
              System Ready
            </text>
            <text x="16" y="60" fill="#22C55E" fontSize="6" fontFamily="monospace">
              128x64 OLED
            </text>
            {/* Header */}
            <rect x="15" y="0" width="70" height="6" fill="#1E293B" />
          </g>
        );

      default:
        // Generic IC / Module package
        return (
          <g>
            <rect
              x="0"
              y="0"
              width={width}
              height={height}
              rx="4"
              fill="#1E293B"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text
              x={width / 2}
              y={height / 2 + 4}
              fill="#E2E8F0"
              fontSize="10"
              fontWeight="bold"
              fontFamily="sans-serif"
              textAnchor="middle"
            >
              {component.label || def.name}
            </text>
          </g>
        );
    }
  };

  return (
    <g
      transform={`translate(${component.x}, ${component.y}) rotate(${rotation}, ${width / 2}, ${height / 2})`}
      className="select-none transition-shadow"
    >
      {/* Component Selection Outline */}
      {isSelected && (
        <rect
          x="-6"
          y="-6"
          width={width + 12}
          height={height + 12}
          rx="8"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
      )}

      {/* Main Visual Shape */}
      {renderVisual()}

      {/* Reference & Name Label */}
      <text
        x={width / 2}
        y={height + 14}
        fill="#94A3B8"
        fontSize="10"
        fontWeight="bold"
        fontFamily="monospace"
        textAnchor="middle"
        pointerEvents="none"
      >
        {component.reference}
      </text>

      {/* Terminal Pins with Connectors & Tooltip labels */}
      {def.pins.map((pin) => {
        const isHovered = activePinId === pin.id;
        const pinColor =
          pin.type === 'power'
            ? '#EF4444'
            : pin.type === 'ground'
            ? '#0F172A'
            : pin.type === 'digital'
            ? '#2563EB'
            : pin.type === 'analog'
            ? '#F59E0B'
            : '#06B6D4';

        return (
          <g
            key={pin.id}
            transform={`translate(${pin.x}, ${pin.y})`}
            onMouseDown={(e) => onPinMouseDown?.(e, pin)}
            onClick={(e) => onPinClick?.(e, pin)}
            className="cursor-crosshair group/pin"
          >
            {/* Outer Target Circle for easy hit-testing */}
            <circle
              cx="0"
              cy="0"
              r="8"
              fill={isHovered ? 'rgba(6, 182, 212, 0.35)' : 'transparent'}
              className="transition-colors"
            />
            {/* Pin Terminal Dot */}
            <circle
              cx="0"
              cy="0"
              r="4"
              fill={pinColor}
              stroke="#FFFFFF"
              strokeWidth="1.5"
              className="group-hover/pin:scale-125 transition-transform"
            />
            {/* Pin Name Label on hover */}
            <title>{`${pin.name} (${pin.type}${pin.description ? `: ${pin.description}` : ''})`}</title>
          </g>
        );
      })}
    </g>
  );
};
