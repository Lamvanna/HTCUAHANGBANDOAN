# Na Food - Vietnamese Food Delivery Platform

## 🍜 Giới thiệu

Na Food là một nền tảng đặt món ăn Việt Nam hiện đại, được xây dựng với full-stack JavaScript và hỗ trợ nhiều vai trò người dùng khác nhau.

## 🚀 Tính năng chính

- **Đa vai trò**: Admin, Staff, và Customer với quyền hạn riêng biệt
- **Quản lý sản phẩm**: Thêm, sửa, xóa món ăn với hình ảnh tự động nén
- **Giỏ hàng**: Quản lý đơn hàng real-time với localStorage
- **Thanh toán**: Hỗ trợ COD, chuyển khoản, ví điện tử
- **Đánh giá**: Hệ thống review có kiểm duyệt
- **Thống kê**: Dashboard admin với charts và báo cáo
- **Xuất báo cáo**: PDF và CSV cho đơn hàng

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, MongoDB
- **Database**: MongoDB với auto-incrementing ID
- **Authentication**: JWT với bcrypt
- **Build Tools**: Vite, esbuild
- **Containerization**: Docker với multi-stage builds

## 📖 Hướng dẫn cài đặt

### 1. Phát triển với VSCode
Xem hướng dẫn chi tiết: [VSCODE_GUIDE.md](./VSCODE_GUIDE.md)

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Truy cập: http://localhost:5000
```

### 2. Chạy với Docker
Xem hướng dẫn chi tiết: [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

```bash
# Chạy đầy đủ với Docker Compose
docker-compose up -d

# Chỉ chạy ứng dụng
docker-compose up -d na-food-app
```

## 🔐 Tài khoản mặc định

- **Admin**: admin@tgdd.com / 123456
- **Mongo Express**: admin / admin123 (khi chạy Docker)

## 📁 Cấu trúc dự án

```
na-food/
├── client/                 # React frontend
├── server/                 # Express backend
├── shared/                 # Shared schemas
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Multi-service setup
├── VSCODE_GUIDE.md        # VSCode development guide
├── DOCKER_GUIDE.md        # Docker deployment guide
└── replit.md             # Project documentation
```

## 🔧 Scripts NPM

```bash
npm run dev        # Development server
npm run build      # Production build
npm run start      # Production server
npm run check      # TypeScript check
```

## 🐳 Docker Commands

```bash
# Build image
docker build -t na-food:latest .

# Run with compose
docker-compose up -d

# View logs
docker-compose logs -f na-food-app

# Stop services
docker-compose down
```

## 🌐 API Endpoints

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/products` - Get products
- `POST /api/orders` - Create order
- `GET /api/statistics/overview` - Admin statistics

## 📊 Monitoring

- **Health Check**: `/api/health`
- **Logs**: `docker-compose logs -f`
- **Mongo Express**: `http://localhost:8081` (Docker)
- **Nginx**: `http://localhost:80` (Production)

## 🔄 Development Workflow

1. Clone repository
2. Install dependencies: `npm install`
3. Configure environment: `.env`
4. Start development: `npm run dev`
5. Build for production: `npm run build`
6. Deploy with Docker: `docker-compose up -d`

## 🚀 Deployment Options

### Docker (Recommended)
- Multi-stage builds cho optimization
- Nginx reverse proxy với SSL
- MongoDB local hoặc cloud
- Auto-restart và health checks

### Direct Node.js
- Traditional npm build và start
- Cần cài đặt MongoDB riêng
- Cần cấu hình reverse proxy

## 🔒 Security Features

- JWT authentication với 7-day expiry
- bcrypt password hashing
- Rate limiting trong Nginx
- Input validation với Zod
- CORS configuration

## 📝 Logs và Debugging

```bash
# Development logs
npm run dev

# Docker logs
docker-compose logs -f na-food-app

# Health check
curl http://localhost:5000/api/health
```

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Create pull request

## 📞 Support

- **Issues**: GitHub Issues
- **Documentation**: `replit.md`
- **Guides**: `VSCODE_GUIDE.md`, `DOCKER_GUIDE.md`

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Na Food** - Bringing Vietnamese cuisine to your fingertips! 🍜🇻🇳