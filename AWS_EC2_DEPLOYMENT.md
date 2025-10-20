# AWS EC2 Deployment Guide for Project-MedSync

## Prerequisites

- An AWS EC2 instance running (you have: i-0f18cd71204c0e533)
- Security group configured to allow inbound traffic on ports 80, 8000, and 3308
- SSH access to the EC2 instance

## Step 1: Connect to Your EC2 Instance

```bash
# Replace with your key file path
ssh -i /path/to/your-key.pem ubuntu@13.60.206.61
```

Or if using the public DNS:

```bash
ssh -i /path/to/your-key.pem ubuntu@ec2-13-60-206-61.eu-north-1.compute.amazonaws.com
```

## Step 2: Install Docker and Docker Compose on EC2

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

## Step 3: Clone Your Project

```bash
# Clone from GitHub
git clone https://github.com/Kalana-Lakshan/Testing-Project.git
cd Testing-Project/Project-MedSync
```

## Step 4: Configure Environment Variables for AWS

Edit the `.env` file with your EC2 public IP or domain:

```bash
nano .env
```

Update the following line:

```
VITE_BACKEND_URL=http://13.60.206.61:8000
```

Or if you have a domain:

```
VITE_BACKEND_URL=http://your-domain.com:8000
```

**Important:** Make sure to update:

- `DATABASE_PASSWORD` to a strong password
- `JWT_SECRET` to a long random string

## Step 5: Configure AWS Security Group

Make sure your EC2 security group allows inbound traffic on:

- **Port 80** (HTTP) - for frontend
- **Port 8000** - for backend API
- **Port 3308** (optional) - if you want external database access
- **Port 22** - for SSH

To configure:

1. Go to EC2 Dashboard → Security Groups
2. Select your security group (launch-wizard-4)
3. Edit Inbound Rules
4. Add rules:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 8000, Source: 0.0.0.0/0
   - Type: Custom TCP, Port: 3308, Source: Your-IP/32 (optional, for database access)

## Step 6: Build and Start Docker Containers

```bash
# Build images
docker-compose build

# Start containers
docker-compose up -d

# Check status
docker ps

# View logs
docker-compose logs -f
```

## Step 7: Access Your Application

- **Frontend:** http://13.60.206.61 or http://your-domain.com
- **Backend API:** http://13.60.206.61:8000 or http://your-domain.com:8000

## Step 8: Monitor and Manage

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose stop

# Update application
git pull
docker-compose up -d --build
```

## Optional: Set Up HTTPS with SSL

For production, you should use HTTPS. Here's how:

### Using Certbot (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires a domain name)
sudo certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

### Update nginx.conf for SSL

After getting the certificate, update your nginx configuration to redirect HTTP to HTTPS.

## Troubleshooting

### Port 8000 already in use

```bash
# Find what's using the port
sudo lsof -i :8000

# Kill the process
sudo kill -9 <PID>
```

### Containers not starting

```bash
# Check logs
docker-compose logs

# Remove and restart
docker-compose down -v
docker-compose up -d
```

### Frontend can't connect to backend

- Verify `VITE_BACKEND_URL` in `.env` matches your EC2 public IP
- Rebuild frontend: `docker-compose up -d --build frontend`
- Check security group allows port 8000

### Database connection issues

- Check if database container is healthy: `docker ps`
- View database logs: `docker logs medsync-db`
- Verify database credentials in `.env`

## Cost Optimization

- Use t3.micro for development (free tier eligible)
- Stop instances when not in use
- Use Elastic IP to keep the same IP address
- Consider using AWS RDS for database in production

## Backup Strategy

```bash
# Backup database
docker exec medsync-db mysqldump -u medsync -p123 Project-MedSync > backup.sql

# Restore database
docker exec -i medsync-db mysql -u medsync -p123 Project-MedSync < backup.sql
```

## Production Checklist

- [ ] Change default passwords in `.env`
- [ ] Use strong JWT_SECRET
- [ ] Set up HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Configure log rotation
- [ ] Set up monitoring (CloudWatch)
- [ ] Use environment-specific configs
- [ ] Enable database backup
- [ ] Configure domain name

## Support

For issues, check:

1. Container logs: `docker-compose logs`
2. AWS Console for resource status
3. Security group configuration
4. Environment variables in `.env`
