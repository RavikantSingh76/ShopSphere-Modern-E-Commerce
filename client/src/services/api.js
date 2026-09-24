import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 or standardize error responses
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid or expired
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// --- Auth APIs ---
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

// --- Product APIs ---
export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getTrending: () => api.get('/products/trending'),
  getNewArrivals: () => api.get('/products/new-arrivals'),
  getBestSellers: () => api.get('/products/best-sellers'),
  getRelated: (category, productId, limit = 4) => api.get('/products/related', { params: { category, productId, limit } }),
  getSuggestions: (query, limit = 6) => api.get('/products/suggestions', { params: { query, limit } }),
};

// --- Category & Brand APIs ---
export const categoryApi = {
  getActive: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getBySlug: (slug) => api.get(`/categories/slug/${slug}`),
};

export const brandApi = {
  getActive: () => api.get('/brands'),
  getById: (id) => api.get(`/brands/${id}`),
  getBySlug: (slug) => api.get(`/brands/slug/${slug}`),
};

// --- Cart APIs ---
export const cartApi = {
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// --- Wishlist APIs ---
export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
  toggle: (productId) => api.post(`/wishlist/toggle/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/move-to-cart/${productId}`),
};

// --- Order APIs ---
export const orderApi = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  trackOrder: (id) => api.get(`/orders/${id}/track`),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

// --- Review APIs ---
export const reviewApi = {
  getProductReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  addReview: (data) => api.post('/reviews', data),
  getUserReviews: () => api.get('/reviews/user'),
};

// --- Coupon APIs ---
export const couponApi = {
  validate: (code, amount) => api.get('/coupons/validate', { params: { code, amount } }),
};

// --- User Profile APIs ---
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
  getAddresses: () => api.get('/users/addresses'),
  addAddress: (data) => api.post('/users/addresses', data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`),
  setDefaultAddress: (id) => api.put(`/users/addresses/${id}/default`),
};

// --- Admin APIs ---
export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  purgeRandomProducts: () => api.post('/admin/purge-random-products'),
  // Products
  createProduct: (data) => api.post('/admin/products', data),
  bulkImportProducts: (data) => api.post('/admin/products/bulk-import', data),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  uploadProductImage: (formData) => api.post('/admin/products/upload-image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  // Categories
  getAllCategories: () => api.get('/admin/categories'),
  createCategory: (data) => api.post('/admin/categories', data),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  // Brands
  getAllBrands: () => api.get('/admin/brands'),
  createBrand: (data) => api.post('/admin/brands', data),
  updateBrand: (id, data) => api.put(`/admin/brands/${id}`, data),
  deleteBrand: (id) => api.delete(`/admin/brands/${id}`),
  // Orders
  getAllOrders: (params) => api.get('/admin/orders', { params }),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  // Users
  getAllUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (id) => api.get(`/admin/users/${id}/details`),
  getCustomerMetrics: () => api.get('/admin/users/metrics'),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateNotesAndTags: (id, data) => api.put(`/admin/users/${id}/notes-tags`, data),
  impersonateUser: (id) => api.post(`/admin/users/${id}/impersonate`),
  toggleUserStatus: (id, enabled) => api.put(`/admin/users/${id}/status`, { enabled }),
  changeUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  // Coupons
  getAllCoupons: () => api.get('/admin/coupons'),
  createCoupon: (data) => api.post('/admin/coupons', data),
  updateCoupon: (id, data) => api.put(`/admin/coupons/${id}`, data),
  deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
};

// --- Delivery Partner Management APIs ---
export const deliveryApi = {
  getAllPartners: () => api.get('/admin/delivery-partners'),
  getAvailablePartners: () => api.get('/admin/delivery-partners/available'),
  createPartner: (data) => api.post('/admin/delivery-partners', data),
  updatePartner: (id, data) => api.put(`/admin/delivery-partners/${id}`, data),
  deletePartner: (id) => api.delete(`/admin/delivery-partners/${id}`),
  assignOrder: (orderId, partnerId) => api.post(`/admin/delivery-partners/assign/${orderId}`, null, { params: { partnerId } }),
  aiAutoAssignOrder: (orderId) => api.post(`/admin/delivery-partners/ai-auto-assign/${orderId}`),
  aiAutoAssignAll: () => api.post('/admin/delivery-partners/ai-auto-assign-all'),
  seedFleet: () => api.post('/admin/delivery-partners/seed-fleet'),
  completeDelivery: (orderId, data) => api.post(`/admin/delivery-partners/complete/${orderId}`, data),
};

// --- AI & Real-Time Cloud Intelligence APIs ---
export const aiApi = {
  getAssistant: (prompt) => api.get('/ai/assistant', { params: { prompt } }),
  getRealTimePulse: () => api.get('/admin/ai/realtime-pulse'),
  getDemandForecast: () => api.get('/admin/ai/demand-forecast'),
  getSentimentAnalysis: () => api.get('/admin/ai/sentiment-analysis'),
};

// --- Payment Gateway APIs ---
export const paymentApi = {
  createRazorpayOrder: (amount, receipt) => api.post('/payment/razorpay/create-order', { amount, receipt }),
  verifyRazorpayPayment: (data) => api.post('/payment/razorpay/verify-payment', data),
};

// --- Multi-Warehouse & Fulfillment Inventory APIs ---
export const inventoryApi = {
  getLocations: () => api.get('/admin/inventory/locations'),
  getInventories: (params) => api.get('/admin/inventory', { params }),
  getTransactions: (params) => api.get('/admin/inventory/transactions', { params }),
  transferStock: (data) => api.post('/admin/inventory/transfer', data),
  adjustStock: (data) => api.post('/admin/inventory/adjust', data),
  pickOrder: (orderId, data) => api.post(`/admin/inventory/orders/${orderId}/pick`, data),
  packOrder: (orderId, data) => api.post(`/admin/inventory/orders/${orderId}/pack`, data),
  readyToShipOrder: (orderId, data) => api.post(`/admin/inventory/orders/${orderId}/ready-to-ship`, data),
};

export default api;
