# 🐳 Docker Build Guide for MedSync

Complete guide to build and run Docker containers for the MedSync project.

---

## 📋 Prerequisites

Before building, ensure you have:

- ✅ **Docker Desktop** installed and running
- ✅ **Docker Hub accessible** (currently down - retry later)
- ✅ At least **4GB RAM** available
- ✅ Ports **80**, **8000**, and **3308** free (we changed from 3306)

---

## 🚀 Quick Build (One Command)

### **Method 1: Build and Start (Recommended)**

```bash
# Navigate to project directory
cd Project-MedSync

# Build and start all containers
docker-compose up -d --build
```

This command will:

1. Build frontend container (React + Vite + Nginx)
2. Build backend container (Node.js + TypeScript + Express)
3. Pull MySQL 8.0 image
4. Start all containers in detached mode

**Expected build time:** 3-5 minutes (first time)

---

## 🔨 Step-by-Step Build Process

### **Step 1: Prepare Environment**

```bash
# Navigate to project
cd Project-MedSync

# Create .env file if it doesn't exist
cp .env.docker .env

# Edit .env with your configuration
notepad .env
```

**Required .env variables:**

```env
DATABASE_PASSWORD=your-secure-password
JWT_SECRET=your-long-random-secret-key-at-least-32-characters
```

### **Step 2: Build Containers**

#### **Option A: Build All Services**

```bash
docker-compose build
```

#### **Option B: Build Specific Service**

```bash
# Build only frontend
docker-compose build frontend

# Build only backend
docker-compose build backend

# Note: database uses pre-built MySQL image (no build needed)
```

#### **Option C: Build with No Cache (Fresh Build)**

```bash
docker-compose build --no-cache
```

### **Step 3: Start Containers**

```bash
# Start all services
docker-compose up -d

# Or build and start in one command
docker-compose up -d --build
```

### **Step 4: Verify Build**

```bash
# Check container status
docker-compose ps

# View build logs
docker-compose logs

# Check specific service
docker-compose logs backend
```

---

## 📦 What Gets Built

### **Frontend Container**

- **Base Image:** `node:20-alpine` (builder) + `nginx:alpine` (runtime)
- **Build Process:**
  1. Install npm dependencies
  2. Build React app with Vite
  3. Copy built files to Nginx
  4. Configure Nginx for SPA routing
- **Size:** ~80-100 MB
- **Port:** 80

**Build location:** `frontend/Dockerfile`

### **Backend Container**

- **Base Image:** `node:20-alpine`
- **Build Process:**
  1. Install npm dependencies (including tsx)
  2. Copy TypeScript source code
  3. Configure health checks
- **Runtime:** TypeScript runs directly with tsx (no compilation)
- **Size:** ~250-300 MB
- **Port:** 8000

**Build location:** `backend/Dockerfile`

### **Database Container**

- **Image:** `mysql:8.0` (pre-built, pulled from Docker Hub)
- **No build needed** - uses official MySQL image
- **Size:** ~1 GB
- **Port:** 3308 (mapped from internal 3306)

---

## 🎯 Build Commands Reference

### **Basic Build Commands**

```bash
# Build all services
docker-compose build

# Build with no cache (fresh build)
docker-compose build --no-cache

# Build specific service
docker-compose build [service-name]

# Build and start
docker-compose up -d --build

# Build with verbose output
docker-compose build --progress=plain
```

### **Rebuild After Code Changes**

```bash
# Rebuild specific service
docker-compose up -d --build frontend
docker-compose up -d --build backend

# Rebuild all services
docker-compose up -d --build

# Force recreate containers
docker-compose up -d --force-recreate
```

### **Clean Build (Start Fresh)**

```bash
# Stop and remove everything
docker-compose down -v

# Remove old images (optional)
docker rmi project-medsync-frontend project-medsync-backend

# Build fresh
docker-compose up -d --build
```

---

## 🔍 Troubleshooting Build Issues

### **Issue 1: Docker Hub Unavailable (503 Error)**

**Error:**

```
failed to fetch oauth token: 503 Service Unavailable
```

**Solutions:**

1. **Wait and Retry** - Docker Hub may be temporarily down

   ```bash
   # Test if Docker Hub is accessible
   docker pull node:20-alpine
   ```

2. **Use Cached Images** - If you built before

   ```bash
   docker images | grep node
   docker images | grep nginx
   ```

3. **Use Alternative Registry** (Advanced)
   - Modify Dockerfile to use alternative registries
   - Example: `mirror.gcr.io` or `quay.io`

### **Issue 2: Port Already in Use**

**Error:**

```
Bind for 0.0.0.0:3306 failed: port is already allocated
```

**Solution:**

```bash
# Check what's using the port
netstat -ano | findstr :3306

# Option 1: Stop the service
# Option 2: Change port in docker-compose.yml (already done - using 3308)
```

### **Issue 3: Build Fails with "No Space Left"**

**Solution:**

```bash
# Clean up Docker system
docker system prune -a

# Remove unused images
docker image prune -a

# Check disk usage
docker system df
```

### **Issue 4: npm Install Fails**

**Error in frontend or backend build**

**Solution:**

```bash
# Rebuild with no cache
docker-compose build --no-cache frontend

# Or modify Dockerfile to use --legacy-peer-deps
# (Already configured in frontend/Dockerfile)
```

### **Issue 5: Health Check Fails**

**Container shows "unhealthy" status**

**Check:**

```bash
# View container logs
docker-compose logs [service-name]

# Test health endpoint manually
curl http://localhost/health
curl http://localhost:8000/health
```

---

## 🎨 Build Optimization Tips

### **1. Faster Builds with Layer Caching**

The Dockerfiles are already optimized:

- Dependencies installed before copying source code
- Multi-stage builds for frontend (smaller final image)

### **2. Parallel Builds**

```bash
# Build services in parallel (default)
docker-compose build

# Control parallelism
docker-compose build --parallel
```

### **3. Monitor Build Progress**

```bash
# Verbose output
docker-compose build --progress=plain

# View build stats
docker images
docker system df
```

---

## 📊 Build Timeline

Typical build times on a modern machine:

| Service   | First Build   | Subsequent Builds | With Cache    |
| --------- | ------------- | ----------------- | ------------- |
| Frontend  | 2-3 min       | 1-2 min           | 10-30 sec     |
| Backend   | 1-2 min       | 30-60 sec         | 5-15 sec      |
| Database  | 30 sec (pull) | N/A (cached)      | Instant       |
| **Total** | **3-5 min**   | **2-3 min**       | **15-45 sec** |

---

## 🔄 Development Workflow

### **Making Code Changes**

1. **Edit your code** in `frontend/src/` or `backend/src/`

2. **Rebuild affected service:**

   ```bash
   # Frontend changes
   docker-compose up -d --build frontend

   # Backend changes
   docker-compose up -d --build backend
   ```

3. **View logs to verify:**
   ```bash
   docker-compose logs -f backend
   ```

### **Quick Restart (No Rebuild)**

If you only changed code and not dependencies:

```bash
# Restart service
docker-compose restart backend

# Or stop and start
docker-compose stop backend
docker-compose start backend
```

---

## ✅ Verification Checklist

After building, verify everything works:

### **1. Check Container Status**

```bash
docker-compose ps
```

Expected output:

```
NAME               STATUS
medsync-frontend   Up (healthy)
medsync-backend    Up (healthy)
medsync-db         Up (healthy)
```

### **2. Test Endpoints**

```bash
# Frontend
curl http://localhost/

# Frontend health
curl http://localhost/health

# Backend health (if implemented)
curl http://localhost:8000/health
```

### **3. Check Logs**

```bash
# All services
docker-compose logs

# Look for errors
docker-compose logs | grep -i error
```

### **4. Verify Database Connection**

```bash
# Connect to database
docker exec -it medsync-db mysql -u medsync -p

# Check database exists
SHOW DATABASES;
```

---

## 🚦 Build Status Indicators

### **Successful Build**

```
✅ Container medsync-frontend  Built
✅ Container medsync-backend   Built
✅ Container medsync-db        Pulled
```

### **Failed Build**

```
❌ ERROR [backend 3/5] RUN npm ci
```

Check error message and refer to troubleshooting section.

---

## 📝 Quick Commands Cheat Sheet

```bash
# BUILD COMMANDS
docker-compose build                    # Build all
docker-compose build --no-cache        # Fresh build
docker-compose build frontend          # Build one service
docker-compose up -d --build           # Build and start

# START/STOP
docker-compose up -d                   # Start all
docker-compose down                    # Stop all
docker-compose restart                 # Restart all

# MONITORING
docker-compose ps                      # Status
docker-compose logs -f                 # Live logs
docker-compose logs backend            # Specific logs

# CLEANUP
docker-compose down -v                 # Remove containers + volumes
docker system prune -a                 # Clean everything
docker images                          # List images

# REBUILD AFTER CHANGES
docker-compose up -d --build backend   # Rebuild backend
docker-compose up -d --build frontend  # Rebuild frontend
docker-compose up -d --build           # Rebuild all
```

---

## 🎯 Next Steps After Build

1. ✅ Verify all containers are healthy
2. 🌐 Open http://localhost in browser
3. 🔒 Update `.env` with secure credentials
4. 📊 Check application logs
5. 🧪 Test core functionality
6. 📖 Read `DOCKER_BUILD_SUCCESS.md` for details

---

## ⚠️ Current Known Issues

### **Docker Hub 503 Error**

- **Status:** Ongoing (as of build time)
- **Impact:** Cannot pull base images
- **Workaround:** Wait for Docker Hub to recover, then retry build
- **Check status:** https://status.docker.com/

### **Database Port Changed**

- **Original:** 3306
- **Current:** 3308
- **Reason:** Conflict with local MySQL
- **Impact:** Update connection strings if needed

---

## 📞 Support

If you encounter issues:

1. Check logs: `docker-compose logs [service]`
2. Verify Docker is running: `docker ps`
3. Check disk space: `docker system df`
4. Review Dockerfile for the failing service
5. Try clean build: `docker-compose build --no-cache`

---

**Last Updated:** October 20, 2025  
**Docker Compose Version:** 2.x  
**Project:** MedSync Medical Management System
