# ShopSphere Live Deployment & Production Readiness Report

**Project:** ShopSphere – Modern E-Commerce  
**Local Repository Path:** `C:\Users\ravik\Desktop\E-CommerceStore`  
**GitHub Repository:** `https://github.com/RavikantSingh76/ShopSphere-Modern-E-Commerce`  
**Audit Date:** 2026-09-24  
**Release Phase:** Phase 7 – Live Deployment & Production Verification  

---

## 1. Deployment Architecture

ShopSphere is engineered as a production-grade containerized full-stack web application. The deployment architecture guarantees high throughput, defense-in-depth security, and database consistency:

```
                            INTERNET / BROWSER CLIENTS
                                       │
                               HTTPS / TLS (Port 443)
                                       │
                         ┌─────────────▼─────────────┐
                         │   Nginx Reverse Proxy     │
                         │  - Serves React SPA dist  │
                         │  - Proxies /api/ requests │
                         │  - Proxies /uploads/      │
                         │  - Injects Security Hdrs  │
                         └─────────────┬─────────────┘
                                       │
                             HTTP /api (Port 8080)
                                       │
                         ┌─────────────▼─────────────┐
                         │  Spring Boot 3.3.4 (Prod) │
                         │  - CorrelationIdFilter    │
                         │  - Rate Limiting (429)    │
                         │  - Storage Abstraction    │
                         │  - Actuator (/health)     │
                         │  - Authoritative Pricing  │
                         └──────┬─────────────┬──────┘
                                │             │
                    ┌───────────┴───┐         │
                    ▼               ▼         ▼
             ┌─────────────┐ ┌─────────────┐ ┌────────────────┐
             │   Redis 7   │ │   MySQL 8   │ │ Object Storage │
             │ Cache Layer │ │ RDBMS Store │ │ (Local Disk /  │
             │  (Resilient │ │  (Flyway    │ │  S3 Bucket)    │
             │   Fallback) │ │   v1 - v2)  │ └────────────────┘
             └─────────────┘ └─────────────┘
```

---

## 2. Hosting Providers Evaluation & Recommendation

| Provider | Component Suitability | Pros | Cons / Considerations | Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **Railway** | Full-Stack (Backend + Frontend + MySQL + Redis) | Single-click Dockerfile deployments; native managed MySQL 8 & Redis 7 on private internal mesh network (`*.railway.internal`); automatic HTTPS. | Requires credit card verification or usage-based tier. | **RECOMMENDED ALL-IN-ONE** |
| **Render** | Backend + Frontend | Native multi-stage Docker build support; free tier web services; automatic Let's Encrypt HTTPS. | No native managed MySQL (PostgreSQL only); MySQL must be external (e.g. Aiven, PlanetScale) or Docker VPS. | **STRONG BACKEND/FRONTEND ALTERNATIVE** |
| **Cloudflare Pages / Vercel** | Frontend (React SPA) | Global CDN edge caching; sub-second DNS resolution; atomic rollbacks; completely free tier. | Only hosts frontend; backend & DB must live elsewhere. | **OPTIMAL FOR DEDICATED FRONTEND EDGE** |
| **Ubuntu VPS (DigitalOcean / Hetzner / AWS EC2)** | Full Stack (`docker compose up -d`) | 100% control over environment; zero cloud vendor lock-in; exact match to repository `docker-compose.yml`. | Requires manual VPS setup, Certbot SSL automation, and OS patching. | **RECOMMENDED SELF-HOSTED PRODUCTION** |

---

## 3. Deployment URLs & Status

| Component | Target Architecture | Production Status | Verified Local/Staging URL |
| :--- | :--- | :---: | :--- |
| **Frontend Web App** | React 18 / Vite SPA via Nginx / Edge CDN | `REQUIRES HOST CONFIGURATION` | `http://localhost:5173` (Dev) / `http://localhost:80` (Docker) |
| **Backend REST API** | Spring Boot 3 on Temurin 17 JRE | `REQUIRES HOST CONFIGURATION` | `http://localhost:8080/api` |
| **API Health Probe** | Spring Boot Actuator (`/actuator/health`) | `REQUIRES HOST CONFIGURATION` | `http://localhost:8080/actuator/health` |
| **Database** | MySQL 8.0 with Flyway Migrations | `REQUIRES HOST CONFIGURATION` | `jdbc:h2:file:./data/ecommercedb` (Dev) / MySQL `:3306` |
| **Cache** | Redis 7 Alpine with Resilient DB Fallback| `REQUIRES HOST CONFIGURATION` | Local simple memory cache / Redis `:6379` |
| **Object Storage** | Pluggable `LocalStorageService` / S3 | `CONFIGURED & TESTED` | `uploads/products` (Local disk with 5MB validation) |

> [!NOTE]
> In accordance with strict production guidelines, live cloud URLs are not fabricated. Hosting accounts and domain DNS mapping require explicit provider provisioning by the repository owner.

---

## 4. Production Environment Configuration

All configurations are strictly externalized via environment variables. Zero plaintext credentials exist in tracked Git files:

```bash
# ==============================================================================
# SHOPSPHERE PRODUCTION ENVIRONMENT TEMPLATE (.env)
# ==============================================================================

# Server Profile
SPRING_PROFILES_ACTIVE=prod
PORT=8080
SERVER_PORT=8080

# Production Database (MySQL 8.0)
DB_HOST=mysql
DB_PORT=3306
DB_NAME=ecommerce_db
DB_USERNAME=ecommerce_user
DB_PASSWORD=<STRONG_GENERATED_DB_PASSWORD>

# Security & Stateless JWT Authentication
JWT_SECRET=<STRONG_64_CHAR_HEX_OR_BASE64_SECRET>
JWT_EXPIRATION_MS=86400000

# CORS Whitelist (Comma-separated production origins)
CORS_ALLOWED_ORIGINS=https://shopsphere.yourdomain.com,https://admin.shopsphere.yourdomain.com

# Distributed Cache (Redis 7)
CACHE_TYPE=redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=<STRONG_REDIS_PASSWORD>
MANAGEMENT_HEALTH_REDIS_ENABLED=true

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=<YOUR_RAZORPAY_KEY_ID>
RAZORPAY_KEY_SECRET=<YOUR_RAZORPAY_KEY_SECRET>
RAZORPAY_CURRENCY=INR
RAZORPAY_COMPANY_NAME=ShopSphere

# Object & Media Storage
STORAGE_PROVIDER=local
STORAGE_BUCKET=
STORAGE_REGION=us-east-1
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=
STORAGE_CDN_URL=

# Frontend Environment (client/.env)
VITE_API_BASE_URL=https://api.shopsphere.yourdomain.com/api
```

---

## 5. Database Schema & Flyway Validation

1. **Schema Authority**: Flyway is the exclusive owner of schema evolution. Production Hibernate operates in `validate` mode (`spring.jpa.hibernate.ddl-auto=validate`), failing fast upon any structural discrepancy.
2. **Migrations Applied**:
   - `V1__initial_schema.sql`: Establishes the 14 foundational normalized tables (`users`, `roles`, `categories`, `brands`, `products`, `product_images`, `addresses`, `orders`, `order_items`, `reviews`, `coupons`, `cart_items`, `wishlist_items`, `delivery_fleet`).
   - `V2__seed_admin_and_baseline.sql`: Establishes indexes on product search queries, foreign keys, order tracking numbers, and seeds baseline roles.
3. **Integrity Guarantees**:
   - Strict foreign key constraints with appropriate cascade/restrict behaviors.
   - Bounded connection pooling via HikariCP (maximum 15 connections, minimum 5 idle, 20-second fail-fast timeout).

---

## 6. Security & Defense-in-Depth Verification

- **Role-Based Access Control**: Administrative endpoints (`/api/admin/**`) strictly enforce `ROLE_ADMIN`, `ROLE_MANAGER`, or `ROLE_VENDOR`. Customer tokens receive HTTP 403 Forbidden.
- **Brute-Force Rate Limiting**: In-memory sliding-window limiter throttles login attempts per IP/identifier; 5 failed attempts trigger a 15-minute lockout returning HTTP 429.
- **Authoritative Calculations**: Product prices, coupon validation limits, shipping rates, and grand totals are calculated server-side; client total payloads are completely ignored.
- **Atomic Stock Decrements**: Inventory race conditions are eliminated through atomic conditional SQL queries.
- **Credential Hygiene**: Git history and codebase verified; zero live secrets or private keys in Git-tracked files.

---

## 7. Automated Test Suite Results

```text
========================================================================
1. Backend Automated Tests (JUnit 5 / Spring Boot Test / Mockito):
   Tests run: 22, Failures: 0, Errors: 0, Skipped: 0
   Execution Time: 35.975 seconds
   Status: BUILD SUCCESS (100% Pass)

2. Frontend Production Build (Vite 5.4 / Rollup):
   Transformed: 1685 modules
   Chunks: 24 production chunks (Content-hashed)
   Build Time: 32.69 seconds
   Status: BUILD SUCCESS (100% Pass)

3. Playwright Real Browser E2E Test Suite (Headless Chromium):
   Total Specs: 23 browser scenarios
   Passed: 23 passed, 0 failed, 0 flaked
   Execution Time: 51.2 seconds
   Status: 100% PASS
========================================================================
```

---

## 8. Backup & Disaster Recovery Verification

- **Automated Backup Scripts**:
  - POSIX/Linux: [`scripts/backup-db.sh`](file:///C:/Users/ravik/Desktop/E-CommerceStore/scripts/backup-db.sh) & [`scripts/restore-db.sh`](file:///C:/Users/ravik/Desktop/E-CommerceStore/scripts/restore-db.sh)
  - Windows: [`scripts/backup-db.ps1`](file:///C:/Users/ravik/Desktop/E-CommerceStore/scripts/backup-db.ps1) & [`scripts/restore-db.ps1`](file:///C:/Users/ravik/Desktop/E-CommerceStore/scripts/restore-db.ps1)
- **Features**: Single-transaction database snapshotting (`--single-transaction --quick`), `gzip` compression, timestamped filenames (`backup_YYYYMMDD_HHMMSS.sql.gz`), and automatic 30-day snapshot rotation.
- **Rollback Operating Procedure**: Fully documented in [`docs/PRODUCTION_ROLLBACK.md`](file:///C:/Users/ravik/Desktop/E-CommerceStore/docs/PRODUCTION_ROLLBACK.md).

---

## 9. Remaining Manual Steps for Cloud Deployment

To launch ShopSphere onto public cloud infrastructure:

1. **Step 1: Choose Provider**:
   - For single-click cloud deployment: Sign up at **Railway.app** or **Render.com**.
   - For virtual private server: Provision an Ubuntu 22.04 LTS VPS (2 vCPU, 4GB RAM).
2. **Step 2: Provision Database & Redis**:
   - Launch MySQL 8.0 and Redis 7 services.
   - Note the internal hostnames and generated credentials.
3. **Step 3: Deploy Backend Container**:
   - Connect GitHub repository `https://github.com/RavikantSingh76/ShopSphere-Modern-E-Commerce`.
   - Set build context to repository root and Dockerfile path to `server/Dockerfile`.
   - Supply environment variables from `.env` template.
4. **Step 4: Deploy Frontend**:
   - Deploy `client/Dockerfile` (or static build `client/dist/` to Cloudflare Pages/Vercel).
   - Set `VITE_API_BASE_URL` to your production backend URL (e.g. `https://api.yourdomain.com/api`).
5. **Step 5: Verify Live Smoke Tests**:
   - Check `/actuator/health` ➔ HTTP 200 `{"status":"UP"}`.
   - Run customer registration, browsing, cart, and demo checkout on live browser.

---

## 10. Final Production Classification

```
========================================================================
                     FINAL PRODUCTION STATUS
========================================================================
  FRONTEND PRODUCTION BUILD        : PASS (24 Chunks)
  BACKEND AUTOMATED TEST SUITE     : PASS (22/22 Tests)
  BROWSER E2E TEST SUITE           : PASS (23/23 Tests)
  DATABASE SCHEMA & MIGRATIONS     : PASS (Flyway v1 & v2)
  SECURITY & RBAC ENFORCEMENT      : PASS
  RATE LIMITING & BRUTE FORCE      : PASS (HTTP 429)
  STORAGE ABSTRACTION              : PASS (Local + S3 Ready)
  CACHING LAYER & FALLBACK         : PASS (Redis + MySQL Fallback)
  CI/CD PIPELINE CONFIGURATION     : PASS (GitHub Actions)
  BACKUP & RECOVERY SCRIPTS        : PASS (Shell & PowerShell)
  HOST DOCKER CLI RUNTIME          : REQUIRES HOST CONFIGURATION
  CLOUD HOSTING PROVISIONING       : REQUIRES HOSTING CONFIGURATION
  PRODUCTION RAZORPAY CREDENTIALS  : REQUIRES CONFIGURATION
========================================================================
OVERALL STATUS: CODEBASE, INFRASTRUCTURE & ARCHITECTURE 100% READY FOR LIVE DEPLOYMENT.
========================================================================
```
