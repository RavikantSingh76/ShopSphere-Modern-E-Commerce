import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Eye,
} from 'lucide-react';
import { OrderStatusBadge } from '../../components/common/Badge';
import { adminApi, productApi, authApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user, login } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthError, setIsAuthError] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await adminApi.getDashboardStats();
        if (res.success && res.data) {
          setStats(res.data);
          setIsAuthError(false);
        }
      } catch (err) {
        console.warn('Admin stats require ADMIN role. Loading live public catalog data as fallback:', err);
        setIsAuthError(true);
        // Fallback: fetch live products to display authentic product counts
        try {
          const prodRes = await productApi.getProducts({ page: 0, size: 50 });
          if (prodRes && prodRes.data) {
            setStats({
              totalProducts: prodRes.data.totalElements || 0,
              totalUsers: 1,
              totalOrders: 0,
              totalRevenue: 0,
              pendingOrders: 0,
              lowStockProducts: prodRes.data.content?.filter(p => (p.stockQuantity ?? 0) < 10)?.length || 0,
              recentOrders: [],
              topSellingProducts: [],
              monthlySales: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 },
              ordersByStatus: { PENDING: 0, CONFIRMED: 0, PROCESSING: 0, DELIVERED: 0, CANCELLED: 0 }
            });
          }
        } catch (e) {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [user]);

  if (loading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${Number(stats?.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtext: '+18.4% from last month',
      icon: DollarSign,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      subtext: `${stats?.pendingOrders || 0} pending processing`,
      icon: ShoppingBag,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      subtext: `${stats?.lowStockProducts || 0} low stock items`,
      icon: Package,
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'Registered Users',
      value: stats?.totalUsers || 0,
      subtext: 'Active customer accounts',
      icon: Users,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  // Max value for monthly chart scaling
  const monthlyValues = stats?.monthlySales ? Object.values(stats.monthlySales) : [];
  const maxMonthlyVal = monthlyValues.length > 0 ? Math.max(...monthlyValues.map(v => Number(v) || 1)) : 10000;

  return (
    <div className="space-y-8">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time business performance analytics, order volume and inventory alerts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            + Add Product
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            View All Orders
          </Link>
        </div>
      </div>

      {/* Auth Banner if not logged in as Admin */}
      {isAuthError && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-amber-300">Live Database Analytics Mode (Guest/Public View)</p>
              <p className="text-[11px] text-amber-200/80">Log in as Store Administrator to unlock full order revenue, customer analytics, and direct status toggles.</p>
            </div>
          </div>
          <Link
            to="/login"
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl transition-all shadow-sm text-xs whitespace-nowrap"
          >
            Admin Log In
          </Link>
        </div>
      )}

      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-400">{card.title}</span>
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-md`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{card.value}</h3>
              <p className="text-[11px] text-slate-400 mt-1">{card.subtext}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. Visual Charts Row (Sales Trend & Status Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Trend Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Monthly Revenue Trends (₹)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Aggregated monthly revenue overview</p>
            </div>
          </div>

          {/* SVG/CSS Interactive Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6">
            {stats?.monthlySales &&
              Object.entries(stats.monthlySales).map(([month, val], idx) => {
                const heightPercent = Math.max(10, Math.min(100, (Number(val) / maxMonthlyVal) * 100));
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2 group relative">
                    {/* Tooltip */}
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-md pointer-events-none whitespace-nowrap shadow-lg">
                      ₹{Number(val).toLocaleString('en-IN')}
                    </div>

                    <div className="w-full bg-slate-900 rounded-t-lg h-44 flex items-end p-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{month}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Order Status Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-6">
          <div className="pb-4 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white">Order Statuses</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Live distribution by fulfillment stage</p>
          </div>

          <div className="space-y-3.5">
            {stats?.ordersByStatus &&
              Object.entries(stats.ordersByStatus).map(([st, cnt]) => {
                const total = Math.max(1, stats.totalOrders || 1);
                const percent = Math.round((Number(cnt) / total) * 100);

                return (
                  <div key={st} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 capitalize">{st.replace(/_/g, ' ').toLowerCase()}</span>
                      <span className="text-slate-400">{cnt} ({percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 3. Recent Orders & Top Selling Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white">Recent Orders</h3>
            <Link to="/admin/orders" className="text-xs text-emerald-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-800/60">
            {stats?.recentOrders?.map((ord) => (
              <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-slate-200 font-mono">{ord.orderNumber}</p>
                  <p className="text-[11px] text-slate-400">{ord.userName} • {new Date(ord.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-200">₹{Number(ord.totalAmount).toLocaleString('en-IN')}</span>
                  <OrderStatusBadge status={ord.orderStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Selling Products (5 cols) */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <h3 className="text-sm font-bold text-white">Top Selling Products</h3>
            <Link to="/admin/products" className="text-xs text-emerald-400 hover:underline">
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {stats?.topSellingProducts && stats.topSellingProducts.length > 0 ? (
              stats.topSellingProducts.map((tp, idx) => (
                <div key={idx} className="p-3 bg-slate-900/60 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-3 truncate">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-200 truncate">{tp.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-emerald-400">{tp.unitsSold} sold</p>
                    <p className="text-[10px] text-slate-400">₹{Number(tp.revenue).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No sales recorded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
