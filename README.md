# 🍜 **NAFOODLVN - Hệ thống quản lý nhà hàng**

> **Hệ thống quản lý nhà hàng toàn diện với giao diện web hiện đại, được xây dựng bằng React và Node.js.**

<div align="center">
  <img src="https://img.shields.io/badge/Docker-Ready-blue?logo=docker&style=for-the-badge" alt="Docker" />
  <img src="https://img.shields.io/badge/Node.js-18+-green?logo=node.js&style=for-the-badge" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&style=for-the-badge" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-5+-green?logo=mongodb&style=for-the-badge" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
</div>

<div align="center">
  <h3>🚀 Nền tảng đặt món ăn Việt Nam hiện đại và chuyên nghiệp</h3>
  <p>Được xây dựng với công nghệ full-stack JavaScript, hỗ trợ đa vai trò người dùng</p>
</div>

---

## ✨ Tính năng nổi bật

### 👥 **Hệ thống đa vai trò**
- 🔐 **Admin**: Quản lý toàn bộ hệ thống, thống kê doanh thu
- 👨‍💼 **Staff**: Xử lý đơn hàng và chăm sóc khách hàng  
- 👤 **Customer**: Đặt món và theo dõi đơn hàng real-time

### 🛍️ **Quản lý sản phẩm thông minh**
- 📸 Upload và tự động nén hình ảnh
- 🏷️ Phân loại món ăn chi tiết theo danh mục
- ⭐ Hệ thống đánh giá và review có kiểm duyệt
- 🔍 Tìm kiếm và lọc sản phẩm thông minh

### 🛒 **Giỏ hàng & Thanh toán**
- 💾 Lưu trữ real-time với localStorage
- 💳 Đa phương thức thanh toán (COD, chuyển khoản, ví điện tử)
- 📱 Responsive hoàn hảo trên mọi thiết bị
- 🔔 Thông báo trạng thái đơn hàng tức thời

### 📊 **Dashboard & Báo cáo**
- 📈 Thống kê doanh thu và đơn hàng chi tiết
- 📋 Xuất báo cáo PDF và CSV
- 📊 Biểu đồ trực quan với Recharts
- 🎯 Phân tích hiệu suất kinh doanh

## 🛠️ Công nghệ & Thư viện

### 🎨 **Frontend**
```javascript
React 18          // UI framework hiện đại với hooks
Wouter           // Lightweight routing (2KB)
TanStack Query   // Data fetching & caching thông minh
Tailwind CSS     // Utility-first CSS framework
Radix UI         // Accessible component primitives
Framer Motion    // Animation library mượt mà
Recharts         // Beautiful charts cho dashboard
React Hook Form  // Form management hiệu quả
Zod              // TypeScript-first schema validation
```

### ⚙️ **Backend**
```javascript
Node.js          // JavaScript runtime environment
Express.js       // Minimal web framework
MongoDB          // NoSQL database linh hoạt
Mongoose         // Elegant MongoDB ODM
JWT              // Secure authentication
Bcrypt           // Password hashing algorithm
Multer           // File upload middleware
Express Session  // Session management
```

### 🔧 **Development Tools**
```javascript
Vite             // Lightning fast build tool
ESBuild          // Extremely fast bundler
PostCSS          // CSS processing pipeline
Concurrently     // Run multiple npm scripts
```

## 🚀 Cài đặt và Chạy

### 📋 **Yêu cầu hệ thống**
- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm hoặc yarn

### ⚡ **Cài đặt nhanh**
```bash
# Clone repository
git clone https://github.com/Lamvanna/CHBANDOAN.git
cd CHBANDOAN

# Cài đặt dependencies
npm install

# Tạo file .env
cp .env.example .env

# Khởi động MongoDB (nếu cài local)
mongod

# Chạy ứng dụng
npm run dev
```

### 🌐 **Truy cập ứng dụng**
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Database**: MongoDB trên port 27017

## 🔐 Tài khoản mặc định

```javascript
// Admin Account
Email: admin@nafood.com
Password: admin123

// Staff Account  
Email: staff@nafood.com
Password: staff123

// Customer Account
Email: customer@nafood.com  
Password: customer123
```

## 📁 Cấu trúc dự án

```
na-food/
├── 📂 client/              # React frontend
│   ├── 📂 src/
│   │   ├── 📂 components/  # UI components
│   │   ├── 📂 pages/       # Page components
│   │   ├── 📂 lib/         # Utilities & hooks
│   │   └── 📂 styles/      # CSS files
├── 📂 server/              # Express backend
│   ├── 📄 index.js         # Server entry point
│   ├── 📄 routes.js        # API routes
│   └── 📄 db.js           # Database connection
├── 📂 shared/              # Shared schemas
├── 📂 public/              # Static files
└── 📄 package.json         # Dependencies
```

## 🎯 Scripts NPM

```bash
# Development
npm run dev              # Chạy cả frontend và backend
npm run dev:client       # Chỉ chạy frontend
npm run dev:server       # Chỉ chạy backend

# Production
npm run build           # Build production
npm run start           # Chạy production server
npm run start:prod      # Chạy với PM2

# Database
npm run seed            # Tạo dữ liệu mẫu
```

## 🔒 Bảo mật

- 🔐 JWT Authentication với 7-day expiry
- 🔒 Bcrypt password hashing
- 🛡️ Input validation với Zod schemas
- 🚫 CORS configuration
- 🔍 Rate limiting protection

## 📱 Responsive Design

- 📱 **Mobile First**: Thiết kế ưu tiên mobile
- 💻 **Desktop Optimized**: Tối ưu cho desktop
- 🖥️ **Tablet Friendly**: Hỗ trợ tablet hoàn hảo
- ⚡ **Fast Loading**: Tối ưu tốc độ tải trang

## 🤝 Đóng góp

1. Fork repository này
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📞 Liên hệ & Hỗ trợ

- 📧 **Email**: lamvanna@example.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/Lamvanna/CHBANDOAN/issues)
- 📖 **Documentation**: [Wiki](https://github.com/Lamvanna/CHBANDOAN/wiki)

## 📄 License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.

---

<div align="center">
  <h3>🍜 Na Food - Bringing Vietnamese cuisine to your fingertips! 🇻🇳</h3>
  <p>Made with ❤️ by <a href="https://github.com/Lamvanna">Lamvanna</a></p>
</div>
