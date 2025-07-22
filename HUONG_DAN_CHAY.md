# 🚀 Hướng dẫn chạy ứng dụng Na Food

## 📋 Yêu cầu hệ thống

### Phần mềm cần thiết:
- **Node.js**: Version 18+ ([Tải tại đây](https://nodejs.org/))
- **npm**: Đi kèm với Node.js
- **Git**: Để clone project ([Tải tại đây](https://git-scm.com/))

### Hệ điều hành hỗ trợ:
- ✅ Windows 10/11
- ✅ macOS
- ✅ Linux (Ubuntu, CentOS, etc.)

## 📥 Cài đặt dự án

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd FoodBuddy
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:
```env
DATABASE_URL=mongodb+srv://admin:ZQJEPt9VIlcRGVp9@lamv.tzc1slv.mongodb.net/
JWT_SECRET=your-jwt-secret-key-here
NODE_ENV=development
```

## 🏃‍♂️ Chạy ứng dụng

### 🔥 Development (Khuyến nghị)
```bash
npm run dev
```

**Kết quả mong đợi:**
```
🍔 Starting Na Food application manually...
📝 Environment: development
📝 This is a manual start - the server will not auto-restart
🔧 To stop the server, press Ctrl+C

Connected to MongoDB
8:23:22 PM [express] serving on port 5000 (host: localhost)
🌐 Open your browser and go to: http://localhost:5000
```

### 🏭 Production
```bash
# Bước 1: Build ứng dụng
npm run build

# Bước 2: Chạy production server
npm run start:prod
```

### 🐳 Docker (Tùy chọn)
```bash
# Chạy tất cả services
docker-compose up

# Chỉ chạy ứng dụng
docker-compose up na-food-app
```

## 🌐 Truy cập ứng dụng

### URLs chính:
- **Website**: http://localhost:5000 (hoặc port khác nếu 5000 bận)
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

### Tài khoản mặc định:
- **Admin**: 
  - Email: `admin@tgdd.com`
  - Password: `123456`

## 🔧 Các lệnh hữu ích

### Scripts NPM:
```bash
npm run dev          # Chạy development server
npm run build        # Build cho production
npm run start        # Chạy production server
npm run start:prod   # Chạy production với NODE_ENV=production
npm run check        # Kiểm tra TypeScript
```

### Chạy trực tiếp:
```bash
node start.js        # Development mode
node start-prod.js   # Production mode
```

## ⚠️ Xử lý lỗi thường gặp

### 1. Port đã được sử dụng
**Lỗi**: `EADDRINUSE: address already in use`
**Giải pháp**: Ứng dụng sẽ tự động tìm port trống (5001, 5002, ...)

### 2. MongoDB connection failed
**Lỗi**: `Failed to connect to MongoDB`
**Giải pháp**: 
- Kiểm tra `DATABASE_URL` trong file `.env`
- Đảm bảo internet connection ổn định

### 3. NODE_ENV not recognized (Windows)
**Lỗi**: `'NODE_ENV' is not recognized`
**Giải pháp**: Đã được sửa - sử dụng `npm run dev` thay vì set NODE_ENV trực tiếp

### 4. Permission denied
**Lỗi**: `EACCES: permission denied`
**Giải pháp**: 
```bash
# Windows: Chạy PowerShell as Administrator
# macOS/Linux: Sử dụng sudo (không khuyến nghị) hoặc thay đổi port
```

## 🛑 Dừng ứng dụng

### Cách dừng:
1. **Nhấn `Ctrl + C`** trong terminal
2. **Đóng terminal/command prompt**
3. **Task Manager** (Windows) hoặc **Activity Monitor** (macOS)

### Kiểm tra process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <process-id> /F

# macOS/Linux
lsof -i :5000
kill -9 <process-id>
```

## 📁 Cấu trúc dự án

```
FoodBuddy/
├── client/                    # Frontend React
├── server/                    # Backend Express
├── shared/                    # Shared schemas
├── start.js                   # Development start script
├── start-prod.js             # Production start script
├── package.json              # Dependencies & scripts
├── .env                      # Environment variables
├── README.md                 # Project overview
├── HUONG_DAN_CHAY.md        # File này
└── README_MANUAL_START.md    # Manual start guide
```

## 🔍 Debug và Logs

### Xem logs:
- **Development**: Logs hiển thị trực tiếp trong terminal
- **Production**: Tương tự, hoặc redirect to file

### Debug mode:
```bash
# Thêm debug logs
DEBUG=* npm run dev
```

## 📞 Hỗ trợ

### Tài liệu tham khảo:
- `README.md` - Tổng quan dự án
- `README_MANUAL_START.md` - Hướng dẫn manual start
- `CLEANUP_SUMMARY.md` - Tóm tắt cleanup
- `VSCODE_GUIDE.md` - Hướng dẫn VSCode
- `DOCKER_GUIDE.md` - Hướng dẫn Docker

### Liên hệ:
- **Issues**: Tạo GitHub issue
- **Email**: [Thêm email support nếu có]

---

## ✅ Checklist nhanh

- [ ] Đã cài Node.js 18+
- [ ] Đã chạy `npm install`
- [ ] Đã tạo file `.env`
- [ ] Đã chạy `npm run dev`
- [ ] Truy cập được http://localhost:5000
- [ ] Đăng nhập được với admin@tgdd.com

**🎉 Chúc bạn sử dụng Na Food vui vẻ!** 🍜
