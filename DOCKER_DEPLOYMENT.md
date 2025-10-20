# Docker Deployment Guide for MedSync

This guide covers how to deploy the MedSync application using Docker and Docker Compose.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available
- Ports 80, 8000, and 3306 available

## 🚀 Quick Start (Local Development)

### 1. Clone and Setup

```bash
cd Project-MedSync
cp .env.docker .env
```

### 2. Configure Environment Variables

Edit `.env` file with your configuration:

```env
# Database Configuration
DATABASE_HOST=database
DATABASE_USER=medsync
DATABASE_PASSWORD=your-secure-password-here
DATABASE_NAME=Project-MedSync

# JWT Configuration
JWT_SECRET=your-long-random-jwt-secret-key-change-this
JWT_EXPIRATION=24h

# Backend Configuration
PORT=8000
NODE_ENV=production
```

### 3. Start All Services

```bash
docker-compose up -d
```

This will start:
- **MySQL Database** on port 3306
- **Backend API** on port 8000
- **Frontend** on port 80

### 4. Check Status

```bash
# View all running containers
docker-compose ps

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### 5. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8000
- **Database**: localhost:3306

### 6. Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This deletes all data)
docker-compose down -v
```

## 🗄️ Database Initialization

The MySQL database is automatically initialized with:
1. `backend/src/db/init.sql` - Initial database setup
2. `backend/src/db/table.sql` - Table definitions
3. `backend/src/db/procedures.sql` - Stored procedures

These files are executed in order when the database container starts for the first time.

## 🔧 Development Commands

### Rebuild Containers

```bash
# Rebuild all containers
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Rebuild and restart
docker-compose up -d --build
```

### Access Container Shell

```bash
# Backend container
docker-compose exec backend sh

# Frontend container
docker-compose exec frontend sh

# Database container
docker-compose exec database mysql -u root -p
```

### View Database

```bash
# Connect to MySQL
docker-compose exec database mysql -u medsync -p Project-MedSync

# Or with root
docker-compose exec database mysql -u root -p
```

## 🌐 AWS Deployment Options

### Option 1: EC2 Instance (Simplest)

1. **Launch EC2 Instance**
   - Instance type: t3.medium or larger
   - OS: Amazon Linux 2 or Ubuntu 22.04
   - Storage: At least 20GB
   - Security Group: Allow ports 80, 443, 22

2. **Install Docker**

   ```bash
   # For Amazon Linux 2
   sudo yum update -y
   sudo yum install docker -y
   sudo service docker start
   sudo usermod -a -G docker ec2-user
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   
   # Logout and login again
   exit
   ```

3. **Deploy Application**

   ```bash
   # Clone repository
   git clone https://github.com/KRakeesh04/Project-MedSync.git
   cd Project-MedSync
   
   # Setup environment
   cp .env.docker .env
   nano .env  # Edit with your values
   
   # Start services
   docker-compose up -d
   ```

4. **Setup Domain (Optional)**
   - Point your domain to EC2 public IP
   - Install Nginx as reverse proxy
   - Setup SSL with Let's Encrypt

### Option 2: ECS with RDS (Production-Ready)

1. **Create RDS MySQL Instance**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier medsync-db \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --engine-version 8.0 \
     --master-username admin \
     --master-user-password <secure-password> \
     --allocated-storage 20 \
     --db-name ProjectMedSync
   ```

2. **Initialize RDS Database**
   ```bash
   # Get RDS endpoint from AWS Console
   mysql -h <rds-endpoint> -u admin -p ProjectMedSync < backend/src/db/init.sql
   mysql -h <rds-endpoint> -u admin -p ProjectMedSync < backend/src/db/table.sql
   mysql -h <rds-endpoint> -u admin -p ProjectMedSync < backend/src/db/procedures.sql
   ```

3. **Create ECR Repositories**
   ```bash
   aws ecr create-repository --repository-name medsync-backend
   aws ecr create-repository --repository-name medsync-frontend
   ```

4. **Build and Push Images**
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build and push backend
   cd backend
   docker build -t medsync-backend .
   docker tag medsync-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/medsync-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/medsync-backend:latest
   
   # Build and push frontend
   cd ../frontend
   docker build -t medsync-frontend .
   docker tag medsync-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/medsync-frontend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/medsync-frontend:latest
   ```

5. **Deploy to ECS**
   - Create ECS cluster
   - Create task definitions (see AWS_DEPLOYMENT.md)
   - Create services with load balancers
   - Configure auto-scaling

### Option 3: Elastic Beanstalk (Managed)

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB Application**
   ```bash
   eb init -p docker medsync-app
   ```

3. **Create Environment**
   ```bash
   eb create medsync-prod --database.engine mysql --database.size 20
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

## 🔒 Security Best Practices

1. **Change Default Passwords**
   - Update all passwords in `.env` file
   - Use strong, random passwords
   - Never commit `.env` to version control

2. **Use Secrets Management**
   - For AWS: Use AWS Secrets Manager or Parameter Store
   - For local: Use Docker secrets

3. **Enable SSL/TLS**
   - Use Let's Encrypt for free SSL certificates
   - Configure HTTPS in production

4. **Database Security**
   - Never expose MySQL port publicly
   - Use private subnets for RDS
   - Enable encryption at rest

5. **Container Security**
   - Keep base images updated
   - Scan images for vulnerabilities
   - Run containers as non-root user (already configured)

## 📊 Monitoring and Logs

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service with timestamps
docker-compose logs -f --timestamps backend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Monitor Resources

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

### Health Checks

All services have health checks configured:
- Backend: HTTP check on `/health` endpoint
- Frontend: HTTP check on `/health` endpoint
- Database: MySQL ping command

Check health status:
```bash
docker-compose ps
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Test connection
docker-compose exec backend sh
nc -zv database 3306
```

### Backend Not Starting

```bash
# Check logs
docker-compose logs backend

# Verify environment variables
docker-compose exec backend env | grep DATABASE

# Restart backend
docker-compose restart backend
```

### Frontend Not Loading

```bash
# Check logs
docker-compose logs frontend

# Verify nginx config
docker-compose exec frontend cat /etc/nginx/conf.d/default.conf

# Restart frontend
docker-compose restart frontend
```

### Port Already in Use

```bash
# Find process using port
# Windows
netstat -ano | findstr :80
netstat -ano | findstr :8000

# Kill process or change port in docker-compose.yml
```

### Database Data Persistence

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect project-medsync_mysql_data

# Backup database
docker-compose exec database mysqldump -u root -p Project-MedSync > backup.sql

# Restore database
docker-compose exec -T database mysql -u root -p Project-MedSync < backup.sql
```

## 🔄 Updates and Maintenance

### Update Application

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Or rebuild specific service
docker-compose up -d --build backend
```

### Database Migrations

```bash
# Connect to database
docker-compose exec database mysql -u root -p Project-MedSync

# Run migration SQL
docker-compose exec -T database mysql -u root -p Project-MedSync < migration.sql
```

### Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T database mysqldump -u root -p${DATABASE_PASSWORD} Project-MedSync > backup_${DATE}.sql
gzip backup_${DATE}.sql
EOF

chmod +x backup.sh

# Run backup
./backup.sh

# Schedule with cron (Linux)
crontab -e
# Add: 0 2 * * * /path/to/backup.sh
```

## 📝 Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| DATABASE_HOST | MySQL host | database | Yes |
| DATABASE_USER | MySQL user | medsync | Yes |
| DATABASE_PASSWORD | MySQL password | - | Yes |
| DATABASE_NAME | Database name | Project-MedSync | Yes |
| JWT_SECRET | JWT signing secret | - | Yes |
| JWT_EXPIRATION | JWT token expiry | 24h | No |
| PORT | Backend port | 8000 | No |
| NODE_ENV | Environment | production | No |

## 🆘 Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review this documentation
3. Check GitHub issues
4. Contact the development team

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
