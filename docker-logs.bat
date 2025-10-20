@echo off
echo ========================================
echo   MedSync Docker Logs
echo ========================================
echo.
echo Press Ctrl+C to exit logs view
echo.
timeout /t 2 > nul

docker-compose logs -f
