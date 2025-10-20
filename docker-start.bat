@echo off
echo ========================================
echo   MedSync Docker Deployment
echo ========================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [INFO] .env file not found. Creating from .env.docker...
    copy .env.docker .env
    echo [SUCCESS] .env file created. Please edit it with your configuration.
    echo.
    echo Press any key to open .env file in notepad...
    pause > nul
    notepad .env
    echo.
)

echo [INFO] Starting Docker containers...
echo.

docker-compose up -d

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Deployment Successful!
    echo ========================================
    echo.
    echo Services are starting up...
    echo.
    echo Frontend:  http://localhost
    echo Backend:   http://localhost:8000
    echo Database:  localhost:3306
    echo.
    echo To view logs: docker-compose logs -f
    echo To stop:      docker-compose down
    echo.
    echo Checking container status...
    timeout /t 5 > nul
    docker-compose ps
) else (
    echo.
    echo [ERROR] Failed to start containers.
    echo Please check Docker is running and try again.
)

echo.
pause
