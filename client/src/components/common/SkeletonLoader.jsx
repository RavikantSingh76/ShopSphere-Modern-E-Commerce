import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full aspect-square bg-slate-200 rounded-xl mb-3" />
        <div className="h-3 bg-slate-100 rounded w-1/3 mb-2" />
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
        <div className="h-5 bg-amber-100 rounded-md w-16 mb-3" />
      </div>
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-6 bg-slate-200 rounded w-20" />
          <div className="h-4 bg-slate-100 rounded w-12" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 bg-amber-200/60 rounded-xl flex-1" />
          <div className="h-8 bg-orange-200/60 rounded-xl flex-1" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-48 mb-6" />
      <div className="space-y-4">
        {[...Array(rows)].map((_, r) => (
          <div key={r} className="flex space-x-4">
            {[...Array(cols)].map((_, c) => (
              <div key={c} className="h-4 bg-slate-100 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
