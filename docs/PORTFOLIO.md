# ShopSphere – Modern E-Commerce Platform

## 1. Project Title & Overview
**ShopSphere** is an industry-grade, full-stack e-commerce web platform engineered with Spring Boot 3, React 18, Vite, MySQL 8, Flyway database migrations, and Docker Compose containerization. The application delivers end-to-end shopping journeys for customers and administrative controls for store managers, backed by strict server-authoritative business logic, automated database migration, and comprehensive security hardening.

---

## 2. Problem Solved
Many e-commerce learning projects suffer from critical enterprise flaws:
- Client-side trust vulnerabilities (price tampering, negative totals, manipulated coupons).
- Concurrency bugs (race conditions leading to inventory overselling).
- Brute-force vulnerabilities on authentication endpoints.
- Tight coupling to local environments without containerization or repeatable database migrations.

ShopSphere addresses these fundamental problems by enforcing:
1. **Server-Side Authoritative Calculations**: The backend strictly recalculates product prices, discounts, subtotal, shipping, and order grand totals directly from the database, ignoring client-tampered totals.
2. **Atomic Inventory Decrements**: Database-level conditional updates (`UPDATE products SET stock_quantity = stock_quantity - :qty WHERE id = :id AND stock_quantity >= :qty`) eliminate race conditions and overselling during simultaneous checkouts.
3. **Defense-in-Depth Security**: BCrypt password hashing, stateless JWT authentication, sliding-window login brute-force rate limiting (HTTP 429), strict file upload validation with path traversal prevention, and HTTP security headers (nosniff, sameOrigin, CSP).
4. **Production-Ready Containerization & Schema Evolution**: Automated Flyway schema migrations, Dockerized multi-stage Spring Boot JAR, and Nginx reverse proxy serving the React SPA and routing `/api/` traffic.

---

## 3. Key Features

### Customer Experience
- **Authentication & Sessions**: Registration with default customer role, JWT authentication, and session persistence in browser storage.
- **Product Catalog & Discovery**: Real-time keyword search, category filtering, multi-attribute sorting (price, rating, new arrivals), and pagination.
- **Interactive Shopping Tools**: Wishlist persistence, multi-product comparison matrix, and full shopping cart lifecycle (add, update quantity, remove).
- **Checkout & Multi-Mode Payments**: Server-validated coupon application, shipping address management, and dual payment support:
  - **Razorpay Integration**: Server-side order creation and HMAC-SHA256 signature verification.
  - **Simulated Demo Payment**: A clearly labeled test payment pipeline for demonstrations without live credentials.
- **Order Management & Tracking**: Real-time order tracking with visual milestone progress bars (Pending, Confirmed, Shipped, Delivered) and customer cancellation with automated stock restoration.
- **Customer Reviews**: Verified customer product reviews and star ratings.

### Administrative Console
- **Analytics Dashboard**: Real-time overview of total revenue, orders, customers, and fulfillment statuses.
- **Product & Inventory Management**: Product creation and editing, automated image uploads with validation, and direct stock adjustment.
- **Order Processing**: Live order inspection, tracking number assignment, and status updates across fulfillment lifecycle.
- **User Administration**: Account inspection and role tracking without leaking password hashes.
- **Promotion Management**: Coupon creation with percentage/flat discounts, minimum order constraints, and validity windows.

---

## 4. Architecture & Data Flow

```
                      +-------------------+
                      | Customer / Admin  |
                      |  Modern Browser   |
                      +---------+---------+
                                |
                              HTTPS
                                |
                      +---------v---------+
                      |       Nginx       |
                      | (Port 80 Proxy /  |
                      |  React Static SPA)|
                      +---------+---------+
                                |
                             HTTP /api
                                |
                      +---------v---------+
                      | Spring Boot 3.3.4 |
                      |    (Port 8080)    |
                      |  Security + JWT   |
                      +----+---------+----+
                           |         |
              +------------+         +------------+
              |                                   |
      +-------v-------+                   +-------v-------+
      |  Redis 7 Cache|                   |  MySQL 8 RDBMS|
      | (Resilient DB |                   | Flyway v1-v2  |
      |   Fallback)   |                   |  Persistence  |
      +---------------+                   +---------------+
                           |
                  +--------v--------+
                  | Storage Service |
                  | (Local Disk /   |
                  |  S3 Compatible) |
                  +-----------------+
```

---

## 5. Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React icons, React Router DOM v6.
- **Backend**: Java 17, Spring Boot 3.3.4, Spring Security 6, Spring Data JPA / Hibernate, JJWT (Java JWT), Maven.
- **Database & Migration**: MySQL 8.x, Flyway Migration Framework, H2 in-memory (isolated test suite).
- **Infrastructure & Proxy**: Docker, Docker Compose, Nginx (Alpine), Multi-stage Docker builds.
- **Testing Suites**: JUnit 5, Spring Boot Test, Mockito, Playwright (Headless Chromium E2E).

---

## 6. Security Implementation Highlights
- **Role-Based Access Control (RBAC)**: All administrative endpoints (`/api/admin/**`) are restricted to `ROLE_ADMIN`, `ROLE_MANAGER`, or `ROLE_VENDOR`. Customer tokens attempting admin endpoints receive HTTP 403 Forbidden.
- **Brute-Force Login Rate Limiting**: In-memory sliding-window limiter tracks failed login attempts. Exceeding 5 consecutive failures triggers a 15-minute temporary lockout returning HTTP 429 Too Many Requests with a `Retry-After` header.
- **File Upload Hardening**: Multi-layer validation enforcing a 5MB size limit, MIME type whitelist (`image/jpeg`, `image/png`, `image/webp`), file extension whitelist, and canonical path traversal resolution.
- **Payment Signature Verification**: Razorpay webhooks and payment confirmations verify HMAC-SHA256 signatures before updating database payment status.
- **Credential Hygiene**: Git history and codebase audited; live credentials removed and replaced with environment variables (`${RAZORPAY_KEY_ID:}`).

---

## 7. Automated Testing & Verification
- **Backend Test Suite**: 22 automated tests covering authentication security, cart calculations, coupon constraints, order fulfillment, Flyway migrations, and security hardening (`./mvnw clean test` passing 100%).
- **Browser End-to-End Suite**: 23 Playwright browser E2E tests validating the full real browser user journey, responsive layouts across mobile/tablet/desktop, and security boundaries (`npx playwright test` passing 100%).

---

## 8. Deployment Options
- **Docker Compose (Recommended)**: Single command deployment (`docker compose up -d`) bootstrapping MySQL with healthchecks, running Flyway migrations, launching Spring Boot, and serving React via Nginx reverse proxy.
- **Standalone Runtime**: Spring Boot runnable JAR (`server-1.0.0.jar`) with external MySQL connection and Vite production build (`dist/`).

---

## 9. Resume-Ready Project Descriptions (3–4 Concise Bullets)
- **Full-Stack Architecture & API Design**: Engineered an enterprise e-commerce platform using **Spring Boot 3 (Java 17)** and **React 18 / Vite**, implementing 35+ REST API endpoints with stateless JWT authentication, role-based authorization (Customer/Admin), and global exception sanitization.
- **Relational Persistence & Migration Control**: Designed and migrated a 14-table **MySQL 8.0** relational schema using **Flyway**, enforcing declarative foreign key constraints, composite indexes, and atomic SQL inventory updates (`UPDATE ... WHERE stock >= qty`) to prevent overselling race conditions.
- **Enterprise Security Hardening**: Implemented brute-force login rate limiting (HTTP 429 sliding window), multi-factor file upload validation (5MB cap, MIME whitelist, path traversal guards), BCrypt password hashing, and authoritative server-side price/coupon recalculation.
- **Automated Verification & CI/CD**: Established comprehensive test coverage with 22 JUnit 5 backend tests and 23 Playwright browser E2E tests across mobile, tablet, and desktop viewports, containerized via multi-stage **Docker** and automated with **GitHub Actions**.

---

## 10. Live Deployment & Cloud Architecture
- **Repository**: [GitHub — ShopSphere-Modern-E-Commerce](https://github.com/RavikantSingh76/ShopSphere-Modern-E-Commerce)
- **Deployment Topology**: Containerized multi-stage Docker deployment (Spring Boot 3 + MySQL 8 + Redis 7 + Nginx React SPA) with automated Flyway database migrations and HikariCP connection pooling.
- **CI/CD Pipeline**: GitHub Actions continuous integration workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)) validating backend compilation, test suite passing, and frontend asset minification before deployment.
- **Production Status**: Tested and validated across 22 backend integration tests and 23 real-browser Playwright E2E tests. Cloud hosting ready for deployment on Railway, Render, or Ubuntu VPS with zero code modifications.
