import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  ShoppingBag,
  Users,
  TicketPercent,
  LogOut,
  Store,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Truck,
  Sparkles,
  Warehouse,
  History,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'AI & Cloud Analytics', path: '/admin/ai-insights', icon: Sparkles },
    { label: 'Warehousing & Stock', path: '/admin/warehousing', icon: Warehouse },
    { label: 'Audit Trail', path: '/admin/audit-trail', icon: History },
    { label: 'Delivery Fleet', path: '/admin/delivery', icon: Truck },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Brands', path: '/admin/brands', icon: Tag },
    { label: 'Customers', path: '/admin/users', icon: Users },
    { label: 'Coupons', path: '/admin/coupons', icon: TicketPercent },
  ];

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-100">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Admin Access Required</h2>
          <p className="text-xs text-slate-500 mb-6">
            You must be logged in with an administrator account (`ravikantsinghravi366@gmail.com`) to view the management console.
          </p>
          <div className="flex gap-3">
            <Link
              to="/login"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all"
            >
              Sign In as Admin
            </Link>
            <Link
              to="/"
              className="flex-1 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
            >
              Go to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-5 justify-between">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center space-x-3 pb-4 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight">Admin Console</h1>
              <p className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">ShopSphere v1.0</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-slate-800">
          <Link
            to="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Store className="w-4 h-4 text-emerald-400" />
              <span>View Storefront</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-bold text-white text-sm">ShopSphere Admin</span>
        </div>
        <Link to="/" className="text-xs text-emerald-400 hover:underline">
          View Store
        </Link>
      </div>

      {/* Mobile Sidebar Dropdown */}
      {sidebarOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 p-4 space-y-2 animate-slide-up">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-900">
        {/* Top Header Strip */}
        <header className="h-16 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Admin</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-200 font-semibold">Management Console</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-right">
              <div>
                <p className="text-xs font-bold text-slate-200">{user?.name}</p>
                <p className="text-[10px] text-emerald-400 font-medium">{user?.email}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-emerald-500 overflow-hidden">
                <img
                  src={user?.avatarUrl || '/admin-avatar.jpeg'}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content View Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
