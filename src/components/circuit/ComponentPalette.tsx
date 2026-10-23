import React, { useState, useEffect } from 'react';
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
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import type { ComponentCategory, CircuitComponentDefinition } from '../../types/circuit';
import { COMPONENT_CATEGORIES, COMPONENT_DEFINITIONS, searchComponents, getComponentDefinition } from '../../lib/circuit/components';

interface ComponentPaletteProps {
  onAddComponent?: (typeId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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

const RECENT_KEY = 'voltnex_recent_components';
const FAVORITES_KEY = 'voltnex_favorite_components';

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  onAddComponent,
  isCollapsed: externalCollapsed,
  onToggleCollapse: externalToggleCollapse,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const toggleCollapse = externalToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<ComponentCategory | 'all' | 'favorites'>('all');
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Load favorites & recent from localStorage
  useEffect(() => {
    try {
      const savedRecents = localStorage.getItem(RECENT_KEY);
      if (savedRecents) setRecentIds(JSON.parse(savedRecents));

      const savedFavs = localStorage.getItem(FAVORITES_KEY);
      if (savedFavs) setFavoriteIds(JSON.parse(savedFavs));
    } catch {
      // Ignore parse errors
    }
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const nextFavs = favoriteIds.includes(id)
      ? favoriteIds.filter((f) => f !== id)
      : [...favoriteIds, id];
    setFavoriteIds(nextFavs);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavs));
  };

  const handleSelectComponent = (typeId: string) => {
    // Record in recents (max 4)
    const nextRecents = [typeId, ...recentIds.filter((id) => id !== typeId)].slice(0, 4);
    setRecentIds(nextRecents);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecents));

    onAddComponent?.(typeId);
  };

  // Perform search across name, category, description, and pin names/GPIOs
  const searchResults = searchComponents(
    search,
    activeCategory === 'favorites' ? 'all' : activeCategory
  );

  const filteredComponents =
    activeCategory === 'favorites'
      ? searchResults.filter((def) => favoriteIds.includes(def.id))
      : searchResults;

  const handleDragStart = (e: React.DragEvent, def: CircuitComponentDefinition) => {
    e.dataTransfer.setData('application/circuit-component', def.id);
    e.dataTransfer.effectAllowed = 'copy';

    // Record in recents
    const nextRecents = [def.id, ...recentIds.filter((id) => id !== def.id)].slice(0, 4);
    setRecentIds(nextRecents);
    localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecents));
  };

  if (isCollapsed) {
    return (
      <aside className="w-14 h-full bg-slate-900 border-r border-slate-800 flex flex-col items-center py-3 select-none flex-shrink-0 z-20">
        <button
          onClick={toggleCollapse}
          title="Expand Component Library"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white transition mb-4 shadow-sm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="space-y-3 flex flex-col items-center">
          {COMPONENT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  toggleCollapse();
                }}
                title={cat.name}
                className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition"
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 h-full bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 text-slate-300 select-none z-20 transition-all duration-200">
      {/* Header, Search & Collapse Toggle */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Component Library
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded">
              {COMPONENT_DEFINITIONS.length} parts
            </span>
            <button
              onClick={toggleCollapse}
              title="Collapse Panel"
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Input with Pin / GPIO awareness */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search parts, pins, D13, PWM, I2C..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner"
          />
        </div>

        {/* Category Pills & Favorites Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
              activeCategory === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveCategory('favorites')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition ${
              activeCategory === 'favorites'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800/60'
            }`}
          >
            <Star className="w-3 h-3 fill-current" />
            <span>Pinned</span>
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
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
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

      {/* Recently Used Strip (Quick insert chips) */}
      {recentIds.length > 0 && !search && activeCategory === 'all' && (
        <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-950/40 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono uppercase">
            <Clock className="w-3 h-3 text-cyan-500" />
            <span>Recent:</span>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {recentIds.map((id) => {
              const def = getComponentDefinition(id);
              if (!def) return null;
              return (
                <button
                  key={id}
                  onClick={() => handleSelectComponent(id)}
                  title={`Click to place ${def.name}`}
                  className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-cyan-600/30 text-slate-300 hover:text-cyan-200 border border-slate-700/80 text-[10px] font-mono whitespace-nowrap transition"
                >
                  +{def.defaultRefPrefix}: {def.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Draggable Component Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredComponents.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs space-y-2">
            <div>No components match "{search}".</div>
            <p className="text-[11px] text-slate-600 max-w-[200px] mx-auto">
              Tip: You can search by pin identifiers like "SCL", "D13", or "VCC".
            </p>
          </div>
        ) : (
          filteredComponents.map((def) => {
            const Icon = CATEGORY_ICONS[def.category];
            const isFav = favoriteIds.includes(def.id);

            return (
              <div
                key={def.id}
                draggable
                onDragStart={(e) => handleDragStart(e, def)}
                className="group relative p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-cyan-500/60 cursor-grab active:cursor-grabbing transition shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Component Icon / Badge */}
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 flex-shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-300 transition line-clamp-1">
                        {def.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                        <span className="text-cyan-400 font-semibold">{def.defaultRefPrefix}</span>
                        <span>•</span>
                        <span>{def.pins.length} pin{def.pins.length !== 1 ? 's' : ''}</span>
                        {def.pins.some((p) => p.aliases?.includes('PWM')) && (
                          <span className="px-1 rounded bg-amber-950/60 text-amber-400 text-[9px] border border-amber-800/40">PWM</span>
                        )}
                        {def.pins.some((p) => p.aliases?.includes('I2C') || p.aliases?.includes('SDA')) && (
                          <span className="px-1 rounded bg-blue-950/60 text-blue-400 text-[9px] border border-blue-800/40">I2C</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Favorite Star & Click-to-add */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleToggleFavorite(e, def.id)}
                      title={isFav ? 'Unpin favorite' : 'Pin to favorites'}
                      className={`p-1 rounded-lg transition ${
                        isFav
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'opacity-0 group-hover:opacity-100 text-slate-500 hover:text-amber-400'
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleSelectComponent(def.id)}
                      title="Click to place component on canvas"
                      className="p-1.5 rounded-lg bg-slate-700 hover:bg-cyan-600 text-slate-200 hover:text-white transition shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed font-sans">
                  {def.description}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Instructions */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Drag or click + to insert
        </span>
        <span className="text-[10px] text-slate-500">Touch & D&D Ready</span>
      </div>
    </aside>
  );
};
