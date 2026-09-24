# ShopSphere Production Deployment & Infrastructure Guide

This guide details the production deployment, infrastructure architecture, Redis caching, cloud storage, database backup, observability, and checklist for **ShopSphere**.

---

## 1. Production Architecture Overview

```text
                           Internet / Client
                                  │
                                HTTPS (Port 443)
                                  ▼
               ┌─────────────────────────────────────┐
               │  Edge SSL / CDN / Reverse Proxy     │
               │  (Cloudflare / AWS ALB / Nginx)     │
               └──────────────────┬──────────────────┘
                                  │ HTTP (Port 80)
                                  ▼
               ┌─────────────────────────────────────┐
               │       Nginx Reverse Proxy           │
               │  - Static Asset Delivery (Vite)     │
               │  - Security Headers & Compression   │
               │  - Routes /api/ -> backend:8080     │
               │  - Routes /uploads/ -> backend:8080 │
               └──────────────────┬──────────────────┘
                                  │ HTTP (Port 8080)
                                  ▼
               ┌─────────────────────────────────────┐
               │     Spring Boot 3.3.4 Backend       │
               │  - Stateless JWT Authentication     │
               │  - Brute-Force Rate Limiting (429)  │
               │  - Authoritative Pricing Logic      │
               │  - Atomic Stock Control             │
               │  - StorageService (Local / S3)      │
               └───┬──────────────┬──────────────┬───┘
                   │              │              │
                   ▼              ▼              ▼
           ┌──────────────┐┌──────────────┐┌──────────────┐
           │   MySQL 8    ││   Redis 7    ││  S3 / R2 /   │
           │  (Flyway DB) ││  (TTL Cache) ││ Object Store │
           └──────────────┘└──────────────┘└──────────────┘
```

---

## 2. Environment Strategy

ShopSphere supports three distinct runtime environments:

| Setting | Local Dev (Standalone) | Docker Dev / Staging | Production |
| :--- | :--- | :--- | :--- |
| **Profile** | `dev` | `prod` (containerized) | `prod` |
| **Database** | H2 file / MySQL local | MySQL 8 in Docker | Managed MySQL 8 (RDS, Cloud SQL) |
| **Schema Tool**| Hibernate / Flyway | Flyway (`ddl-auto=validate`) | Flyway (`ddl-auto=validate`) |
| **Caching** | Simple in-memory | Redis 7 in Docker | Redis 7 Cluster / ElastiCache |
| **Storage** | Local filesystem (`uploads/`) | Docker Volume (`uploads/`) | AWS S3 / Cloudflare R2 / CDN |
| **Payment** | Demo Mode (Simulated) | Demo Mode (Simulated) | Razorpay Live (HMAC-SHA256 verified) |

---

## 3. Environment Variables Reference

| Variable | Description | Default | Production Requirement |
| :--- | :--- | :--- | :--- |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | `prod` | Set to `prod` |
| `SERVER_PORT` | Backend internal HTTP port | `8080` | Required |
| `DB_HOST` | MySQL hostname | `mysql` | Fully qualified domain / IP |
| `DB_PORT` | MySQL port | `3306` | Standard 3306 |
| `DB_NAME` | Database name | `ecommerce_db` | Application DB name |
| `DB_USERNAME` | Database user | `ecommerce_user` | Least-privilege user |
| `DB_PASSWORD` | Database password | - | **MANDATORY**: Strong secret |
| `REDIS_HOST` | Redis hostname | `redis` | Cluster endpoint / container |
| `REDIS_PORT` | Redis port | `6379` | Standard 6379 |
| `REDIS_PASSWORD` | Redis auth password | - | Recommended for production |
| `JWT_SECRET` | 256-bit HMAC signing key | - | **MANDATORY**: 64+ char hex string |
| `CORS_ALLOWED_ORIGINS` | Comma-separated allowed origins | `http://localhost` | Strictly locked to domain(s) |
| `STORAGE_PROVIDER` | Media persistence mode (`local` or `s3`) | `local` | `s3` for multi-instance |
| `STORAGE_BUCKET` | S3 bucket name | - | Required if `STORAGE_PROVIDER=s3` |
| `STORAGE_REGION` | AWS / S3 region | `us-east-1` | Cloud region |
| `STORAGE_ACCESS_KEY` | S3 access key ID | - | IAM user with S3 Put/Get |
| `STORAGE_SECRET_KEY` | S3 secret access key | - | IAM secret key |
| `STORAGE_CDN_URL` | Optional CloudFront / CDN root URL | - | Accelerates static image delivery |
| `RAZORPAY_KEY_ID` | Razorpay Merchant Key ID | - | Required for live transactions |
| `RAZORPAY_KEY_SECRET` | Razorpay Merchant Key Secret | - | Required for live transactions |

---

## 4. Connection Pooling (HikariCP) Architecture

In `application-prod.properties`, HikariCP is configured as follows:
- **Maximum Pool Size**: `15`
  - *Rationale*: A single thread executes a query in <5ms. With 15 connections, the pool easily services 300+ requests/second without saturating MySQL thread pools or causing connection contention.
- **Minimum Idle Connections**: `5`
  - Keeps 5 warm connections open to immediately service incoming requests without handshake delay.
- **Connection Timeout**: `20,000ms` (20s)
  - Fails quickly if all connections are exhausted rather than hanging requests indefinitely.
- **Idle Timeout**: `300,000ms` (5 minutes)
  - Closes idle connections above the minimum threshold.
- **Max Lifetime**: `1,200,000ms` (20 minutes)
  - Periodically recycles connections to prevent MySQL server-side idle timeout disconnects.

---

## 5. Database Backup and Recovery Strategy

### Full Logical Backup
```bash
# Using POSIX script
./scripts/backup-db.sh ./backups/prod_backup_$(date +%Y%m%d).sql

# Using PowerShell (Windows)
.\scripts\backup-db.ps1 -OutputFile ".\backups\prod_backup.sql"
```

### Full Logical Restore
```bash
# Using POSIX script
./scripts/restore-db.sh ./backups/prod_backup.sql

# Using PowerShell (Windows)
.\scripts\restore-db.ps1 -InputFile ".\backups\prod_backup.sql"
```

### Recommended Retention Schedule:
1. **Daily Incremental/Snapshot**: Retained for 14 days.
2. **Weekly Full Backup**: Retained for 8 weeks off-site (e.g. AWS S3 Glacier with Object Lock).
3. **Pre-Deployment Snapshot**: Mandatory snapshot immediately prior to applying new Flyway migrations (`V3__...`).

---

## 6. Observability & Health Monitoring

### Endpoints
- **Health Check**: `GET /api/health` or `GET /actuator/health`
  - Returns HTTP 200 `{"status": "UP"}` with database and disk health.
- **Application Info**: `GET /actuator/info`
  - Returns application version, build info, and runtime metrics.

### Request Correlation & Distributed Tracing
- All HTTP requests entering the application pass through `CorrelationIdFilter`.
- If client passes `X-Request-Id`, it is preserved; otherwise a unique ID (`req_xxxxxxxxxxxx`) is generated.
- The ID is bound to SLF4J MDC (`%X{correlationId}`) and appended to every log entry, and echoed back in the response header `X-Request-Id`.
- **Zero Sensitive Data Logging**: Password hashes, JWT tokens, and payment secrets are strictly excluded from all log streams.

---

## 7. Production Deployment Checklist

Before exposing the application to public internet traffic, verify every item:

- [ ] **Production Secrets Configured**: `JWT_SECRET`, `DB_PASSWORD`, `REDIS_PASSWORD` set via environment variables.
- [ ] **MySQL Production Database Online**: Database accessible, encoding `utf8mb4`, timezone UTC.
- [ ] **Flyway Migration Validated**: `V1` and `V2` migrations executed; `spring.jpa.hibernate.ddl-auto=validate` enforced.
- [ ] **Redis Caching Verified**: Redis cluster online with authentication enabled; graceful fallback confirmed.
- [ ] **Object Storage Configured**: S3 bucket or volume mount configured; 5MB cap and MIME validation verified.
- [ ] **HTTPS Terminated**: SSL/TLS certificate installed at reverse proxy or load balancer.
- [ ] **CORS Restricted**: `CORS_ALLOWED_ORIGINS` explicitly restricted to production storefront domain.
- [ ] **Payment Credentials Verified**: Razorpay live keys entered (or Demo Mode explicitly active for staging).
- [ ] **Database Backup Automated**: Cron job / scheduled task configured for daily `mysqldump` backups.
- [ ] **CI Pipeline Passing**: GitHub Actions workflow passing backend tests and frontend bundle build.
- [ ] **Docker Images Built**: Multi-stage Dockerfiles built without development dependencies.
- [ ] **Health Checks Working**: Docker healthchecks on MySQL, Redis, Backend, and Frontend reported `healthy`.
- [ ] **Structured Logs Verified**: Log statements include `[%X{correlationId}]`; zero credentials logged.
- [ ] **Frontend Build Verified**: `npm run build` succeeds; route-level code splitting chunks present.
- [ ] **Backend Tests Passing**: All 22 automated tests passing (`./mvnw clean test`).
- [ ] **Browser E2E Passing**: All 23 Playwright tests passing (`npx playwright test`).
- [ ] **Admin Authorization Verified**: Unprivileged users receive HTTP 403 on `/api/admin/**`.
- [ ] **Customer Authorization Verified**: Protected customer APIs require valid JWT Bearer header.
- [ ] **Error Handling Verified**: Generic JSON error responses returned without exposing stack traces or SQL.
