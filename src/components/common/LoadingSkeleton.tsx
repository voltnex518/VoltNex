import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-subtle animate-pulse">
      <div className="h-48 bg-slate-200" />
      <div className="p-6 space-y-4">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-24 bg-slate-200 rounded-full" />
        </div>
        <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-slate-200 rounded" />
          <div className="h-4 w-5/6 bg-slate-200 rounded" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="h-4 w-20 bg-slate-200 rounded" />
          <div className="h-4 w-16 bg-slate-200 rounded" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-subtle p-6 space-y-4 animate-pulse">
      <div className="h-10 bg-slate-100 rounded-xl w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-3 border-b border-slate-50 last:border-0">
          <div className="h-10 w-10 bg-slate-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-slate-200 rounded" />
            <div className="h-3 w-1/4 bg-slate-200 rounded" />
          </div>
          <div className="h-6 w-16 bg-slate-200 rounded-full" />
          <div className="h-8 w-20 bg-slate-200 rounded-xl" />
        </div>
      ))}
    </div>
  );
};
