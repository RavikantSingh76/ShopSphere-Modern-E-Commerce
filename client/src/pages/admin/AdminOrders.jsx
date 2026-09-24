import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  Edit2,
  Truck,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Printer,
  Tag,
  Sparkles,
  Package,
  Box,
  Layers,
  Send,
  MapPin,
  CheckSquare,
  QrCode,
  Warehouse,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { OrderStatusBadge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { InvoiceReceiptModal } from '../../components/common/InvoiceReceiptModal';
import { ShippingLabelModal } from '../../components/common/ShippingLabelModal';
import { useToast } from '../../context/ToastContext';
import { adminApi, deliveryApi, inventoryApi } from '../../services/api';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [availablePartners, setAvailablePartners] = useState([]);

  // Status Updater Modal
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [courierName, setCourierName] = useState('');
  const [updating, setUpdating] = useState(false);

  // Warehouse Operational Action Modals
  const [pickModalOpen, setPickModalOpen] = useState(false);
  const [packModalOpen, setPackModalOpen] = useState(false);
  const [readyModalOpen, setReadyModalOpen] = useState(false);
  const [activeFulfillOrder, setActiveFulfillOrder] = useState(null);

  // Pick Form
  const [pickerName, setPickerName] = useState('Ravikant Singh (Manager)');
  const [pickerNotes, setPickerNotes] = useState('All SKUs verified and inspected from bin racks.');
  
  // Pack Form
  const [packerName, setPackerName] = useState('Ravikant Singh (Manager)');
  const [packageBoxSize, setPackageBoxSize] = useState('Medium Box (30x20x10 cm)');
  const [packageWeightKg, setPackageWeightKg] = useState('0.65');
  const [packageBarcode, setPackageBarcode] = useState('');

  // Ready To Ship Form
  const [manifestedBy, setManifestedBy] = useState('Ravikant Singh (Manager)');
  const [selectedPartnerId, setSelectedPartnerId] = useState('');
  const [shipCourierName, setShipCourierName] = useState('ShopZone Express Surface Fleet');
  const [shipTrackingNumber, setShipTrackingNumber] = useState('');

  // Receipt Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Shipping Label / Parcel Sticker Modal
  const [stickerModalOpen, setStickerModalOpen] = useState(false);
  const [selectedStickerOrder, setSelectedStickerOrder] = useState(null);

  const { success, error: toastError } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getAllOrders({
        query: searchQuery || undefined,
        status: statusFilter || undefined,
        page,
        size: pageSize,
      });
      if (res.success && res.data) {
        setOrders(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalElements(res.data.totalElements || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPartners = async () => {
    try {
      const res = await deliveryApi.getAllPartners();
      if (res.success && res.data) {
        setAvailablePartners(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadOrders();
    loadPartners();
  }, [searchQuery, statusFilter, page, pageSize]);

  // Open PICK Modal
  const handleOpenPickModal = (ord) => {
    setActiveFulfillOrder(ord);
    setPickerName('Ravikant Singh (Manager)');
    setPickerNotes('All items verified from bin racks without defects.');
    setPickModalOpen(true);
  };

  const handleExecutePick = async (e) => {
    e.preventDefault();
    if (!activeFulfillOrder) return;
    try {
      setUpdating(true);
      const res = await inventoryApi.pickOrder(activeFulfillOrder.id, {
        pickedBy: pickerName,
        pickerNotes: pickerNotes,
      });
      if (res.success) {
        success(`Order #${activeFulfillOrder.orderNumber} successfully PICKED! Bins verified.`);
        setPickModalOpen(false);
        loadOrders();
      }
    } catch (err) {
      toastError(err.message || 'Failed to execute pick workflow');
    } finally {
      setUpdating(false);
    }
  };

  // Open PACK Modal
  const handleOpenPackModal = (ord) => {
    setActiveFulfillOrder(ord);
    setPackerName('Ravikant Singh (Manager)');
    setPackageBoxSize('Medium Corrugated Box (30x20x10 cm)');
    setPackageWeightKg('0.65');
    setPackageBarcode(`PKG-${ord.orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`);
    setPackModalOpen(true);
  };

  const handleExecutePack = async (e) => {
    e.preventDefault();
    if (!activeFulfillOrder) return;
    try {
      setUpdating(true);
      const res = await inventoryApi.packOrder(activeFulfillOrder.id, {
        packedBy: packerName,
        packageBoxSize: packageBoxSize,
        packageWeightKg: parseFloat(packageWeightKg) || 0.65,
        packageBarcode: packageBarcode,
      });
      if (res.success) {
        success(`Order #${activeFulfillOrder.orderNumber} successfully PACKED & Sealed!`);
        setPackModalOpen(false);
        loadOrders();
      }
    } catch (err) {
      toastError(err.message || 'Failed to execute pack workflow');
    } finally {
      setUpdating(false);
    }
  };

  // Open READY TO SHIP Modal
  const handleOpenReadyModal = (ord) => {
    setActiveFulfillOrder(ord);
    setManifestedBy('Ravikant Singh (Manager)');
    setShipCourierName('ShopZone Express Hub Fleet');
    setShipTrackingNumber(`AWB-SZ-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setSelectedPartnerId(availablePartners[0]?.id || '');
    setReadyModalOpen(true);
  };

  const handleExecuteReadyToShip = async (e) => {
    e.preventDefault();
    if (!activeFulfillOrder) return;
    try {
      setUpdating(true);
      const res = await inventoryApi.readyToShipOrder(activeFulfillOrder.id, {
        manifestedBy: manifestedBy,
        deliveryPartnerId: selectedPartnerId ? Number(selectedPartnerId) : null,
        courierName: shipCourierName,
        trackingNumber: shipTrackingNumber,
      });
      if (res.success) {
        success(`Order #${activeFulfillOrder.orderNumber} is READY TO SHIP! AWB Generated & Fleet Manifested.`);
        setReadyModalOpen(false);
        loadOrders();
      }
    } catch (err) {
      toastError(err.message || 'Failed to mark order ready to ship');
    } finally {
      setUpdating(false);
    }
  };

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setTrackingNumber(ord.trackingNumber || '');
    setCourierName(ord.courierName || 'Express Surface Courier');
    setStatusModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      const res = await adminApi.updateOrderStatus(selectedOrder.id, {
        status: newStatus,
        trackingNumber,
        courierName,
      });
      if (res.success) {
        success(`Order ${selectedOrder.orderNumber} status updated to ${newStatus}`);
        setStatusModalOpen(false);
        loadOrders();
      }
    } catch (err) {
      toastError(err.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const handleAiAutoAssign = async (orderId) => {
    try {
      const res = await deliveryApi.aiAutoAssignOrder(orderId);
      success(res.message || 'AI matched and assigned delivery rider!');
      loadOrders();
    } catch (err) {
      toastError(err.message || 'Failed to auto-assign rider');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Order & Warehouse Fulfillment Management</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Live Operations
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-End Operational Pipeline: Stock Reservation ➔ <b>PICK</b> ➔ <b>PACK</b> ➔ <b>READY TO SHIP</b> ➔ <b>DISPATCH</b>.
          </p>
        </div>
      </div>

      {/* Operational Pipeline Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl">
          <p className="text-[11px] font-bold text-slate-400">Total Live Orders</p>
          <p className="text-xl font-extrabold text-white mt-1">{orders.length}</p>
        </div>
        <div className="p-3 bg-slate-950/80 border border-amber-500/30 rounded-2xl">
          <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
            <Box className="w-3.5 h-3.5" /> To Pick
          </p>
          <p className="text-xl font-extrabold text-amber-300 mt-1">
            {orders.filter((o) => ['CONFIRMED', 'PENDING', 'PROCESSING'].includes(o.orderStatus)).length}
          </p>
        </div>
        <div className="p-3 bg-slate-950/80 border border-purple-500/30 rounded-2xl">
          <p className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" /> Picked / In Packing
          </p>
          <p className="text-xl font-extrabold text-purple-300 mt-1">
            {orders.filter((o) => o.orderStatus === 'PICKED').length}
          </p>
        </div>
        <div className="p-3 bg-slate-950/80 border border-indigo-500/30 rounded-2xl">
          <p className="text-[11px] font-bold text-indigo-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" /> Packed & Boxed
          </p>
          <p className="text-xl font-extrabold text-indigo-300 mt-1">
            {orders.filter((o) => o.orderStatus === 'PACKED').length}
          </p>
        </div>
        <div className="p-3 bg-slate-950/80 border border-blue-500/30 rounded-2xl">
          <p className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" /> Ready To Ship
          </p>
          <p className="text-xl font-extrabold text-blue-300 mt-1">
            {orders.filter((o) => o.orderStatus === 'READY_TO_SHIP').length}
          </p>
        </div>
        <div className="p-3 bg-slate-950/80 border border-emerald-500/30 rounded-2xl">
          <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" /> In Transit / Shipped
          </p>
          <p className="text-xl font-extrabold text-emerald-300 mt-1">
            {orders.filter((o) => ['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.orderStatus)).length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center bg-slate-950/80 border border-slate-800/80 rounded-2xl px-4 py-2.5 flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 mr-2.5" />
          <input
            type="text"
            placeholder="Search by Order #, Customer Name, Email, SKU..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="bg-slate-950/80 border border-slate-800/80 rounded-2xl px-4 py-2.5 text-xs text-slate-300 font-semibold focus:outline-none cursor-pointer"
        >
          <option value="">All Statuses</option>
          <option value="CONFIRMED">Confirmed / New</option>
          <option value="PICKED">Picked (Items Binned)</option>
          <option value="PACKED">Packed (Box Sealed)</option>
          <option value="READY_TO_SHIP">Ready To Ship</option>
          <option value="SHIPPED">Shipped / In Transit</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Order & Warehouse</th>
                <th className="p-4">Customer & Destination</th>
                <th className="p-4">Items & Bin Racks</th>
                <th className="p-4">Amount & Payment</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4">Warehouse Action</th>
                <th className="p-4 text-right">Documents & Tools</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">Loading orders & fulfillment matrix...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-white">
                      <div className="flex items-center gap-1.5">
                        <span>{ord.orderNumber}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-sans mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-sky-400 font-sans">
                        <Warehouse className="w-3 h-3 text-sky-400 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {ord.fulfillmentLocationName || 'ShopZone Central Hub (BLR)'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-200">{ord.shippingAddress?.fullName || ord.userName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{ord.shippingAddress?.phone || 'Phone verified'}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-rose-400 flex-shrink-0" />
                        <span>{ord.shippingAddress?.city}, {ord.shippingAddress?.state} ({ord.shippingAddress?.postalCode})</span>
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="text-slate-200 font-bold">{ord.items?.length || 0} SKU(s)</span>
                        <div className="text-[10px] text-slate-400">
                          {ord.items?.slice(0, 2).map((it) => (
                            <div key={it.id} className="truncate max-w-[180px] flex items-center gap-1">
                              <span className="text-amber-400 font-mono font-semibold">[{it.binRackNumber || 'RACK-A1'}]</span>
                              <span>{it.quantity}x {it.productName}</span>
                            </div>
                          ))}
                          {(ord.items?.length || 0) > 2 && (
                            <span className="text-slate-500 italic">+{(ord.items?.length || 0) - 2} more item(s)</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-extrabold text-emerald-400 text-sm">
                        ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {ord.paymentMethod} • <span className={ord.paymentStatus === 'PAID' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{ord.paymentStatus}</span>
                      </p>
                    </td>
                    <td className="p-4">
                      <OrderStatusBadge status={ord.orderStatus} />
                      {ord.pickedBy && (
                        <p className="text-[9px] text-purple-400 mt-1">Picked by: {ord.pickedBy}</p>
                      )}
                      {ord.packedBy && (
                        <p className="text-[9px] text-indigo-400">Packed by: {ord.packedBy} ({ord.packageWeightKg || 0.5}kg)</p>
                      )}
                    </td>

                    {/* Operational Fulfillment Actions: PICK -> PACK -> READY TO SHIP */}
                    <td className="p-4">
                      {['CONFIRMED', 'PENDING', 'PROCESSING'].includes(ord.orderStatus) && (
                        <button
                          onClick={() => handleOpenPickModal(ord)}
                          className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-900/40 flex items-center gap-1.5 transition-all hover:scale-105"
                        >
                          <Box className="w-3.5 h-3.5" />
                          <span>1. PICK Items</span>
                        </button>
                      )}

                      {ord.orderStatus === 'PICKED' && (
                        <button
                          onClick={() => handleOpenPackModal(ord)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-900/40 flex items-center gap-1.5 transition-all hover:scale-105"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>2. PACK Box</span>
                        </button>
                      )}

                      {ord.orderStatus === 'PACKED' && (
                        <button
                          onClick={() => handleOpenReadyModal(ord)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-900/40 flex items-center gap-1.5 transition-all hover:scale-105"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>3. READY TO SHIP</span>
                        </button>
                      )}

                      {ord.orderStatus === 'READY_TO_SHIP' && (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                            <Tag className="w-3 h-3" /> AWB: {ord.trackingNumber || 'Manifested'}
                          </span>
                          <div>
                            {ord.deliveryPartner ? (
                              <p className="text-[10px] text-emerald-400 font-semibold">🚚 {ord.deliveryPartner.name}</p>
                            ) : (
                              <button
                                onClick={() => handleAiAutoAssign(ord.id)}
                                className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-all"
                              >
                                <Sparkles className="w-3 h-3" /> Dispatch AI Rider
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {['SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].includes(ord.orderStatus) && (
                        <span className="text-[11px] text-slate-500 font-semibold">Pipeline Fulfilled</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedStickerOrder(ord);
                          setStickerModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/20 transition-all inline-flex items-center gap-1"
                        title="Print Box Shipping Label / Customer Address Sticker"
                      >
                        <Tag className="w-3.5 h-3.5" />
                        <span>Sticker</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReceiptOrder(ord);
                          setReceiptModalOpen(true);
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/20 transition-all inline-flex items-center gap-1"
                        title="View Official Digital Tax Invoice & Receipt"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>

                      <button
                        onClick={() => handleOpenStatusModal(ord)}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors"
                        title="Manual Status Override"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Pagination & Items Per Page */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Showing <span className="text-white font-bold">{orders.length > 0 ? page * pageSize + 1 : 0}</span> to{' '}
            <span className="text-white font-bold">{Math.min((page + 1) * pageSize, totalElements)}</span> of{' '}
            <span className="text-white font-bold">{totalElements}</span> orders
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>Per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(0);
                }}
                className="bg-slate-800 border border-slate-700 text-white rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="150">150</option>
              </select>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="px-2 font-medium text-slate-300">
                  {page + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. PICK ACTION MODAL */}
      <Modal
        isOpen={pickModalOpen}
        onClose={() => setPickModalOpen(false)}
        title={`Warehouse Picklist: Order #${activeFulfillOrder?.orderNumber}`}
      >
        <form onSubmit={handleExecutePick} className="space-y-4 text-slate-800">
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-xs text-purple-900 flex items-start gap-2">
            <Box className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Step 1: Inventory Pick & Bin Collection</p>
              <p className="text-[11px] text-purple-700 mt-0.5">
                Collect matching SKUs from designated warehouse aisles and bin racks.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Warehouse Hub</label>
            <input
              type="text"
              readOnly
              value={activeFulfillOrder?.fulfillmentLocationName || 'ShopZone Central Mega Warehouse - Bengaluru'}
              className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Warehouse Picker Name</label>
            <input
              type="text"
              required
              value={pickerName}
              onChange={(e) => setPickerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold"
            />
          </div>

          {/* Items To Pick with Bin Numbers */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">SKUs to Collect from Warehouse Bins:</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {activeFulfillOrder?.items?.map((it) => (
                <div key={it.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{it.quantity}x {it.productName}</span>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">SKU: {it.productSku || 'SKU-001'}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono font-bold text-[11px] border border-purple-300">
                      📍 {it.binRackNumber || 'AISLE-01 / BAY-A1 / BIN-04'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Picker Quality Inspection Notes</label>
            <input
              type="text"
              value={pickerNotes}
              onChange={(e) => setPickerNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPickModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-900/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{updating ? 'Processing Pick...' : 'Confirm Items Picked (Set PICKED)'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. PACK ACTION MODAL */}
      <Modal
        isOpen={packModalOpen}
        onClose={() => setPackModalOpen(false)}
        title={`Packing Station: Order #${activeFulfillOrder?.orderNumber}`}
      >
        <form onSubmit={handleExecutePack} className="space-y-4 text-slate-800">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-xs text-indigo-900 flex items-start gap-2">
            <Package className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Step 2: Box Boxing, Bubble Wrap & Barcoding</p>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Wrap items with tamper-proof seal and input dimensional shipping parameters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Packer Name</label>
              <input
                type="text"
                required
                value={packerName}
                onChange={(e) => setPackerName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gross Weight (Kg)</label>
              <input
                type="number"
                step="0.01"
                required
                value={packageWeightKg}
                onChange={(e) => setPackageWeightKg(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Box Dimension Specification</label>
            <select
              value={packageBoxSize}
              onChange={(e) => setPackageBoxSize(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold cursor-pointer"
            >
              <option value="Small Box (20x15x8 cm)">Small Box (20x15x8 cm) - Up to 1kg</option>
              <option value="Medium Corrugated Box (30x20x10 cm)">Medium Corrugated Box (30x20x10 cm) - Up to 3kg</option>
              <option value="Large Rigid Box (45x35x20 cm)">Large Rigid Box (45x35x20 cm) - Up to 10kg</option>
              <option value="Heavy Duty Pallet / Crate (60x50x40 cm)">Heavy Duty Pallet / Crate (60x50x40 cm) - Bulk</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Generated Package Box Barcode</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={packageBarcode}
                className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl font-mono font-bold text-slate-700"
              />
              <button
                type="button"
                onClick={() => setPackageBarcode(`PKG-${activeFulfillOrder?.orderNumber}-${Math.floor(1000 + Math.random() * 9000)}`)}
                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700"
              >
                Regen
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setPackModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-900/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{updating ? 'Sealing Package...' : 'Seal & Confirm Packed (Set PACKED)'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. READY TO SHIP ACTION MODAL */}
      <Modal
        isOpen={readyModalOpen}
        onClose={() => setReadyModalOpen(false)}
        title={`Dispatch & Manifest: Order #${activeFulfillOrder?.orderNumber}`}
      >
        <form onSubmit={handleExecuteReadyToShip} className="space-y-4 text-slate-800">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs text-blue-900 flex items-start gap-2">
            <Send className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Step 3: AWB Generation & Delivery Partner Dispatch</p>
              <p className="text-[11px] text-blue-700 mt-0.5">
                Generate Air Waybill (AWB) number and assign to registered fleet courier or express rider.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Courier Carrier</label>
            <select
              value={shipCourierName}
              onChange={(e) => setShipCourierName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold cursor-pointer"
            >
              <option value="ShopZone Express Hub Fleet">ShopZone Express Hub Fleet (Direct Same-Day)</option>
              <option value="Delhivery Express Surface">Delhivery Express Surface Logistics</option>
              <option value="Blue Dart Express Air">Blue Dart Express Air Logistics</option>
              <option value="Ecom Express Secure Courier">Ecom Express Secure Doorstep</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assign Registered Delivery Rider</label>
            <select
              value={selectedPartnerId}
              onChange={(e) => setSelectedPartnerId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold cursor-pointer"
            >
              <option value="">-- Assign Later via AI Dispatch --</option>
              {availablePartners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.name} ({partner.vehicleType} • {partner.currentArea})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">AWB Tracking Code</label>
            <input
              type="text"
              required
              value={shipTrackingNumber}
              onChange={(e) => setShipTrackingNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-blue-700 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Dispatch Officer</label>
            <input
              type="text"
              required
              value={manifestedBy}
              onChange={(e) => setManifestedBy(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setReadyModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-900/30 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{updating ? 'Generating Manifest...' : 'Generate AWB & Set READY TO SHIP'}</span>
            </button>
          </div>
        </form>
      </Modal>

      {/* Manual Status Override Modal */}
      <Modal
        isOpen={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        title={`Update Order Status: #${selectedOrder?.orderNumber}`}
      >
        <form onSubmit={handleUpdateStatus} className="space-y-4 text-slate-800">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Fulfillment Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-semibold"
            >
              <option value="PENDING">PENDING</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="PICKED">PICKED (Items Binned)</option>
              <option value="PACKED">PACKED (Box Sealed)</option>
              <option value="READY_TO_SHIP">READY_TO_SHIP</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tracking Number</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Courier Partner</label>
            <input
              type="text"
              value={courierName}
              onChange={(e) => setCourierName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Official Tax Invoice & Payment Receipt Modal */}
      <InvoiceReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        order={selectedReceiptOrder}
      />

      {/* Box Shipping Label & Parcel Customer Detail Sticker Modal */}
      <ShippingLabelModal
        isOpen={stickerModalOpen}
        onClose={() => setStickerModalOpen(false)}
        order={selectedStickerOrder}
      />
    </div>
  );
};
