# 🐳 **DOCKER COMMANDS - CHEAT SHEET**

## ⚡ **QUICK START - 3 LỆNH**

```bash
cd CONGNGHEPHANMEM
copy .env.example .env
docker-compose up --build -d
```

**✅ XONG! Truy cập: http://localhost:3000/api/health**

---

## 🚀 **KHỞI ĐỘNG**

```bash
# Chạy tất cả services
docker-compose up -d

# Build và chạy (khi có thay đổi code)
docker-compose up --build -d

# Chạy và xem logs realtime
docker-compose up

# Chạy chỉ một service
docker-compose up mongodb -d
docker-compose up backend -d
```

---

## ⏹️ **DỪNG**

```bash
# Dừng tất cả containers
docker-compose stop

# Dừng và xóa containers
docker-compose down

# Dừng, xóa containers + volumes (xóa data)
docker-compose down -v

# Dừng, xóa containers + images
docker-compose down --rmi all

# Dừng một service cụ thể
docker-compose stop backend
```

---

## 🔄 **RESTART**

```bash
# Restart tất cả
docker-compose restart

# Restart một service
docker-compose restart backend
docker-compose restart mongodb

# Restart với rebuild
docker-compose down
docker-compose up --build -d
```

---

## 🔍 **KIỂM TRA TRẠNG THÁI**

```bash
# Xem trạng thái containers
docker-compose ps

# Xem tất cả containers (cả stopped)
docker ps -a

# Xem resource usage (CPU, Memory)
docker stats

# Xem disk usage
docker system df

# Xem networks
docker network ls

# Xem volumes
docker volume ls
```

---

## 📝 **XEM LOGS**

```bash
# Logs tất cả services
docker-compose logs

# Logs realtime (follow)
docker-compose logs -f

# Logs một service cụ thể
docker-compose logs backend
docker-compose logs mongodb
docker-compose logs redis

# Logs với số dòng giới hạn
docker-compose logs --tail=50 backend
docker-compose logs --tail=100 -f backend

# Logs từ thời gian cụ thể
docker-compose logs --since=10m backend
docker-compose logs --since="2024-01-24T10:00:00" backend
```

---

## 🔍 **HEALTH CHECK & TEST**

```bash
# Test API health
curl http://localhost:3000/api/health

# Test từ trong container
docker-compose exec backend curl http://localhost:3000/api/health

# Test API endpoints
curl http://localhost:3000/api/products
curl http://localhost:3000/api/banners

# Chạy health check script
docker-compose exec backend node scripts/docker-health-check.js

# Chạy integration tests
docker-compose exec backend node scripts/test-docker-setup.js
```

---

## 🖥️ **TRUY CẬP CONTAINERS**

```bash
# Truy cập backend container
docker-compose exec backend bash
docker-compose exec backend sh

# Truy cập MongoDB shell
docker-compose exec mongodb mongosh

# Truy cập Redis CLI
docker-compose exec redis redis-cli

# Chạy lệnh trong container
docker-compose exec backend npm --version
docker-compose exec backend node --version
docker-compose exec backend ls -la
```

---

## 💾 **DATABASE OPERATIONS**

### **Backup Database**
```bash
# Tạo backup
docker exec nafood-mongodb mongodump \
  --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" \
  --out="/tmp/backup"

# Copy backup ra ngoài
docker cp nafood-mongodb:/tmp/backup ./backup

# Backup với timestamp
BACKUP_NAME="nafood_backup_$(date +%Y%m%d_%H%M%S)"
docker exec nafood-mongodb mongodump \
  --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" \
  --out="/tmp/$BACKUP_NAME"
docker cp nafood-mongodb:/tmp/$BACKUP_NAME ./backups/
```

### **Restore Database**
```bash
# Copy backup vào container
docker cp ./backup nafood-mongodb:/tmp/backup

# Restore database
docker exec nafood-mongodb mongorestore \
  --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" \
  --drop /tmp/backup/nafood
```

### **Seed Data**
```bash
# Chạy seed script
docker-compose exec backend node scripts/seed-data.js

# Hoặc nếu có npm script
docker-compose exec backend npm run seed
```

### **MongoDB Operations**
```bash
# Truy cập MongoDB shell
docker-compose exec mongodb mongosh

# Trong MongoDB shell:
use nafood
db.products.find().limit(5)
db.users.countDocuments()
db.orders.find({status: "pending"})

# Chạy MongoDB command từ ngoài
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

---

## 🛠️ **DEVELOPMENT**

```bash
# Cài package mới
docker-compose exec backend npm install package-name
docker-compose restart backend

# Chạy npm scripts
docker-compose exec backend npm run build
docker-compose exec backend npm test

# Copy file vào container
docker cp ./local-file.js nafood-backend:/app/

# Copy file từ container ra
docker cp nafood-backend:/app/logs/app.log ./logs/

# Xem cấu trúc thư mục trong container
docker-compose exec backend ls -la
docker-compose exec backend find . -name "*.js" | head -10
```

---

## 🛠️ **XỬ LÝ LỖI**

### **Port Conflicts**
```bash
# Kiểm tra port đang sử dụng
netstat -ano | findstr :3000    # Windows
lsof -i :3000                   # Linux/macOS

# Thay đổi port trong docker-compose.yml
# ports:
#   - "3001:3000"  # Dùng port 3001 thay vì 3000
```

### **Container Issues**
```bash
# Xem lỗi chi tiết
docker-compose logs backend

# Restart container có vấn đề
docker-compose restart backend

# Rebuild container
docker-compose up --build backend -d

# Xóa và tạo lại container
docker-compose rm backend
docker-compose up backend -d
```

### **Database Issues**
```bash
# Kiểm tra MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Test MongoDB connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Reset MongoDB data (⚠️ XÓA TẤT CẢ DATA)
docker-compose down -v
docker volume rm congnghephanmem_mongodb_data
docker-compose up -d
```

### **Reset Everything**
```bash
# Soft reset (giữ data)
docker-compose down
docker-compose up --build -d

# Hard reset (xóa tất cả)
docker-compose down -v --rmi all
docker system prune -a
docker-compose up --build -d
```

---

## 🚀 **PRODUCTION**

### **Deploy Production**
```bash
# Tạo production environment
cp .env.example .env.production

# Deploy với production config
docker-compose --env-file .env.production up -d

# Hoặc sử dụng production compose file
docker-compose -f docker-compose.prod.yml up -d
```

### **Security Commands**
```bash
# Tạo strong passwords
openssl rand -base64 32

# Update environment variables
# Sửa .env file với passwords mới
# MONGODB_URI=mongodb://admin:NEW_PASSWORD@mongodb:27017/nafood?authSource=admin
# JWT_SECRET=your-super-strong-32-char-secret
# SESSION_SECRET=your-super-strong-32-char-secret
```

### **Monitoring Production**
```bash
# Xem resource usage
docker stats --no-stream

# Xem logs production
docker-compose logs --since=1h -f

# Health check
curl -f http://localhost:3000/api/health || echo "Health check failed"
```

---

## 🆘 **EMERGENCY COMMANDS**

### **When Everything Breaks**
```bash
# 1. Stop everything
docker-compose down -v

# 2. Clean Docker system
docker system prune -a -f

# 3. Remove all volumes
docker volume prune -f

# 4. Start fresh
docker-compose up --build -d
```

### **Nuclear Option (⚠️ DANGER)**
```bash
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Remove all images
docker rmi $(docker images -q) -f

# Remove all volumes
docker volume rm $(docker volume ls -q) -f

# Remove all networks
docker network rm $(docker network ls -q)
```

---

## 📊 **MONITORING & DEBUGGING**

```bash
# Container details
docker inspect nafood-backend
docker inspect nafood-mongodb

# Network details
docker network inspect congnghephanmem_nafood-network

# Volume details
docker volume inspect congnghephanmem_mongodb_data

# Process list in containers
docker-compose top

# Container resource limits
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"

# Disk usage by containers
docker system df -v
```

---

## 📱 **QUICK REFERENCE**

| **Mục đích** | **Lệnh** |
|--------------|----------|
| **Chạy** | `docker-compose up -d` |
| **Dừng** | `docker-compose down` |
| **Restart** | `docker-compose restart` |
| **Build** | `docker-compose up --build -d` |
| **Logs** | `docker-compose logs -f` |
| **Status** | `docker-compose ps` |
| **Health** | `curl http://localhost:3000/api/health` |
| **Reset** | `docker-compose down -v && docker-compose up --build -d` |
| **Backup** | `docker exec nafood-mongodb mongodump --uri="..." --out="/tmp/backup"` |
| **Shell** | `docker-compose exec backend bash` |

---

## 🎯 **WORKFLOW HÀNG NGÀY**

### **🌅 Bắt đầu ngày**
```bash
cd CONGNGHEPHANMEM
docker-compose up -d
docker-compose logs -f backend
```

### **💻 Khi code thay đổi**
```bash
docker-compose restart backend
# Hoặc rebuild nếu cần:
docker-compose up --build backend -d
```

### **🔍 Debug issues**
```bash
docker-compose logs backend
docker-compose exec backend bash
curl http://localhost:3000/api/health
```

### **🌙 Kết thúc ngày**
```bash
docker-compose stop
# Hoặc để chạy tiếp: không cần làm gì
```

---

## 🔗 **IMPORTANT URLS**

- **🏠 API Base**: http://localhost:3000/api
- **🔍 Health Check**: http://localhost:3000/api/health
- **📦 Products**: http://localhost:3000/api/products
- **🎨 Banners**: http://localhost:3000/api/banners
- **👤 Auth Login**: http://localhost:3000/api/auth/login
- **📝 Auth Register**: http://localhost:3000/api/auth/register

---

## 🎉 **SUCCESS INDICATORS**

### **✅ Healthy Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-24T...",
  "mongodb": "connected"
}
```

### **✅ Container Status:**
```
NAME                STATE               PORTS
nafood-backend      Up (healthy)        0.0.0.0:3000->3000/tcp
nafood-mongodb      Up (healthy)        0.0.0.0:27017->27017/tcp
nafood-redis        Up                  0.0.0.0:6379->6379/tcp
```

---

**🚀 Docker Commands Ready! Bookmark this page for quick reference!**

**💡 Pro tip: Use `Ctrl+F` to quickly find the command you need!**
