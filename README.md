# 🛒 ShopSphere - Full Stack E-Commerce Shopping Platform

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-JJWT_0.12-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

A complete, production-grade Full Stack E-Commerce Shopping Platform engineered for high-performance retail operations. Featuring robust Spring Boot REST APIs with Spring Security and JJWT authentication on the backend, paired with an ultra-responsive, modern React.js + Tailwind CSS storefront and comprehensive Admin Console.

Developed for the **CodeAlpha Full Stack Development Internship**.

---

## 🌟 Key Features

### 🛍️ Customer Storefront & Shopping Experience
- **Interactive Home Page**: Dynamic hero banners, category spotlight pills, flash sale countdown timers, tabbed product showcases (Featured, Trending, New Arrivals, Best Sellers), customer trust badges, and brand partner carousels.
- **Faceted Product Catalog & Smart Search**:
  - Real-time debounced search bar with live auto-complete suggestions.
  - Multi-attribute filtering: Categories, Brands, Dynamic Price Range Slider, Star Ratings (4★, 3★, 2★), In-Stock Only toggle, and Minimum Discount % filter.
  - Multi-criteria sorting (Price: Low to High, High to Low, Highest Rated, Most Popular, Newest).
  - Active filter chips with instant clear/remove.
  - Grid & List view switchers with responsive pagination.
- **Rich Product Details Page**:
  - High-resolution interactive image gallery with thumbnail picker.
  - Dynamic price calculations, discount percentage savings, and live stock indicator.
  - 1-Click "Buy Now" and "Add to Cart" flows.
  - Technical specifications matrix and structured description.
  - Verified Customer Reviews with interactive 1–5 star rating submission form.
  - Related Products recommendations carousel.
- **Cart & Wishlist Management**:
  - Persistent shopping cart synchronized across browser sessions and backend database.
  - Free delivery progress bar (dynamic calculation toward ₹500 threshold).
  - Promotional discount coupon code engine (e.g. `WELCOME10`, `FESTIVE50`).
  - Saved Wishlist with 1-click "Move to Cart" migration.
- **Multi-Product Side-by-Side Comparison**:
  - Compare up to 4 products simultaneously with detailed spec tables and direct purchase actions.
  - Floating Quick Compare drawer.
- **Streamlined Checkout & Multi-Payment Suite**:
  - Saved multi-address book with default address management.
  - **Comprehensive Active Payment Modes**:
    1. **Instant UPI / Dynamic QR Code**: Google Pay, PhonePe, Paytm, BHIM, Cred UPI + live scannable QR code generator.
    2. **Credit & Debit Cards**: Visa, MasterCard, RuPay, Amex with live 3D-styled interactive card preview and 3D Secure tokenization.
    3. **Net Banking**: Instant fast-banks (SBI, HDFC, ICICI, Axis, Kotak, PNB) + 40+ Indian scheduled banks selector.
    4. **Digital E-Wallets**: Amazon Pay Balance, Paytm Wallet, PhonePe Wallet, MobiKwik.
    5. **0% No-Cost EMI & Pay Later**: 3/6-month zero-interest installments and 1-click Simpl / LazyPay.
    6. **Cash on Delivery (COD)**: Doorstep cash & rider UPI verification.
  - Celebration confirmation with confetti animation and printable invoice generator.
  - Real-time visual tracking timeline (`CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`).

### 🚚 Delivery Fleet & Logistics Management
- **Rider Fleet Operations**: Full management of delivery personnel (Name, Phone, Vehicle Number, Vehicle Type [Bike, EV Scooter, Van], Operational Locality).
- **AI Smart Auto-Dispatch**: 1-click intelligent dispatch engine that analyzes customer locality, rider proximity, rating (4.8+), and fleet availability to automatically assign the optimal courier partner.
- **🏷️ Parcel Box Sticker & Shipping Label Printing (4x6 / A6)**: Printable customer address label & logistics box sticker before dispatch with scannable barcode, routing hub code, bold PREPAID / COD cash collection alert, delivery OTP prompt, and packing checklist.
- **Secure Handshake OTP**: Generates a unique 4-digit Delivery Handshake OTP for the customer to share with the rider upon package arrival.
- **Live Order Tracking Integration**: Customer tracking screen displays rider's name, phone (click-to-call), vehicle details, and active delivery OTP.

### 🤖 AI Intelligence Hub & Real-Time Cloud Telemetry
- **Storefront AI Shopping Assistant**: Floating AI concierge widget capable of understanding conversational natural language queries (English/Hinglish/Hindi) and returning matching product cards with direct purchase links.
- **Real-Time Cloud Telemetry Pulse**: Live tracking of active online shoppers, in-flight cart checkouts, server API response latency (ms), CPU load, and JVM memory allocation with auto-polling.
- **AI Predictive Demand & Restock Forecasting**: 30-day forward demand projections per category with restock recommendations and stock-out alerts.
- **Customer Review NLP Sentiment Analysis**: Analyzes review feedback with positive/neutral/negative percentage split, key praises extracted, and executive AI summary.

### 🧾 Official Tax Invoice & Payment Receipt System
- **Digital Tax Invoice Generator**: Automatic generation of official GST Tax Invoices (`INV-2026-XXXXXX`) with itemized SKU breakdown, GST calculations, store legal metadata (ShopSphere Retail India Pvt Ltd, GSTIN), and digital authorization stamp.
- **Admin Payment Verification**: Admin can inspect payment status (`PAID` / `PENDING`), view Gateway Transaction Reference IDs (`TXN-UPI-XXXXX`, `TXN-CARD-XXXXX`), and 1-click open or print official tax invoices from `/admin/orders`.
- **Customer Self-Service Invoices**: Customers can view and download/print their digital receipts directly from `/order-success` or their Profile order history (`/profile?tab=orders`).
- **Print & PDF Optimized**: Dedicated print layout styles (`window.print()`) that render a paper-ready A4 invoice sheet without browser navigation clutter.

### 🛡️ Administrative Console & Management
- **Analytics Dashboard**:
  - Real-time KPI summary cards (Total Revenue, Total Orders, Total Products, Total Users, Low Stock Alerts).
  - SVG Interactive Monthly Sales Revenue Bar Chart.
  - Order status distribution breakdown.
  - Top 5 best-selling products leaderboard.
  - Recent orders quick-view feed.
- **Product Inventory Manager**:
  - Full CRUD for products with image URLs, categorization, brand tags, price, discount, and stock.
  - Active/Inactive visibility toggle and SKU tracking.
- **Order Fulfillment Console**:
  - Order status updater with custom tracking number and courier assignment.
  - Order items and delivery destination inspector.
- **Categories & Brands Management**:
  - Add, edit, and organize taxonomy with banner images and slug indexing.
- **Customer Accounts & Security**:
  - User accounts manager with enable/disable account switch and Role changer (`ROLE_CUSTOMER` / `ROLE_ADMIN`).
- **Discount Coupons Manager**:
  - Create and configure marketing promo codes with percentage discounts, max savings caps, minimum order requirements, usage limits, and expiration dates.

---

## 🏗️ System Architecture

```
E-CommerceStore/
├── server/                                # Spring Boot 3 Backend Application
│   ├── pom.xml                           # Maven dependencies (Web, JPA, Security, JJWT, H2, MySQL)
│   ├── src/main/resources/
│   │   ├── application.properties        # Default Dev profile (H2 embedded storage + console)
│   │   ├── application-mysql.properties  # Production MySQL database profile
│   │   └── schema.sql                    # Production MySQL DDL schema
│   └── src/main/java/com/ecommerce/
│       ├── config/                       # Seed Data Initializer (DataInitializer.java)
│       ├── controller/                   # 11 REST API Controllers
│       ├── dto/                          # 23 Request / Response DTOs
│       ├── entity/                       # 14 JPA Entities & Enums
│       ├── exception/                    # Global Exception Handler & Custom Exceptions
│       ├── repository/                   # 13 Spring Data JPA Repositories
│       ├── security/                     # Spring Security 6, JJWT Filters, UserDetails
│       └── service/                      # 11 Business Logic Services
│
└── client/                                # React.js + Vite Frontend Application
    ├── package.json                      # React 18, React Router v6, Tailwind CSS, Lucide
    ├── vite.config.js                    # Dev server with proxy to :8080 backend
    ├── tailwind.config.js                # Custom design system colors, shadows & animations
    └── src/
        ├── components/
        │   ├── common/                   # StarRating, Badges, Modals, EmptyState, Skeletons
        │   ├── layout/                   # Navbar (with live search), Footer, AdminLayout
        │   └── product/                  # ProductCard, QuickViewModal, ProductFilterSidebar
        ├── context/                      # AuthContext, CartContext, WishlistContext, CompareContext
        ├── pages/                        # Home, ProductList, ProductDetail, Cart, Checkout, etc.
        │   └── admin/                    # AdminDashboard, AdminProducts, AdminOrders, etc.
        └── services/api.js               # Axios client with JWT interceptor & domain APIs
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Java**: OpenJDK 17 or higher
- **Node.js**: v18 or higher (v20+ recommended) & `npm`
- **Maven**: 3.8+ (or IDE bundled Maven)
- *(Optional)* **MySQL 8.x** (H2 embedded database runs out of the box with zero setup)

---

### 1. Launch Backend Server (Spring Boot)

```bash
# Navigate to the server folder
cd server

# Run with embedded persistent H2 database (Zero setup required)
mvn spring-boot:run
```

> **Backend URL**: `http://localhost:8080`  
> **H2 Console**: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/ecommercedb`, User: `sa`, Password: `[empty]`)

*(Optional) To run with MySQL:*
```bash
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

### 2. Launch Frontend Client (React + Vite)

```bash
# Navigate to the client folder
cd client

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

> **Frontend Storefront**: `http://localhost:5173`

---

## 🔑 Demo Accounts & Credentials

The platform is pre-seeded with realistic products, categories, active promo coupons, and ready-to-test credentials:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `ravikantsinghravi366@gmail.com` | `Admin@123` | Full Admin Console, Analytics, CRUD for Products/Orders/Coupons/Users |
| **Customer** | `customer@ecommerce.com` | `Customer@123` | Storefront Shopping, Cart, Wishlist, Checkout, Order Tracking |

*Tip: The Login page includes convenient **1-Click Demo Fill** buttons for quick testing!*

### Sample Active Coupon Codes
- `WELCOME10` — 10% instant discount (Min order ₹499)
- `SUPER20` — 20% instant discount (Min order ₹1,999)
- `FESTIVE50` — 50% discount up to ₹1,500 (Min order ₹2,999)

---

## 📡 REST API Documentation Overview

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new customer account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current authenticated user details
- `POST /api/auth/forgot-password` — Password reset request

### 📦 Products & Catalog (`/api/products`)
- `GET /api/products` — Faceted search, filtering (category, brand, price, rating, stock, discount), sorting, pagination
- `GET /api/products/{idOrSlug}` — Detailed product data
- `GET /api/products/search/suggestions?q=...` — Real-time auto-complete suggestions
- `GET /api/products/featured` — Featured products
- `GET /api/products/trending` — Trending products
- `GET /api/products/new-arrivals` — New arrivals
- `GET /api/products/best-sellers` — Best sellers
- `GET /api/products/related?category=...` — Category-related product recommendations

### 🛒 Shopping Cart (`/api/cart`)
- `GET /api/cart` — Retrieve user's active shopping cart
- `POST /api/cart/items` — Add item to cart with quantity
- `PUT /api/cart/items/{itemId}` — Update item quantity
- `DELETE /api/cart/items/{itemId}` — Remove item from cart
- `DELETE /api/cart` — Clear entire cart

### ❤️ Wishlist (`/api/wishlist`)
- `GET /api/wishlist` — Get saved items
- `POST /api/wishlist/toggle/{productId}` — Toggle item in wishlist
- `POST /api/wishlist/move-to-cart/{productId}` — Move item to shopping cart

### 🚚 Orders & Tracking (`/api/orders`)
- `POST /api/orders` — Create new order from cart with address & payment method
- `GET /api/orders` — Get authenticated user's order history
- `GET /api/orders/{id}` — Get single order details
- `GET /api/orders/track/{identifier}` — **Public** tracking by Order # or Tracking #
- `POST /api/orders/{id}/cancel` — Cancel pending order and restore inventory

### 🎟️ Coupons (`/api/coupons`)
- `GET /api/coupons/validate/{code}?orderAmount=...` — Validate promo code and calculate discount

### ⭐ Reviews (`/api/reviews`)
- `GET /api/reviews/product/{productId}` — Get verified customer reviews
- `POST /api/reviews` — Submit new review with 1–5 star rating and comment

### 📊 Admin Console (`/api/admin`)
- `GET /api/admin/dashboard` — Metric counts, monthly sales trends, order status distribution, top sellers
- `POST /api/admin/products` — Create new product
- `PUT /api/admin/products/{id}` — Update product
- `DELETE /api/admin/products/{id}` — Delete product
- `GET /api/admin/orders` — Filter all customer orders
- `PUT /api/admin/orders/{id}/status` — Update order status, tracking number & courier
- `GET /api/admin/users` — List registered customers with search
- `PUT /api/admin/users/{id}/toggle-status` — Enable / Disable user account
- `PUT /api/admin/users/{id}/role` — Change user role (`ROLE_CUSTOMER` / `ROLE_ADMIN`)
- `GET /api/admin/coupons` — List and create discount coupons

---

## 🔒 Security Best Practices Implemented
- **Stateless JWT Authentication**: Secure HMAC-SHA512 token signing with configurable expiration and authorization bearer interceptors.
- **Role-Based Access Control (RBAC)**: Fine-grained method and URL security segregating customer operations from administrative management.
- **BCrypt Password Hashing**: Cryptographic password hashing (work factor 10) for zero plaintext storage.
- **Input Validation & Sanitization**: `@Valid` bean constraints, DTO isolation, and custom exception handling preventing SQL injection and data corruption.
- **CORS Protection**: Explicitly mapped frontend origin permissions.

---

## 📜 License
This project is developed as an open-source educational and portfolio showcase for the **CodeAlpha Full Stack Web Development Internship**.
