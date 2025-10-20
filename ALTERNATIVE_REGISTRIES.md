# Alternative Docker Registries (When Docker Hub is Down)

When Docker Hub experiences outages, you can use alternative container registries:

## 🔄 Alternative Registries

### **1. Microsoft Container Registry (MCR)**

```yaml
# For MySQL alternative
image: mcr.microsoft.com/mssql/server:2022-latest  # SQL Server instead
# OR use PostgreSQL from MCR
image: mcr.microsoft.com/azure-sql-edge
```

### **2. GitHub Container Registry (ghcr.io)**

```yaml
image: ghcr.io/linuxserver/mysql:latest
```

### **3. Quay.io**

```yaml
image: quay.io/mysql/mysql-server:8.0
```

### **4. Google Container Registry**

```yaml
image: gcr.io/cloudsql-docker/mysql:latest
```

---

## 🛠️ How to Use Alternative Registry

### **Option A: Modify docker-compose.yml Temporarily**

1. Open `docker-compose.yml`
2. Replace the database image:

   ```yaml
   # FROM:
   image: mysql:8.0

   # TO (using Quay):
   image: quay.io/mysql/mysql-server:8.0
   ```

3. Rebuild:
   ```bash
   docker-compose up -d --build
   ```

### **Option B: Use Docker Registry Mirrors**

Configure Docker Desktop to use mirror registries:

1. Open Docker Desktop
2. Go to Settings → Docker Engine
3. Add mirror configuration:
   ```json
   {
     "registry-mirrors": [
       "https://mirror.gcr.io",
       "https://registry.docker-cn.com"
     ]
   }
   ```
4. Restart Docker Desktop
5. Retry build

---

## ⚠️ Important Notes

- Alternative registries may have different tags/versions
- Images might not be identical to Docker Hub versions
- Some registries require authentication
- **Best option:** Wait for Docker Hub to recover

---

## ✅ Recommended Approach

**For Production/Stable Setup:**

- Wait for Docker Hub to recover
- Use official images from Docker Hub
- Build with verified, stable images

**For Development/Testing:**

- Try alternative registries if urgent
- Be prepared for potential compatibility issues
- Document which registry you used

---

## 📊 Current Status

Check Docker Hub status:

- Website: https://status.docker.com/
- Twitter: @DockerStatus
- Downdetector: https://downdetector.com/status/docker/

Check alternative registry status:

- Quay.io: https://status.quay.io/
- GitHub: https://www.githubstatus.com/
- GCR: https://status.cloud.google.com/
