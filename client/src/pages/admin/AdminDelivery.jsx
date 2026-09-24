import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  Truck, Plus, Search, Edit2, Trash2, CheckCircle2, Clock, AlertCircle, 
  MapPin, Phone, Star, ShieldCheck, Sparkles, UserCheck, RefreshCw,
  Tag, Printer, Warehouse, ArrowRightLeft, Layers, Box, CheckSquare,
  Building2, History, AlertTriangle, TrendingUp, BarChart3, Download,
  SlidersHorizontal, IndianRupee, FileSpreadsheet, ExternalLink, Filter,
  Shield, Check, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { deliveryApi, adminApi, inventoryApi } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../../components/common/Modal';
import { ShippingLabelModal } from '../../components/common/ShippingLabelModal';

export const AdminDelivery = ({ initialTab = 'fleet' }) => {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Determine active tab from URL path, query param, or prop
  const getResolvedTab = () => {
    if (location.pathname.includes('/admin/warehousing')) return 'inventory';
    if (location.pathname.includes('/admin/audit-trail')) return 'transactions';
    if (location.pathname.includes('/admin/delivery')) return 'fleet';
    const queryTab = searchParams.get('tab');
    if (queryTab && ['fleet', 'inventory', 'transactions'].includes(queryTab)) return queryTab;
    return initialTab || 'fleet';
  };

  const [activeTab, setActiveTab] = useState(getResolvedTab);

  useEffect(() => {
    setActiveTab(getResolvedTab());
  }, [location.pathname, searchParams]);

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'inventory') navigate('/admin/warehousing');
    else if (tab === 'transactions') navigate('/admin/audit-trail');
    else navigate('/admin/delivery');
  };

  // Fleet & Orders State
  const [partners, setPartners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Multi-Warehouse & Inventory State
  const [locations, setLocations] = useState([]);
  const [inventories, setInventories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [invLoading, setInvLoading] = useState(false);
  const [invSearchQuery, setInvSearchQuery] = useState('');
  const [invStatusFilter, setInvStatusFilter] = useState('ALL'); // 'ALL' | 'LOW_STOCK' | 'HEALTHY' | 'RESERVED'

  // Stock Audit Adjustment Modal State
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditForm, setAuditForm] = useState({
    productId: '',
    productName: '',
    locationId: '',
    locationName: '',
    currentOnHand: 0,
    newQuantityOnHand: 0,
    binRackNumber: '',
    performedBy: 'Ravikant Singh (Manager)',
    notes: 'Physical cycle count audit verification',
  });
  const [auditing, setAuditing] = useState(false);

  // Audit Trail Filter State
  const [txSearchQuery, setTxSearchQuery] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState('ALL');
  const [txLocationFilter, setTxLocationFilter] = useState('');

  // Partner Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    vehicleNumber: '',
    vehicleType: 'Two Wheeler (Bike)',
    currentArea: 'Bengaluru Central',
    status: 'AVAILABLE',
  });
  const [saving, setSaving] = useState(false);

  // Rider Assign Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Transfer Stock Modal
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferForm, setTransferForm] = useState({
    productId: '',
    fromLocationId: '',
    toLocationId: '',
    quantity: 10,
    performedBy: 'Ravikant Singh (Manager)',
    notes: 'Inter-hub replenishment',
  });
  const [transferring, setTransferring] = useState(false);

  // Box Shipping Label / Sticker Modal
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [selectedStickerOrder, setSelectedStickerOrder] = useState(null);

  useEffect(() => {
    loadData();
    loadInventoryData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pRes, oRes] = await Promise.all([
        deliveryApi.getAllPartners().catch(() => ({ data: [] })),
        adminApi.getAllOrders({ page: 0, size: 50 }).catch(() => ({ data: { content: [] } }))
      ]);
      
      setPartners(pRes.data || []);
      const serverOrders = (oRes.data?.content || []).filter(o => o.orderStatus !== 'DELIVERED' && o.orderStatus !== 'CANCELLED');
      setOrders(serverOrders);
    } catch (err) {
      toastError(err.message || 'Failed to load delivery data');
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryData = async () => {
    try {
      setInvLoading(true);
      const [locRes, invRes, txRes] = await Promise.all([
        inventoryApi.getLocations().catch(() => ({ data: [] })),
        inventoryApi.getInventories(selectedLocationId ? { locationId: selectedLocationId } : {}).catch(() => ({ data: [] })),
        inventoryApi.getTransactions({ page: 0, size: 20 }).catch(() => ({ data: { content: [] } }))
      ]);

      setLocations(locRes.data || []);
      setInventories(invRes.data || []);
      setTransactions(txRes.data?.content || []);
    } catch (err) {
      console.error(err);
    } finally {
      setInvLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'inventory' || activeTab === 'transactions') {
      loadInventoryData();
    }
  }, [activeTab, selectedLocationId]);

  const handleOpenAdd = () => {
    setEditingPartner(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      vehicleNumber: '',
      vehicleType: 'Two Wheeler (Bike)',
      currentArea: 'Bengaluru Central',
      status: 'AVAILABLE',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name || '',
      phone: partner.phone || '',
      email: partner.email || '',
      vehicleNumber: partner.vehicleNumber || '',
      vehicleType: partner.vehicleType || 'Two Wheeler (Bike)',
      currentArea: partner.currentArea || 'Bengaluru Central',
      status: partner.status || 'AVAILABLE',
    });
    setModalOpen(true);
  };

  const handleSavePartner = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingPartner) {
        await deliveryApi.updatePartner(editingPartner.id, formData);
        success('Delivery partner profile updated');
      } else {
        await deliveryApi.createPartner(formData);
        success('New delivery partner registered successfully');
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to save delivery partner');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePartner = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this delivery partner?')) return;
    try {
      await deliveryApi.deletePartner(id);
      success('Delivery partner deactivated');
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to deactivate partner');
    }
  };

  const handleAssignOrder = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !selectedPartnerId) return;
    try {
      setAssigning(true);
      await deliveryApi.assignOrder(selectedOrder.id, selectedPartnerId);
      success(`Order #${selectedOrder.orderNumber} assigned to rider!`);
      setAssignModalOpen(false);
      loadData();
    } catch (err) {
      toastError(err.message || 'Failed to assign rider');
    } finally {
      setAssigning(false);
    }
  };

  const handleAiAutoAssign = async (orderId) => {
    try {
      setAssigning(true);
      const res = await deliveryApi.aiAutoAssignOrder(orderId);
      success(res.message || 'AI matched and assigned optimal delivery rider!');
      loadData();
    } catch (err) {
      toastError(err.message || 'AI Auto-assign failed');
    } finally {
      setAssigning(false);
    }
  };

  const handleAiAutoAssignAll = async () => {
    try {
      setAssigning(true);
      const res = await deliveryApi.aiAutoAssignAll();
      success(res.message || 'AI smartly distributed all orders across local riders with dynamic load balancing!');
      loadData();
    } catch (err) {
      toastError(err.message || 'AI Auto-assign all failed');
    } finally {
      setAssigning(false);
    }
  };

  const handleExecuteTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.productId || !transferForm.fromLocationId || !transferForm.toLocationId) {
      toastError('Please fill in all transfer fields');
      return;
    }
    try {
      setTransferring(true);
      const res = await inventoryApi.transferStock({
        productId: Number(transferForm.productId),
        fromLocationId: Number(transferForm.fromLocationId),
        toLocationId: Number(transferForm.toLocationId),
        quantity: Number(transferForm.quantity),
        performedBy: transferForm.performedBy,
        notes: transferForm.notes,
      });
      if (res.success) {
        success('Stock transferred successfully across warehouses!');
        setTransferModalOpen(false);
        loadInventoryData();
      }
    } catch (err) {
      toastError(err.message || 'Transfer failed');
    } finally {
      setTransferring(false);
    }
  };

  // Physical Stock Count Audit Adjustment Handlers
  const handleOpenAudit = (inv) => {
    setAuditForm({
      productId: inv.productId,
      productName: inv.productName,
      productSku: inv.productSku,
      locationId: inv.locationId,
      locationName: inv.locationName,
      locationCode: inv.locationCode,
      currentOnHand: inv.quantityOnHand,
      newQuantityOnHand: inv.quantityOnHand,
      binRackNumber: inv.binRackNumber || 'AISLE-01 / BAY-A1',
      performedBy: 'Ravikant Singh (Manager)',
      notes: 'Periodic physical cycle count audit verification',
    });
    setAuditModalOpen(true);
  };

  const handleSaveAudit = async (e) => {
    e.preventDefault();
    if (!auditForm.productId || !auditForm.locationId) {
      toastError('Product and Location are required for audit adjustment');
      return;
    }
    try {
      setAuditing(true);
      const res = await inventoryApi.adjustStock({
        productId: Number(auditForm.productId),
        locationId: Number(auditForm.locationId),
        newQuantityOnHand: Number(auditForm.newQuantityOnHand),
        binRackNumber: auditForm.binRackNumber,
        performedBy: auditForm.performedBy,
        notes: auditForm.notes,
      });
      if (res.success) {
        success(`Stock count adjusted to ${auditForm.newQuantityOnHand} units & catalog synchronized!`);
        setAuditModalOpen(false);
        loadInventoryData();
      }
    } catch (err) {
      toastError(err.message || 'Failed to record stock audit adjustment');
    } finally {
      setAuditing(false);
    }
  };

  // Warehousing & Stock Valuation Metrics Calculation
  const inventoryMetrics = useMemo(() => {
    let totalOnHand = 0;
    let totalValuation = 0;
    let totalReserved = 0;
    let totalAvailable = 0;
    let lowStockCount = 0;
    let healthyCount = 0;
    let reservedCount = 0;

    inventories.forEach((inv) => {
      const onHand = inv.quantityOnHand || 0;
      const price = inv.unitPrice || 0;
      const reserved = inv.quantityReserved || 0;
      const available = inv.quantityAvailable || 0;

      totalOnHand += onHand;
      totalValuation += onHand * price;
      totalReserved += reserved;
      totalAvailable += available;

      if (inv.lowStock) lowStockCount++;
      else if (onHand > 0) healthyCount++;

      if (reserved > 0) reservedCount++;
    });

    return {
      totalOnHand,
      totalValuation,
      totalReserved,
      totalAvailable,
      lowStockCount,
      healthyCount,
      reservedCount,
      totalRecords: inventories.length,
    };
  }, [inventories]);

  // Filtered Inventories List
  const filteredInventories = useMemo(() => {
    return inventories.filter((inv) => {
      const matchesSearch =
        !invSearchQuery ||
        inv.productName?.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
        inv.productSku?.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
        inv.binRackNumber?.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
        inv.locationName?.toLowerCase().includes(invSearchQuery.toLowerCase()) ||
        inv.locationCode?.toLowerCase().includes(invSearchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (invStatusFilter === 'LOW_STOCK') return inv.lowStock;
      if (invStatusFilter === 'HEALTHY') return !inv.lowStock && (inv.quantityOnHand || 0) > 0;
      if (invStatusFilter === 'RESERVED') return (inv.quantityReserved || 0) > 0;

      return true;
    });
  }, [inventories, invSearchQuery, invStatusFilter]);

  // Filtered Transactions Audit Trail & Metrics
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesSearch =
        !txSearchQuery ||
        tx.referenceNumber?.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
        tx.productName?.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
        tx.productSku?.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
        tx.performedBy?.toLowerCase().includes(txSearchQuery.toLowerCase()) ||
        tx.notes?.toLowerCase().includes(txSearchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (txTypeFilter !== 'ALL' && tx.transactionType !== txTypeFilter) return false;
      if (txLocationFilter && String(tx.locationId) !== String(txLocationFilter)) return false;

      return true;
    });
  }, [transactions, txSearchQuery, txTypeFilter, txLocationFilter]);

  const auditMetrics = useMemo(() => {
    const total = transactions.length;
    const adjustments = transactions.filter((t) => t.transactionType === 'AUDIT_ADJUSTMENT').length;
    const transfers = transactions.filter(
      (t) => t.transactionType === 'TRANSFER_IN' || t.transactionType === 'TRANSFER_OUT'
    ).length;
    const fulfillment = transactions.filter(
      (t) => t.transactionType === 'DEDUCT_FULFILLMENT' || t.transactionType === 'RESERVE'
    ).length;
    return { total, adjustments, transfers, fulfillment };
  }, [transactions]);

  // Export Audit Trail to CSV
  const handleExportAuditCsv = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) {
      toastError('No audit transaction records to export');
      return;
    }
    const headers = ['Reference #', 'Timestamp', 'Action Type', 'Product Name', 'SKU', 'Warehouse Location', 'Quantity Delta', 'Auditor / Agent', 'Audit Notes'];
    const rows = filteredTransactions.map((tx) => [
      `"${tx.referenceNumber || `TXN-${tx.id}`}"`,
      `"${new Date(tx.createdAt).toLocaleString()}"`,
      `"${tx.transactionType}"`,
      `"${(tx.productName || '').replace(/"/g, '""')}"`,
      `"${tx.productSku || ''}"`,
      `"${(tx.locationName || '').replace(/"/g, '""')}"`,
      tx.quantity,
      `"${(tx.performedBy || 'System').replace(/"/g, '""')}"`,
      `"${(tx.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ShopSphere_Inventory_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Inventory audit trail CSV exported successfully');
  };

  // Stats Calculations for Delivery Fleet
  const availableCount = partners.filter((p) => p.status === 'AVAILABLE').length;
  const onDeliveryCount = partners.filter((p) => p.status === 'ON_DELIVERY').length;
  const totalDeliveries = partners.reduce((sum, p) => sum + (p.totalDeliveries || 0), 0);

  const filteredPartners = partners.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.vehicleNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.currentArea?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>
              {activeTab === 'inventory'
                ? 'Warehousing & Stock Valuation'
                : activeTab === 'transactions'
                ? 'Inventory Transaction Audit Trail'
                : 'Fulfillment & Delivery Fleet Operations'}
            </span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Hub
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {activeTab === 'inventory'
              ? 'Multi-hub stock valuation, rack bin codes, healthy threshold tracking, and physical cycle count audits.'
              : activeTab === 'transactions'
              ? 'Immutable real-time audit trail of all warehouse allocations, inter-hub transfers, and order deductions.'
              : 'Doorstep delivery fleet dispatch, AI smart rider assignments, and package shipping labels.'}
          </p>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <button
            onClick={() => handleTabSwitch('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Warehousing & Stock</span>
          </button>
          <button
            onClick={() => handleTabSwitch('transactions')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'transactions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail</span>
          </button>
          <button
            onClick={() => handleTabSwitch('fleet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'fleet' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Delivery Fleet</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DELIVERY FLEET */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Registered Fleet</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Truck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white mt-2">{partners.length}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Active delivery personnel</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Available Now</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-2">{availableCount}</p>
              <p className="text-[10px] text-emerald-500/80 mt-0.5">Ready for instant order dispatch</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">In Transit</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-400 mt-2">{onDeliveryCount}</p>
              <p className="text-[10px] text-amber-500/80 mt-0.5">Currently out for delivery</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Fulfilled Deliveries</span>
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-sky-400 mt-2">{totalDeliveries}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Lifetime package drop-offs</p>
            </div>
          </div>

          {/* Unassigned Active Orders Queue */}
          {orders.length > 0 && (
            <div className="bg-gradient-to-r from-slate-950 to-slate-900 border border-indigo-900/40 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <h2 className="text-sm font-bold text-white tracking-wide">Live Orders Awaiting Rider Dispatch ({orders.length})</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAiAutoAssignAll}
                    disabled={assigning}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-orange-600 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-950/40 transition-all active:scale-95 disabled:opacity-50"
                    title="Intelligently distribute all pending orders across riders using load balancing & city matching"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>⚡ AI Auto-Dispatch & Balance Fleet</span>
                  </button>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2.5 py-1 rounded-full border border-indigo-500/30">
                    AI Smart Match Enabled
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {orders.slice(0, 6).map((order) => (
                  <div key={order.id} className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-white">#{order.orderNumber}</p>
                        <p className="text-[10px] text-slate-400">{order.shippingAddress?.city || 'Bengaluru'}, {order.shippingAddress?.state || 'KA'}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                        order.orderStatus === 'OUT_FOR_DELIVERY' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-300 flex items-center justify-between bg-slate-950/60 p-2 rounded-lg">
                      <span>₹{order.totalAmount?.toLocaleString('en-IN')} • {order.items?.length || 1} items</span>
                      <span className="text-emerald-400 font-medium">{order.deliveryPartner ? `Rider: ${order.deliveryPartner.name}` : 'Unassigned'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        onClick={() => {
                          setSelectedStickerOrder(order);
                          setStickerModalOpen(true);
                        }}
                        className="px-2 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-lg border border-amber-500/30 flex items-center gap-1 transition-all"
                        title="Print Box Shipping Label / Customer Address Sticker"
                      >
                        <Tag className="w-3 h-3" />
                        <span>Sticker</span>
                      </button>
                      <button
                        onClick={() => handleAiAutoAssign(order.id)}
                        disabled={assigning}
                        className="flex-1 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Auto-Assign</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setSelectedPartnerId(order.deliveryPartner?.id ? String(order.deliveryPartner.id) : '');
                          setAssignModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30 transition-all"
                      >
                        Manual Assign
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Fleet Table */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search riders by name, vehicle, area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadData}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
                  title="Refresh List"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={handleOpenAdd}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-900/30 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Rider</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Rider Details</th>
                    <th className="p-4">Vehicle & Number</th>
                    <th className="p-4">Operating Zone</th>
                    <th className="p-4">Live Status</th>
                    <th className="p-4">Rating & Drops</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredPartners.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500">No delivery partners found.</td>
                    </tr>
                  ) : (
                    filteredPartners.map((partner) => (
                      <tr key={partner.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-semibold text-white">
                          <p>{partner.name}</p>
                          <p className="text-[10px] text-slate-500 font-mono">{partner.phone}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-slate-300 font-mono">{partner.vehicleNumber}</p>
                          <p className="text-[10px] text-slate-500">{partner.vehicleType}</p>
                        </td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 text-slate-300">
                            <MapPin className="w-3 h-3 text-rose-400" />
                            <span>{partner.currentArea}</span>
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            partner.status === 'AVAILABLE'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {partner.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{partner.rating || 4.9}</span>
                            <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              (partner.activeOrders || 0) > 0
                                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {partner.activeOrders || 0} active
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500">{partner.totalDeliveries || 0} orders completed</p>
                        </td>
                        <td className="p-4 text-right space-x-1">
                          <button
                            onClick={() => handleOpenEdit(partner)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="Edit Rider"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePartner(partner.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                            title="Deactivate Rider"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MULTI-WAREHOUSE STOCK MATRIX & VALUATION */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Stock Market Valuation & Inventory Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Units On-Hand</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white mt-2 font-mono">
                {inventoryMetrics.totalOnHand.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Across all storage locations</p>
            </div>

            <div className="bg-gradient-to-br from-slate-950 to-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 shadow-lg shadow-emerald-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">Inventory Market Value</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">
                ₹{inventoryMetrics.totalValuation.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-[10px] text-emerald-500/80 mt-0.5 flex items-center gap-1 font-medium">
                <span>● Live On-Hand Valuation</span>
              </p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Active Fulfillment Reserved</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-400 mt-2 font-mono">
                {inventoryMetrics.totalReserved.toLocaleString()}
              </p>
              <p className="text-[10px] text-amber-500/80 mt-0.5">Locked in processing & dispatch</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Available to Order</span>
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-sky-400 mt-2 font-mono">
                {inventoryMetrics.totalAvailable.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Ready for instant storefront purchase</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Low Stock Alerts</span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              </div>
              <p className={`text-2xl font-black mt-2 font-mono ${inventoryMetrics.lowStockCount > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
                {inventoryMetrics.lowStockCount}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">Items below threshold safety limit</p>
            </div>
          </div>

          {/* Warehouse Locations Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {locations.map((loc) => {
              const isSelected = selectedLocationId === String(loc.id);
              return (
                <div 
                  key={loc.id} 
                  onClick={() => setSelectedLocationId(isSelected ? '' : String(loc.id))}
                  className={`border p-3.5 rounded-2xl space-y-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-950/50 scale-[1.02]' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-mono font-bold text-[10px] border border-sky-500/30">
                      {loc.code}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{loc.type}</span>
                  </div>
                  <h3 className="text-xs font-extrabold text-white truncate" title={loc.name}>{loc.name}</h3>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{loc.city}, {loc.state}</span>
                  </p>
                  <div className="text-[10px] text-slate-500 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
                    <span>Mgr: <b className="text-slate-300">{loc.contactPerson?.split(' ')[0]}</b></span>
                    <span className="text-[10px] text-indigo-400 font-bold">{isSelected ? 'Active Filter ✓' : 'Click to filter'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Search, Status Filter Pills, and Action Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-3xl shadow-lg">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search products by name, SKU, bin/rack or warehouse..."
                  value={invSearchQuery}
                  onChange={(e) => setInvSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Warehouse Dropdown */}
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="">All Warehouses ({locations.length})</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.code})
                  </option>
                ))}
              </select>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-2xl border border-slate-800">
                <button
                  onClick={() => setInvStatusFilter('ALL')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all ${
                    invStatusFilter === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All ({inventoryMetrics.totalRecords})
                </button>
                <button
                  onClick={() => setInvStatusFilter('LOW_STOCK')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    invStatusFilter === 'LOW_STOCK' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>⚠️ Low Stock</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-950/60 text-[10px]">{inventoryMetrics.lowStockCount}</span>
                </button>
                <button
                  onClick={() => setInvStatusFilter('HEALTHY')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    invStatusFilter === 'HEALTHY' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Healthy</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/60 text-[10px]">{inventoryMetrics.healthyCount}</span>
                </button>
                <button
                  onClick={() => setInvStatusFilter('RESERVED')}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
                    invStatusFilter === 'RESERVED' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>In Orders</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-950/60 text-[10px]">{inventoryMetrics.reservedCount}</span>
                </button>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (inventories.length > 0) {
                    handleOpenAudit(inventories[0]);
                  } else {
                    toastError('No inventory available to audit');
                  }
                }}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 border border-slate-700 shadow-sm transition-all"
                title="Perform physical stock count audit and sync catalog"
              >
                <CheckSquare className="w-4 h-4 text-emerald-400" />
                <span>Audit / Adjust Stock</span>
              </button>

              <button
                onClick={() => {
                  setTransferForm({
                    productId: inventories[0]?.productId ? String(inventories[0].productId) : '1',
                    fromLocationId: locations[0]?.id ? String(locations[0].id) : '1',
                    toLocationId: locations[1]?.id ? String(locations[1].id) : '2',
                    quantity: 10,
                    performedBy: 'Ravikant Singh (Manager)',
                    notes: 'Inter-warehouse stock replenishment',
                  });
                  setTransferModalOpen(true);
                }}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-lg shadow-indigo-900/30 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Transfer Stock</span>
              </button>
            </div>
          </div>

          {/* Stock Matrix Table */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Warehouse className="w-4 h-4 text-indigo-400" />
                  <span>Warehouse Inventory Matrix & Valuation Rates</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Showing {filteredInventories.length} of {inventories.length} allocated stock records
                </p>
              </div>
              <button
                onClick={loadInventoryData}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Refresh inventory matrix"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Product Name & SKU</th>
                    <th className="p-4">Unit Market Price</th>
                    <th className="p-4">Warehouse Location</th>
                    <th className="p-4">Bin / Rack Code</th>
                    <th className="p-4">Physical On-Hand</th>
                    <th className="p-4">Total Stock Value</th>
                    <th className="p-4">Reserved</th>
                    <th className="p-4">Available</th>
                    <th className="p-4">Stock Health</th>
                    <th className="p-4 text-right">Audit & Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {invLoading ? (
                    <tr>
                      <td colSpan="10" className="p-12 text-center text-slate-500">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                        <span>Loading multi-warehouse inventory matrix & valuations...</span>
                      </td>
                    </tr>
                  ) : filteredInventories.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="p-12 text-center text-slate-500">
                        <Warehouse className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-400">No inventory records matching current filters.</p>
                        <p className="text-xs text-slate-600 mt-1">Try clearing your search query or warehouse filter.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredInventories.map((inv) => {
                      const unitPrice = inv.unitPrice || 0;
                      const stockValue = (inv.quantityOnHand || 0) * unitPrice;

                      return (
                        <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                          <td className="p-4">
                            <p className="font-bold text-white max-w-[220px] truncate" title={inv.productName}>
                              {inv.productName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{inv.productSku || 'SKU-GEN-001'}</p>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-200">
                            ₹{unitPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-slate-200">{inv.locationName}</span>
                            <p className="text-[10px] text-sky-400 font-mono">{inv.locationCode}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/30 font-mono font-bold text-[10px]">
                              {inv.binRackNumber || 'AISLE-01 / BAY-A1'}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-black text-white text-sm">
                            {inv.quantityOnHand}
                          </td>
                          <td className="p-4 font-mono font-extrabold text-emerald-400 text-sm">
                            ₹{stockValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                          </td>
                          <td className="p-4 font-mono text-amber-400 font-bold">
                            {inv.quantityReserved}
                          </td>
                          <td className="p-4 font-mono font-extrabold text-sky-400 text-sm">
                            {inv.quantityAvailable}
                          </td>
                          <td className="p-4">
                            {inv.lowStock ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-[10px] flex items-center gap-1 w-max">
                                <AlertTriangle className="w-3 h-3" /> Low Stock ({inv.quantityAvailable})
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] flex items-center gap-1 w-max">
                                <CheckCircle2 className="w-3 h-3" /> Healthy Stock
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenAudit(inv)}
                              className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold rounded-xl border border-emerald-500/30 transition-all inline-flex items-center gap-1"
                              title="Audit physical count & log cycle adjustment"
                            >
                              <CheckSquare className="w-3.5 h-3.5" />
                              <span>Audit Stock</span>
                            </button>
                            <button
                              onClick={() => {
                                setTransferForm({
                                  productId: String(inv.productId),
                                  fromLocationId: String(inv.locationId),
                                  toLocationId: locations.find((l) => l.id !== inv.locationId)?.id
                                    ? String(locations.find((l) => l.id !== inv.locationId).id)
                                    : '1',
                                  quantity: Math.min(10, inv.quantityAvailable || 1),
                                  performedBy: 'Ravikant Singh (Manager)',
                                  notes: `Inter-warehouse transfer for ${inv.productName}`,
                                });
                                setTransferModalOpen(true);
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors inline-block"
                              title="Transfer to another warehouse"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REAL-TIME AUDIT TRAIL */}
      {activeTab === 'transactions' && (
        <div className="space-y-6">
          {/* Audit Metrics Summary Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Audit Events</span>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-white mt-2 font-mono">{auditMetrics.total}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Immutable transaction records</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Physical Stock Audits</span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">{auditMetrics.adjustments}</p>
              <p className="text-[10px] text-emerald-500/80 mt-0.5">Cycle counts & manual write-offs</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Inter-Hub Transfers</span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-purple-400 mt-2 font-mono">{auditMetrics.transfers}</p>
              <p className="text-[10px] text-purple-400/80 mt-0.5">Cross-warehouse rebalancing</p>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Order Deductions & Reserves</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <Box className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-400 mt-2 font-mono">{auditMetrics.fulfillment}</p>
              <p className="text-[10px] text-amber-500/80 mt-0.5">Live store checkout fulfillment</p>
            </div>
          </div>

          {/* Audit Trail Filters & Export Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-950/80 border border-slate-800 p-4 rounded-3xl shadow-lg">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              {/* Search input */}
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Reference # (ADJ/TRF/ORD), SKU, Auditor, or Notes..."
                  value={txSearchQuery}
                  onChange={(e) => setTxSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Action Type Dropdown */}
              <select
                value={txTypeFilter}
                onChange={(e) => setTxTypeFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Action Types</option>
                <option value="AUDIT_ADJUSTMENT">AUDIT_ADJUSTMENT (Cycle Counts & Corrections)</option>
                <option value="TRANSFER_IN">TRANSFER_IN (Inbound Hub Transfer)</option>
                <option value="TRANSFER_OUT">TRANSFER_OUT (Outbound Hub Transfer)</option>
                <option value="DEDUCT_FULFILLMENT">DEDUCT_FULFILLMENT (Shipped Orders)</option>
                <option value="RESERVE">RESERVE (Order Placement Locks)</option>
              </select>

              {/* Location Filter Dropdown */}
              <select
                value={txLocationFilter}
                onChange={(e) => setTxLocationFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2 text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="">All Locations ({locations.length})</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>

              {(txSearchQuery || txTypeFilter !== 'ALL' || txLocationFilter) && (
                <button
                  onClick={() => {
                    setTxSearchQuery('');
                    setTxTypeFilter('ALL');
                    setTxLocationFilter('');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Export & Print Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportAuditCsv}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
                title="Download CSV report of filtered audit logs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-2xl flex items-center gap-1.5 border border-slate-700 transition-colors"
                title="Print audit report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Audit Trail Table */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <span>Real-Time Inventory Transaction Audit Trail</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Showing {filteredTransactions.length} of {transactions.length} total logged events
                </p>
              </div>
              <button
                onClick={loadInventoryData}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Refresh audit trail"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Timestamp & Ref #</th>
                    <th className="p-4">Action Type</th>
                    <th className="p-4">Product Name & SKU</th>
                    <th className="p-4">Warehouse Hub</th>
                    <th className="p-4">Delta Quantity</th>
                    <th className="p-4">Stock Snapshot (Before → After)</th>
                    <th className="p-4">Auditor / Agent</th>
                    <th className="p-4">Audit Notes & Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-12 text-center text-slate-500">
                        <History className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                        <p className="font-semibold text-slate-400">No inventory transactions found.</p>
                        <p className="text-xs text-slate-600 mt-1">Try resetting filters or adjusting stock to log audit entries.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white">
                          <span className="px-2 py-0.5 bg-slate-900 rounded-md border border-slate-800 text-[11px] text-indigo-300">
                            {tx.referenceNumber || `TXN-${tx.id}`}
                          </span>
                          <p className="text-[10px] text-slate-500 font-sans mt-1">
                            {new Date(tx.createdAt).toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] inline-flex items-center gap-1 border ${
                            tx.transactionType === 'AUDIT_ADJUSTMENT'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : tx.transactionType === 'TRANSFER_IN'
                              ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                              : tx.transactionType === 'TRANSFER_OUT'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : tx.transactionType === 'RESERVE'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}>
                            {tx.transactionType}
                          </span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white max-w-[200px] truncate" title={tx.productName}>
                            {tx.productName}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{tx.productSku}</p>
                        </td>
                        <td className="p-4 font-semibold text-slate-200">
                          {tx.locationName}
                        </td>
                        <td className="p-4 font-mono font-black text-sm">
                          <span className={`px-2 py-0.5 rounded-md inline-flex items-center gap-0.5 ${
                            tx.quantity > 0 
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {tx.quantity > 0 ? `+${tx.quantity}` : tx.quantity}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-xs">
                          {tx.previousOnHand !== undefined && tx.newOnHand !== undefined ? (
                            <span className="text-slate-300">
                              <span className="text-slate-500">{tx.previousOnHand}</span>
                              <span className="mx-1 text-slate-600">→</span>
                              <span className="font-bold text-white">{tx.newOnHand}</span>
                            </span>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-200 font-semibold">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                            {tx.performedBy || 'System Algorithm'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400 text-[11px] max-w-[240px]">
                          <p className="truncate" title={tx.notes}>{tx.notes || 'Routine stock synchronization'}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PHYSICAL STOCK COUNT & AUDIT ADJUSTMENT */}
      <Modal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        title="Physical Stock Count Audit & Correction"
      >
        <form onSubmit={handleSaveAudit} className="space-y-4 text-slate-800">
          {/* Target Product & Warehouse Info */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target SKU</span>
              <span className="text-[10px] font-mono font-bold text-indigo-600">{auditForm.productSku || 'SKU-001'}</span>
            </div>
            <p className="text-xs font-black text-slate-800">{auditForm.productName}</p>
            <p className="text-[11px] text-slate-500">
              Warehouse: <b className="text-slate-700">{auditForm.locationName}</b> ({auditForm.locationCode})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">Current System On-Hand</label>
              <div className="px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700">
                {auditForm.currentOnHand} units
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                New Counted Physical Units <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                required
                value={auditForm.newQuantityOnHand}
                onChange={(e) => setAuditForm({ ...auditForm, newQuantityOnHand: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-indigo-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono font-black text-indigo-700"
              />
            </div>
          </div>

          {/* Live Delta Display */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-600 font-semibold">Audit Adjustment Delta:</span>
            <span className={`font-mono font-black ${
              Number(auditForm.newQuantityOnHand) - Number(auditForm.currentOnHand) > 0
                ? 'text-emerald-600'
                : Number(auditForm.newQuantityOnHand) - Number(auditForm.currentOnHand) < 0
                ? 'text-rose-600'
                : 'text-slate-500'
            }`}>
              {Number(auditForm.newQuantityOnHand) - Number(auditForm.currentOnHand) > 0 ? '+' : ''}
              {Number(auditForm.newQuantityOnHand) - Number(auditForm.currentOnHand)} units
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Bin / Rack Code</label>
              <input
                type="text"
                value={auditForm.binRackNumber}
                onChange={(e) => setAuditForm({ ...auditForm, binRackNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
                placeholder="e.g. AISLE-03 / BAY-B2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Auditor / Manager</label>
              <input
                type="text"
                required
                value={auditForm.performedBy}
                onChange={(e) => setAuditForm({ ...auditForm, performedBy: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Audit Notes & Reason</label>
            <input
              type="text"
              required
              value={auditForm.notes}
              onChange={(e) => setAuditForm({ ...auditForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              placeholder="e.g. Periodic physical cycle count audit verification"
            />
            {/* Quick Reason Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                'Physical Cycle Count',
                'Damaged / Expired Write-Off',
                'Unrecorded Inward Stock Found',
                'Vendor Return Reconciliation',
              ].map((reason) => (
                <button
                  type="button"
                  key={reason}
                  onClick={() => setAuditForm({ ...auditForm, notes: reason })}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-semibold border border-slate-200 transition-colors"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAuditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={auditing}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-900/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{auditing ? 'Saving Audit...' : 'Save & Sync Stock'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: REGISTER / EDIT RIDER */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingPartner ? 'Edit Rider Profile' : 'Register New Delivery Personnel'}
      >
        <form onSubmit={handleSavePartner} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Registration #</label>
              <input
                type="text"
                required
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              >
                <option value="Two Wheeler (Bike)">Two Wheeler (Bike)</option>
                <option value="Electric Scooter">Electric Scooter (EV)</option>
                <option value="Delivery Van">Delivery Van</option>
                <option value="Three Wheeler (Auto Cargo)">Three Wheeler (Auto Cargo)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Operating Hub / Area</label>
              <input
                type="text"
                required
                value={formData.currentArea}
                onChange={(e) => setFormData({ ...formData, currentArea: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: INTER-WAREHOUSE STOCK TRANSFER */}
      <Modal
        isOpen={transferModalOpen}
        onClose={() => setTransferModalOpen(false)}
        title="Inter-Warehouse Stock Transfer Order"
      >
        <form onSubmit={handleExecuteTransfer} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Product to Transfer</label>
            <select
              value={transferForm.productId}
              onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold cursor-pointer"
            >
              {inventories.slice(0, 15).map((inv) => (
                <option key={inv.id} value={inv.productId}>
                  {inv.productName} ({inv.productSku})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Source Warehouse (From)</label>
              <select
                value={transferForm.fromLocationId}
                onChange={(e) => setTransferForm({ ...transferForm, fromLocationId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Destination Hub (To)</label>
              <select
                value={transferForm.toLocationId}
                onChange={(e) => setTransferForm({ ...transferForm, toLocationId: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold cursor-pointer"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Transfer Units</label>
              <input
                type="number"
                min="1"
                required
                value={transferForm.quantity}
                onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Authorized Manager</label>
              <input
                type="text"
                required
                value={transferForm.performedBy}
                onChange={(e) => setTransferForm({ ...transferForm, performedBy: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Transfer Reason / Notes</label>
            <input
              type="text"
              value={transferForm.notes}
              onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setTransferModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={transferring}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-900/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>{transferring ? 'Transferring...' : 'Execute Stock Transfer'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: MANUAL RIDER ASSIGN */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title={`Assign Rider for Order #${selectedOrder?.orderNumber}`}
      >
        <form onSubmit={handleAssignOrder} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Delivery Partner</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold"
            >
              <option value="">-- Choose Rider --</option>
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} ({partner.status} • {partner.vehicleType} • {partner.currentArea})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setAssignModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={assigning || !selectedPartnerId}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              {assigning ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Shipping Label / Sticker Modal */}
      <ShippingLabelModal
        isOpen={stickerModalOpen}
        onClose={() => setStickerModalOpen(false)}
        order={selectedStickerOrder}
      />
    </div>
  );
};

export default AdminDelivery;
