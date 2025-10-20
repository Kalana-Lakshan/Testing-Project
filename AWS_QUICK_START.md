# AWS Quick Start Guide for MedSync

This is a simplified guide to get MedSync running on AWS quickly.

## 🚀 Fastest Way: EC2 with Docker Compose

### Step 1: Launch EC2 Instance

1. Go to AWS EC2 Console
2. Click "Launch Instance"
3. Configure:
   - **Name**: MedSync-Server
   - **AMI**: Amazon Linux 2023 or Ubuntu 22.04
   - **Instance Type**: t3.medium (2 vCPU, 4GB RAM)
   - **Storage**: 20GB gp3
   - **Key Pair**: Create or select existing
   - **Security Group**: Create new with these rules:
     - SSH (22) - Your IP
     - HTTP (80) - Anywhere (0.0.0.0/0)
     - HTTPS (443) - Anywhere (0.0.0.0/0)
     - Custom TCP (8000) - Anywhere (0.0.0.0/0) [Backend API]

### Step 2: Connect and Install Docker

```bash
# Connect to your instance
ssh -i your-key.pem ec2-user@<your-ec2-public-ip>

# Update system
sudo yum update -y

# Install Docker
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
exit
ssh -i your-key.pem ec2-user@<your-ec2-public-ip>

# Verify installation
docker --version
docker-compose --version
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone https://github.com/KRakeesh04/Project-MedSync.git
cd Project-MedSync

# Create environment file
cp .env.docker .env

# Edit environment variables
nano .env
```

**Important: Update these values in .env:**
```env
DATABASE_PASSWORD=your-strong-password-here
JWT_SECRET=your-long-random-jwt-secret-minimum-32-characters
```

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 4: Access Your Application

- **Frontend**: http://your-ec2-public-ip
- **Backend API**: http://your-ec2-public-ip:8000

### Step 5: Setup Domain (Optional)

If you have a domain:

1. **Point DNS to EC2**:
   - Create A record: `yourdomain.com` → EC2 Public IP
   - Create A record: `api.yourdomain.com` → EC2 Public IP

2. **Install Nginx as Reverse Proxy**:
```bash
sudo yum install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

3. **Configure Nginx**:
```bash
sudo nano /etc/nginx/conf.d/medsync.conf
```

Add this configuration:
```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. **Setup SSL with Let's Encrypt**:
```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx -y

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal is configured automatically
```

5. **Restart Nginx**:
```bash
sudo systemctl restart nginx
```

Now access via:
- **Frontend**: https://yourdomain.com
- **Backend API**: https://api.yourdomain.com

---

## 💰 Cost Estimate (Monthly)

**EC2 with Docker Compose:**
- t3.medium EC2: ~$30/month
- 20GB EBS Storage: ~$2/month
- Data Transfer: ~$5-10/month
- **Total: ~$37-42/month**

**With RDS MySQL (More Reliable):**
- t3.medium EC2: ~$30/month
- db.t3.micro RDS: ~$15/month
- Storage & Backup: ~$5/month
- Data Transfer: ~$5-10/month
- **Total: ~$55-60/month**

---

## 🔒 Production Checklist

Before going live:

- [ ] Change all default passwords in `.env`
- [ ] Use strong JWT secret (minimum 32 characters)
- [ ] Setup SSL/HTTPS
- [ ] Configure firewall rules (Security Groups)
- [ ] Enable automated backups
- [ ] Setup monitoring (CloudWatch)
- [ ] Configure log rotation
- [ ] Test disaster recovery
- [ ] Document access credentials securely
- [ ] Setup alerts for downtime

---

## 📊 Monitoring

### View Application Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Check Resource Usage
```bash
# Container stats
docker stats

# Disk usage
df -h
docker system df
```

### Database Backup
```bash
# Manual backup
docker-compose exec -T database mysqldump -u root -p${DATABASE_PASSWORD} Project-MedSync > backup_$(date +%Y%m%d).sql

# Automated backup (add to crontab)
crontab -e
# Add: 0 2 * * * cd /home/ec2-user/Project-MedSync && docker-compose exec -T database mysqldump -u root -prootpassword Project-MedSync > /home/ec2-user/backups/backup_$(date +\%Y\%m\%d).sql
```

---

## 🆘 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Restart services
docker-compose restart

# Rebuild if needed
docker-compose up -d --build
```

### Database connection errors
```bash
# Check database is running
docker-compose ps database

# Check database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Out of disk space
```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a

# Remove old logs
sudo journalctl --vacuum-time=7d
```

### High memory usage
```bash
# Check container stats
docker stats

# Restart services
docker-compose restart

# Consider upgrading to t3.large
```

---

## 🔄 Updates

To update the application:

```bash
cd Project-MedSync

# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

---

## 🛡️ Security Best Practices

1. **Never expose MySQL port (3306) publicly**
   - Remove from Security Group if added

2. **Use AWS Secrets Manager for sensitive data**
   ```bash
   aws secretsmanager create-secret --name medsync/db-password --secret-string "your-password"
   ```

3. **Enable AWS CloudWatch for monitoring**

4. **Setup automated backups**

5. **Use IAM roles instead of access keys**

6. **Enable VPC Flow Logs**

7. **Regular security updates**
   ```bash
   sudo yum update -y
   docker-compose pull
   docker-compose up -d
   ```

---

## 📞 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Review [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)
3. Check AWS CloudWatch logs
4. Contact development team

---

## 🎯 Next Steps

After basic deployment:

1. **Setup RDS MySQL** for better reliability
2. **Configure Auto Scaling** for high traffic
3. **Setup CloudFront CDN** for better performance
4. **Implement CI/CD** with GitHub Actions
5. **Setup monitoring** with CloudWatch or Datadog
6. **Configure automated backups** to S3

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for advanced configurations.
