import React, { useState } from 'react';
import { CheckSquare, Square, Layers } from 'lucide-react';
import type { ProjectComponent } from '../../types';

interface BOMTableProps {
  components: ProjectComponent[];
}

export const BOMTable: React.FC<BOMTableProps> = ({ components }) => {
  const [checkedIds, setCheckedIds] = useState<Record<string, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedIds((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const completedCount = Object.values(checkedIds).filter(Boolean).length;
  const progressPercent = components.length > 0 ? Math.round((completedCount / components.length) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden my-6">
      {/* Header with Progress Bar */}
      <div className="p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-100/60 text-blue-700">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Bill of Materials & Component Sourcing
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check off components as you gather or solder them in your lab.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-mono font-bold text-slate-700">
              {completedCount} of {components.length} Acquired
            </div>
            <div className="w-28 h-2 bg-slate-200 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-mono text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-12 text-center">Status</th>
              <th className="py-3 px-4 font-semibold">Component / Part</th>
              <th className="py-3 px-4 font-semibold w-28">Quantity</th>
              <th className="py-3 px-4 font-semibold">Specification / Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {components.map((item, idx) => {
              const isChecked = !!checkedIds[idx];
              return (
                <tr
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className={`cursor-pointer transition-colors ${
                    isChecked ? 'bg-emerald-50/30 text-slate-400' : 'hover:bg-slate-50/60 text-slate-800'
                  }`}
                >
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      className="text-slate-400 hover:text-emerald-600 transition"
                      aria-label={`Toggle ${item.name}`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-medium">
                    <span className={isChecked ? 'line-through text-slate-400' : ''}>
                      {item.name}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-semibold text-blue-600">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 font-sans">
                    {item.notes || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
