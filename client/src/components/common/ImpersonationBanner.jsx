import React from 'react';
import { ShieldAlert, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ImpersonationBanner = () => {
  const { user, isImpersonating, exitImpersonation } = useAuth();
  const navigate = useNavigate();

  if (!isImpersonating || !user) return null;

  const handleExit = () => {
    exitImpersonation();
    navigate('/admin/users');
  };

  return (
    <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
      <div className="flex items-center space-x-2">
        <ShieldAlert className="w-4 h-4 text-slate-950 animate-pulse" />
        <span>
          <strong>Support Impersonation Mode Active:</strong> Logged in as customer{' '}
          <span className="underline font-mono">{user.name}</span> ({user.email}). All actions reflect this user.
        </span>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={handleExit}
          className="bg-slate-950 hover:bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
        >
          <LogOut className="w-3.5 h-3.5 text-amber-400" />
          <span>Exit Impersonation & Return to Admin</span>
        </button>
      </div>
    </div>
  );
};
