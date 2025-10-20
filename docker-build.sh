#!/bin/bash
# MedSync Docker Build Script
# Run this script to build and start all containers

echo "========================================="
echo "  MedSync Docker Build & Start"
echo "========================================="
echo ""

# Step 1: Check if .env exists
if [ ! -f ".env" ]; then
    echo "[INFO] Creating .env file from template..."
    cp .env.docker .env
    echo "[WARN] Please edit .env file with your secure credentials"
    echo ""
fi

# Step 2: Build all containers
echo "[INFO] Building Docker containers..."
echo "This may take 3-5 minutes on first build..."
echo ""

docker-compose build --no-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "[SUCCESS] Build completed successfully!"
    echo ""
    
    # Step 3: Start containers
    echo "[INFO] Starting containers..."
    docker-compose up -d
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "========================================="
        echo "  Build & Deployment Successful!"
        echo "========================================="
        echo ""
        echo "Frontend:  http://localhost"
        echo "Backend:   http://localhost:8000"
        echo "Database:  localhost:3308"
        echo ""
        echo "View logs: docker-compose logs -f"
        echo "Stop all:  docker-compose down"
        echo ""
        
        # Show container status
        echo "Container Status:"
        docker-compose ps
    else
        echo ""
        echo "[ERROR] Failed to start containers"
        echo "Check logs with: docker-compose logs"
    fi
else
    echo ""
    echo "[ERROR] Build failed!"
    echo "Please check the error messages above"
    echo ""
    echo "Common issues:"
    echo "1. Docker Hub unavailable - wait and retry"
    echo "2. Port conflicts - check ports 80, 8000, 3308"
    echo "3. Insufficient disk space - run: docker system prune"
fi
