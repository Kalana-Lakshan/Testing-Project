# 🚀 MedSync Docker Quick Start Guide

## Prerequisites

- **Docker Desktop** installed and running on Windows
- At least **4GB RAM** available
- Ports **80**, **8000**, and **3306** free

## 🎯 Quick Start (3 Steps)

### Step 1: Configure Environment

Copy the environment template:
```bash
copy .env.docker .env
```

Edit `.env` and update these critical values:
```env
DATABASE_PASSWORD=your-secure-password-here
JWT_SECRET=your-long-random-jwt-secret-key-change-this
```

### Step 2: Start Application

**Option A - Using Batch Script (Easiest):**
```bash
docker-start.bat
```

**Option B - Using Docker Compose:**
```bash
docker-compose up -d
```

### Step 3: Access Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Database**: localhost:3306

## 📋 Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database

# Or use the batch script
docker-logs.bat
```

### Check Status
```bash
docker-compose ps
```

### Stop Application
```bash
# Using batch script
docker-stop.bat

# Or using docker-compose
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build
```

## 🏗️ Project Structure

```
Project-MedSync/
├── docker-compose.yml          # Main orchestration file
├── .env.docker                 # Environment template
├── .env                        # Your configuration (create this)
├── docker-start.bat            # Quick start script
├── docker-stop.bat             # Quick stop script
├── docker-logs.bat             # View logs script
├── backend/
│   ├── Dockerfile              # Backend container config
│   ├── .dockerignore           # Files to exclude
│   └── src/
│       └── db/
│           ├── init.sql        # Database initialization
│           ├── table.sql       # Table definitions
│           └── procedures.sql  # Stored procedures
└── frontend/
    ├── Dockerfile              # Frontend container config
    ├── nginx.conf              # Web server config
    └── .dockerignore           # Files to exclude
```

## 🐳 Docker Services

### 1. Database (MySQL 8.0)
- **Container**: `medsync-db`
- **Port**: 3306
- **Volume**: `mysql_data` (persistent storage)
- **Auto-initialized** with SQL scripts on first run

### 2. Backend (Node.js + TypeScript)
- **Container**: `medsync-backend`
- **Port**: 8000
- **Technology**: Express.js with tsx
- **Health Check**: `/health` endpoint

### 3. Frontend (React + Vite)
- **Container**: `medsync-frontend`
- **Port**: 80
- **Technology**: React with Nginx
- **Features**: SPA routing, gzip compression

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Check what's using the port (Windows)
netstat -ano | findstr :80
netstat -ano | findstr :8000
netstat -ano | findstr :3306

# Stop the process or change ports in docker-compose.yml
```

### Database Connection Failed
```bash
# Check database is healthy
docker-compose ps database

# View database logs
docker-compose logs database

# Wait for database to be ready (takes ~30 seconds on first start)
```

### Backend Not Starting
```bash
# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers and volumes
docker-compose down -v

# Start again
docker-compose up -d
```

## 🔒 Security Checklist

- [ ] Changed `DATABASE_PASSWORD` in `.env`
- [ ] Changed `JWT_SECRET` in `.env`
- [ ] `.env` file is in `.gitignore` (already configured)
- [ ] Using strong passwords (min 16 characters)
- [ ] Not exposing database port publicly in production

## 📊 Monitoring

### View Container Stats
```bash
docker stats
```

### Check Disk Usage
```bash
docker system df
```

### Health Status
```bash
docker-compose ps
```

All services have health checks:
- ✅ Database: MySQL ping
- ✅ Backend: HTTP `/health` endpoint
- ✅ Frontend: HTTP `/health` endpoint

## 🔄 Development Workflow

### 1. Make Code Changes
Edit files in `backend/` or `frontend/`

### 2. Rebuild and Restart
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### 3. View Logs
```bash
docker-compose logs -f backend
```

## 💾 Database Management

### Backup Database
```bash
docker-compose exec database mysqldump -u root -p Project-MedSync > backup.sql
```

### Restore Database
```bash
docker-compose exec -T database mysql -u root -p Project-MedSync < backup.sql
```

### Access MySQL CLI
```bash
docker-compose exec database mysql -u medsync -p Project-MedSync
```

## 📚 Additional Documentation

- **Full Deployment Guide**: See `DOCKER_DEPLOYMENT.md`
- **Docker Files Overview**: See `DOCKER_FILES_OVERVIEW.md`
- **AWS Deployment**: See `AWS_QUICK_START.md`

## 🆘 Need Help?

1. Check logs: `docker-compose logs -f`
2. Review `DOCKER_DEPLOYMENT.md` for detailed troubleshooting
3. Ensure Docker Desktop is running
4. Verify all ports are available

## 🎉 Success Indicators

When everything is working:
- `docker-compose ps` shows all services as "healthy"
- Frontend loads at http://localhost
- Backend responds at http://localhost:8000/health
- No errors in `docker-compose logs`

---

**Ready to deploy?** Run `docker-start.bat` and you're good to go! 🚀
