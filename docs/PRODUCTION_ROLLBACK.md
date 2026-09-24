# ShopSphere Production Rollback & Incident Recovery Plan

## 1. Overview & Strategy

This document defines the standard operating procedures for rolling back application versions, frontend static deployments, container images, and database schema states in the event of a critical production regression or outage.

### Guiding Principles:
- **Fast Mitigation First**: Triage whether reverting traffic (switching container tags or Git commit) resolves the user-facing issue before executing stateful or database-level actions.
- **Forward Migrations Over Destructive Rollbacks**: Database rollback via `DROP TABLE` or `ALTER TABLE DROP COLUMN` can cause irrecoverable data loss. Use non-destructive forward migrations (`V3__fix_regression.sql`) or point-in-time database restoration from automated backups.
- **Zero Data Loss for Orders and Financial Records**: In-flight orders, transactions, and audit trails must be preserved across rollbacks.

---

## 2. Application & Backend Rollback

### Scenario A: Containerized Cloud Deployment (Railway / Render / Docker VPS)

1. **Identify the Last Known Healthy Tag / Commit**:
   ```bash
   git log --oneline -n 5
   # Example: d24e860 was the previous stable release commit
   ```
2. **Rollback Service Image / Deployment**:
   - **Render / Railway Dashboard**:
     - Navigate to the **Backend Web Service** ➔ **Deployments** tab.
     - Locate the previous successful deployment.
     - Click **Redeploy** or **Rollback to this version**.
   - **Docker VPS / Docker Compose**:
     ```bash
     # Re-tag or check out previous stable commit
     git checkout <stable-commit-hash>
     
     # Rebuild and restart backend container gracefully
     docker compose up -d --no-deps --build backend
     
     # Verify container health
     docker compose ps backend
     docker compose logs --tail=100 backend
     ```
3. **Verify Actuator Health**:
   ```bash
   curl -i https://<production-backend-domain>/actuator/health
   # Expected: HTTP 200 {"status":"UP"}
   ```

---

## 3. Frontend Static SPA Rollback

### Scenario A: CDN / Static Hosting (Vercel / Netlify / Cloudflare Pages)

1. **Instant Atomic Rollback**:
   - Open the hosting provider console (Vercel / Cloudflare Pages / Netlify).
   - Go to **Deployments**.
   - Find the previous passing production build.
   - Click **Promote to Production** / **Rollback**. The CDN edge instantly updates within ~5 seconds with zero cache invalidation lag.

### Scenario B: Nginx Docker Container

1. **Rollback Nginx Static Container**:
   ```bash
   git checkout <stable-commit-hash>
   docker compose up -d --no-deps --build frontend
   docker compose logs --tail=50 frontend
   ```
2. **Verify Browser Delivery**:
   - Open an incognito browser window.
   - Verify `index.html` loads with previous asset hashes and executes API calls against the backend.

---

## 4. Database Rollback Strategy

Flyway strictly validates applied migrations against `flyway_schema_history` using checksums. If a migration fails or causes a regression:

### Rule 1: Never Manually Delete `flyway_schema_history` in Production
Manually editing `flyway_schema_history` causes checksum mismatch errors (`FlywayValidateException`) on subsequent boots.

### Rule 2: Forward Migration (Preferred Method)
If a column, index, or constraint introduced in migration `V_X` causes unexpected lock contention or performance degradation:
1. Create a corrective forward migration: `V<X+1>__revert_<issue>.sql`.
2. Apply standard idempotent DDL:
   ```sql
   -- Example: V3__drop_problematic_index.sql
   DROP INDEX idx_temporary_query ON products;
   ```
3. Deploy the backend with the new migration file. Flyway detects the new version and executes it without corrupting the historical checksum baseline.

### Rule 3: Point-in-Time Database Restoration (Catastrophic Data Corruption)
If unrecoverable data corruption occurred and forward migration is impossible:
1. Put application into maintenance mode (return HTTP 503 from Nginx or pause backend container).
2. Restore database from pre-deployment snapshot:
   ```bash
   # On Linux VPS:
   ./scripts/restore-db.sh ./backups/backup_PRE_DEPLOY_TIMESTAMP.sql.gz
   
   # Or on Windows host:
   .\scripts\restore-db.ps1 -BackupFilePath .\backups\backup_PRE_DEPLOY_TIMESTAMP.sql.gz
   ```
3. Verify restored tables:
   ```sql
   SELECT version, description, success FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;
   ```
4. Roll back backend code to the exact commit matching the restored schema.
5. Disable maintenance mode and resume traffic.

---

## 5. Emergency Incident Procedure (P1 Outage Checklist)

When a critical production failure is reported:

1. **Triage & Containment (0–5 Minutes)**:
   - Check `/actuator/health` to confirm whether backend is reachable.
   - Check error logs: `docker compose logs --tail=200 backend`.
   - If user accounts or financial data are at immediate risk, switch Nginx to maintenance mode:
     ```nginx
     return 503 '{"error": "Site temporarily undergoing critical maintenance. Please retry in 5 minutes."}';
     ```
2. **Execute Rollback (5–15 Minutes)**:
   - Roll back backend to previous Docker tag or Git commit.
   - Roll back frontend to previous build.
3. **Verify Baseline (15–20 Minutes)**:
   - Authenticate with demo customer account.
   - Perform read test on catalog.
   - Check database connection pool status (`HikariPool`).
4. **Post-Mortem**:
   - Collect application logs, error traces, and request correlation IDs (`X-Request-Id`).
   - Replicate the failure in local test suite with a new regression test in `server/src/test/`.
