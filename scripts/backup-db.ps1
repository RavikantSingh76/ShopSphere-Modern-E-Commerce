<#
.SYNOPSIS
    ShopSphere MySQL Database Backup Utility (PowerShell)
.DESCRIPTION
    Creates a full SQL logical backup of the ShopSphere MySQL database.
    Supports either a running Docker container 'shopsphere-mysql' or local mysqldump.
    Uses environment variables DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD.
.EXAMPLE
    .\scripts\backup-db.ps1
    .\scripts\backup-db.ps1 -OutputFile "C:\backups\custom_backup.sql"
#>

param (
    [string]$OutputFile = ""
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir = if ($env:BACKUP_DIR) { $env:BACKUP_DIR } else { ".\backups" }

if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

if ([string]::IsNullOrWhiteSpace($OutputFile)) {
    $OutputFile = Join-Path $backupDir "shopsphere_backup_$timestamp.sql"
}

$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "ecommerce_db" }
$dbUser = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "ecommerce_user" }
$dbPass = $env:DB_PASSWORD

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " Starting ShopSphere Database Backup" -ForegroundColor Cyan
Write-Host " Target Database: $dbName"
Write-Host " Output File:     $OutputFile"
Write-Host "=========================================="

# Check if Docker container is available
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerInstalled) {
    $runningContainers = docker ps --format "{{.Names}}" 2>$null
    if ($runningContainers -contains "shopsphere-mysql") {
        Write-Host "Dumping from Docker container 'shopsphere-mysql'..." -ForegroundColor Green
        docker exec shopsphere-mysql mysqldump `
            --single-transaction `
            --quick `
            --routines `
            --triggers `
            -u $dbUser `
            "-p$dbPass" `
            $dbName | Out-File -FilePath $OutputFile -Encoding utf8
        Write-Host "Backup completed successfully! Saved to: $OutputFile" -ForegroundColor Green
        exit 0
    }
}

# Fallback to local mysqldump
$mysqldumpInstalled = Get-Command mysqldump -ErrorAction SilentlyContinue
if ($mysqldumpInstalled) {
    Write-Host "Dumping via local mysqldump..." -ForegroundColor Green
    $dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "127.0.0.1" }
    $dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "3306" }

    $env:MYSQL_PWD = $dbPass
    & mysqldump `
        --host=$dbHost `
        --port=$dbPort `
        --user=$dbUser `
        --single-transaction `
        --quick `
        --routines `
        --triggers `
        $dbName | Out-File -FilePath $OutputFile -Encoding utf8
    Write-Host "Backup completed successfully! Saved to: $OutputFile" -ForegroundColor Green
    exit 0
}

Write-Error "Neither Docker nor mysqldump was found on system PATH. Please ensure MySQL client tools or Docker are installed."
