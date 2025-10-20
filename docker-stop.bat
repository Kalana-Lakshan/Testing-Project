@echo off
echo ========================================
echo   Stopping MedSync Docker Containers
echo ========================================
echo.

docker-compose down

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] All containers stopped successfully.
) else (
    echo.
    echo [ERROR] Failed to stop containers.
)

echo.
pause
