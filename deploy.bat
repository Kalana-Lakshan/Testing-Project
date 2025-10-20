@echo off
REM MedSync Deployment Script for Windows
REM This script helps deploy the MedSync application using Docker

echo.
echo ========================================
echo    MedSync Deployment Script
echo ========================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [OK] Docker and Docker Compose are installed
echo.

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found.
    if exist .env.docker (
        echo Creating .env file from template...
        copy .env.docker .env
        echo [OK] .env file created from .env.docker
        echo.
        echo [WARNING] Please edit .env file with your configuration
        echo Press any key to open .env file in notepad...
        pause >nul
        notepad .env
    ) else (
        echo [ERROR] .env.docker template not found
        pause
        exit /b 1
    )
)

echo.
echo Select deployment option:
echo 1) Start all services (fresh start)
echo 2) Start all services (rebuild containers)
echo 3) Stop all services
echo 4) View logs
echo 5) Check status
echo 6) Backup database
echo 7) Clean up (remove containers and volumes)
echo 8) Exit
echo.

set /p choice="Enter your choice [1-8]: "

if "%choice%"=="1" goto start
if "%choice%"=="2" goto rebuild
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto status
if "%choice%"=="6" goto backup
if "%choice%"=="7" goto cleanup
if "%choice%"=="8" goto end
goto invalid

:start
echo.
echo [INFO] Starting all services...
docker-compose up -d
echo.
echo [OK] Services started successfully!
echo.
echo Access the application at:
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8000
echo.
echo View logs with: docker-compose logs -f
goto end

:rebuild
echo.
echo [INFO] Rebuilding and starting all services...
docker-compose up -d --build
echo.
echo [OK] Services rebuilt and started successfully!
echo.
echo Access the application at:
echo   Frontend: http://localhost
echo   Backend:  http://localhost:8000
goto end

:stop
echo.
echo [INFO] Stopping all services...
docker-compose down
echo [OK] Services stopped
goto end

:logs
echo.
echo [INFO] Showing logs (Ctrl+C to exit)...
docker-compose logs -f
goto end

:status
echo.
echo [INFO] Service status:
echo.
docker-compose ps
echo.
echo Container health:
docker ps --format "table {{.Names}}\t{{.Status}}"
goto end

:backup
echo.
echo [INFO] Creating database backup...
set BACKUP_FILE=backup_%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%%time:~6,2%.sql
set BACKUP_FILE=%BACKUP_FILE: =0%
docker-compose exec -T database mysqldump -u root -prootpassword Project-MedSync > %BACKUP_FILE%
echo [OK] Backup created: %BACKUP_FILE%
goto end

:cleanup
echo.
echo [WARNING] This will remove all containers and volumes (including database data)
set /p confirm="Are you sure? (yes/no): "
if /i "%confirm%"=="yes" (
    echo [INFO] Cleaning up...
    docker-compose down -v
    echo [OK] Cleanup complete
) else (
    echo Cancelled
)
goto end

:invalid
echo [ERROR] Invalid option
goto end

:end
echo.
pause
