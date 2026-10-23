import type {
  CircuitComponentInstance,
  CircuitData,
  CircuitPin,
  WireRoutingStyle,
} from '../../types/circuit';
import { getComponentDefinition } from './components';

export function snapToGrid(val: number, gridSize: number = 10): number {
  return Math.round(val / gridSize) * gridSize;
}

export function getRotatedPinPosition(
  comp: CircuitComponentInstance,
  pin: CircuitPin
): { x: number; y: number } {
  const def = getComponentDefinition(comp.typeId);
  const width = def ? def.width : 60;
  const height = def ? def.height : 60;

  const cx = width / 2;
  const cy = height / 2;
  const rad = ((comp.rotation || 0) * Math.PI) / 180;

  // Offset from component center
  const dx = pin.x - cx;
  const dy = pin.y - cy;

  // Rotated relative position
  const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
  const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

  return {
    x: Math.round(comp.x + cx + rx),
    y: Math.round(comp.y + cy + ry),
  };
}

export function computeWirePath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  routing: WireRoutingStyle = 'orthogonal'
): string {
  if (routing === 'straight') {
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  if (routing === 'curved') {
    const dx = toX - fromX;
    const cx1 = fromX + dx * 0.5;
    const cy1 = fromY;
    const cx2 = toX - dx * 0.5;
    const cy2 = toY;
    return `M ${fromX} ${fromY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toX} ${toY}`;
  }

  // Orthogonal Manhattan routing with right-angle midpoint
  const midX = Math.round((fromX + toX) / 2);
  return `M ${fromX} ${fromY} L ${midX} ${fromY} L ${midX} ${toY} L ${toX} ${toY}`;
}

export function exportCircuitToJson(data: CircuitData, title: string) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.download = `${cleanTitle}-circuit.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCircuitToSvg(
  svgElement: SVGSVGElement,
  title: string
): string {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

  // Add branding watermark and title in standalone export
  const titleElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  titleElem.setAttribute('x', '20');
  titleElem.setAttribute('y', '30');
  titleElem.setAttribute('fill', '#94A3B8');
  titleElem.setAttribute('font-family', 'sans-serif');
  titleElem.setAttribute('font-size', '14');
  titleElem.setAttribute('font-weight', 'bold');
  titleElem.textContent = `VoltNex Labs • ${title}`;
  clone.insertBefore(titleElem, clone.firstChild);

  const serializer = new XMLSerializer();
  return '<?xml version="1.0" standalone="no"?>\r\n' + serializer.serializeToString(clone);
}

export function downloadSvgFile(svgString: string, title: string) {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  a.download = `${cleanTitle}-schematic.svg`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPngFromSvg(
  svgElement: SVGSVGElement,
  title: string,
  width: number = 1200,
  height: number = 800
) {
  const svgString = exportCircuitToSvg(svgElement, title);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const image = new Image();

  image.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = width * 2; // 2x Retina resolution
    canvas.height = height * 2;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    ctx.fillStyle = '#0F172A'; // dark engineering canvas background
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    URL.revokeObjectURL(url);
    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    const cleanTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    a.download = `${cleanTitle}-schematic.png`;
    a.click();
  };

  image.src = url;
}
