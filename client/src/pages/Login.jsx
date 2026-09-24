import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result?.success) {
      if (result.user?.role === 'ROLE_ADMIN' || result.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const isDemoLoginEnabled = import.meta.env.VITE_ENABLE_DEMO_LOGIN === 'true';
  const demoAdminEmail = import.meta.env.VITE_DEMO_ADMIN_EMAIL || '';
  const demoAdminPassword = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || '';
  const demoCustomerEmail = import.meta.env.VITE_DEMO_CUSTOMER_EMAIL || '';
  const demoCustomerPassword = import.meta.env.VITE_DEMO_CUSTOMER_PASSWORD || '';

  const handleDemoAdmin = () => {
    if (demoAdminEmail) setEmail(demoAdminEmail);
    if (demoAdminPassword) setPassword(demoAdminPassword);
  };

  const handleDemoCustomer = () => {
    if (demoCustomerEmail) setEmail(demoCustomerEmail);
    if (demoCustomerPassword) setPassword(demoCustomerPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to ShopSphere
          </h2>
          <p className="text-xs text-slate-500">
            Welcome back! Enter your credentials to access your account.
          </p>
        </div>

        {/* Optional Demo Fast Login Pills (Disabled by default; enabled via VITE_ENABLE_DEMO_LOGIN) */}
        {isDemoLoginEnabled && (
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
              ⚡ Quick Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoCustomer}
                className="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer Demo</span>
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="py-1.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Admin Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] font-semibold text-emerald-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account yet?{' '}
          <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} className="font-bold text-emerald-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
