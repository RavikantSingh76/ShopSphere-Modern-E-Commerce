import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Lock,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  ExternalLink,
  FileText,
  Printer,
  CreditCard,
  Star,
  MessageSquarePlus,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { OrderStatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { StarRating } from '../components/common/StarRating';
import { InvoiceReceiptModal } from '../components/common/InvoiceReceiptModal';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { userApi, orderApi, reviewApi } from '../services/api';
import { getProductImage } from '../utils/imageHelper';

export const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';

  const { user, updateUser } = useAuth();
  const { success, error: toastError } = useToast();

  // Profile Tab State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewedProductIds, setReviewedProductIds] = useState(new Set());

  // Addresses Tab State
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  // Password Tab State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Invoice Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders') {
      setLoadingOrders(true);
      orderApi.getUserOrders({ page: 0, size: 20 }).then((res) => {
        if (res.success && res.data) {
          setOrders(res.data.content || []);
        }
      }).catch(console.error).finally(() => setLoadingOrders(false));
    } else if (activeTab === 'addresses') {
      setLoadingAddresses(true);
      userApi.getAddresses().then((res) => {
        if (res.success && res.data) {
          setAddresses(res.data || []);
        }
      }).catch(console.error).finally(() => setLoadingAddresses(false));
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await userApi.updateProfile({ name, phone, avatarUrl });
      if (res.success && res.data) {
        updateUser(res.data);
        success('Profile updated successfully!');
      }
    } catch (err) {
      toastError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastError('New password and confirm password do not match');
      return;
    }
    try {
      setChangingPassword(true);
      await userApi.changePassword({ currentPassword, newPassword });
      success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toastError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddressId) {
        await userApi.updateAddress(editingAddressId, addressForm);
        success('Address updated!');
      } else {
        await userApi.addAddress(addressForm);
        success('Address added!');
      }
      setAddressModalOpen(false);
      setEditingAddressId(null);
      const res = await userApi.getAddresses();
      if (res.success) setAddresses(res.data || []);
    } catch (err) {
      toastError(err.message || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await userApi.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
      success('Address removed');
    } catch (err) {
      toastError(err.message || 'Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await userApi.setDefaultAddress(id);
      setAddresses(addresses.map((a) => ({ ...a, isDefault: a.id === id })));
      success('Default address set');
    } catch (err) {
      toastError(err.message || 'Failed to set default address');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await orderApi.cancelOrder(orderId);
      if (res.success && res.data) {
        setOrders(orders.map((o) => (o.id === orderId ? res.data : o)));
        success('Order cancelled successfully');
      }
    } catch (err) {
      toastError(err.message || 'Failed to cancel order');
    }
  };

  const handleOpenReviewModal = (item) => {
    setReviewingItem(item);
    setReviewRating(5);
    setReviewTitle('');
    setReviewComment('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewingItem) return;
    try {
      setSubmittingReview(true);
      const res = await reviewApi.addReview({
        productId: reviewingItem.productId,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });
      if (res.success && res.data) {
        setReviewedProductIds((prev) => new Set([...prev, reviewingItem.productId]));
        success('Thank you! Your review and rating have been published.');
        setReviewModalOpen(false);
        setReviewTitle('');
        setReviewComment('');
        setReviewingItem(null);
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumb items={[{ label: 'My Account' }]} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Navigation Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-card p-6 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 mx-auto overflow-hidden ring-4 ring-emerald-100">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800">{user?.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Customer Account'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-2 space-y-1 text-xs font-bold">
            <button
              onClick={() => setSearchParams({ tab: 'profile' })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'profile' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'orders' })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'orders' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'addresses' })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'addresses' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Saved Addresses</span>
            </button>

            <button
              onClick={() => setSearchParams({ tab: 'security' })}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === 'security' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Security & Password</span>
            </button>
          </div>
        </div>

        {/* Right Content Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-card p-6 sm:p-8">
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50"
                >
                  {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Order History */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                My Order History ({orders.length})
              </h3>

              {loadingOrders ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : orders.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No Orders Yet"
                  description="You haven't placed any orders yet. Check out our latest arrivals and offers!"
                  actionText="Browse Shop"
                  actionLink="/products"
                />
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all space-y-4 bg-slate-50/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/60 text-xs">
                        <div>
                          <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                          <span className="text-slate-400 ml-2">
                            • {new Date(ord.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <OrderStatusBadge status={ord.orderStatus} />
                          <span className="font-extrabold text-slate-900 text-sm">
                            ₹{Number(ord.totalAmount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="space-y-2.5">
                        {ord.items?.map((it) => (
                          <div
                            key={it.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/80 text-xs shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                          >
                            <div className="flex items-center space-x-3 min-w-0">
                              <img
                                src={getProductImage({ name: it.productName, primaryImageUrl: it.productImage })}
                                alt=""
                                className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold text-slate-800 line-clamp-1 block">
                                  {it.productName}
                                </span>
                                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                                  <span>Qty: <strong className="text-slate-700">{it.quantity}</strong></span>
                                  {it.unitPrice && (
                                    <span>• ₹{Number(it.unitPrice).toLocaleString('en-IN')} each</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                              <button
                                type="button"
                                onClick={() => handleOpenReviewModal(it)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  reviewedProductIds.has(it.productId)
                                    ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-600 hover:text-white shadow-xs'
                                }`}
                              >
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                                <span>{reviewedProductIds.has(it.productId) ? 'Reviewed ★' : 'Rate & Review'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Payment Method & Transaction Summary */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-slate-200/80 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                          <span>
                            {ord.paymentMethod === 'COD' 
                              ? 'Cash on Delivery' 
                              : ord.paymentMethod === 'ONLINE' || ord.paymentMethod === 'RAZORPAY' || ord.paymentMethod === 'CARD'
                              ? 'Debit / Credit Card (Razorpay)' 
                              : ord.paymentMethod === 'UPI' 
                              ? 'UPI Pay (7607805940@jio)'
                              : ord.paymentMethod || 'Online Payment'}
                          </span>
                          {ord.transactionId && (
                            <span className="font-mono text-slate-400 font-normal">
                              ({ord.transactionId})
                            </span>
                          )}
                        </div>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                          ord.paymentStatus === 'PAID' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          Payment: {ord.paymentStatus || 'PAID'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100 mt-2">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/track-order?orderId=${ord.orderNumber}`}
                            className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>Track Delivery</span>
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedReceiptOrder(ord);
                              setReceiptModalOpen(true);
                            }}
                            className="font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            <span>Tax Invoice / Receipt</span>
                          </button>
                        </div>

                        {(ord.orderStatus === 'PENDING' || ord.orderStatus === 'CONFIRMED') && (
                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="font-bold text-rose-600 hover:underline"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Saved Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Saved Addresses</h3>
                <button
                  onClick={() => {
                    setEditingAddressId(null);
                    setAddressForm({
                      fullName: user?.name || '',
                      phone: user?.phone || '',
                      streetAddress: '',
                      apartment: '',
                      city: '',
                      state: '',
                      postalCode: '',
                      country: 'India',
                      isDefault: false,
                    });
                    setAddressModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              {loadingAddresses ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : addresses.length === 0 ? (
                <EmptyState
                  icon={MapPin}
                  title="No Saved Addresses"
                  description="Add your delivery address to enjoy fast, seamless checkouts."
                  actionText="Add Address"
                  onAction={() => setAddressModalOpen(true)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                          {addr.default && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-snug">
                          {addr.streetAddress}, {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">Phone: {addr.phone}</p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                        {!addr.default && (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-slate-500 hover:text-emerald-600 font-semibold"
                          >
                            Set as Default
                          </button>
                        )}
                        <div className="flex items-center space-x-2 ml-auto">
                          <button
                            onClick={() => {
                              setEditingAddressId(addr.id);
                              setAddressForm(addr);
                              setAddressModalOpen(true);
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-700"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Security & Password */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6 max-w-md">
              <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
                Change Password
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">New Password (Min 6 chars) *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
                >
                  {changingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Address Form Modal */}
      <Modal
        isOpen={addressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        title={editingAddressId ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSaveAddress} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={addressForm.fullName}
              onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
            <input
              type="tel"
              required
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
            <input
              type="text"
              required
              value={addressForm.streetAddress}
              onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                required
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code (PIN) *</label>
            <input
              type="text"
              required
              value={addressForm.postalCode}
              onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setAddressModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Save Address
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

      {/* Rate & Review Product Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Write a Customer Review"
      >
        {reviewingItem && (
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            {/* Product Summary */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
              <img
                src={getProductImage({ name: reviewingItem.productName, primaryImageUrl: reviewingItem.productImage })}
                alt=""
                className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 line-clamp-1">{reviewingItem.productName}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Verified Purchase</p>
              </div>
            </div>

            {/* Star Rating */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Overall Rating *</label>
              <div className="flex items-center gap-3">
                <StarRating
                  rating={reviewRating}
                  interactive={true}
                  onRatingChange={(val) => setReviewRating(val)}
                  size="lg"
                />
                <span className="text-xs font-bold text-slate-700 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                  {reviewRating} / 5 Stars
                </span>
              </div>
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Headline / Summary *</label>
              <input
                type="text"
                required
                placeholder="e.g. Excellent build quality, totally satisfied!"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Review & Experience *</label>
              <textarea
                rows={4}
                required
                placeholder="What did you like or dislike about this product? How is the performance and packaging?"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
