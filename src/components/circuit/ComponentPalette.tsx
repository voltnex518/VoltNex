import React, { useState } from 'react';
import {
  Search,
  Cpu,
  Zap,
  Sliders,
  Activity,
  ToggleRight,
  Volume2,
  Radio,
  Plus,
} from 'lucide-react';
import type { ComponentCategory, CircuitComponentDefinition } from '../../types/circuit';
import { COMPONENT_CATEGORIES, COMPONENT_DEFINITIONS } from '../../lib/circuit/components';

interface ComponentPaletteProps {
  onAddComponent?: (typeId: string) => void;
}

const CATEGORY_ICONS: Record<ComponentCategory, React.ComponentType<{ className?: string }>> = {
  microcontrollers: Cpu,
  power: Zap,
  passive: Sliders,
  semiconductors: Activity,
  inputs: ToggleRight,
  outputs: Volume2,
  sensors: Radio,
};

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({ onAddComponent }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all'>('all');

  const filteredComponents = COMPONENT_DEFINITIONS.filter((def) => {
    const matchesCategory = activeCategory === 'all' || def.category === activeCategory;
    const matchesSearch =
      def.name.toLowerCase().includes(search.toLowerCase()) ||
      def.description.toLowerCase().includes(search.toLowerCase()) ||
      def.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDragStart = (e: React.DragEvent, def: CircuitComponentDefinition) => {
    e.dataTransfer.setData('application/circuit-component', def.id);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <aside className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 text-slate-300 select-none">
      {/* Header & Search */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            Component Library
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {COMPONENT_DEFINITIONS.length} parts
          </span>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Arduino, LED, Resistor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
              activeCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            All
          </button>
          {COMPONENT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white bg-slate-800/60'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Draggable Component Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No electronic components match "{search}".
          </div>
        ) : (
          filteredComponents.map((def) => {
            const Icon = CATEGORY_ICONS[def.category];
            return (
              <div
                key={def.id}
                draggable
                onDragStart={(e) => handleDragStart(e, def)}
                className="group relative p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-cyan-500/60 cursor-grab active:cursor-grabbing transition shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition">
                        {def.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {def.defaultRefPrefix} • {def.pins.length} pin{def.pins.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Add button for mobile/touch accessibility */}
                  <button
                    onClick={() => onAddComponent?.(def.id)}
                    title="Click to add component"
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white transition"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {def.description}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer tip */}
      <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        <span>Drag to canvas or click + to insert</span>
      </div>
    </aside>
  );
};
