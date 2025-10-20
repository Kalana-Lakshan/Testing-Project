@echo off
REM Docker Hub availability checker for Windows
REM Run this to check if Docker Hub is back online

echo Checking Docker Hub availability...
echo.

docker pull hello-world >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker Hub is ONLINE!
    echo.
    echo You can now build your containers:
    echo   docker-compose up -d --build
    echo.
    pause
    exit /b 0
) else (
    echo ❌ Docker Hub is still OFFLINE
    echo.
    echo Please wait and try again later.
    echo Check status: https://status.docker.com/
    echo.
    echo Press any key to retry or close window to exit...
    pause >nul
    goto :EOF
)
