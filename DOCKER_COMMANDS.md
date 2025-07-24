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
# Chạy tất cả services ở chế độ nền (detached mode)
# Sử dụng hàng ngày để khởi động ứng dụng
docker-compose up -d

# Build lại images và chạy (khi có thay đổi code hoặc Dockerfile)
# Sử dụng khi: thêm package mới, sửa Dockerfile, hoặc lần đầu chạy
docker-compose up --build -d

# Chạy và xem logs trực tiếp (không chạy nền)
# Hữu ích khi debug hoặc theo dõi logs realtime
docker-compose up

# Chạy chỉ một service cụ thể (ví dụ: chỉ database)
# Hữu ích khi chỉ cần test database hoặc chạy từng phần
docker-compose up mongodb -d    # Chỉ chạy MongoDB
docker-compose up backend -d    # Chỉ chạy Backend API
```

---

## ⏹️ **DỪNG**

```bash
# Dừng tất cả containers (giữ nguyên containers để restart nhanh)
docker-compose stop

# Dừng và xóa containers (thường dùng nhất - an toàn, giữ data)
# ⚠️ Lưu ý: Lệnh này chỉ xóa containers, KHÔNG xóa data trong database
docker-compose down

# Dừng, xóa containers + volumes (⚠️ NGUY HIỂM - XÓA TẤT CẢ DATA)
# Sử dụng khi muốn reset hoàn toàn database và bắt đầu lại từ đầu
docker-compose down -v

# Dừng, xóa containers + images (tiết kiệm dung lượng ổ cứng)
# Sử dụng khi muốn dọn dẹp hoàn toàn để build lại từ đầu
docker-compose down --rmi all

# Dừng một service cụ thể (ví dụ: chỉ dừng backend, giữ database chạy)
docker-compose stop backend
```

---

## 🔄 **RESTART**

```bash
# Restart tất cả services (nhanh nhất, giữ nguyên cấu hình)
# Sử dụng khi: server bị lag, cần refresh toàn bộ hệ thống
docker-compose restart

# Restart một service cụ thể (chỉ restart phần cần thiết)
# Sử dụng khi: chỉ backend có vấn đề, database vẫn ổn
docker-compose restart backend    # Restart API server
docker-compose restart mongodb    # Restart database

# Restart với rebuild (chậm hơn nhưng đảm bảo cập nhật code mới)
# Sử dụng khi: có thay đổi code quan trọng cần build lại
docker-compose down               # Dừng và xóa containers
docker-compose up --build -d     # Build lại và chạy
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
# Xem logs của tất cả services (một lần, không theo dõi tiếp)
# Hữu ích để xem tổng quan lỗi của toàn bộ hệ thống
docker-compose logs

# Xem logs realtime (theo dõi liên tục - follow mode)
# Sử dụng khi: debug lỗi, theo dõi request, monitor hệ thống
docker-compose logs -f

# Xem logs của một service cụ thể (tập trung vào một phần)
docker-compose logs backend     # Logs của API server
docker-compose logs mongodb     # Logs của database
docker-compose logs redis       # Logs của cache server

# Xem logs với giới hạn số dòng (tránh quá nhiều thông tin)
docker-compose logs --tail=50 backend      # 50 dòng cuối
docker-compose logs --tail=100 -f backend  # 100 dòng cuối + theo dõi tiếp

# Xem logs từ thời gian cụ thể (lọc theo thời gian)
docker-compose logs --since=10m backend                    # 10 phút gần đây
docker-compose logs --since="2025-07-24T10:00:00" backend  # Từ thời điểm cụ thể
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

**💡 Mẹo hay: Sử dụng `Ctrl+F` để tìm nhanh lệnh bạn cần!**

---

## 🎯 **LỆNH THƯỜNG DÙNG NHẤT**

```bash
# Khởi động hệ thống (hàng ngày)
docker-compose up -d

# Dừng hệ thống (an toàn, giữ data)
docker-compose down

# Restart khi có vấn đề
docker-compose restart

# Build lại khi có code mới
docker-compose up --build -d

# Xem logs khi debug
docker-compose logs -f backend
```

**📝 Ghi nhớ: `docker-compose down` là lệnh an toàn nhất để dừng hệ thống!**