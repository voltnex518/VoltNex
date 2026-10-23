import React, { useState } from 'react';
import type { CircuitComponentInstance, CircuitPin, PinLabelMode } from '../../types/circuit';
import { getComponentDefinition } from '../../lib/circuit/components';

interface ComponentSvgProps {
  component: CircuitComponentInstance;
  isSelected: boolean;
  isSimulating: boolean;
  isBlown?: boolean;
  isEnergized?: boolean;
  activePinId?: string | null;
  pinLabelMode?: PinLabelMode;
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
  isSimulating: _isSimulating,
  isBlown,
  isEnergized,
  activePinId,
  pinLabelMode = 'auto',
  onPinMouseDown,
  onPinClick,
  onToggleInteractive,
}) => {
  const def = getComponentDefinition(component.typeId);
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  if (!def) return null;

  const width = def.width;
  const height = def.height;
  const rotation = component.rotation || 0;

  // Active pin (from external canvas drag or local hover)
  const currentHoveredPin = hoveredPinId ? def.pins.find((p) => p.id === hoveredPinId) : null;

  // Render specific visual package for each component type
  const renderVisual = () => {
    switch (component.typeId) {
      case 'arduino_uno': {
        const isD13Active = isEnergized;
        return (
          <g>
            {/* Arduino Uno PCB Body with characteristic shape and corner bevels */}
            <rect
              x="6"
              y="12"
              width={width - 12}
              height={height - 24}
              rx="10"
              fill="#00878F"
              stroke="#006369"
              strokeWidth="2.5"
            />
            {/* Gold PCB ground fill patterns */}
            <rect
              x="14"
              y="20"
              width={width - 28}
              height={height - 40}
              rx="8"
              fill="none"
              stroke="#0E6E77"
              strokeWidth="1"
              strokeDasharray="6 4"
            />

            {/* Standard Arduino Mounting Holes with annular ground solder rings */}
            <g fill="#CBD5E1" stroke="#004D52" strokeWidth="1.5">
              <circle cx="36" cy="62" r="5" />
              <circle cx="36" cy="62" r="3" fill="#090D16" />
              <circle cx="260" cy="38" r="5" />
              <circle cx="260" cy="38" r="3" fill="#090D16" />
              <circle cx="160" cy="180" r="5" />
              <circle cx="160" cy="180" r="3" fill="#090D16" />
              <circle cx="260" cy="180" r="5" />
              <circle cx="260" cy="180" r="3" fill="#090D16" />
            </g>

            {/* USB Type-B Port Protrusion */}
            <g>
              <rect x="-6" y="28" width="44" height="30" rx="3" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              <rect x="0" y="32" width="32" height="22" rx="1.5" fill="#334155" />
              {/* Blue plastic connector tongue inside port */}
              <rect x="4" y="38" width="18" height="10" rx="1" fill="#0284C7" />
              <rect x="-8" y="34" width="3" height="6" fill="#94A3B8" />
              <rect x="-8" y="48" width="3" height="6" fill="#94A3B8" />
            </g>

            {/* DC Power Barrel Jack Protrusion */}
            <g>
              <rect x="-6" y="125" width="48" height="38" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="2" />
              <rect x="2" y="131" width="34" height="26" rx="2" fill="#1E293B" />
              {/* Center contact barrel pin */}
              <circle cx="14" cy="144" r="5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
              <circle cx="14" cy="144" r="2.5" fill="#0F172A" />
            </g>

            {/* SOT-223 5V Voltage Regulator (NCP1117ST50) */}
            <g>
              <rect x="52" y="126" width="22" height="16" rx="2" fill="#18181B" stroke="#334155" strokeWidth="1" />
              <rect x="50" y="129" width="3" height="10" fill="#94A3B8" />
              <rect x="73" y="129" width="3" height="4" fill="#94A3B8" />
              <rect x="73" y="137" width="3" height="4" fill="#94A3B8" />
            </g>

            {/* Tactile Reset Button */}
            <g className="cursor-pointer" onClick={onToggleInteractive}>
              <rect x="48" y="24" width="18" height="18" rx="3" fill="#475569" stroke="#334155" strokeWidth="1" />
              <circle cx="57" cy="33" r="5" fill="#EF4444" stroke="#B91C1C" strokeWidth="1" />
              <text x="57" y="48" fill="#E2E8F0" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                RESET
              </text>
            </g>

            {/* ATmega16U2 USB-to-Serial Controller IC */}
            <g>
              <rect x="80" y="34" width="22" height="22" rx="2" fill="#18181B" stroke="#334155" strokeWidth="1" />
              <circle cx="84" cy="38" r="1" fill="#64748B" />
              <text x="91" y="46" fill="#94A3B8" fontSize="5" fontFamily="monospace" textAnchor="middle">
                16U2
              </text>
            </g>

            {/* 16.000 MHz Crystal Oscillator */}
            <g>
              <rect x="90" y="62" width="26" height="13" rx="4" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
              <text x="103" y="71" fill="#475569" fontSize="6" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                16.000
              </text>
            </g>

            {/* Dual 2x3 ICSP Gold Header Blocks */}
            <g>
              {/* 16U2 ICSP */}
              <rect x="110" y="26" width="18" height="12" fill="#0F172A" stroke="#E2E8F0" strokeWidth="0.5" />
              <circle cx="114" cy="30" r="1.5" fill="#F59E0B" />
              <circle cx="119" cy="30" r="1.5" fill="#F59E0B" />
              <circle cx="124" cy="30" r="1.5" fill="#F59E0B" />
              <circle cx="114" cy="34" r="1.5" fill="#F59E0B" />
              <circle cx="119" cy="34" r="1.5" fill="#F59E0B" />
              <circle cx="124" cy="34" r="1.5" fill="#F59E0B" />

              {/* ATmega328P ICSP */}
              <rect x="250" y="86" width="18" height="12" fill="#0F172A" stroke="#E2E8F0" strokeWidth="0.5" />
              <circle cx="254" cy="90" r="1.5" fill="#F59E0B" />
              <circle cx="259" cy="90" r="1.5" fill="#F59E0B" />
              <circle cx="264" cy="90" r="1.5" fill="#F59E0B" />
              <circle cx="254" cy="94" r="1.5" fill="#F59E0B" />
              <circle cx="259" cy="94" r="1.5" fill="#F59E0B" />
              <circle cx="264" cy="94" r="1.5" fill="#F59E0B" />
            </g>

            {/* ATmega328P DIP-28 Microcontroller IC & Socket */}
            <g>
              <rect x="118" y="74" width="114" height="46" rx="3" fill="#18181B" stroke="#0F172A" strokeWidth="1.5" />
              {/* Notch at pin 1 end */}
              <path d="M 118 91 A 6 6 0 0 1 118 103 Z" fill="#0F172A" />
              {/* DIP Lead pins */}
              {Array.from({ length: 14 }).map((_, i) => (
                <React.Fragment key={i}>
                  <rect x={124 + i * 7.6} y="71" width="3" height="4" fill="#94A3B8" />
                  <rect x={124 + i * 7.6} y="119" width="3" height="4" fill="#94A3B8" />
                </React.Fragment>
              ))}
              {/* Laser-etched chip text */}
              <text x="175" y="93" fill="#CBD5E1" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold" letterSpacing="0.5">
                ATMEGA328P-PU
              </text>
              <text x="175" y="105" fill="#64748B" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
                VoltNex Uno Core
              </text>
            </g>

            {/* Surface Mount Diagnostic LEDs */}
            <g>
              {/* ON LED (Green) */}
              <circle cx="150" cy="46" r="3" fill={isEnergized ? '#22C55E' : '#14532D'} />
              {isEnergized && <circle cx="150" cy="46" r="6" fill="#22C55E" opacity="0.35" />}
              <text x="150" y="56" fill="#E2E8F0" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                ON
              </text>

              {/* L LED (Pin 13 Yellow) */}
              <circle cx="166" cy="46" r="3" fill={isD13Active ? '#EAB308' : '#713F12'} />
              {isD13Active && <circle cx="166" cy="46" r="6" fill="#EAB308" opacity="0.4" />}
              <text x="166" y="56" fill="#E2E8F0" fontSize="6" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                L
              </text>

              {/* TX / RX LEDs */}
              <circle cx="182" cy="46" r="2.5" fill="#713F12" />
              <text x="182" y="56" fill="#94A3B8" fontSize="5" fontFamily="sans-serif" textAnchor="middle">
                TX
              </text>
              <circle cx="196" cy="46" r="2.5" fill="#713F12" />
              <text x="196" y="56" fill="#94A3B8" fontSize="5" fontFamily="sans-serif" textAnchor="middle">
                RX
              </text>
            </g>

            {/* Board Silkscreen Branding */}
            <g pointerEvents="none">
              <text x="135" y="66" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
                VoltNex
              </text>
              <text x="190" y="66" fill="#06B6D4" fontSize="11" fontWeight="700" fontFamily="sans-serif">
                UNO R3
              </text>
              {/* Silkscreen Section Labels */}
              <text x="145" y="27" fill="#E2E8F0" fontSize="7" fontWeight="bold" fontFamily="monospace">
                ← DIGITAL (PWM ~) →
              </text>
              <text x="96" y="174" fill="#E2E8F0" fontSize="7" fontWeight="bold" fontFamily="monospace">
                POWER
              </text>
              <text x="206" y="174" fill="#E2E8F0" fontSize="7" fontWeight="bold" fontFamily="monospace">
                ANALOG IN
              </text>
            </g>

            {/* Top Molded Socket Strips with 14px Real Gap between D8 and D7 */}
            <rect x="44" y="8" width="122" height="14" rx="2" fill="#090D16" stroke="#1E293B" strokeWidth="1" />
            <rect x="176" y="8" width="98" height="14" rx="2" fill="#090D16" stroke="#1E293B" strokeWidth="1" />

            {/* Bottom Molded Socket Strips (Power & Analog) */}
            <rect x="56" y="178" width="98" height="14" rx="2" fill="#090D16" stroke="#1E293B" strokeWidth="1" />
            <rect x="176" y="178" width="74" height="14" rx="2" fill="#090D16" stroke="#1E293B" strokeWidth="1" />
          </g>
        );
      }

      case 'esp32_devkit':
        return (
          <g>
            {/* PCB Body */}
            <rect x="12" y="10" width={width - 24} height={height - 20} rx="8" fill="#111827" stroke="#1F2937" strokeWidth="2" />
            {/* Gold antenna meander trace */}
            <rect x="25" y="40" width="16" height="90" fill="#CA8A04" opacity="0.85" rx="2" />
            {/* Metal RF Shield Can */}
            <rect x="50" y="32" width="145" height="116" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
            <rect x="55" y="37" width="135" height="106" fill="#CBD5E1" opacity="0.25" />
            <text x="122" y="70" fill="#0F172A" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              ESP-WROOM-32
            </text>
            <text x="122" y="86" fill="#334155" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              Wi-Fi & Dual-Mode BLE
            </text>
            <text x="122" y="100" fill="#475569" fontSize="7" fontFamily="monospace" textAnchor="middle">
              FCC ID: 2AC7Z-ESPWROOM32
            </text>
            {/* Micro-USB Port */}
            <rect x="105" y="166" width="36" height="14" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <rect x="111" y="170" width="24" height="8" rx="1" fill="#1E293B" />
            {/* Dual tactile microswitches: EN and BOOT */}
            <g>
              <rect x="25" y="148" width="14" height="12" rx="2" fill="#374151" />
              <circle cx="32" cy="154" r="3" fill="#D1D5DB" />
              <text x="32" y="144" fill="#9CA3AF" fontSize="6" textAnchor="middle">EN</text>
              <rect x="205" y="148" width="14" height="12" rx="2" fill="#374151" />
              <circle cx="212" cy="154" r="3" fill="#D1D5DB" />
              <text x="212" y="144" fill="#9CA3AF" fontSize="6" textAnchor="middle">BOOT</text>
            </g>
            {/* Diagnostic LEDs */}
            <circle cx="48" cy="154" r="2.5" fill={isEnergized ? '#EF4444' : '#7F1D1D'} />
            <circle cx="196" cy="154" r="2.5" fill={isEnergized ? '#3B82F6' : '#1E3A8A'} />
            {/* Top & Bottom 15-pin header sockets */}
            <rect x="24" y="8" width="208" height="14" rx="2" fill="#090D16" stroke="#1E293B" />
            <rect x="24" y="158" width="208" height="14" rx="2" fill="#090D16" stroke="#1E293B" />
          </g>
        );

      case 'esp8266_nodemcu':
        return (
          <g>
            {/* PCB Body */}
            <rect x="12" y="10" width={width - 24} height={height - 20} rx="8" fill="#0F2942" stroke="#1E3A5F" strokeWidth="2" />
            {/* ESP-12E Metallic Shield */}
            <rect x="52" y="34" width="140" height="110" rx="4" fill="#94A3B8" stroke="#64748B" strokeWidth="1.5" />
            <text x="122" y="75" fill="#0F172A" fontSize="12" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              ESP-12E
            </text>
            <text x="122" y="90" fill="#334155" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              802.11 b/g/n Wi-Fi
            </text>
            {/* Micro-USB Port */}
            <rect x="105" y="166" width="36" height="14" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            {/* Header strips */}
            <rect x="24" y="8" width="208" height="14" rx="2" fill="#090D16" stroke="#1E293B" />
            <rect x="24" y="158" width="208" height="14" rx="2" fill="#090D16" stroke="#1E293B" />
          </g>
        );

      case 'battery_9v':
        return (
          <g>
            {/* Battery Body with metallic bevel */}
            <rect x="6" y="16" width="68" height="90" rx="6" fill="#1E293B" stroke="#475569" strokeWidth="2" />
            {/* Top brand banner */}
            <rect x="6" y="16" width="68" height="30" rx="6" fill="#0284C7" />
            {/* Snap Terminals */}
            <rect x="18" y="4" width="14" height="12" rx="2" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
            <circle cx="55" cy="10" r="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="1" />
            {/* Polarity symbols */}
            <text x="25" y="27" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle">+</text>
            <text x="55" y="27" fill="#FFFFFF" fontSize="14" fontWeight="bold" textAnchor="middle">−</text>
            <text x="40" y="68" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
              9V
            </text>
            <text x="40" y="82" fill="#94A3B8" fontSize="8" fontFamily="sans-serif" textAnchor="middle">
              ALKALINE
            </text>
          </g>
        );

      case 'power_supply_dc': {
        const v = component.properties.voltage || 5.0;
        return (
          <g>
            <rect x="2" y="2" width={width - 4} height={height - 4} rx="8" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
            {/* Digital LED readout panel */}
            <rect x="15" y="12" width="70" height="28" rx="4" fill="#090D16" stroke="#334155" />
            <text x="50" y="32" fill="#06B6D4" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {Number(v).toFixed(1)}V
            </text>
            {/* Output terminals (Red positive, Black ground) */}
            <circle cx="25" cy="58" r="8" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="75" cy="58" r="8" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
          </g>
        );
      }

      case 'ground':
        return (
          <g>
            <line x1="25" y1="0" x2="25" y2="22" stroke="#06B6D4" strokeWidth="3" />
            <line x1="8" y1="22" x2="42" y2="22" stroke="#06B6D4" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="14" y1="29" x2="36" y2="29" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
            <line x1="20" y1="36" x2="30" y2="36" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
            <text x="25" y="47" fill="#64748B" fontSize="8" fontFamily="monospace" textAnchor="middle">
              GND
            </text>
          </g>
        );

      case 'voltage_source': {
        const v = component.properties.voltage || 5.0;
        return (
          <g>
            <circle cx="25" cy="25" r="18" fill="#1E293B" stroke="#EF4444" strokeWidth="2" />
            <text x="25" y="29" fill="#EF4444" fontSize="11" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
              +{v}V
            </text>
            <line x1="25" y1="43" x2="25" y2="50" stroke="#EF4444" strokeWidth="3" />
          </g>
        );
      }

      case 'resistor': {
        const ohms = Number(component.properties.resistance) || 220;
        const bands = getResistorColorBands(ohms);
        return (
          <g>
            {/* Metallic Lead Wires */}
            <line x1="0" y1="20" x2="25" y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="75" y1="20" x2={width} y2="20" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Carbon-Film Ceramic Body */}
            <rect x="25" y="11" width="50" height="18" rx="8" fill="#E2D9C5" stroke="#78716C" strokeWidth="1.2" />
            {/* Color Bands */}
            <rect x="33" y="11" width="4" height="18" fill={bands.b1} />
            <rect x="42" y="11" width="4" height="18" fill={bands.b2} />
            <rect x="51" y="11" width="4" height="18" fill={bands.mult} />
            <rect x="63" y="11" width="4" height="18" fill={bands.tol} />
            {/* Value Text */}
            <text x="50" y="37" fill="#06B6D4" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              {ohms >= 1000 ? `${(ohms / 1000).toFixed(1)}kΩ` : `${ohms}Ω`}
            </text>
          </g>
        );
      }

      case 'potentiometer': {
        const pct = Math.max(0, Math.min(100, Number(component.properties.valuePercent) || 50));
        const angle = -135 + (pct / 100) * 270;
        return (
          <g>
            <circle cx="40" cy="38" r="28" fill="#1E293B" stroke="#0284C7" strokeWidth="2" />
            {/* Resistance Track */}
            <circle cx="40" cy="38" r="20" fill="none" stroke="#334155" strokeWidth="5" strokeDasharray="94 30" />
            {/* Dial Knob & Indicator Arrow */}
            <circle cx="40" cy="38" r="14" fill="#0F172A" stroke="#64748B" strokeWidth="1.5" />
            <g transform={`rotate(${angle}, 40, 38)`}>
              <line x1="40" y1="38" x2="40" y2="25" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            {/* Three terminal leads */}
            <rect x="13" y="65" width="4" height="15" fill="#94A3B8" />
            <rect x="38" y="65" width="4" height="15" fill="#94A3B8" />
            <rect x="63" y="65" width="4" height="15" fill="#94A3B8" />
          </g>
        );
      }

      case 'capacitor_ceramic':
        return (
          <g>
            <line x1="0" y1="25" x2="28" y2="25" stroke="#94A3B8" strokeWidth="2" />
            <line x1="42" y1="25" x2={width} y2="25" stroke="#94A3B8" strokeWidth="2" />
            <circle cx="35" cy="25" r="16" fill="#F97316" stroke="#EA580C" strokeWidth="1.5" />
            <text x="35" y="28" fill="#FFFFFF" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              104
            </text>
          </g>
        );

      case 'capacitor_electrolytic':
        return (
          <g>
            <line x1="0" y1="30" x2="22" y2="30" stroke="#94A3B8" strokeWidth="2" />
            <line x1="48" y1="30" x2={width} y2="30" stroke="#94A3B8" strokeWidth="2" />
            <rect x="22" y="12" width="26" height="36" rx="4" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
            {/* Negative stripe */}
            <rect x="40" y="12" width="8" height="36" rx="1" fill="#94A3B8" />
            <text x="44" y="26" fill="#1E293B" fontSize="8" fontWeight="bold" textAnchor="middle">−</text>
            <text x="44" y="38" fill="#1E293B" fontSize="8" fontWeight="bold" textAnchor="middle">−</text>
            <text x="14" y="24" fill="#06B6D4" fontSize="10" fontWeight="bold">+</text>
          </g>
        );

      case 'inductor':
        return (
          <g>
            <line x1="0" y1="20" x2="16" y2="20" stroke="#94A3B8" strokeWidth="2" />
            <line x1="64" y1="20" x2={width} y2="20" stroke="#94A3B8" strokeWidth="2" />
            {/* Coils */}
            <path
              d="M 16 20 A 8 8 0 0 1 32 20 A 8 8 0 0 1 48 20 A 8 8 0 0 1 64 20"
              fill="none"
              stroke="#D97706"
              strokeWidth="3.5"
            />
          </g>
        );

      case 'led': {
        const color = component.properties.color || 'red';
        const hex = color === 'green' ? '#22C55E' : color === 'blue' ? '#3B82F6' : '#EF4444';
        const isLit = isEnergized && !isBlown;

        return (
          <g>
            {/* Lead wires: Anode (pin x=15) and Cathode (pin x=45) */}
            <line x1="15" y1="46" x2="15" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="45" y1="46" x2="45" y2="70" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Radiant illumination aura when energized */}
            {isLit && (
              <circle cx="30" cy="28" r="26" fill={hex} opacity="0.35" className="animate-pulse" />
            )}
            {/* LED Bulb Dome (with flat cathode rim at x=45) */}
            <path
              d="M 15 42 L 15 28 A 15 15 0 0 1 45 28 L 45 42 Z"
              fill={isBlown ? '#475569' : isLit ? hex : '#334155'}
              stroke={isBlown ? '#1E293B' : hex}
              strokeWidth="2"
            />
            {/* Internal leadframe anvil & post */}
            <path d="M 23 40 L 23 30 L 29 24" fill="none" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
            <line x1="37" y1="40" x2="37" y2="28" stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
          </g>
        );
      }

      case 'rgb_led':
        return (
          <g>
            {/* 4 Leads */}
            <line x1="15" y1="50" x2="15" y2="80" stroke="#EF4444" strokeWidth="2" />
            <line x1="32" y1="50" x2="32" y2="80" stroke="#0F172A" strokeWidth="2" />
            <line x1="49" y1="50" x2="49" y2="80" stroke="#22C55E" strokeWidth="2" />
            <line x1="66" y1="50" x2="66" y2="80" stroke="#3B82F6" strokeWidth="2" />
            {/* Bulb Dome */}
            <circle cx="40" cy="30" r="22" fill={isEnergized ? '#FFFFFF' : '#334155'} stroke="#64748B" strokeWidth="2" opacity="0.9" />
            <circle cx="32" cy="26" r="3" fill="#EF4444" />
            <circle cx="40" cy="26" r="3" fill="#22C55E" />
            <circle cx="48" cy="26" r="3" fill="#3B82F6" />
          </g>
        );

      case 'diode':
        return (
          <g>
            <line x1="0" y1="20" x2="20" y2="20" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="60" y1="20" x2={width} y2="20" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Cylindrical plastic body */}
            <rect x="20" y="10" width="40" height="20" rx="3" fill="#18181B" stroke="#334155" strokeWidth="1" />
            {/* Silver cathode band */}
            <rect x="52" y="10" width="8" height="20" rx="1" fill="#E2E8F0" />
            <text x="36" y="24" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
              1N4007
            </text>
          </g>
        );

      case 'transistor_npn':
        return (
          <g>
            {/* TO-92 half-cylinder package */}
            <path d="M 25 15 C 65 15, 65 55, 25 55 Z" fill="#18181B" stroke="#475569" strokeWidth="1.5" />
            <line x1="10" y1="35" x2="25" y2="35" stroke="#94A3B8" strokeWidth="2" />
            <line x1="45" y1="18" x2="55" y2="10" stroke="#94A3B8" strokeWidth="2" />
            <line x1="45" y1="52" x2="55" y2="60" stroke="#94A3B8" strokeWidth="2" />
            <text x="38" y="38" fill="#94A3B8" fontSize="7" fontFamily="monospace" textAnchor="middle">
              2N2222
            </text>
          </g>
        );

      case 'mosfet_n':
        return (
          <g>
            {/* TO-220 metallic tab */}
            <rect x="22" y="5" width="44" height="22" rx="2" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <circle cx="44" cy="14" r="4" fill="#090D16" />
            {/* Plastic body */}
            <rect x="22" y="24" width="44" height="38" rx="2" fill="#18181B" stroke="#334155" strokeWidth="1" />
            <line x1="10" y1="35" x2="22" y2="35" stroke="#94A3B8" strokeWidth="2" />
            <line x1="44" y1="62" x2="55" y2="10" stroke="#94A3B8" strokeWidth="2" />
            <line x1="44" y1="62" x2="55" y2="60" stroke="#94A3B8" strokeWidth="2" />
            <text x="44" y="45" fill="#E2E8F0" fontSize="7" fontFamily="monospace" textAnchor="middle">
              IRF540N
            </text>
          </g>
        );

      case 'push_button': {
        const isPressed = component.state?.isClosed ?? false;
        return (
          <g className="cursor-pointer" onClick={onToggleInteractive}>
            {/* 6x6mm tactile base */}
            <rect x="8" y="8" width="44" height="44" rx="4" fill="#334155" stroke="#1E293B" strokeWidth="2" />
            <circle cx="15" cy="15" r="2" fill="#94A3B8" />
            <circle cx="45" cy="15" r="2" fill="#94A3B8" />
            <circle cx="15" cy="45" r="2" fill="#94A3B8" />
            <circle cx="45" cy="45" r="2" fill="#94A3B8" />
            {/* Button Actuator */}
            <circle
              cx="30"
              cy="30"
              r={isPressed ? 11 : 13}
              fill={isPressed ? '#06B6D4' : '#0F172A'}
              stroke="#64748B"
              strokeWidth="2"
              className="transition-all"
            />
            {/* Pins */}
            <line x1="0" y1="30" x2="8" y2="30" stroke="#94A3B8" strokeWidth="3" />
            <line x1="52" y1="30" x2="60" y2="30" stroke="#94A3B8" strokeWidth="3" />
          </g>
        );
      }

      case 'spst_switch': {
        const isClosed = component.state?.isClosed ?? component.properties.isClosed ?? false;
        return (
          <g className="cursor-pointer" onClick={onToggleInteractive}>
            {/* Switch Body */}
            <rect x="10" y="10" width="50" height="30" rx="4" fill="#1E293B" stroke="#0284C7" strokeWidth="1.5" />
            {/* Contacts */}
            <circle cx="20" cy="25" r="3" fill="#E2E8F0" />
            <circle cx="50" cy="25" r="3" fill="#E2E8F0" />
            {/* Toggle Arm */}
            {isClosed ? (
              <line x1="20" y1="25" x2="50" y2="25" stroke="#22C55E" strokeWidth="3.5" strokeLinecap="round" />
            ) : (
              <line x1="20" y1="25" x2="46" y2="14" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" />
            )}
            <line x1="0" y1="25" x2="10" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="60" y1="25" x2="70" y2="25" stroke="#94A3B8" strokeWidth="2.5" />
            <text x="35" y="36" fill={isClosed ? '#22C55E' : '#94A3B8'} fontSize="7" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              {isClosed ? 'ON' : 'OFF'}
            </text>
          </g>
        );
      }

      case 'dc_motor':
        return (
          <g>
            {/* Motor Cylinder Body */}
            <rect x="15" y="15" width="50" height="45" rx="6" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
            <circle cx="40" cy="37" r="12" fill="#475569" />
            {/* Animated Rotating Propeller */}
            <g
              transform="translate(40, 37)"
              className={isEnergized ? 'animate-spin' : ''}
              style={{ transformOrigin: '40px 37px' }}
            >
              <ellipse cx="0" cy="0" rx="18" ry="4" fill="#06B6D4" opacity="0.8" />
              <ellipse cx="0" cy="0" rx="4" ry="18" fill="#06B6D4" opacity="0.8" />
            </g>
            <circle cx="40" cy="37" r="3" fill="#FFFFFF" />
            <line x1="20" y1="60" x2="20" y2="80" stroke="#EF4444" strokeWidth="2.5" />
            <line x1="60" y1="60" x2="60" y2="80" stroke="#0F172A" strokeWidth="2.5" />
          </g>
        );

      case 'piezo_buzzer':
        return (
          <g>
            <circle cx="35" cy="35" r="26" fill="#18181B" stroke="#475569" strokeWidth="2" />
            <circle cx="35" cy="35" r="9" fill="#090D16" stroke="#334155" strokeWidth="1.5" />
            {/* Acoustic Waves Animation */}
            {isEnergized && (
              <g stroke="#06B6D4" fill="none" strokeWidth="1.5" className="animate-ping" opacity="0.75">
                <circle cx="35" cy="35" r="16" />
                <circle cx="35" cy="35" r="22" />
              </g>
            )}
            <line x1="20" y1="58" x2="20" y2="70" stroke="#EF4444" strokeWidth="2" />
            <line x1="50" y1="58" x2="50" y2="70" stroke="#0F172A" strokeWidth="2" />
          </g>
        );

      case 'servo_motor':
        return (
          <g>
            {/* Translucent Blue SG90 Body */}
            <rect x="15" y="20" width="60" height="40" rx="3" fill="#0284C7" stroke="#0369A1" strokeWidth="1.5" opacity="0.9" />
            <circle cx="30" cy="35" r="12" fill="#E2E8F0" stroke="#94A3B8" />
            {/* Servo Horn */}
            <line x1="30" y1="35" x2="60" y2="25" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" />
            <circle cx="30" cy="35" r="4" fill="#334155" />
            <text x="45" y="52" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
              SG90
            </text>
            <line x1="20" y1="60" x2="20" y2="80" stroke="#451A03" strokeWidth="2" />
            <line x1="45" y1="60" x2="45" y2="80" stroke="#EF4444" strokeWidth="2" />
            <line x1="70" y1="60" x2="70" y2="80" stroke="#F59E0B" strokeWidth="2" />
          </g>
        );

      case 'relay_module':
        return (
          <g>
            {/* Blue Songle Relay Casing */}
            <rect x="10" y="15" width="80" height="50" rx="3" fill="#1D4ED8" stroke="#1E40AF" strokeWidth="2" />
            <text x="50" y="38" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              SONGLE
            </text>
            <text x="50" y="50" fill="#93C5FD" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
              10A 250VAC • 5V DC
            </text>
          </g>
        );

      case 'hc_sr04':
        return (
          <g>
            {/* Bright Blue PCB */}
            <rect x="8" y="10" width="94" height="55" rx="6" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
            {/* Dual Ultrasonic Transducer Drums */}
            <circle cx="32" cy="37" r="18" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="32" cy="37" r="12" fill="#334155" />
            <text x="32" y="40" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
              T
            </text>
            <circle cx="78" cy="37" r="18" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
            <circle cx="78" cy="37" r="12" fill="#334155" />
            <text x="78" y="40" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
              R
            </text>
            {/* 4 Pin Header */}
            <rect x="14" y="66" width="82" height="9" fill="#090D16" rx="2" />
          </g>
        );

      case 'dht11':
        return (
          <g>
            {/* Bright Cyan-Blue Vented Housing */}
            <rect x="10" y="10" width="55" height="65" rx="5" fill="#06B6D4" stroke="#0891B2" strokeWidth="2" />
            {/* Horizontal air vent grills */}
            {Array.from({ length: 6 }).map((_, i) => (
              <rect key={i} x="18" y={20 + i * 8} width="39" height="3" rx="1.5" fill="#164E63" />
            ))}
            <text x="37.5" y="72" fill="#FFFFFF" fontSize="7" fontWeight="bold" textAnchor="middle">
              DHT11
            </text>
          </g>
        );

      case 'pir_sensor':
        return (
          <g>
            <rect x="10" y="10" width="65" height="55" rx="5" fill="#15803D" stroke="#166534" strokeWidth="2" />
            {/* White Faceted Fresnel Dome */}
            <circle cx="42.5" cy="37" r="22" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="42.5" cy="37" r="14" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx="42.5" cy="37" r="6" fill="#CBD5E1" />
          </g>
        );

      case 'rc522_rfid':
        return (
          <g>
            {/* Dark Navy RFID PCB */}
            <rect x="10" y="10" width="100" height="65" rx="5" fill="#1E3A8A" stroke="#1E40AF" strokeWidth="2" />
            {/* Concentric gold PCB antenna coil traces */}
            <rect x="18" y="16" width="45" height="52" fill="none" stroke="#F59E0B" strokeWidth="1.2" rx="3" />
            <rect x="22" y="20" width="37" height="44" fill="none" stroke="#F59E0B" strokeWidth="1.2" rx="2" />
            <rect x="26" y="24" width="29" height="36" fill="none" stroke="#F59E0B" strokeWidth="1.2" rx="2" />
            {/* MFRC522 Chip */}
            <rect x="72" y="30" width="24" height="24" rx="2" fill="#0F172A" stroke="#334155" />
            <text x="84" y="44" fill="#94A3B8" fontSize="6" fontFamily="monospace" textAnchor="middle">
              RC522
            </text>
          </g>
        );

      case 'oled_i2c':
        return (
          <g>
            {/* Blue PCB */}
            <rect x="8" y="10" width="79" height="68" rx="4" fill="#1E3A8A" stroke="#1E40AF" strokeWidth="2" />
            {/* OLED Glass Screen */}
            <rect x="14" y="20" width="67" height="52" rx="2" fill="#090D16" stroke="#475569" strokeWidth="1.5" />
            {/* Screen Graphics */}
            <text x="47" y="38" fill="#06B6D4" fontSize="7.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              VoltNex Labs
            </text>
            <text x="47" y="50" fill="#22C55E" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
              I2C: 0x3C OK
            </text>
            <rect x="20" y="56" width="55" height="4" rx="1" fill="#0891B2" opacity="0.7" />
          </g>
        );

      case 'lcd_16x2_i2c':
        return (
          <g>
            {/* Green Display PCB */}
            <rect x="8" y="8" width={width - 16} height={height - 16} rx="6" fill="#14532D" stroke="#166534" strokeWidth="2" />
            {/* Metallic Glass Bezel */}
            <rect x="18" y="18" width={width - 36} height={height - 36} rx="3" fill="#18181B" stroke="#64748B" strokeWidth="1" />
            {/* 16x2 Backlit Character Area */}
            <rect x="22" y="22" width={width - 44} height={height - 44} fill="#84CC16" opacity={isEnergized ? '0.85' : '0.35'} />
            <text x={width / 2} y="38" fill="#14532D" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
              VoltNex Core
            </text>
            <text x={width / 2} y="52" fill="#14532D" fontSize="9" fontFamily="monospace" textAnchor="middle">
              Studio v2.0
            </text>
          </g>
        );

      case 'gps_module':
        return (
          <g>
            {/* Blue Breakout PCB */}
            <rect x="8" y="8" width={width - 16} height={height - 16} rx="5" fill="#1E40AF" stroke="#1D4ED8" strokeWidth="2" />
            {/* Ceramic Patch Antenna */}
            <rect x="20" y="18" width="50" height="46" rx="4" fill="#D6D3D1" stroke="#A8A29E" strokeWidth="1.5" />
            <circle cx="45" cy="41" r="5" fill="#78716C" />
            <text x="45" y="56" fill="#44403C" fontSize="7" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">
              NEO-6M
            </text>
            <circle cx="76" cy="22" r="2.5" fill={isEnergized ? '#22C55E' : '#14532D'} />
          </g>
        );

      default:
        return (
          <rect
            x="0"
            y="0"
            width={width}
            height={height}
            rx="6"
            fill="#1E293B"
            stroke="#475569"
            strokeWidth="2"
          />
        );
    }
  };

  return (
    <g
      transform={`translate(${component.x}, ${component.y}) rotate(${rotation}, ${width / 2}, ${height / 2})`}
      className="select-none transition-shadow"
    >
      {/* Component Selection Outline & Grips */}
      {isSelected && (
        <g pointerEvents="none">
          <rect
            x="-8"
            y="-8"
            width={width + 16}
            height={height + 16}
            rx="10"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
          {/* Corner accent marks */}
          <circle cx="-8" cy="-8" r="3.5" fill="#06B6D4" />
          <circle cx={width + 8} cy="-8" r="3.5" fill="#06B6D4" />
          <circle cx="-8" cy={height + 8} r="3.5" fill="#06B6D4" />
          <circle cx={width + 8} cy={height + 8} r="3.5" fill="#06B6D4" />
        </g>
      )}

      {/* Main Visual Shape */}
      {renderVisual()}

      {/* Reference & Name Label Badge */}
      <g pointerEvents="none">
        <rect
          x={width / 2 - 28}
          y={height + 6}
          width="56"
          height="16"
          rx="4"
          fill="#090D16"
          stroke="#334155"
          strokeWidth="1"
        />
        <text
          x={width / 2}
          y={height + 18}
          fill="#38BDF8"
          fontSize="9"
          fontWeight="bold"
          fontFamily="monospace"
          textAnchor="middle"
        >
          {component.reference}
        </text>
      </g>

      {/* Terminal Pins with Precision Connectors & Labels */}
      {def.pins.map((pin) => {
        const isHovered = activePinId === pin.id || hoveredPinId === pin.id;
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

        // Determine if label text should be shown for this pin under current pinLabelMode
        const shouldShowLabel =
          pinLabelMode === 'all' ||
          (pinLabelMode === 'numbers' && (pin.physicalNumber || pin.gpio)) ||
          (pinLabelMode === 'auto' && (isSelected || isHovered));

        const labelText =
          pinLabelMode === 'numbers'
            ? String(pin.physicalNumber || pin.gpio || pin.name)
            : pin.name;

        // Position text label outside or adjacent based on pin vertical coordinate
        const isTopEdge = pin.y <= 25;
        const isBottomEdge = pin.y >= height - 25;
        const labelY = isTopEdge ? -8 : isBottomEdge ? 16 : 0;
        const labelAnchor = isTopEdge || isBottomEdge ? 'middle' : pin.x < width / 2 ? 'end' : 'start';
        const labelX = isTopEdge || isBottomEdge ? 0 : pin.x < width / 2 ? -8 : 8;

        return (
          <g
            key={pin.id}
            transform={`translate(${pin.x}, ${pin.y})`}
            onMouseDown={(e) => onPinMouseDown?.(e, pin)}
            onClick={(e) => onPinClick?.(e, pin)}
            onMouseEnter={() => setHoveredPinId(pin.id)}
            onMouseLeave={() => setHoveredPinId(null)}
            className="cursor-crosshair group/pin"
          >
            {/* Enlarged invisible target circle for effortless hit-testing on touch and desktop */}
            <circle
              cx="0"
              cy="0"
              r="10"
              fill={isHovered ? 'rgba(6, 182, 212, 0.4)' : 'transparent'}
              className="transition-colors"
            />

            {/* Gold / Copper Annular Terminal Ring */}
            <circle
              cx="0"
              cy="0"
              r="4.5"
              fill="#1E293B"
              stroke={isHovered ? '#22D3EE' : pinColor}
              strokeWidth="1.8"
              className="transition-all"
            />
            {/* Terminal Contact Hole */}
            <circle cx="0" cy="0" r="1.8" fill="#FFFFFF" />

            {/* Active / Compatible Hover Glow Ring */}
            {isHovered && (
              <circle
                cx="0"
                cy="0"
                r="7"
                fill="none"
                stroke="#06B6D4"
                strokeWidth="1.5"
                className="animate-ping"
              />
            )}

            {/* Visible Pin Text Label in Supported Modes */}
            {shouldShowLabel && (
              <g pointerEvents="none" transform={`translate(${labelX}, ${labelY})`}>
                <rect
                  x={labelAnchor === 'middle' ? -labelText.length * 3.2 - 2 : labelAnchor === 'end' ? -labelText.length * 6.4 - 4 : 0}
                  y="-6"
                  width={labelText.length * 6.4 + 4}
                  height="12"
                  rx="3"
                  fill="#090D16"
                  stroke={isHovered ? '#06B6D4' : '#334155'}
                  strokeWidth="0.8"
                />
                <text
                  x="0"
                  y="3"
                  fill={isHovered ? '#22D3EE' : '#E2E8F0'}
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor={labelAnchor}
                >
                  {labelText}
                </text>
              </g>
            )}

            {/* Accessible Native Title for screen readers & SVG export */}
            <title>{`${component.reference}.${pin.name} • ${pin.type.toUpperCase()}${pin.description ? ` (${pin.description})` : ''}`}</title>
          </g>
        );
      })}

      {/* Floating Interactive Tooltip Badge for Currently Hovered Pin */}
      {currentHoveredPin && (
        <g
          transform={`translate(${currentHoveredPin.x}, ${currentHoveredPin.y > 50 ? currentHoveredPin.y - 48 : currentHoveredPin.y + 24})`}
          pointerEvents="none"
          className="z-50"
        >
          <rect
            x="-70"
            y="-2"
            width="140"
            height="34"
            rx="6"
            fill="#090D16"
            stroke="#06B6D4"
            strokeWidth="1.5"
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
          />
          <text x="0" y="11" fill="#38BDF8" fontSize="8.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
            {currentHoveredPin.name} {currentHoveredPin.physicalNumber ? `(#${currentHoveredPin.physicalNumber})` : ''}
          </text>
          <text x="0" y="23" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" textAnchor="middle">
            {currentHoveredPin.type.toUpperCase()}{currentHoveredPin.description ? ` • ${currentHoveredPin.description}` : ''}
          </text>
        </g>
      )}
    </g>
  );
};
