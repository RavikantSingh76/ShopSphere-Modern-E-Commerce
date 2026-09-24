<#
.SYNOPSIS
    ShopSphere MySQL Database Restore Utility (PowerShell)
.DESCRIPTION
    Restores an existing SQL dump into the ShopSphere MySQL database.
    Supports either a running Docker container 'shopsphere-mysql' or local mysql CLI.
    Uses environment variables DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD.
.EXAMPLE
    .\scripts\restore-db.ps1 -InputFile ".\backups\shopsphere_backup_20260924_120000.sql"
#>

param (
    [Parameter(Mandatory=$true)]
    [string]$InputFile
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $InputFile)) {
    Write-Error "Backup file '$InputFile' does not exist."
}

$dbName = if ($env:DB_NAME) { $env:DB_NAME } else { "ecommerce_db" }
$dbUser = if ($env:DB_USERNAME) { $env:DB_USERNAME } else { "ecommerce_user" }
$dbPass = $env:DB_PASSWORD

Write-Host "==========================================" -ForegroundColor Yellow
Write-Host " Starting ShopSphere Database Restore" -ForegroundColor Yellow
Write-Host " Source File:     $InputFile"
Write-Host " Target Database: $dbName"
Write-Host "=========================================="
Write-Host "WARNING: This will overwrite data in '$dbName'." -ForegroundColor Red
$confirmation = Read-Host "Are you sure you want to proceed? (y/N)"
if ($confirmation -notmatch "^[Yy]$") {
    Write-Host "Restore aborted by user." -ForegroundColor Gray
    exit 0
}

# Check if Docker container is available
$dockerInstalled = Get-Command docker -ErrorAction SilentlyContinue
if ($dockerInstalled) {
    $runningContainers = docker ps --format "{{.Names}}" 2>$null
    if ($runningContainers -contains "shopsphere-mysql") {
        Write-Host "Restoring into Docker container 'shopsphere-mysql'..." -ForegroundColor Green
        Get-Content $InputFile -Raw | docker exec -i shopsphere-mysql mysql -u $dbUser "-p$dbPass" $dbName
        Write-Host "Database successfully restored from $InputFile!" -ForegroundColor Green
        exit 0
    }
}

# Fallback to local mysql CLI
$mysqlInstalled = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlInstalled) {
    Write-Host "Restoring via local mysql CLI..." -ForegroundColor Green
    $dbHost = if ($env:DB_HOST) { $env:DB_HOST } else { "127.0.0.1" }
    $dbPort = if ($env:DB_PORT) { $env:DB_PORT } else { "3306" }

    $env:MYSQL_PWD = $dbPass
    Get-Content $InputFile -Raw | & mysql --host=$dbHost --port=$dbPort --user=$dbUser $dbName
    Write-Host "Database successfully restored from $InputFile!" -ForegroundColor Green
    exit 0
}

Write-Error "Neither Docker nor mysql client was found on system PATH."
