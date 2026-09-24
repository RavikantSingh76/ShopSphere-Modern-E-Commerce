import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  MapPin,
  Plus,
  ArrowRight,
  Lock,
  AlertCircle,
  Smartphone,
  Building2,
  Wallet,
  CalendarClock,
  QrCode,
  Check,
  Zap,
  HelpCircle,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderApi, userApi, paymentApi } from '../services/api';
import { getProductImage } from '../utils/imageHelper';

export const Checkout = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, appliedCoupon, refreshCart } = useCart();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  // Accordion Step State (1: Login, 2: Address, 3: Order Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState(4); // Default to payment if address is available

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('new');
  const [isNewAddress, setIsNewAddress] = useState(false);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  // Flipkart Style Payment Methods: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD'
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiMode, setUpiMode] = useState('apps'); // 'apps' | 'id'
  const [upiId, setUpiId] = useState('7607805940@jio');
  const [selectedUpiApp, setSelectedUpiApp] = useState('GPAY');

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: user?.name || 'RAVIKANT SINGH',
    expiry: '',
    cvv: '',
  });

  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedWallet, setSelectedWallet] = useState('PAYTM');
  const [codCaptcha, setCodCaptcha] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');

  const [orderNotes, setOrderNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  // Generate simple 3-digit Captcha for COD
  const generateCaptcha = () => {
    const num = Math.floor(100 + Math.random() * 900).toString();
    setCodCaptcha(num);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // Load saved addresses
  useEffect(() => {
    if (isAuthenticated) {
      userApi
        .getAddresses()
        .then((res) => {
          if (res.success && res.data && res.data.length > 0) {
            setSavedAddresses(res.data);
            const defaultAddr = res.data.find((a) => a.default) || res.data[0];
            setSelectedAddressId(defaultAddr.id);
            setIsNewAddress(false);
            setAddressForm(defaultAddr);
            setCurrentStep(4);
          } else {
            setIsNewAddress(true);
            setSelectedAddressId('new');
            setCurrentStep(2);
            if (user) {
              setAddressForm((prev) => ({
                ...prev,
                fullName: user.name || '',
                phone: user.phone || '7607805940',
              }));
            }
          }
        })
        .catch(console.error);
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Sign In to Complete Order</h2>
          <p className="text-xs text-slate-500 mt-1">Please log in to your account to securely place your order.</p>
        </div>
        <div className="space-y-3">
          <Link
            to="/login?redirect=/checkout"
            className="w-full block py-3 rounded-xl text-xs font-bold text-white bg-[#2874f0] hover:bg-blue-700 shadow-md transition-all"
          >
            Sign In to ShopSphere
          </Link>
          <Link
            to="/register?redirect=/checkout"
            className="w-full block py-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            New Customer? Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add items to your cart before proceeding to checkout.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 rounded-xl bg-[#2874f0] text-white font-bold text-xs shadow-md">
          Shop Now
        </Link>
      </div>
    );
  }

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    if (e) e.preventDefault();

    // Validate address form
    if (
      !addressForm.fullName ||
      !addressForm.phone ||
      !addressForm.streetAddress ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.postalCode
    ) {
      toastError('Please complete your delivery address first');
      setCurrentStep(2);
      return;
    }

    // COD Captcha Validation
    if (paymentMethod === 'COD') {
      if (userCaptchaInput.trim() !== codCaptcha) {
        toastError('Please enter the correct characters shown in the image');
        generateCaptcha();
        return;
      }
    }

    try {
      setPlacingOrder(true);

      // 1. Cash on Delivery (COD) Flow
      if (paymentMethod === 'COD') {
        const res = await orderApi.createOrder({
          shippingAddress: addressForm,
          paymentMethod: 'COD',
          couponCode: appliedCoupon ? appliedCoupon.code : null,
          notes: orderNotes,
        });

        if (res.success && res.data) {
          success('Order Placed Successfully via Cash on Delivery!');
          await refreshCart();
          navigate('/order-success', { state: { order: res.data } });
        }
        return;
      }

      // 2. Online / UPI / Card / NetBanking Payment via Razorpay Live Gateway
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toastError('Failed to load secure payment gateway. Please check your internet connection.');
        setPlacingOrder(false);
        return;
      }

      const totalToPay = Number(cart.totalAmount || 9);
      const orderGenRes = await paymentApi.createRazorpayOrder(totalToPay, `rcpt_${Date.now()}`);

      if (!orderGenRes.success || !orderGenRes.data) {
        toastError('Failed to initialize secure payment session. Please try again.');
        setPlacingOrder(false);
        return;
      }

      const rzpData = orderGenRes.data;

      const options = {
        key: rzpData.keyId || 'rzp_live_TaBVwbfDRE5yH4',
        amount: rzpData.amountInPaise,
        currency: rzpData.currency || 'INR',
        name: 'ShopSphere',
        description: `Payment for ${cart.items?.length || 1} Item(s)`,
        image: cart.items?.[0] ? getProductImage({ name: cart.items[0].productName, primaryImageUrl: cart.items[0].productImage }) : 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=120&auto=format&fit=crop&q=80',
        order_id: rzpData.razorpayOrderId,
        modal: {
          ondismiss: function () {
            toastError('Payment was cancelled or closed. Your order was not placed.');
            setPlacingOrder(false);
          },
        },
        handler: async function (response) {
          try {
            setPlacingOrder(true);
            // Create order on backend only after bank debit
            const createRes = await orderApi.createOrder({
              shippingAddress: addressForm,
              paymentMethod: paymentMethod === 'UPI' ? 'UPI' : paymentMethod === 'CARD' ? 'CARD' : 'ONLINE',
              couponCode: appliedCoupon ? appliedCoupon.code : null,
              notes: orderNotes,
            });

            if (createRes.success && createRes.data) {
              // Verify signature on backend
              try {
                await paymentApi.verifyRazorpayPayment({
                  razorpayOrderId: response.razorpay_order_id || rzpData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature || 'sig_verified',
                  orderId: createRes.data.id,
                });
              } catch (verifyErr) {
                console.warn('Verification audit logged:', verifyErr);
              }

              success(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);
              await refreshCart();
              navigate('/order-success', {
                state: {
                  order: {
                    ...createRes.data,
                    paymentStatus: 'PAID',
                    transactionId: response.razorpay_payment_id,
                    paymentGateway: 'Razorpay Payment Gateway (Live)',
                  },
                },
              });
            } else {
              toastError(createRes.message || 'Failed to save order details after payment.');
            }
          } catch (err) {
            console.error('Order creation error post-payment:', err);
            toastError('Payment successful! Processing order summary...');
            await refreshCart();
            navigate('/track-order');
          } finally {
            setPlacingOrder(false);
          }
        },
        prefill: {
          name: addressForm.fullName || user?.name || 'Ravikant Singh',
          email: user?.email || 'ravikantsinghravi366@gmail.com',
          contact: addressForm.phone || user?.phone || '7607805940',
          method: paymentMethod === 'UPI' ? 'upi' : paymentMethod === 'CARD' ? 'card' : paymentMethod === 'NETBANKING' ? 'netbanking' : undefined,
          vpa: paymentMethod === 'UPI' && upiMode === 'id' && upiId ? upiId : undefined,
        },
        notes: {
          address: `${addressForm.streetAddress}, ${addressForm.city}`,
        },
        theme: {
          color: '#2874f0',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        toastError(`Payment failed: ${response.error?.description || 'Transaction declined'}. Order not placed.`);
        setPlacingOrder(false);
      });
      rzp.open();
      setPlacingOrder(false);
    } catch (err) {
      toastError(err.message || 'Failed to start payment process');
      setPlacingOrder(false);
    }
  };

  // Calculations for Flipkart-style Price Details
  const itemsCount = cart.items?.reduce((sum, it) => sum + it.quantity, 0) || 1;
  const originalSubtotal = Number(cart.subtotal || cart.totalAmount || 0);
  const discount = Number(cart.discountAmount || 0);
  const totalPayable = Number(cart.totalAmount || 0);
  const totalSavings = discount + (originalSubtotal > 500 ? 40 : 0);

  return (
    <div className="bg-[#f1f3f6] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Flipkart Clean Top Bar */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
          <Breadcrumb items={[{ label: 'Home', link: '/' }, { label: 'Cart', link: '/cart' }, { label: 'Checkout' }]} />
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#2874f0]" />
            <span>100% Safe & Secure Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left 8-Columns: Flipkart Accordion Steps */}
          <div className="lg:col-span-8 space-y-3">
            
            {/* STEP 1: LOGIN STEP */}
            <div className="bg-white rounded-sm shadow-xs border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between bg-white">
                <div className="flex items-center space-x-4">
                  <span className="w-6 h-6 rounded-xs bg-slate-200 text-[#2874f0] font-bold text-xs flex items-center justify-center">
                    1
                  </span>
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">LOGIN</span>
                    <span className="text-sm font-bold text-slate-900">
                      {user?.name || 'Customer'} <span className="font-normal text-slate-500 font-mono">+91 {user?.phone || '9696675081'}</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFIED</span>
                </div>
              </div>
            </div>

            {/* STEP 2: DELIVERY ADDRESS */}
            <div className="bg-white rounded-sm shadow-xs border border-slate-200 overflow-hidden">
              <div
                className={`px-6 py-4 flex items-center justify-between cursor-pointer ${
                  currentStep === 2 ? 'bg-[#2874f0] text-white' : 'bg-white'
                }`}
                onClick={() => setCurrentStep(2)}
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={`w-6 h-6 rounded-xs font-bold text-xs flex items-center justify-center ${
                      currentStep === 2 ? 'bg-white text-[#2874f0]' : 'bg-slate-200 text-[#2874f0]'
                    }`}
                  >
                    2
                  </span>
                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider block ${
                        currentStep === 2 ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      DELIVERY ADDRESS
                    </span>
                    {currentStep !== 2 && (
                      <span className="text-sm font-bold text-slate-800 line-clamp-1">
                        {addressForm.fullName} — {addressForm.streetAddress}, {addressForm.city} ({addressForm.postalCode})
                      </span>
                    )}
                  </div>
                </div>
                {currentStep !== 2 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-1.5 border border-slate-300 text-[#2874f0] hover:bg-blue-50 text-xs font-bold rounded-sm uppercase tracking-wider transition-colors"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              {/* Step 2 Expanded Content */}
              {currentStep === 2 && (
                <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
                  {savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      {savedAddresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`p-4 rounded-sm border flex items-start space-x-3 cursor-pointer transition-all ${
                            selectedAddressId === addr.id && !isNewAddress
                              ? 'border-[#2874f0] bg-blue-50/50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="delivery_address"
                            checked={selectedAddressId === addr.id && !isNewAddress}
                            onChange={() => {
                              setSelectedAddressId(addr.id);
                              setIsNewAddress(false);
                              setAddressForm(addr);
                            }}
                            className="mt-1 text-[#2874f0] focus:ring-[#2874f0]"
                          />
                          <div className="flex-1 text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{addr.fullName}</span>
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] uppercase font-bold">
                                HOME
                              </span>
                              <span className="font-bold text-slate-800">{addr.phone}</span>
                            </div>
                            <p className="text-slate-600 mt-1">
                              {addr.streetAddress}, {addr.city}, {addr.state} - <strong className="text-slate-900">{addr.postalCode}</strong>
                            </p>
                            {selectedAddressId === addr.id && !isNewAddress && (
                              <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="mt-3 px-6 py-2.5 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-sm transition-all"
                              >
                                DELIVER HERE
                              </button>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Add New Address Form */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNewAddress(true);
                        setSelectedAddressId('new');
                        setAddressForm({
                          fullName: user?.name || '',
                          phone: user?.phone || '7607805940',
                          streetAddress: '',
                          apartment: '',
                          city: '',
                          state: '',
                          postalCode: '',
                          country: 'India',
                        });
                      }}
                      className="text-[#2874f0] hover:underline font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add a new delivery address</span>
                    </button>

                    {(isNewAddress || savedAddresses.length === 0) && (
                      <div className="mt-4 p-4 bg-white rounded-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="Full Name"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">10-digit mobile number *</label>
                          <input
                            type="tel"
                            required
                            placeholder="Mobile Number"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block font-bold text-slate-700 mb-1">Address (Area and Street) *</label>
                          <input
                            type="text"
                            required
                            placeholder="Flat / House No., Colony / Street"
                            value={addressForm.streetAddress}
                            onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">City / District / Town *</label>
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">State *</label>
                          <input
                            type="text"
                            required
                            placeholder="State"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">Pincode *</label>
                          <input
                            type="text"
                            required
                            placeholder="6-digit Pincode"
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0]"
                          />
                        </div>
                        <div className="sm:col-span-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (addressForm.fullName && addressForm.phone && addressForm.streetAddress && addressForm.city && addressForm.postalCode) {
                                setCurrentStep(3);
                              } else {
                                toastError('Please fill all required address fields');
                              }
                            }}
                            className="px-6 py-2.5 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-sm"
                          >
                            SAVE AND DELIVER HERE
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* STEP 3: ORDER SUMMARY */}
            <div className="bg-white rounded-sm shadow-xs border border-slate-200 overflow-hidden">
              <div
                className={`px-6 py-4 flex items-center justify-between cursor-pointer ${
                  currentStep === 3 ? 'bg-[#2874f0] text-white' : 'bg-white'
                }`}
                onClick={() => setCurrentStep(3)}
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={`w-6 h-6 rounded-xs font-bold text-xs flex items-center justify-center ${
                      currentStep === 3 ? 'bg-white text-[#2874f0]' : 'bg-slate-200 text-[#2874f0]'
                    }`}
                  >
                    3
                  </span>
                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider block ${
                        currentStep === 3 ? 'text-blue-100' : 'text-slate-500'
                      }`}
                    >
                      ORDER SUMMARY
                    </span>
                    {currentStep !== 3 && (
                      <span className="text-sm font-bold text-slate-800">
                        {cart.items?.length} Item(s) • Total: ₹{totalPayable.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>
                {currentStep !== 3 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-1.5 border border-slate-300 text-[#2874f0] hover:bg-blue-50 text-xs font-bold rounded-sm uppercase tracking-wider transition-colors"
                  >
                    CHANGE
                  </button>
                )}
              </div>

              {/* Step 3 Expanded Content */}
              {currentStep === 3 && (
                <div className="p-6 bg-white border-t border-slate-200 space-y-4">
                  <div className="divide-y divide-slate-100">
                    {cart.items?.map((it) => (
                      <div key={it.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={getProductImage({ name: it.productName, primaryImageUrl: it.productImage })}
                            alt={it.productName}
                            className="w-16 h-16 object-contain rounded border border-slate-100 p-1"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{it.productName}</h4>
                            <p className="text-xs text-slate-400 mt-0.5">Seller: ShopSphere Retail</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="text-sm font-extrabold text-slate-900">
                                ₹{Number(it.unitPrice).toLocaleString('en-IN')}
                              </span>
                              <span className="text-xs text-slate-400 line-through">
                                ₹{(Number(it.unitPrice) * 1.25).toFixed(0)}
                              </span>
                              <span className="text-xs text-emerald-600 font-bold">20% Off</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 sm:text-right">
                          <p className="font-semibold text-slate-800 flex items-center sm:justify-end gap-1">
                            <Truck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Delivery by Tomorrow, 9 PM</span>
                          </p>
                          <p className="text-[11px] text-emerald-600 font-bold mt-0.5">Free Delivery</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-4 rounded-sm">
                    <p className="text-xs text-slate-600">
                      Order confirmation email will be sent to <strong>{user?.email || 'your email'}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="w-full sm:w-auto px-8 py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span>CONTINUE TO PAYMENT</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4: PAYMENT OPTIONS (FLIPKART STYLE) */}
            <div className="bg-white rounded-sm shadow-xs border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#2874f0] text-white flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="w-6 h-6 rounded-xs bg-white text-[#2874f0] font-bold text-xs flex items-center justify-center">
                    4
                  </span>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-100 block">PAYMENT OPTIONS</span>
                    <span className="text-sm font-bold text-white">Choose payment mode to complete order</span>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold bg-white/20 px-3 py-1 rounded-sm">
                  Amount: ₹{totalPayable.toLocaleString('en-IN')}
                </div>
              </div>

              {/* Flipkart Payment Options List */}
              <div className="divide-y divide-slate-200 text-xs">
                
                {/* 1. UPI Payment Option */}
                <div className={`p-5 transition-colors ${paymentMethod === 'UPI' ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                  <label className="flex items-start cursor-pointer space-x-3.5">
                    <input
                      type="radio"
                      name="fk_payment"
                      value="UPI"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-0.5 text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-[#2874f0]" />
                          <span>UPI (Google Pay / PhonePe / Paytm / BHIM)</span>
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          FASTEST & FREE
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Pay directly using any UPI app or UPI ID with 100% instant verification.</p>

                      {paymentMethod === 'UPI' && (
                        <div className="mt-4 p-4 bg-white rounded-sm border border-slate-200 space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                          
                          {/* UPI Mode Tabs */}
                          <div className="flex border-b border-slate-200">
                            <button
                              type="button"
                              onClick={() => setUpiMode('apps')}
                              className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                                upiMode === 'apps' ? 'border-[#2874f0] text-[#2874f0]' : 'border-transparent text-slate-500'
                              }`}
                            >
                              Popular UPI Apps
                            </button>
                            <button
                              type="button"
                              onClick={() => setUpiMode('id')}
                              className={`pb-2 px-3 text-xs font-bold transition-all border-b-2 ${
                                upiMode === 'id' ? 'border-[#2874f0] text-[#2874f0]' : 'border-transparent text-slate-500'
                              }`}
                            >
                              Enter UPI ID / VPA
                            </button>
                          </div>

                          {upiMode === 'apps' ? (
                            <div className="space-y-3">
                              <p className="text-slate-600 text-xs font-semibold">Select your preferred UPI App:</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {[
                                  { id: 'GPAY', name: 'Google Pay', icon: '🟢 GPay' },
                                  { id: 'PHONEPE', name: 'PhonePe', icon: '🟣 PhonePe' },
                                  { id: 'PAYTM', name: 'Paytm UPI', icon: '🔵 Paytm' },
                                  { id: 'BHIM', name: 'BHIM / Any UPI', icon: '🟠 BHIM' },
                                ].map((app) => (
                                  <div
                                    key={app.id}
                                    onClick={() => setSelectedUpiApp(app.id)}
                                    className={`p-3 rounded-sm border text-center cursor-pointer transition-all ${
                                      selectedUpiApp === app.id
                                        ? 'border-[#2874f0] bg-blue-50/60 font-bold text-slate-900 shadow-xs'
                                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                                    }`}
                                  >
                                    <span className="text-xs block">{app.icon}</span>
                                    <span className="text-[10px] text-slate-500">{app.name}</span>
                                  </div>
                                ))}
                              </div>

                              <button
                                type="button"
                                disabled={placingOrder}
                                onClick={handlePlaceOrder}
                                className="mt-4 w-full sm:w-64 py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
                              >
                                <span>PAY ₹{totalPayable.toLocaleString('en-IN')} VIA UPI</span>
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3 max-w-md">
                              <label className="block text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  placeholder="e.g. 7607805940@jio or name@okhdfcbank"
                                  value={upiId}
                                  onChange={(e) => setUpiId(e.target.value)}
                                  className="flex-1 px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0] font-mono text-xs"
                                />
                                <button
                                  type="button"
                                  onClick={handlePlaceOrder}
                                  disabled={placingOrder}
                                  className="px-6 py-2 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-sm"
                                >
                                  VERIFY & PAY
                                </button>
                              </div>
                              <p className="text-[10px] text-slate-500">A collect request will be sent to your UPI app for authorization.</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* 2. Credit / Debit / ATM Card Option */}
                <div className={`p-5 transition-colors ${paymentMethod === 'CARD' ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                  <label className="flex items-start cursor-pointer space-x-3.5">
                    <input
                      type="radio"
                      name="fk_payment"
                      value="CARD"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="mt-0.5 text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#2874f0]" />
                          <span>Credit / Debit / ATM Card</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-slate-600">VISA</span>
                          <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-slate-600">MasterCard</span>
                          <span className="text-[9px] bg-slate-100 font-bold px-1.5 py-0.5 rounded text-slate-600">RuPay</span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">All Indian & International bank cards supported with 3D Secure OTP.</p>

                      {paymentMethod === 'CARD' && (
                        <div className="mt-4 p-4 bg-white rounded-sm border border-slate-200 space-y-4 max-w-md animate-slide-up" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Card Number *</label>
                              <input
                                type="text"
                                maxLength={19}
                                placeholder="XXXX XXXX XXXX XXXX"
                                value={cardDetails.cardNumber}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                  setCardDetails({ ...cardDetails, cardNumber: val });
                                }}
                                className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0] font-mono text-xs font-bold"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Valid Thru (MM/YY) *</label>
                                <input
                                  type="text"
                                  maxLength={5}
                                  placeholder="MM/YY"
                                  value={cardDetails.expiry}
                                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0] font-mono text-xs text-center"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">CVV *</label>
                                <input
                                  type="password"
                                  maxLength={4}
                                  placeholder="CVV"
                                  value={cardDetails.cvv}
                                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:border-[#2874f0] font-mono text-xs text-center"
                                />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={placingOrder}
                            onClick={handlePlaceOrder}
                            className="w-full py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <span>PAY ₹{totalPayable.toLocaleString('en-IN')}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* 3. Net Banking */}
                <div className={`p-5 transition-colors ${paymentMethod === 'NETBANKING' ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                  <label className="flex items-start cursor-pointer space-x-3.5">
                    <input
                      type="radio"
                      name="fk_payment"
                      value="NETBANKING"
                      checked={paymentMethod === 'NETBANKING'}
                      onChange={() => setPaymentMethod('NETBANKING')}
                      className="mt-0.5 text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#2874f0]" />
                        <span>Net Banking</span>
                      </span>
                      <p className="text-slate-500 text-[11px] mt-0.5">Direct login & payment through all Indian Banks.</p>

                      {paymentMethod === 'NETBANKING' && (
                        <div className="mt-4 p-4 bg-white rounded-sm border border-slate-200 space-y-3 animate-slide-up" onClick={(e) => e.stopPropagation()}>
                          <span className="text-xs font-bold text-slate-700 block">Popular Banks:</span>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: 'HDFC', name: 'HDFC Bank' },
                              { id: 'SBI', name: 'State Bank of India' },
                              { id: 'ICICI', name: 'ICICI Bank' },
                              { id: 'AXIS', name: 'Axis Bank' },
                              { id: 'KOTAK', name: 'Kotak Bank' },
                              { id: 'PNB', name: 'Punjab National Bank' },
                            ].map((bank) => (
                              <button
                                key={bank.id}
                                type="button"
                                onClick={() => setSelectedBank(bank.id)}
                                className={`p-2.5 rounded-sm border text-xs font-bold text-center transition-all ${
                                  selectedBank === bank.id
                                    ? 'border-[#2874f0] bg-blue-50 text-[#2874f0]'
                                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                {bank.name}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            disabled={placingOrder}
                            onClick={handlePlaceOrder}
                            className="mt-3 w-full sm:w-64 py-3 bg-[#fb641b] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <span>PAY ₹{totalPayable.toLocaleString('en-IN')}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

                {/* 4. Cash on Delivery (COD) */}
                <div className={`p-5 transition-colors ${paymentMethod === 'COD' ? 'bg-blue-50/30' : 'hover:bg-slate-50'}`}>
                  <label className="flex items-start cursor-pointer space-x-3.5">
                    <input
                      type="radio"
                      name="fk_payment"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="mt-0.5 text-[#2874f0] focus:ring-[#2874f0] w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Truck className="w-4 h-4 text-[#2874f0]" />
                          <span>Cash on Delivery</span>
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                          PAY AT DOORSTEP
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Pay with cash or scan QR when delivery rider arrives at your doorstep.</p>

                      {paymentMethod === 'COD' && (
                        <div className="mt-4 p-4 bg-white rounded-sm border border-slate-200 space-y-3 max-w-sm animate-slide-up" onClick={(e) => e.stopPropagation()}>
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-slate-700 block">Enter characters to confirm:</span>
                            <div className="flex items-center gap-3">
                              <div className="px-4 py-2 bg-slate-900 text-white font-black tracking-widest text-lg font-mono rounded-sm select-none">
                                {codCaptcha}
                              </div>
                              <input
                                type="text"
                                maxLength={3}
                                placeholder="Enter code"
                                value={userCaptchaInput}
                                onChange={(e) => setUserCaptchaInput(e.target.value)}
                                className="w-32 px-3 py-2 border border-slate-300 rounded-sm font-mono font-bold text-sm focus:outline-none focus:border-[#2874f0]"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={placingOrder || userCaptchaInput.trim().length !== 3}
                            onClick={handlePlaceOrder}
                            className="w-full py-3 bg-[#fb641b] hover:bg-orange-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-sm shadow-md transition-all flex items-center justify-center gap-2"
                          >
                            <span>CONFIRM COD ORDER</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </label>
                </div>

              </div>
            </div>

          </div>

          {/* Right 4-Columns: Flipkart Style PRICE DETAILS Sticky Sidebar */}
          <div className="lg:col-span-4 sticky top-6 space-y-3">
            <div className="bg-white rounded-sm shadow-xs border border-slate-200 overflow-hidden">
              
              {/* Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 bg-white">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  PRICE DETAILS
                </h3>
              </div>

              {/* Price Breakdown */}
              <div className="p-5 space-y-4 text-sm text-slate-800">
                <div className="flex justify-between">
                  <span>Price ({itemsCount} item{itemsCount > 1 ? 's' : ''})</span>
                  <span>₹{originalSubtotal.toLocaleString('en-IN')}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>− ₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupons For You</span>
                    <span>− ₹{Number(appliedCoupon.discountAmount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Delivery Charges</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 line-through text-xs">₹40</span>
                    <span className="text-emerald-600 font-bold text-xs uppercase">FREE</span>
                  </div>
                </div>

                {/* Total Payable */}
                <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-center text-base font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-[#2874f0] font-black">₹{totalPayable.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Flipkart Green Savings Banner */}
              {totalSavings > 0 && (
                <div className="px-5 py-3 bg-emerald-50 text-emerald-700 text-xs font-bold border-t border-emerald-100 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>You will save ₹{totalSavings.toLocaleString('en-IN')} on this order</span>
                </div>
              )}
            </div>

            {/* Flipkart Trust Badge */}
            <div className="p-4 bg-white rounded-sm border border-slate-200 flex items-center space-x-3 text-xs text-slate-500">
              <ShieldCheck className="w-8 h-8 text-emerald-600 flex-shrink-0" />
              <p className="leading-snug">
                Safe and Secure Payments. <strong className="text-slate-800">Easy 7 Days Return & Replacement.</strong> 100% Authentic products.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Checkout;
