#!/usr/bin/env bash
# ==============================================================================
# ShopSphere MySQL Restore Script
# Usage: ./scripts/restore-db.sh <backup_file.sql>
# Uses environment variables: DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
# ==============================================================================

set -euo pipefail

if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <backup_file.sql>" >&2
    exit 1
fi

INPUT_FILE="$1"

if [ ! -f "${INPUT_FILE}" ]; then
    echo "ERROR: Backup file '${INPUT_FILE}' does not exist." >&2
    exit 1
fi

DB_NAME="${DB_NAME:-ecommerce_db}"
DB_USER="${DB_USERNAME:-ecommerce_user}"

echo "=========================================="
echo " Starting ShopSphere Database Restore"
echo " Source File:     ${INPUT_FILE}"
echo " Target Database: ${DB_NAME}"
echo "=========================================="
echo "WARNING: This will overwrite data in '${DB_NAME}'."
read -p "Are you sure you want to proceed? (y/N): " -r CONFIRM
if [[ ! "${CONFIRM}" =~ ^[Yy]$ ]]; then
    echo "Restore aborted by user."
    exit 0
fi

if command -v docker &> /dev/null && docker ps --format '{{.Names}}' | grep -q "^shopsphere-mysql$"; then
    echo "Restoring into active Docker container 'shopsphere-mysql'..."
    docker exec -i shopsphere-mysql mysql \
        -u "${DB_USER}" \
        -p"${DB_PASSWORD}" \
        "${DB_NAME}" < "${INPUT_FILE}"
elif command -v mysql &> /dev/null; then
    echo "Restoring via host mysql client..."
    export MYSQL_PWD="${DB_PASSWORD}"
    mysql \
        --host="${DB_HOST:-127.0.0.1}" \
        --port="${DB_PORT:-3306}" \
        --user="${DB_USER}" \
        "${DB_NAME}" < "${INPUT_FILE}"
else
    echo "ERROR: Neither docker nor mysql client was found on PATH." >&2
    exit 1
fi

echo "Database restore completed successfully from ${INPUT_FILE}!"
