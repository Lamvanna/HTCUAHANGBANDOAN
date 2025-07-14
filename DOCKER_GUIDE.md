# Hướng dẫn chạy Na Food với Docker

## Giới thiệu

Docker containerization cho phép bạn chạy ứng dụng Na Food một cách nhất quán trên bất kỳ hệ thống nào mà không cần cài đặt Node.js hay MongoDB trực tiếp.

## Yêu cầu hệ thống

### 1. Cài đặt Docker
- **Docker Desktop** (Windows/Mac): https://www.docker.com/products/docker-desktop/
- **Docker Engine** (Linux): https://docs.docker.com/engine/install/
- **Docker Compose**: Thường được bao gồm với Docker Desktop

### 2. Kiểm tra cài đặt
```bash
docker --version
docker-compose --version
```

## Cách chạy ứng dụng

### 1. Chạy với Docker Compose (Khuyến nghị)

#### Chạy đầy đủ với MongoDB local:
```bash
# Clone repository
git clone <repository-url>
cd na-food

# Chạy tất cả services
docker-compose up -d

# Xem logs
docker-compose logs -f na-food-app
```

#### Chạy chỉ ứng dụng (sử dụng MongoDB cloud):
```bash
# Chạy chỉ ứng dụng chính
docker-compose up -d na-food-app

# Hoặc với custom environment
docker-compose up -d na-food-app --env-file .env.production
```

### 2. Chạy với Docker build trực tiếp

```bash
# Build image
docker build -t na-food:latest .

# Chạy container
docker run -d \
  --name na-food-app \
  -p 5000:5000 \
  -e DATABASE_URL="mongodb+srv://admin:ZQJEPt9VIlcRGVp9@lamv.tzc1slv.mongodb.net/" \
  -e JWT_SECRET="your-jwt-secret" \
  -e NODE_ENV="production" \
  na-food:latest
```

## Cấu hình môi trường

### 1. File .env cho Docker
Tạo file `.env.docker`:
```env
# Application
NODE_ENV=production
PORT=5000

# Database - MongoDB Cloud
DATABASE_URL=mongodb+srv://admin:ZQJEPt9VIlcRGVp9@lamv.tzc1slv.mongodb.net/

# Database - Local MongoDB (nếu dùng docker-compose)
# DATABASE_URL=mongodb://admin:password123@mongo:27017/na_food?authSource=admin

# JWT
JWT_SECRET=your-very-secure-jwt-secret-key-for-production

# MongoDB Local (cho docker-compose)
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password123
MONGO_INITDB_DATABASE=na_food

# Mongo Express
ME_CONFIG_MONGODB_ADMINUSERNAME=admin
ME_CONFIG_MONGODB_ADMINPASSWORD=password123
ME_CONFIG_BASICAUTH_USERNAME=admin
ME_CONFIG_BASICAUTH_PASSWORD=admin123
```

### 2. Sử dụng file môi trường
```bash
# Chạy với custom env file
docker-compose --env-file .env.docker up -d
```

## Services có sẵn

### 1. Na Food Application
- **Port**: 5000
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 2. MongoDB Database (Optional)
- **Port**: 27017
- **Username**: admin
- **Password**: password123
- **Database**: na_food

### 3. Mongo Express (Optional)
- **Port**: 8081
- **URL**: http://localhost:8081
- **Username**: admin
- **Password**: admin123

### 4. Nginx Reverse Proxy (Optional)
- **Port**: 80 (HTTP), 443 (HTTPS)
- **URL**: http://localhost

## Các lệnh Docker hữu ích

### Quản lý containers
```bash
# Xem containers đang chạy
docker ps

# Xem logs
docker logs na-food-app
docker-compose logs -f na-food-app

# Restart container
docker restart na-food-app
docker-compose restart na-food-app

# Stop containers
docker-compose down

# Stop và xóa volumes
docker-compose down -v
```

### Debugging
```bash
# Truy cập vào container
docker exec -it na-food-app sh

# Chạy lệnh trong container
docker exec na-food-app npm --version

# Xem resource usage
docker stats na-food-app
```

### Quản lý images
```bash
# Xem images
docker images

# Xóa image
docker rmi na-food:latest

# Build lại image
docker-compose build --no-cache na-food-app
```

## Production Deployment

### 1. Cấu hình Production
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  na-food-app:
    image: na-food:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    restart: unless-stopped
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - na-food-app
    restart: unless-stopped
```

### 2. Chạy production
```bash
# Build production image
docker build -t na-food:latest .

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

### 3. SSL/HTTPS Setup
```bash
# Tạo thư mục SSL
mkdir ssl

# Generate self-signed certificate (cho testing)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/key.pem -out ssl/cert.pem

# Hoặc sử dụng Let's Encrypt
# certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

## Monitoring và Logging

### 1. Health Checks
```bash
# Kiểm tra health
curl http://localhost:5000/api/health

# Xem health status
docker inspect --format='{{.State.Health.Status}}' na-food-app
```

### 2. Logging
```bash
# Realtime logs
docker-compose logs -f

# Logs của service cụ thể
docker-compose logs -f na-food-app

# Logs với timestamp
docker-compose logs -t na-food-app
```

### 3. Monitoring với Portainer (Optional)
```bash
# Chạy Portainer
docker run -d -p 9000:9000 -p 8000:8000 \
  --name portainer \
  --restart=unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
```

## Backup và Restore

### 1. Backup MongoDB
```bash
# Backup database
docker exec na-food-mongodb mongodump --out /backup

# Copy backup ra host
docker cp na-food-mongodb:/backup ./backup
```

### 2. Restore MongoDB
```bash
# Copy backup vào container
docker cp ./backup na-food-mongodb:/backup

# Restore database
docker exec na-food-mongodb mongorestore /backup
```

## Troubleshooting

### 1. Container không start
```bash
# Xem logs chi tiết
docker logs na-food-app

# Kiểm tra resource
docker system df
docker system prune
```

### 2. Database connection error
```bash
# Kiểm tra network
docker network ls
docker network inspect na-food_na-food-network

# Test connection
docker exec na-food-app ping mongo
```

### 3. Port conflicts
```bash
# Kiểm tra port đang sử dụng
netstat -tlnp | grep :5000
lsof -i :5000

# Thay đổi port mapping
docker-compose up -d -p 5001:5000
```

### 4. Memory/CPU issues
```bash
# Kiểm tra resource usage
docker stats

# Giới hạn resource
docker update --memory=512m --cpus=1.0 na-food-app
```

## Docker Compose Commands

### Development
```bash
# Chạy development mode
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Rebuild và restart
docker-compose up -d --build

# Chạy một service cụ thể
docker-compose up -d na-food-app
```

### Production
```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Scale services
docker-compose up -d --scale na-food-app=3
```

## Security Best Practices

### 1. Environment Variables
- Không commit file `.env` có secrets
- Sử dụng Docker secrets cho production
- Thay đổi default passwords

### 2. Network Security
```bash
# Tạo custom network
docker network create na-food-secure

# Chạy với custom network
docker-compose --network na-food-secure up -d
```

### 3. Image Security
```bash
# Scan image vulnerabilities
docker scan na-food:latest

# Sử dụng non-root user
# (đã được cấu hình trong Dockerfile)
```

## Performance Optimization

### 1. Multi-stage builds
- Dockerfile đã được tối ưu với multi-stage build
- Giảm kích thước image cuối cùng

### 2. Caching
```bash
# Build với cache
docker build --cache-from na-food:latest -t na-food:latest .

# Disable cache khi cần
docker build --no-cache -t na-food:latest .
```

### 3. Resource limits
```yaml
# Trong docker-compose.yml
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 512M
    reservations:
      cpus: '0.5'
      memory: 256M
```

## Tài khoản mặc định

Khi chạy lần đầu, hệ thống sẽ tự động tạo:

- **Admin**: 
  - Email: admin@tgdd.com
  - Password: 123456
  - Role: admin

- **MongoDB Admin**:
  - Username: admin
  - Password: password123

- **Mongo Express**:
  - Username: admin
  - Password: admin123

## Liên hệ và Hỗ trợ

- **Documentation**: Xem `replit.md` và `VSCODE_GUIDE.md`
- **Issues**: Tạo GitHub issue
- **Docker Hub**: (nếu có) registry của images