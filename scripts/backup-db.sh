#!/usr/bin/env bash
# ==============================================================================
# ShopSphere MySQL Backup Script
# Usage: ./scripts/backup-db.sh [output_file.sql]
# Uses environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
# Or dumps from running Docker container 'shopsphere-mysql'
# ==============================================================================

set -euo pipefail

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="${BACKUP_DIR:-./backups}"
mkdir -p "${BACKUP_DIR}"

OUTPUT_FILE="${1:-${BACKUP_DIR}/shopsphere_backup_${TIMESTAMP}.sql}"

DB_NAME="${DB_NAME:-ecommerce_db}"
DB_USER="${DB_USERNAME:-ecommerce_user}"

echo "=========================================="
echo " Starting ShopSphere Database Backup"
echo " Target Database: ${DB_NAME}"
echo " Output File:     ${OUTPUT_FILE}"
echo "=========================================="

if command -v docker &> /dev/null && docker ps --format '{{.Names}}' | grep -q "^shopsphere-mysql$"; then
    echo "Dumping from active Docker container 'shopsphere-mysql'..."
    docker exec shopsphere-mysql mysqldump \
        --single-transaction \
        --quick \
        --routines \
        --triggers \
        -u "${DB_USER}" \
        -p"${DB_PASSWORD}" \
        "${DB_NAME}" > "${OUTPUT_FILE}"
elif command -v mysqldump &> /dev/null; then
    echo "Dumping via host mysqldump client..."
    export MYSQL_PWD="${DB_PASSWORD}"
    mysqldump \
        --host="${DB_HOST:-127.0.0.1}" \
        --port="${DB_PORT:-3306}" \
        --user="${DB_USER}" \
        --single-transaction \
        --quick \
        --routines \
        --triggers \
        "${DB_NAME}" > "${OUTPUT_FILE}"
else
    echo "ERROR: Neither docker nor mysqldump was found on PATH." >&2
    exit 1
fi

FILE_SIZE=$(du -h "${OUTPUT_FILE}" | cut -f1)
echo "Backup successfully completed!"
echo "Snapshot size: ${FILE_SIZE}"
echo "Destination:   ${OUTPUT_FILE}"
