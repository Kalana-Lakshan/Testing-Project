# 🎓 Complete Beginner's Guide to Docker for MedSync

**Your Goal:** Package your entire MedSync project into Docker containers  
**Why:** So anyone can run it easily without complex setup  
**Current Status:** ⚠️ Docker Hub is down (not your fault!)

---

## 📖 **Part 1: Understanding What You're Building**

### **Visual Overview**

```
Your Computer
│
├── Docker Desktop (Installed ✅)
│   │
│   ├── Container 1: Frontend (React Website)
│   │   └── Shows at: http://localhost
│   │
│   ├── Container 2: Backend (Node.js API)
│   │   └── Runs at: http://localhost:8000
│   │
│   └── Container 3: Database (MySQL)
│       └── Listens on: localhost:3308
│
└── Your MedSync Code (Ready ✅)
```

### **The Files You Need (Already Created ✅)**

```
Project-MedSync/
│
├── docker-compose.yml          ← Orchestrates all 3 containers
│   (This is the MAIN file that controls everything)
│
├── backend/
│   └── Dockerfile             ← Instructions to build backend container
│
├── frontend/
│   └── Dockerfile             ← Instructions to build frontend container
│
└── .env                       ← Your configuration (passwords, etc.)
```

---

## 🚀 **Part 2: The Simple 3-Step Process**

### **Step 1: Prepare Configuration (30 seconds)**

Your `.env` file tells Docker how to configure your app.

**Check it exists:**

```bash
# Open it
notepad .env
```

**What you should see:**

```env
# Database settings
DATABASE_HOST=database
DATABASE_USER=medsync
DATABASE_PASSWORD=123           ← Change this!
DATABASE_NAME=Project-MedSync

# Security settings
JWT_SECRET=your-secret-key-change-in-production  ← Change this!
JWT_EXPIRATION=24h

# Backend settings
PORT=8000
NODE_ENV=production
```

**Action:** Change `DATABASE_PASSWORD` and `JWT_SECRET` to something secure.

---

### **Step 2: Build Containers (3-5 minutes)**

This is where Docker creates your containers from the instructions in Dockerfiles.

**The Magic Command:**

```bash
docker-compose up -d --build
```

**What this does:**

- `docker-compose` = Uses the docker-compose.yml file
- `up` = Start containers
- `-d` = Run in background (detached mode)
- `--build` = Build images first

**What happens behind the scenes:**

```
1. Reads docker-compose.yml
2. Downloads base images (node, nginx, mysql) from Docker Hub
3. Builds frontend container (2-3 minutes)
4. Builds backend container (1-2 minutes)
5. Pulls database container (30 seconds)
6. Starts all 3 containers
7. Connects them together in a network
```

**Expected output when successful:**

```
[+] Building 180.2s (28/28) FINISHED
[+] Running 4/4
 ✔ Network project-medsync_medsync-network  Created
 ✔ Container medsync-db                     Started
 ✔ Container medsync-backend                Started
 ✔ Container medsync-frontend               Started
```

---

### **Step 3: Verify It's Working (1 minute)**

**Check container status:**

```bash
docker-compose ps
```

**You should see:**

```
NAME               STATUS
medsync-frontend   Up (healthy)
medsync-backend    Up (healthy)
medsync-db         Up (healthy)
```

**Test in browser:**

- Open: http://localhost
- You should see your MedSync website!

---

## 🛠️ **Part 3: Common Commands You'll Use**

### **Starting and Stopping**

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# Restart everything
docker-compose restart

# Stop and remove everything (including data!)
docker-compose down -v
```

### **Viewing Logs (Debugging)**

```bash
# See all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# See logs for specific container
docker-compose logs backend
docker-compose logs frontend
docker-compose logs database
```

### **Checking Status**

```bash
# Are containers running?
docker-compose ps

# How much resources are they using?
docker stats

# What images do I have?
docker images
```

### **Rebuilding After Code Changes**

```bash
# Changed backend code?
docker-compose up -d --build backend

# Changed frontend code?
docker-compose up -d --build frontend

# Changed both?
docker-compose up -d --build
```

---

## 🚨 **Part 4: Current Problem & Solution**

### **The Problem**

Docker Hub (where Docker downloads base images from) is currently **DOWN** with a 503 error.

**Think of it like this:**

```
You: "Docker, build my container"
Docker: "I need to download Node.js and MySQL images first"
Docker Hub: "Sorry, I'm down for maintenance" 🚫
Result: Build fails ❌
```

### **The Solution**

**You need to WAIT for Docker Hub to come back online.**

**How to check if it's back:**

```bash
# Quick test
docker pull hello-world

# Or use the checker script
./check-docker-hub.bat
```

**When it shows success:**

```
✅ Docker Hub is ONLINE!
You can now build your containers
```

**Then run:**

```bash
docker-compose up -d --build
```

---

## 📋 **Part 5: Complete Step-by-Step Walkthrough**

### **When Docker Hub is Online (Follow This)**

**1. Open terminal in project folder**

```bash
cd Project-MedSync
```

**2. Make sure .env is configured**

```bash
notepad .env
# Update DATABASE_PASSWORD and JWT_SECRET
# Save and close
```

**3. Build and start containers**

```bash
docker-compose up -d --build
```

**Expected output:**

```
[+] Building frontend...
[+] Building backend...
[+] Pulling database...
[+] Creating containers...
[+] Starting containers...
```

**This will take 3-5 minutes. Wait patiently!**

**4. Check if successful**

```bash
docker-compose ps
```

**Should show:**

```
NAME               STATUS
medsync-frontend   Up (healthy)
medsync-backend    Up (healthy)
medsync-db         Up (healthy)
```

**5. Test in browser**

```
http://localhost
```

**6. View logs if something's wrong**

```bash
docker-compose logs -f
```

---

## 🎯 **Part 6: Troubleshooting for Beginners**

### **Problem 1: "Docker is not running"**

**Solution:**

1. Look for Docker Desktop icon in system tray (bottom-right)
2. If not there, open Docker Desktop from Start Menu
3. Wait for it to say "Docker Desktop is running"
4. Try your command again

---

### **Problem 2: "Port is already allocated"**

**Error:**

```
Bind for 0.0.0.0:80 failed: port is already allocated
```

**Solution:**

```bash
# Check what's using the port
netstat -ano | findstr :80

# Option 1: Stop that service
# Option 2: Change port in docker-compose.yml
ports:
  - "8080:80"  # Use 8080 instead
```

---

### **Problem 3: "503 Service Unavailable" (Current Issue)**

**This is Docker Hub being down, not your fault!**

**Solution:**

1. Wait for Docker Hub to recover
2. Check status: https://status.docker.com/
3. Run `./check-docker-hub.bat` periodically
4. When online, run `docker-compose up -d --build`

---

### **Problem 4: Container shows "unhealthy"**

**Check logs:**

```bash
docker-compose logs frontend
```

**Common fixes:**

```bash
# Restart the container
docker-compose restart frontend

# Rebuild it
docker-compose up -d --build frontend
```

---

## 📚 **Part 7: Understanding the Files**

### **docker-compose.yml (The Conductor)**

```yaml
services:
  database: # Container 1
    image: mysql:8.0 # Use this pre-built image
    ports:
      - "3308:3306" # External:Internal port mapping
    environment: # Configuration
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}

  backend: # Container 2
    build:
      context: ./backend
      dockerfile: Dockerfile # Use this recipe
    ports:
      - "8000:8000"
    depends_on:
      - database # Start database first

  frontend: # Container 3
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend # Start backend first
```

---

### **backend/Dockerfile (The Recipe)**

```dockerfile
# Start from this base image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy all source code
COPY . .

# Expose port 8000
EXPOSE 8000

# Run this command when container starts
CMD ["npx", "tsx", "src/index.ts"]
```

---

### **frontend/Dockerfile (Two-Stage Recipe)**

```dockerfile
# STAGE 1: Build the React app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build  # Creates production build

# STAGE 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## ✅ **Part 8: Quick Reference**

### **Daily Commands**

```bash
# Start your app
docker-compose up -d

# Stop your app
docker-compose down

# View what's happening
docker-compose logs -f

# Check if running
docker-compose ps

# Restart after code changes
docker-compose up -d --build
```

### **When Things Go Wrong**

```bash
# View logs
docker-compose logs

# Restart a service
docker-compose restart backend

# Nuclear option (start fresh)
docker-compose down -v
docker-compose up -d --build
```

### **Cleaning Up**

```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes (data)
docker-compose down -v

# Remove all Docker stuff (careful!)
docker system prune -a
```

---

## 🎓 **Part 9: What You've Learned**

After following this guide, you now understand:

✅ What Docker containers are (packaged applications)  
✅ How docker-compose manages multiple containers  
✅ How Dockerfiles are recipes to build containers  
✅ How to build, start, stop, and monitor containers  
✅ How to debug issues with logs  
✅ How to make changes and rebuild

---

## 🎯 **Part 10: Your Next Steps**

### **Right Now (Docker Hub is down):**

1. ✅ Read this guide ← You're doing it!
2. ✅ Check your .env file is configured
3. ⏳ Wait for Docker Hub to recover
4. 🔄 Run `./check-docker-hub.bat` every hour

### **When Docker Hub is back:**

```bash
# 1. Build everything
docker-compose up -d --build

# 2. Check status
docker-compose ps

# 3. View logs
docker-compose logs -f

# 4. Test in browser
# Open: http://localhost

# 5. Celebrate! 🎉
```

### **Long Term:**

- Learn more: https://docs.docker.com/get-started/
- Practice: Make code changes and rebuild
- Experiment: Try different configurations
- Share: Send your docker-compose.yml to others

---

## 💡 **Important Reminders**

1. **Docker Hub Down = Can't Build**

   - This is temporary (usually few hours)
   - Not your fault
   - Just wait and retry

2. **Containers are Temporary**

   - Stopping containers doesn't delete your code
   - But stopping with `-v` flag deletes data
   - Your source code is always safe

3. **Logs are Your Friend**

   - Always check logs when something's wrong
   - `docker-compose logs -f` is your best tool

4. **Port Conflicts are Common**
   - Make sure ports 80, 8000, 3308 are free
   - Change ports in docker-compose.yml if needed

---

## 🎊 **You're Ready!**

You now know:

- ✅ What Docker is and why you need it
- ✅ How to build containers
- ✅ How to manage containers
- ✅ How to troubleshoot issues
- ✅ What commands to use

**Once Docker Hub is back online, you can containerize your entire MedSync project in ONE command:**

```bash
docker-compose up -d --build
```

**Good luck! 🚀**
