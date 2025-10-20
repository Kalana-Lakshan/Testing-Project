# Frontend-Backend Connection Fix & AWS Deployment Setup

## 🔧 Issues Fixed

### 1. Frontend Unable to Connect to Backend

**Problem:** The frontend was built with a hardcoded backend URL that couldn't connect to the backend container.

**Solution:**

- Updated `frontend/Dockerfile` to accept `VITE_BACKEND_URL` as a build argument
- Modified `docker-compose.yml` to pass the backend URL during build
- Frontend now correctly connects to backend at `http://localhost:8000`

### 2. AWS EC2 Deployment Configuration

**Problem:** The application wasn't configured for cloud deployment.

**Solution:**

- Made backend URL configurable via environment variable
- Created comprehensive AWS deployment guide
- Added deployment script for easy AWS setup

---

## 📝 Changes Made

### 1. **frontend/Dockerfile**

Added build argument support:

```dockerfile
ARG VITE_BACKEND_URL=http://localhost:8000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
```

### 2. **docker-compose.yml**

Updated frontend service to pass backend URL:

```yaml
frontend:
  build:
    args:
      VITE_BACKEND_URL: ${VITE_BACKEND_URL:-http://localhost:8000}
```

### 3. **.env**

Added configuration for backend URL:

```
VITE_BACKEND_URL=http://localhost:8000
```

### 4. **New Files Created**

- `AWS_EC2_DEPLOYMENT.md` - Complete AWS deployment guide
- `deploy-aws.sh` - Automated deployment script for AWS

---

## ✅ How to Use Locally

### Running on Your Local Machine:

1. **Make sure `.env` has the correct backend URL:**

   ```
   VITE_BACKEND_URL=http://localhost:8000
   ```

2. **Rebuild and start containers:**

   ```bash
   docker-compose down
   docker-compose up -d --build
   ```

3. **Access the application:**
   - Frontend: http://localhost
   - Backend: http://localhost:8000
   - Database: localhost:3308

---

## 🚀 How to Deploy to AWS EC2

### Quick Start:

1. **On your EC2 instance, clone the repo:**

   ```bash
   git clone https://github.com/Kalana-Lakshan/Testing-Project.git
   cd Testing-Project/Project-MedSync
   ```

2. **Update `.env` with your EC2 public IP:**

   ```bash
   nano .env
   ```

   Change:

   ```
   VITE_BACKEND_URL=http://13.60.206.61:8000
   ```

3. **Run the deployment script:**
   ```bash
   chmod +x deploy-aws.sh
   ./deploy-aws.sh
   ```

### Manual Deployment:

1. **Install Docker on EC2:**

   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
   newgrp docker
   ```

2. **Update `.env` file with your EC2 IP:**

   ```
   VITE_BACKEND_URL=http://YOUR_EC2_IP:8000
   ```

3. **Build and start:**

   ```bash
   docker-compose up -d --build
   ```

4. **Configure AWS Security Group:**

   - Allow inbound traffic on ports 80 and 8000

5. **Access your app:**
   - Frontend: http://YOUR_EC2_IP
   - Backend: http://YOUR_EC2_IP:8000

---

## 🔐 Security Checklist for AWS

Before deploying to production:

- [ ] Change `DATABASE_PASSWORD` to a strong password
- [ ] Change `JWT_SECRET` to a long random string
- [ ] Configure AWS Security Group to allow only necessary ports
- [ ] Consider using HTTPS (add SSL certificate)
- [ ] Use environment-specific configurations
- [ ] Enable database backups
- [ ] Set up monitoring

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│         AWS EC2 Instance                │
│  (13.60.206.61)                         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Frontend Container             │   │
│  │  (Nginx + React)                │   │
│  │  Port: 80                       │   │
│  └─────────────┬───────────────────┘   │
│                │                        │
│                │ API Calls              │
│                ▼                        │
│  ┌─────────────────────────────────┐   │
│  │  Backend Container              │   │
│  │  (Node.js + TypeScript)         │   │
│  │  Port: 8000                     │   │
│  └─────────────┬───────────────────┘   │
│                │                        │
│                │ Database Queries       │
│                ▼                        │
│  ┌─────────────────────────────────┐   │
│  │  Database Container             │   │
│  │  (MySQL 8.0)                    │   │
│  │  Port: 3308                     │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### Frontend shows "Network Error" or can't load branches:

1. **Check backend URL in browser console**

   - Open DevTools → Console
   - Look for API call URLs

2. **Verify `.env` configuration:**

   ```bash
   cat .env | grep VITE_BACKEND_URL
   ```

3. **Rebuild frontend with correct URL:**
   ```bash
   docker-compose up -d --build frontend
   ```

### Backend not accessible:

1. **Check if container is running:**

   ```bash
   docker ps
   ```

2. **Check backend logs:**

   ```bash
   docker logs medsync-backend
   ```

3. **Verify port is not blocked:**
   ```bash
   curl http://localhost:8000
   ```

### AWS deployment issues:

1. **Check Security Group:**

   - Ports 80 and 8000 must be open

2. **Verify containers are running:**

   ```bash
   docker ps
   ```

3. **Check logs:**
   ```bash
   docker-compose logs -f
   ```

---

## 📚 Additional Resources

- **Full AWS Deployment Guide:** See `AWS_EC2_DEPLOYMENT.md`
- **Docker Documentation:** See `BEGINNER_DOCKER_GUIDE.md`
- **Project README:** See `README.md`

---

## 🎯 Next Steps

1. ✅ Test locally: http://localhost
2. ✅ Push changes to GitHub
3. ✅ Deploy to AWS EC2
4. ✅ Configure domain name (optional)
5. ✅ Set up HTTPS with SSL (recommended for production)
6. ✅ Configure monitoring and backups

---

## 📞 Support

If you encounter any issues:

1. Check container logs: `docker-compose logs`
2. Verify `.env` configuration
3. Check AWS Security Group settings
4. Review the AWS deployment guide

**Your application is now ready for deployment!** 🎉
