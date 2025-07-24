# 🐳 **HƯỚNG DẪN CHẠY NAFOODLVN TRÊN DOCKER**

## 📋 **YÊU CẦU HỆ THỐNG**

- **Docker Desktop** >= 20.10
- **Docker Compose** >= 2.0
- **RAM**: Tối thiểu 2GB
- **Ổ cứng**: Tối thiểu 5GB trống
- **Hệ điều hành**: Windows 10/11, macOS, Linux

---

## 🚀 **BƯỚC 1: CÀI ĐẶT DOCKER**

### **Windows:**
1. Tải **Docker Desktop** từ: https://www.docker.com/products/docker-desktop
2. Cài đặt và khởi động Docker Desktop
3. Đảm bảo WSL2 được bật (nếu cần)

### **macOS:**
1. Tải **Docker Desktop for Mac**
2. Kéo thả vào Applications folder
3. Khởi động Docker Desktop

### **Linux (Ubuntu/Debian):**
```bash
# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### **Kiểm tra cài đặt:**
```bash
docker --version
docker-compose --version
```

---

## 📁 **BƯỚC 2: CHUẨN BỊ PROJECT**

### **2.1: Clone hoặc tải project**
```bash
# Nếu có Git
git clone <repository-url>
cd NAFOODLVN/CHBANDOAN

# Hoặc giải nén file zip và cd vào thư mục
```

### **2.2: Di chuyển vào thư mục Docker**
```bash
cd CONGNGHEPHANMEM
```

### **2.3: Tạo file môi trường**
```bash
# Windows
copy .env.example .env

# Linux/macOS  
cp .env.example .env
```

### **2.4: Chỉnh sửa file .env (tùy chọn)**
Mở file `.env` và cập nhật các giá trị:

```env
# Database Configuration
MONGODB_URI=mongodb://admin:password123@mongodb:27017/nafood?authSource=admin&retryWrites=true&w=majority

# Security Configuration (⚠️ ĐỔI TRONG PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-minimum-32-characters
SESSION_SECRET=your-session-secret-change-in-production-minimum-32-characters

# Server Configuration
NODE_ENV=production
DOCKER_ENV=true
PORT=3000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
```

---

## 🐳 **BƯỚC 3: CHẠY DOCKER**

### **3.1: Build và chạy tất cả services**
```bash
docker-compose up --build -d
```

**Giải thích lệnh:**
- `up`: Khởi động containers
- `--build`: Build lại images từ Dockerfile
- `-d`: Chạy ở background (detached mode)

### **3.2: Chờ services khởi động (2-3 phút)**
Docker sẽ:
1. ⬇️ Tải base images (Node.js, MongoDB, Redis)
2. 🔨 Build backend application
3. 🚀 Khởi động tất cả services
4. ✅ Chạy health checks

### **3.3: Theo dõi quá trình khởi động**
```bash
# Xem logs realtime
docker-compose logs -f

# Hoặc xem logs của từng service
docker-compose logs -f backend
docker-compose logs -f mongodb
```

---

## 🔍 **BƯỚC 4: KIỂM TRA HOẠT ĐỘNG**

### **4.1: Kiểm tra trạng thái containers**
```bash
docker-compose ps
```

**Kết quả mong đợi:**
```
NAME                STATE               PORTS
nafood-backend      Up (healthy)        0.0.0.0:3000->3000/tcp
nafood-mongodb      Up (healthy)        0.0.0.0:27017->27017/tcp
nafood-redis        Up                  0.0.0.0:6379->6379/tcp
```

### **4.2: Test API Health Check**
```bash
# Windows PowerShell
Invoke-WebRequest -Uri http://localhost:3000/api/health -UseBasicParsing

# Linux/macOS/Git Bash
curl http://localhost:3000/api/health
```

**Kết quả mong đợi:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-24T...",
  "mongodb": "connected"
}
```

### **4.3: Kiểm tra từ Docker Desktop**
1. Mở **Docker Desktop**
2. Vào tab **Containers**
3. Tìm **congnghephanmem** project
4. Tất cả containers phải có trạng thái **Running** và **Healthy**

---

## 🌐 **BƯỚC 5: TRUY CẬP ỨNG DỤNG**

### **5.1: Các URL có sẵn:**
- **🏠 Trang chủ**: http://localhost:3000
- **🔍 Health Check**: http://localhost:3000/api/health
- **📦 Products API**: http://localhost:3000/api/products
- **🎨 Banners API**: http://localhost:3000/api/banners
- **👤 Auth Login**: http://localhost:3000/api/auth/login
- **📝 Auth Register**: http://localhost:3000/api/auth/register

### **5.2: Truy cập từ Docker Desktop:**
1. Mở **Docker Desktop**
2. Tìm container **nafood-backend**
3. Click vào **port 3000:3000** hoặc biểu tượng browser 🌐

### **5.3: Test API với Postman/Thunder Client:**
```json
// GET http://localhost:3000/api/products
// GET http://localhost:3000/api/banners
// POST http://localhost:3000/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "fullName": "Test User",
  "phone": "0123456789"
}
```

---

## 📊 **BƯỚC 6: QUẢN LÝ CONTAINERS**

### **6.1: Các lệnh cơ bản**
```bash
# Xem trạng thái tất cả containers
docker-compose ps

# Xem logs
docker-compose logs backend          # Logs backend
docker-compose logs mongodb          # Logs database
docker-compose logs -f               # Follow all logs
docker-compose logs --tail=50 backend # 50 dòng cuối

# Quản lý containers
docker-compose stop                  # Dừng tất cả
docker-compose start                 # Khởi động lại
docker-compose restart backend       # Restart backend
docker-compose down                  # Dừng và xóa containers
docker-compose down -v               # Dừng và xóa cả volumes
```

### **6.2: Rebuild khi có thay đổi code**
```bash
# Dừng containers
docker-compose down

# Build và chạy lại
docker-compose up --build -d

# Hoặc rebuild chỉ backend
docker-compose up --build backend -d
```

### **6.3: Truy cập vào container**
```bash
# Truy cập backend container
docker-compose exec backend bash

# Truy cập MongoDB
docker-compose exec mongodb mongosh

# Chạy lệnh trong container
docker-compose exec backend npm run seed
```

---

## 🛠️ **BƯỚC 7: SEED DỮ LIỆU MẪU**

### **7.1: Chạy script seed data**
```bash
# Seed dữ liệu mẫu
docker-compose exec backend node scripts/seed-data.js

# Hoặc nếu có npm script
docker-compose exec backend npm run seed
```

### **7.2: Kiểm tra dữ liệu đã seed**
```bash
# Truy cập MongoDB
docker-compose exec mongodb mongosh

# Trong MongoDB shell
use nafood
db.products.countDocuments()
db.users.countDocuments()
db.banners.countDocuments()
```

---

## 🔧 **TROUBLESHOOTING - XỬ LÝ LỖI**

### **❌ Lỗi: Port đã được sử dụng**
```bash
# Kiểm tra port đang sử dụng
# Windows
netstat -ano | findstr :3000

# Linux/macOS
lsof -i :3000

# Giải pháp: Thay đổi port trong docker-compose.yml
services:
  backend:
    ports:
      - "3001:3000"  # Sử dụng port 3001 thay vì 3000
```

### **❌ Lỗi: MongoDB connection failed**
```bash
# Kiểm tra logs MongoDB
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb

# Kiểm tra kết nối
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Kiểm tra network
docker network ls
docker network inspect congnghephanmem_nafood-network
```

### **❌ Lỗi: Backend không start**
```bash
# Xem logs chi tiết
docker-compose logs backend

# Kiểm tra health check
docker-compose exec backend curl http://localhost:3000/api/health

# Restart backend
docker-compose restart backend

# Rebuild backend
docker-compose up --build backend -d
```

### **❌ Lỗi: Out of memory**
```bash
# Kiểm tra memory usage
docker stats

# Tăng memory limit trong docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M
```

### **❌ Lỗi: Permission denied (Linux/macOS)**
```bash
# Fix permissions cho uploads directory
sudo chown -R 1001:1001 public/uploads
chmod -R 755 public/uploads

# Hoặc chạy Docker với sudo (không khuyến nghị)
sudo docker-compose up --build -d
```

### **❌ Reset hoàn toàn**
```bash
# Dừng và xóa tất cả
docker-compose down -v --rmi all

# Xóa cache Docker
docker system prune -a

# Xóa tất cả volumes
docker volume prune

# Build lại từ đầu
docker-compose up --build -d
```

---

## 📈 **MONITORING & LOGS**

### **8.1: Xem logs realtime**
```bash
# Tất cả services
docker-compose logs -f

# Chỉ backend
docker-compose logs -f backend

# Với timestamp
docker-compose logs -f -t backend

# 50 dòng cuối
docker-compose logs --tail=50 backend

# Logs từ 10 phút trước
docker-compose logs --since=10m backend
```

### **8.2: Kiểm tra resource usage**
```bash
# Xem CPU, Memory usage realtime
docker stats

# Xem disk usage
docker system df

# Xem network usage
docker network ls
```

### **8.3: Health checks**
```bash
# Kiểm tra health của containers
docker-compose ps

# Test tất cả API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/products
curl http://localhost:3000/api/banners

# Chạy comprehensive test
docker-compose exec backend node scripts/test-docker-setup.js
```

### **8.4: Database monitoring**
```bash
# Truy cập MongoDB shell
docker-compose exec mongodb mongosh

# Kiểm tra database stats
use nafood
db.stats()
db.products.countDocuments()
db.orders.countDocuments()
db.users.countDocuments()

# Kiểm tra indexes
db.products.getIndexes()
```

---

## 🔒 **BẢO MẬT PRODUCTION**

### **9.1: Thay đổi mật khẩu mặc định**
```env
# Trong .env - ⚠️ QUAN TRỌNG CHO PRODUCTION
MONGODB_URI=mongodb://admin:YOUR_STRONG_PASSWORD@mongodb:27017/nafood?authSource=admin
JWT_SECRET=your-super-strong-jwt-secret-minimum-32-characters-random
SESSION_SECRET=your-super-strong-session-secret-minimum-32-characters-random
```

### **9.2: Tạo mật khẩu mạnh**
```bash
# Tạo random password 32 ký tự
openssl rand -base64 32

# Hoặc sử dụng online generator
# https://passwordsgenerator.net/
```

### **9.3: Security checklist**
- [ ] Đổi MongoDB password
- [ ] Đổi JWT_SECRET
- [ ] Đổi SESSION_SECRET  
- [ ] Cấu hình firewall
- [ ] Sử dụng HTTPS trong production
- [ ] Giới hạn CORS origins
- [ ] Enable rate limiting
- [ ] Regular security updates

---

## 💾 **BACKUP & RESTORE**

### **10.1: Backup database**
```bash
# Tạo backup với timestamp
BACKUP_NAME="nafood_backup_$(date +%Y%m%d_%H%M%S)"

# Backup database
docker exec nafood-mongodb mongodump \
  --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" \
  --out="/tmp/$BACKUP_NAME"

# Copy backup ra ngoài
docker cp nafood-mongodb:/tmp/$BACKUP_NAME ./backups/

# Nén backup
tar -czf "./backups/$BACKUP_NAME.tar.gz" -C ./backups/ $BACKUP_NAME
```

### **10.2: Restore database**
```bash
# Giải nén backup
tar -xzf "./backups/nafood_backup_20250124_120000.tar.gz" -C ./backups/

# Copy backup vào container
docker cp ./backups/nafood_backup_20250124_120000 nafood-mongodb:/tmp/

# Restore database
docker exec nafood-mongodb mongorestore \
  --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" \
  --drop /tmp/nafood_backup_20250124_120000/nafood
```

### **10.3: Automated backup script**
```bash
#!/bin/bash
# backup.sh - Thêm vào crontab để backup tự động

BACKUP_DIR="./backups"
BACKUP_NAME="nafood_backup_$(date +%Y%m%d_%H%M%S)"

mkdir -p $BACKUP_DIR

# Backup
docker exec nafood-mongodb mongodump \
  --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" \
  --out="/tmp/$BACKUP_NAME"

docker cp nafood-mongodb:/tmp/$BACKUP_NAME $BACKUP_DIR/

# Nén và xóa backup cũ (giữ 7 ngày)
tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C $BACKUP_DIR/ $BACKUP_NAME
rm -rf "$BACKUP_DIR/$BACKUP_NAME"
find $BACKUP_DIR -name "nafood_backup_*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_NAME.tar.gz"
```

---

## 🚀 **DEPLOYMENT PRODUCTION**

### **11.1: Production environment**
```bash
# Tạo file .env.production
cp .env .env.production

# Chỉnh sửa cho production
NODE_ENV=production
MONGODB_URI=mongodb://admin:STRONG_PASSWORD@mongodb:27017/nafood?authSource=admin
JWT_SECRET=super-strong-jwt-secret-for-production
SESSION_SECRET=super-strong-session-secret-for-production

# Deploy với production config
docker-compose --env-file .env.production up -d
```

### **11.2: Production docker-compose**
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
    healthcheck:
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 40s
```

### **11.3: SSL/HTTPS Setup**
```yaml
# Thêm nginx reverse proxy
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
  depends_on:
    - backend
```

---

## 🔄 **CI/CD INTEGRATION**

### **12.1: GitHub Actions**
```yaml
# .github/workflows/docker.yml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Build and Deploy
      run: |
        cd CONGNGHEPHANMEM
        docker-compose up --build -d
        
    - name: Health Check
      run: |
        sleep 30
        curl -f http://localhost:3000/api/health
```

### **12.2: Auto-deployment script**
```bash
#!/bin/bash
# deploy.sh - Script tự động deploy

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin main

# Navigate to docker directory
cd CONGNGHEPHANMEM

# Backup current database
./backup.sh

# Deploy new version
docker-compose down
docker-compose up --build -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
if curl -f http://localhost:3000/api/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
```

---

## 📞 **HỖ TRỢ & LIÊN HỆ**

### **Khi gặp vấn đề:**

1. **📋 Kiểm tra logs đầu tiên:**
   ```bash
   docker-compose logs -f
   ```

2. **🔄 Thử restart services:**
   ```bash
   docker-compose restart
   ```

3. **🧹 Reset hoàn toàn nếu cần:**
   ```bash
   docker-compose down -v
   docker system prune -a
   docker-compose up --build -d
   ```

4. **🔍 Chạy health check:**
   ```bash
   docker-compose exec backend node scripts/docker-health-check.js
   ```

### **Các file quan trọng:**
- `docker-compose.yml`: Cấu hình services chính
- `Dockerfile`: Cấu hình build backend image
- `.env`: Biến môi trường
- `DOCKER.md`: Documentation chi tiết
- `scripts/`: Các utility scripts

### **Useful commands cheat sheet:**
```bash
# Quick start
docker-compose up --build -d

# Quick stop
docker-compose down

# View logs
docker-compose logs -f backend

# Health check
curl http://localhost:3000/api/health

# Reset everything
docker-compose down -v && docker system prune -a

# Backup database
docker exec nafood-mongodb mongodump --uri="mongodb://admin:password123@localhost:27017/nafood?authSource=admin" --out="/tmp/backup"
```

---

## 🎉 **HOÀN THÀNH!**

**🎊 Chúc mừng! Bạn đã chạy thành công NAFOODLVN trên Docker!**

### **🔗 Truy cập ngay:**
- **🏠 Trang chủ**: http://localhost:3000
- **🔍 API Health**: http://localhost:3000/api/health
- **📦 Products**: http://localhost:3000/api/products

### **📱 Next Steps:**
1. ✅ Test các API endpoints
2. ✅ Seed dữ liệu mẫu với `docker-compose exec backend node scripts/seed-data.js`
3. ✅ Tích hợp với frontend
4. ✅ Cấu hình production environment
5. ✅ Setup monitoring và backup

### **🚀 Happy Coding!**

---

**📝 Tài liệu này được cập nhật lần cuối: 24/01/2025**

**💡 Tip: Bookmark trang này để tham khảo nhanh các lệnh Docker!**
