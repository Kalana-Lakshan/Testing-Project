# MedSync - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Database Setup (2 minutes)

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE IF NOT EXISTS `Project-MedSync`;
USE `Project-MedSync`;

# Run schema
SOURCE /full/path/to/backend/src/db/table.sql;

# Run procedures
SOURCE /full/path/to/backend/src/db/procedures.sql;

# Verify
SHOW TABLES;
SHOW PROCEDURE STATUS WHERE Db = 'Project-MedSync';
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=Project-MedSync
PORT=8000
JWT_SECRET=your_secret_key_here
EOF

# Start server
npm run dev
```

### Step 3: Test API (1 minute)

```bash
# Test health check (if available)
curl http://localhost:8000/

# Test login
curl -X POST http://localhost:8000/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

---

## 🎯 Quick Test Scenarios

### Test 1: Check Available Slots
```bash
curl -X GET "http://localhost:8000/appointments/available-slots?doctor_id=1&date=2025-01-20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Test 2: Create Appointment
```bash
curl -X POST http://localhost:8000/appointments/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "appointment_id": 1001,
    "patient_id": 100,
    "doctor_id": 1,
    "patient_note": "Regular checkup",
    "date": "2025-01-20",
    "time_slot": "08:00-09:00",
    "status": "Scheduled"
  }'
```

### Test 3: Get Reports
```bash
curl -X GET "http://localhost:8000/reports/branch-appointments?date=2025-01-20&branch_id=-1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Documentation

- **API Reference:** `API_DOCUMENTATION.md`
- **Testing Guide:** `TESTING_GUIDE.md`
- **Implementation Details:** `IMPLEMENTATION_SUMMARY.md`
- **Project Status:** `PROJECT_STATUS.md`
- **Completion Report:** `COMPLETION_REPORT.md`

---

## 🐳 Docker Quick Start

```bash
# Start everything with Docker
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ✅ Verify Installation

1. Server running on `http://localhost:8000`
2. Database has 15 tables
3. Database has 80+ procedures
4. API endpoints respond correctly

---

## 🆘 Troubleshooting

**Can't connect to database?**
- Check MySQL is running: `sudo systemctl status mysql`
- Verify credentials in `.env`

**Procedures not found?**
- Re-run: `mysql -u root -p Project-MedSync < backend/src/db/procedures.sql`

**Port already in use?**
- Change PORT in `.env` file

---

## 🎉 You're Ready!

The system is now running. Check the documentation files for detailed information.

**Happy Coding! 🚀**
