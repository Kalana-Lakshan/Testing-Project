@echo off
REM MedSync Docker Build Script for Windows
REM Run this script to build and start all containers

echo =========================================
echo   MedSync Docker Build ^& Start
echo =========================================
echo.

REM Step 1: Check if .env exists
if not exist ".env" (
    echo [INFO] Creating .env file from template...
    copy .env.docker .env
    echo [WARN] Please edit .env file with your secure credentials
    echo.
    echo Press any key to edit .env now or close to skip...
    pause > nul
    notepad .env
    echo.
)

REM Step 2: Build all containers
echo [INFO] Building Docker containers...
echo This may take 3-5 minutes on first build...
echo.

docker-compose build --no-cache

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Build completed successfully!
    echo.
    
    REM Step 3: Start containers
    echo [INFO] Starting containers...
    docker-compose up -d
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo =========================================
        echo   Build ^& Deployment Successful!
        echo =========================================
        echo.
        echo Frontend:  http://localhost
        echo Backend:   http://localhost:8000
        echo Database:  localhost:3308
        echo.
        echo View logs: docker-compose logs -f
        echo Stop all:  docker-compose down
        echo.
        
        REM Show container status
        echo Container Status:
        docker-compose ps
    ) else (
        echo.
        echo [ERROR] Failed to start containers
        echo Check logs with: docker-compose logs
    )
) else (
    echo.
    echo [ERROR] Build failed!
    echo Please check the error messages above
    echo.
    echo Common issues:
    echo 1. Docker Hub unavailable - wait and retry
    echo 2. Port conflicts - check ports 80, 8000, 3308
    echo 3. Insufficient disk space - run: docker system prune
)

echo.
pause
