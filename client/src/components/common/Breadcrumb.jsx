import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex items-center text-xs md:text-sm text-slate-500 py-3 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center hover:text-emerald-600 transition-colors">
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-300 flex-shrink-0" />
            {isLast || !item.link ? (
              <span className="font-semibold text-slate-800 truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link to={item.link} className="hover:text-emerald-600 transition-colors truncate max-w-[150px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
