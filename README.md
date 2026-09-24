# 🛒 ShopSphere — Modern Full Stack E-Commerce Platform

[![Java](https://img.shields.io/badge/Java-17%2B-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3.4-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Flyway](https://img.shields.io/badge/Flyway-Migrations-CC0200?style=for-the-badge&logo=flyway&logoColor=white)](https://flywaydb.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Redis](https://img.shields.io/badge/Redis-7.0--Alpine-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows/ci.yml)
[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-22%20Passing%20(100%25)-brightgreen?style=for-the-badge)](server/src/test/java/com/ecommerce)
[![E2E Tests](https://img.shields.io/badge/Browser%20E2E-23%20Passing%20(100%25)-brightgreen?style=for-the-badge)](client/e2e)

ShopSphere is an enterprise-grade full-stack e-commerce platform built with a high-performance **Spring Boot 3** REST API backend, **MySQL 8** with **Flyway** schema migrations, **Redis 7** distributed caching with resilient database fallback, and a responsive **React (Vite) + Tailwind CSS** storefront and administrative console.

---

## 🏛️ System Architecture

```text
                ┌─────────────────────────────────┐
                │        Customer / Admin         │
                │         Modern Browser          │
                └────────────────┬────────────────┘
                                 │
                            HTTP / HTTPS
                                 │
                ┌────────────────▼────────────────┐
                │          Nginx Proxy            │
                │  - React 18 SPA Static Assets   │
                │  - Proxies /api/ to Backend     │
                │  - Proxies /uploads/ to Backend │
                │  - HTTP Security Headers        │
                └────────────────┬────────────────┘
                                 │
                             HTTP /api
                                 │
                ┌────────────────▼────────────────┐
                │       Spring Boot 3.3.4         │
                │  - Stateless JWT Security       │
                │  - Login Rate Limiting (429)    │
                │  - Authoritative Pricing Engine │
                │  - Request Correlation ID (MDC) │
                │  - Storage Service Abstraction  │
                └───────┬─────────────────┬───────┘
                        │                 │
            ┌───────────┴───────────┐     │
            ▼                       ▼     ▼
    ┌───────────────┐       ┌───────────────┐
    │    Redis 7    │       │    MySQL 8    │
    │  Cache Layer  │       │ RDBMS Storage │
    │ (Resilient)   │       │  (+ Flyway)   │
    └───────────────┘       └───────────────┘
```

---

## 🌐 Live Demo & Deployment Status

| Endpoint | Target URL | Production Status | Local Staging / Verified URL |
| :--- | :--- | :---: | :--- |
| **Storefront Web App** | Production Domain | `REQUIRES HOST CONFIGURATION` | `http://localhost:5173` (Dev) / `http://localhost:80` (Docker) |
| **REST API Base** | `https://api.<yourdomain>.com/api` | `REQUIRES HOST CONFIGURATION` | `http://localhost:8080/api` |
| **Actuator Health** | `https://api.<yourdomain>.com/actuator/health` | `REQUIRES HOST CONFIGURATION` | `http://localhost:8080/actuator/health` |
| **Payment Gateway** | Live Razorpay Credentials | `REQUIRES CONFIGURATION` | Simulated `DEMO / TEST PAYMENT` Flow |

*Documentation Guides:*
- **Operations & Deployment Guide**: [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md)
- **Live Deployment & Cloud Report**: [`docs/LIVE_DEPLOYMENT_REPORT.md`](docs/LIVE_DEPLOYMENT_REPORT.md)
- **Production Rollback Plan**: [`docs/PRODUCTION_ROLLBACK.md`](docs/PRODUCTION_ROLLBACK.md)
- **Test & Verification Matrix**: [`docs/PRODUCTION_TEST_REPORT.md`](docs/PRODUCTION_TEST_REPORT.md)

---

## 🌟 Key Capabilities & Technical Features

### 🛍️ Storefront & Shopping Experience
- **Faceted Catalog & Search**: Debounced live product search, dynamic multi-attribute filtering (category, brand, price slider, minimum discount, in-stock toggle), multi-criteria sorting, and responsive pagination.
- **Persistent Shopping Cart**: Cross-session synchronized shopping cart with current catalog price re-validation and stock reservation logic.
- **Wishlist & Compare**: One-click wishlist migration and side-by-side spec comparison drawer (up to 4 items).
- **Ratings & Reviews**: Verified customer product reviews with 1–5 star ratings, automated product rating recalculation, and customer/admin deletion rights.
- **Promo Coupon Engine**: Discount promo validation supporting percentage discounts, maximum savings caps, minimum order thresholds, and expiry enforcement.

### 💳 Checkout & Payment Gateway Suite
- **Hybrid Razorpay & Simulated Payment Gateway**:
  - **Live Mode**: When valid Razorpay API keys (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`) are configured, the application securely integrates with Razorpay order creation and constant-time HMAC-SHA256 signature verification (`MessageDigest.isEqual`).
  - **Simulated / Demo Mode**: In development environments without live credentials, the checkout seamlessly runs a secure simulated payment flow without dummy gateway errors.
- **Multi-Payment Options**: Credit/Debit Cards, UPI / Dynamic QR Code, Net Banking, E-Wallets, EMI / Pay Later, and Cash on Delivery (COD).
- **Official GST Tax Invoices**: Automated invoice generator (`INV-YYYY-XXXXXX`) with itemized SKU breakdown, GST calculations, and print-ready paper layout (`window.print()`).

### 🚚 Smart Logistics & Fleet Dispatch
- **Fulfillment Engine**: Multi-hub inventory allocation, nearest-locality rider selection, and stock reservation.
- **Secure Handshake OTP**: Cryptographic 4-digit OTP delivery verification shared between customer and courier partner.
- **Printable Shipping Labels**: A6/4x6 printable logistics box stickers with barcode, routing hub codes, and prepaid/COD indicators.

### 🤖 Heuristic Analytics & Telemetry
- **Storefront Shopping Assistant**: Natural language pattern matching assistant that maps conversational queries (English/Hinglish/Hindi) to catalog filters.
- **Review Sentiment Analysis**: Rule-based lexical NLP parser evaluating positive/neutral/negative sentiment ratios and keyword praise extraction.
- **Predictive Demand Alerts**: Heuristic trend analysis based on historic order velocity and stock threshold monitoring.
- **System Telemetry**: Real-time JVM memory, CPU load estimation, and active session telemetry pulse.

### 🛡️ Administrative Console
- **Executive Analytics**: KPI summary cards, aggregate SQL monthly sales trends, order status distribution, and top-selling products.
- **Product Inventory Management**: Full product CRUD with compound indexing support, stock management, and SKU tracking.
- **Order Fulfillment Console**: Order status management (`CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` / `CANCELLED`), tracking assignment, and stock restoration on cancellation.
- **User & Access Management**: Account status toggle (active/disabled) and RBAC role assignment (`ROLE_CUSTOMER`, `ROLE_ADMIN`).

---

## 🔒 Security & Industry Standards

- **Privilege Escalation Protection**: Public registration strictly enforces `ROLE_CUSTOMER` regardless of client request payloads. Role changes require administrative privilege.
- **Secure Cryptography**: Constant-time HMAC-SHA256 comparison for payment signature verification (`MessageDigest.isEqual`), eliminating timing-attack vulnerabilities.
- **Stateless Authentication**: JJWT 0.12 tokens with configurable TTL, HMAC-SHA512 signing, and Bearer token parsing.
- **Zero Plaintext Secrets**: Sensitive keys (`JWT_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, database credentials) are strictly externalized via environment variables.
- **Sanitized Error Handling**: Standardized `{ success: false, status, error, message, path, timestamp }` error responses that prevent internal stack trace and SQL schema exposure.
- **Database Indexing**: Compound and single-column indices on `Product` (`slug`, `category_id`, `brand_id`, `price`, `active`), `Order` (`user_id`, `order_number`, `order_status`, `tracking_number`), and `User` (`email`).

---

## 🚀 Deployment & Quick Start Guide

### Prerequisites
- **For Docker Deployment**: Docker Engine 24+ & Docker Compose v2 (e.g. Docker Desktop)
- **For Local Native Development**:
  - **Java**: OpenJDK 17 or higher
  - **Node.js**: v18+ (Node 20+ recommended) & `npm`
  - **Maven**: 3.8+ (Maven wrapper `mvnw` / `mvnw.cmd` included)
  - *(Optional)* **MySQL 8.x** (Embedded persistent H2 runs out of the box with zero setup)

---

### 🐳 Option A: Production-Like Docker Deployment

ShopSphere is fully containerized using multi-stage Docker builds and orchestrated via Docker Compose:

```text
Browser / Client
       ↓
  Nginx (:80)  ─── serves static React SPA assets (with client-side routing fallback)
       │
    /api/*  (reverse-proxied)
       ↓
Spring Boot Backend (:8080)
    ├── MySQL 8.0 (:3306)   (persisted in mysql_data volume)
    ├── Redis 7.0 (:6379)   (persisted in redis_data volume)
    └── Upload Storage      (persisted in backend_uploads volume)
```

#### 1. Configure Environment Variables
```bash
# Copy example configuration to .env
cp .env.example .env
```
Ensure required secrets (`JWT_SECRET`, `DB_PASSWORD`) and configurations are populated in `.env`.

#### 2. Build and Start Containers
```bash
# Build multi-stage images without cache
docker compose build --no-cache

# Start all services in detached mode
docker compose up -d
```

#### 3. Inspect Service Status & Health
```bash
# Verify all container states and health
docker compose ps

# Inspect individual service logs
docker compose logs -f backend
docker compose logs -f mysql
docker compose logs -f frontend
```

#### 4. Access the Application
- **Storefront & Admin Web App**: `http://localhost` (or configured `FRONTEND_PORT`)
- **Backend Health Check**: `http://localhost/api/health`

#### 5. Database Persistence & Teardown
MySQL data is persisted inside a named Docker volume (`mysql_data` mapped to `/var/lib/mysql`):
```bash
# Stop containers (preserves database records):
docker compose down

# Restart containers (all orders, products, and users remain intact):
docker compose up -d

# Clean teardown (destroys containers and removes database volume):
docker compose down -v
```

---

### 💻 Option B: Local Native Development Setup

#### Step 1: Environment Configuration
```bash
# Root environment configuration
cp .env.example .env

# Client environment configuration
cp client/.env.example client/.env
```

#### Step 2: Launch Backend (Spring Boot 3)
```bash
cd server

# Using Maven Wrapper (Windows):
.\mvnw.cmd spring-boot:run

# Using Maven Wrapper (Linux / macOS):
./mvnw spring-boot:run
```
- **Backend API**: `http://localhost:8080`
- **H2 Console** (Dev profile): `http://localhost:8080/h2-console`  
  *(JDBC URL: `jdbc:h2:file:./data/ecommercedb`, User: `sa`, Password: `[empty]`)*

*To launch with MySQL profile locally:*
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```

#### Step 3: Launch Frontend (React + Vite)
```bash
cd client

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
- **Storefront & Admin Portal**: `http://localhost:5173`

---

## ⚙️ Environment Variables Reference

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `DB_HOST` | `mysql` (Docker) / `localhost` | Database hostname or Docker service name |
| `DB_PORT` | `3306` | MySQL port |
| `DB_NAME` | `shopsphere` | Database schema name |
| `DB_USERNAME` | `shopsphere_user` | MySQL user |
| `DB_PASSWORD` | *(Must be set)* | MySQL password |
| `DB_ROOT_PASSWORD`| *(Must be set)* | MySQL root administrative password |
| `JWT_SECRET` | *(Must be set, 256-bit)* | HMAC signing key for JWT tokens |
| `JWT_EXPIRATION_MS`| `86400000` (24h) | Token lifespan in milliseconds |
| `RAZORPAY_KEY_ID` | `rzp_test_placeholder` | Razorpay Key ID (fallback mode if invalid) |
| `RAZORPAY_KEY_SECRET` | `rzp_secret_placeholder` | Razorpay Key Secret |
| `CORS_ALLOWED_ORIGINS`| `http://localhost,http://localhost:80,http://localhost:5173` | Allowed CORS origins |
| `FRONTEND_PORT` | `80` | Host port mapped to Nginx reverse proxy |

---

## 🗄️ Database Migrations

ShopSphere uses **Flyway** for version-controlled database migrations and schema evolution:

- **Flyway** manages database schema creation, evolution, foreign keys, indexes, and historical execution records.
- **Hibernate** is configured with `spring.jpa.hibernate.ddl-auto=validate` in production and MySQL profiles, ensuring entity-schema alignment without modifying the database at runtime.
- Migrations are stored under:
  ```text
  server/src/main/resources/db/migration/
  ```

### Migration History
| Version | Script | Description |
| :--- | :--- | :--- |
| **V1** | `V1__initial_schema.sql` | Baseline relational schema for all 19 application entities, compound indexes, and foreign keys. |

### Creating Future Migrations
To modify the schema in future phases, create a new forward SQL migration file following Flyway's versioning pattern:
```text
V2__add_product_inventory_fields.sql
V3__add_order_tracking_index.sql
```

> [!CAUTION]
> **Immutability of Applied Migrations**: Never modify or rename an already-applied migration script (`V1__initial_schema.sql`). Changing applied migrations alters Flyway checksums and causes application startup to fail with validation errors. All schema evolutions must be declared as new versioned scripts (`V2`, `V3`, etc.).

### Backup & Recovery Strategy
1. **Pre-Migration Backup**: Take an export snapshot (`mysqldump -u <user> -p <db_name> > backup.sql`) before applying new migrations to production environments.
2. **Failed Migrations**: If a migration script fails, fix the underlying SQL, repair the history record with `mvn flyway:repair` (or remove the failed row in `flyway_schema_history`), and restart.

---

## 🧪 Automated Testing Suites

### 1. Backend Automated Test Suite (JUnit 5 + Spring Boot Test)
The backend features 22 automated tests covering business logic, migration safety, and security hardening against an isolated in-memory test database.

```bash
cd server
.\mvnw.cmd test    # Windows
./mvnw test        # Linux / macOS
```

#### Test Coverage Highlights (22 Tests Passing):
- **`AuthServiceTest`**: Customer registration role enforcement, duplicate email rejection, valid credential JWT authentication, invalid password handling, and user profile retrieval.
- **`CartServiceTest`**: Subtotal calculation, stock availability validation, quantity updates, and cart item removal.
- **`CouponServiceTest`**: Promo discount calculation, minimum order threshold validation, expired coupon rejection, and max discount capping.
- **`OrderServiceTest`**: Order placement with inventory deduction, order cancellation with stock restoration, and fulfillment warehouse reservation.
- **`ProductServiceTest`**: Catalog creation, slug resolution, multi-filter criteria queries (category, price range, keyword search).
- **`FlywayMigrationValidationTest`**: Migration discovery, clean schema deployment, and checksum validation.
- **`SecurityHardeningTest`**: Sliding-window brute force login rate limiting (HTTP 429 lockout), BCrypt hash verification, CustomAccessDeniedHandler HTTP 403 JSON payloads, and atomic stock decrement race condition prevention.

### 2. Browser End-to-End Test Suite (Playwright Headless Chromium)
The frontend includes a full real-browser integration suite validating all critical customer and administrative flows from the user interface down to the backend.

```bash
cd client
npx playwright test
```

#### E2E Flow Coverage (23 Tests Passing):
- **`01-auth.spec.js`**: Customer registration, invalid credential feedback, and session persistence across reload.
- **`02-catalog.spec.js`**: Catalog browsing, real-time keyword search, category filtering, price sorting, and pagination.
- **`03-details-cart-wishlist.spec.js`**: Product details, thumbnail gallery, wishlist toggling, comparison matrix, and cart mutations.
- **`04-checkout-order.spec.js`**: Address selection, coupon application, simulated Demo Payment checkout, and order confirmation.
- **`05-admin.spec.js`**: Dashboard analytics KPI cards, product catalog management, order processing, and customer table rendering.
- **`06-security.spec.js`**: Customer blocked from `/admin` (HTTP 403), unauthenticated checkout redirect, unauthenticated API rejection (HTTP 401), and password hash omission in API responses.
- **`07-responsive.spec.js`**: Cross-device viewport verification across Desktop (1920x1080), Tablet (1024x768), and Mobile (390x844).

---

## 🔑 Pre-Seeded Demo Credentials

> [!NOTE]
> **DEMO ENVIRONMENT NOTICE**: The accounts listed below are pre-seeded demonstration accounts for local and development evaluation only.

| Role | Email | Password | Scope |
| :--- | :--- | :--- | :--- |
| **Administrator** | `ravikantsinghravi366@gmail.com` | `Admin@123` | Full Admin Console, Analytics, Product/Order/User Management |
| **Store Manager** | `manager.ravi@ecommerce.com` | `Manager@123` | Fulfillment, Logistics & Dispatch Operations |
| **Vendor** | `vendor.ravi@ecommerce.com` | `Vendor@123` | Inventory & Catalog Oversight |
| **Customer** | `customer@ecommerce.com` | `Customer@123` | Storefront Shopping, Cart, Wishlist, Checkout & Tracking |

*Tip: The Storefront Login modal contains convenient **1-Click Demo Fill** buttons for instant access.*

### Sample Active Coupon Codes:
- `WELCOME10` — 10% discount on orders above ₹499
- `SUPER20` — 20% discount on orders above ₹1,999
- `FESTIVE50` — 50% discount (up to ₹1,500) on orders above ₹2,999

---

## 📡 REST API Reference Overview

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new customer account (`ROLE_CUSTOMER` enforced) | Public |
| `POST` | `/api/auth/login` | Authenticate credentials and receive Bearer JWT | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |
| `POST` | `/api/auth/forgot-password` | Initiate password reset | Public |

### 📦 Catalog & Products (`/api/products`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Faceted search, filtering, sorting, and pagination | Public |
| `GET` | `/api/products/{idOrSlug}` | Get detailed product by numeric ID or URL slug | Public |
| `GET` | `/api/products/search/suggestions` | Live search keyword auto-complete suggestions | Public |
| `GET` | `/api/products/featured` | Retrieve featured products showcase | Public |

### 🛒 Cart & Wishlist (`/api/cart`, `/api/wishlist`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | Get current user's synchronized cart | Authenticated |
| `POST` | `/api/cart/items` | Add item with quantity to cart | Authenticated |
| `PUT` | `/api/cart/items/{id}` | Update cart item quantity | Authenticated |
| `DELETE` | `/api/cart/items/{id}` | Remove item from cart | Authenticated |
| `POST` | `/api/wishlist/toggle/{productId}` | Toggle item in user's wishlist | Authenticated |
| `POST` | `/api/wishlist/move-to-cart/{productId}`| Move wishlist item into active cart | Authenticated |

### 🚚 Orders & Fulfillment (`/api/orders`, `/api/coupons`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Place order with live price revalidation and stock reservation | Authenticated |
| `GET` | `/api/orders` | Customer order history list | Authenticated |
| `GET` | `/api/orders/{id}` | Detailed order metadata and items | Authenticated |
| `GET` | `/api/orders/track/{identifier}` | Public order tracking by order # or tracking # | Public |
| `POST` | `/api/orders/{id}/cancel` | Cancel order and restore product inventory | Authenticated |
| `GET` | `/api/coupons/validate/{code}` | Validate coupon code against order subtotal | Public |

### ⭐ Customer Reviews (`/api/reviews`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/reviews/product/{productId}` | Retrieve verified product reviews | Public |
| `POST` | `/api/reviews` | Submit product review & rating (1–5 stars) | Authenticated |
| `DELETE` | `/api/reviews/{id}` | Delete review (Author or Admin only) | Authenticated |

### 📊 Administrative Console (`/api/admin`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/dashboard` | Aggregated sales metrics, charts, and KPI summary | Admin |
| `POST` | `/api/admin/products` | Create catalog product | Admin |
| `PUT` | `/api/admin/products/{id}` | Update product specifications and stock | Admin |
| `DELETE`| `/api/admin/products/{id}` | Delete product | Admin |
| `GET` | `/api/admin/orders` | Filter and manage all customer orders | Admin |
| `PUT` | `/api/admin/orders/{id}/status` | Update fulfillment state, tracking #, and courier | Admin |
| `PUT` | `/api/admin/users/{id}/role` | Modify user privileges (`ROLE_CUSTOMER` / `ROLE_ADMIN`) | Admin |
| `PUT` | `/api/admin/users/{id}/toggle-status` | Suspend or activate customer account | Admin |

---

## 📜 License
Developed as an open-source educational and portfolio showcase for the **CodeAlpha Full Stack Web Development Internship**.
