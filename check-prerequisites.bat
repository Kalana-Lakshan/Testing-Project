@echo off
echo ========================================
echo   Docker Prerequisites Checker
echo ========================================
echo.

echo [1/4] Checking Docker Desktop...
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker Desktop is installed
    docker --version
) else (
    echo ❌ Docker Desktop is NOT installed
    echo Download from: https://www.docker.com/products/docker-desktop
    goto :end
)

echo.
echo [2/4] Checking Docker is running...
docker ps >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker is running
) else (
    echo ❌ Docker is not running
    echo Please start Docker Desktop and try again
    goto :end
)

echo.
echo [3/4] Checking docker-compose...
docker-compose --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ docker-compose is available
    docker-compose --version
) else (
    echo ❌ docker-compose is NOT available
    goto :end
)

echo.
echo [4/4] Checking Docker Hub connectivity...
timeout 3 docker pull hello-world >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker Hub is accessible
) else (
    echo ⚠️  Docker Hub is currently DOWN
    echo This will prevent building containers
    echo Check status: https://status.docker.com/
)

echo.
echo ========================================
echo   Prerequisites Check Complete
echo ========================================
echo.
echo Next step: Read BEGINNER_DOCKER_GUIDE.md
echo.

:end
pause
