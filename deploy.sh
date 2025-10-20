#!/bin/bash

# MedSync Deployment Script
# This script helps deploy the MedSync application using Docker

set -e

echo "🏥 MedSync Deployment Script"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Docker and Docker Compose are installed${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from template...${NC}"
    if [ -f .env.docker ]; then
        cp .env.docker .env
        echo -e "${GREEN}✅ .env file created from .env.docker${NC}"
        echo -e "${YELLOW}⚠️  Please edit .env file with your configuration before continuing${NC}"
        echo ""
        echo "Press Enter to edit .env file now, or Ctrl+C to exit and edit manually"
        read
        ${EDITOR:-nano} .env
    else
        echo -e "${RED}❌ .env.docker template not found${NC}"
        exit 1
    fi
fi

echo ""
echo "Select deployment option:"
echo "1) Start all services (fresh start)"
echo "2) Start all services (rebuild containers)"
echo "3) Stop all services"
echo "4) View logs"
echo "5) Check status"
echo "6) Backup database"
echo "7) Clean up (remove containers and volumes)"
echo "8) Exit"
echo ""
read -p "Enter your choice [1-8]: " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Starting all services...${NC}"
        docker-compose up -d
        echo ""
        echo -e "${GREEN}✅ Services started successfully!${NC}"
        echo ""
        echo "Access the application at:"
        echo "  Frontend: http://localhost"
        echo "  Backend:  http://localhost:8000"
        echo ""
        echo "View logs with: docker-compose logs -f"
        ;;
    2)
        echo -e "${GREEN}🔨 Rebuilding and starting all services...${NC}"
        docker-compose up -d --build
        echo ""
        echo -e "${GREEN}✅ Services rebuilt and started successfully!${NC}"
        echo ""
        echo "Access the application at:"
        echo "  Frontend: http://localhost"
        echo "  Backend:  http://localhost:8000"
        ;;
    3)
        echo -e "${YELLOW}🛑 Stopping all services...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
    4)
        echo -e "${GREEN}📋 Showing logs (Ctrl+C to exit)...${NC}"
        docker-compose logs -f
        ;;
    5)
        echo -e "${GREEN}📊 Service status:${NC}"
        echo ""
        docker-compose ps
        echo ""
        echo "Container health:"
        docker ps --format "table {{.Names}}\t{{.Status}}"
        ;;
    6)
        echo -e "${GREEN}💾 Creating database backup...${NC}"
        BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
        docker-compose exec -T database mysqldump -u root -p${DATABASE_PASSWORD:-rootpassword} Project-MedSync > "$BACKUP_FILE"
        gzip "$BACKUP_FILE"
        echo -e "${GREEN}✅ Backup created: ${BACKUP_FILE}.gz${NC}"
        ;;
    7)
        echo -e "${RED}⚠️  WARNING: This will remove all containers and volumes (including database data)${NC}"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}🗑️  Cleaning up...${NC}"
            docker-compose down -v
            echo -e "${GREEN}✅ Cleanup complete${NC}"
        else
            echo "Cancelled"
        fi
        ;;
    8)
        echo "Goodbye!"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac
