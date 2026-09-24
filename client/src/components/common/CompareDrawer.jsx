import React from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeftRight, Trash2 } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

export const CompareDrawer = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();

  if (compareItems.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl p-3 sm:p-4 transition-all duration-300 animate-slide-up">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left info & items preview */}
        <div className="flex items-center space-x-4 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm flex-shrink-0">
            <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
            <span>Compare ({compareItems.length}/4)</span>
          </div>

          <div className="flex items-center space-x-3">
            {compareItems.map((prod) => (
              <div
                key={prod.id}
                className="relative flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 pr-3 max-w-[200px] flex-shrink-0 shadow-sm"
              >
                <img
                  src={prod.primaryImageUrl || prod.images?.[0]}
                  alt={prod.name}
                  className="w-8 h-8 object-cover rounded-lg"
                />
                <span className="text-xs font-medium text-slate-700 truncate">{prod.name}</span>
                <button
                  onClick={() => removeFromCompare(prod.id)}
                  className="p-0.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center space-x-3 flex-shrink-0 w-full sm:w-auto justify-end">
          <button
            onClick={clearCompare}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          <Link
            to="/compare"
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
};
