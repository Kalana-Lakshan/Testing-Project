#!/bin/bash

# AWS EC2 Deployment Script for Project-MedSync
# This script helps deploy the application to AWS EC2

echo "=========================================="
echo "Project-MedSync AWS EC2 Deployment"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found!"
    echo "Please create a .env file with your configuration."
    exit 1
fi

# Prompt for EC2 public IP or domain
echo "Enter your EC2 Public IP or Domain:"
echo "Example: 13.60.206.61 or your-domain.com"
read -p "> " EC2_ADDRESS

if [ -z "$EC2_ADDRESS" ]; then
    echo "Error: EC2 address is required!"
    exit 1
fi

# Update VITE_BACKEND_URL in .env
echo ""
echo "Updating backend URL in .env file..."
if grep -q "^VITE_BACKEND_URL=" .env; then
    # Update existing line
    sed -i "s|^VITE_BACKEND_URL=.*|VITE_BACKEND_URL=http://${EC2_ADDRESS}:8000|" .env
else
    # Add new line
    echo "VITE_BACKEND_URL=http://${EC2_ADDRESS}:8000" >> .env
fi

echo "✓ Backend URL set to: http://${EC2_ADDRESS}:8000"
echo ""

# Prompt for password update
echo "=========================================="
echo "Security Configuration"
echo "=========================================="
echo ""
echo "It's recommended to change default passwords for production."
read -p "Do you want to update DATABASE_PASSWORD? (y/n): " UPDATE_DB_PASS

if [ "$UPDATE_DB_PASS" = "y" ] || [ "$UPDATE_DB_PASS" = "Y" ]; then
    read -p "Enter new database password: " DB_PASS
    sed -i "s|^DATABASE_PASSWORD=.*|DATABASE_PASSWORD=${DB_PASS}|" .env
    echo "✓ Database password updated"
fi

read -p "Do you want to update JWT_SECRET? (y/n): " UPDATE_JWT

if [ "$UPDATE_JWT" = "y" ] || [ "$UPDATE_JWT" = "Y" ]; then
    # Generate a random JWT secret
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i "s|^JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET}|" .env
    echo "✓ JWT secret updated"
fi

echo ""
echo "=========================================="
echo "Building Docker Images"
echo "=========================================="
echo ""

# Build images
docker-compose build

if [ $? -ne 0 ]; then
    echo "Error: Docker build failed!"
    exit 1
fi

echo ""
echo "=========================================="
echo "Starting Containers"
echo "=========================================="
echo ""

# Start containers
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "Error: Failed to start containers!"
    exit 1
fi

echo ""
echo "=========================================="
echo "Deployment Status"
echo "=========================================="
echo ""

# Wait for containers to start
sleep 5

# Check container status
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="
echo ""
echo "Your application should be accessible at:"
echo "  Frontend: http://${EC2_ADDRESS}"
echo "  Backend:  http://${EC2_ADDRESS}:8000"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f"
echo ""
echo "To stop:"
echo "  docker-compose stop"
echo ""
echo "⚠️  IMPORTANT: Make sure your AWS Security Group allows:"
echo "   - Port 80 (HTTP)"
echo "   - Port 8000 (Backend API)"
echo ""
