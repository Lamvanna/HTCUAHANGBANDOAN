# 📁 **CẤU TRÚC CODE VÀ CHỨC NĂNG CÁC FILE**

> **Mô tả chi tiết từng file code trong dự án HT Cửa Hàng Bán Đồ Ăn**

---

## 🏗️ **CẤU TRÚC TỔNG QUAN**

```
HTCUAHANGBANDOAN/
├── 📂 client/              # Frontend React Application
├── 📂 server/              # Backend Node.js API
├── 📂 shared/              # Code dùng chung
├── 📂 scripts/             # Scripts tiện ích
├── 📂 public/              # Static files
├── 📂 data/                # Sample data
└── 📂 CONGNGHEPHANMEM/     # Docker configuration
```

---

## 🎨 **FRONTEND (CLIENT) - React Application**

### **📁 client/src/main.jsx**
- **Chức năng**: Entry point của React app
- **Mục đích**: Khởi tạo React app, setup providers
- **Code chính**: ReactDOM.render, Router setup

### **📁 client/src/App.jsx**
- **Chức năng**: Component gốc của ứng dụng
- **Mục đích**: Layout chính, routing, authentication check
- **Code chính**: Route definitions, AuthProvider, Layout

### **📁 client/src/lib/queryClient.js**
- **Chức năng**: Cấu hình TanStack Query
- **Mục đích**: Quản lý cache API calls, data fetching
- **Code chính**: QueryClient config, retry logic, cache time

### **📁 client/src/lib/config.js**
- **Chức năng**: Cấu hình ứng dụng
- **Mục đích**: Centralized config, API URLs, constants
- **Code chính**: API_BASE_URL, app settings

### **📁 client/src/hooks/**
- **Chức năng**: Custom React hooks
- **Mục đích**: Logic tái sử dụng, state management
- **Files**: useAuth.js, useCart.js, useProducts.js

### **📁 client/src/components/**
- **Chức năng**: React components tái sử dụng
- **Mục đích**: UI components, business logic components
- **Cấu trúc**:
  ```
  components/
  ├── ui/                   # Base UI components
  ├── admin/                # Admin-specific components
  ├── customer/             # Customer-specific components
  └── shared/               # Shared components
  ```

### **📁 client/src/components/admin/product-management.jsx**
- **Chức năng**: Quản lý sản phẩm cho admin
- **Mục đích**: CRUD operations cho products
- **Code chính**: Product form, table, modal dialogs

### **📁 client/src/pages/**
- **Chức năng**: Page components
- **Mục đích**: Các trang chính của ứng dụng
- **Files**: HomePage.jsx, ProductsPage.jsx, AdminPage.jsx

---

## ⚙️ **BACKEND (SERVER) - Node.js API**

### **📁 server/index.js**
- **Chức năng**: Entry point của server
- **Mục đích**: Khởi tạo Express app, middleware setup
- **Code chính**:
  ```javascript
  // Khởi tạo Express server
  // Middleware setup (CORS, JSON parsing)
  // Health check endpoint
  // Port finding và server startup
  ```

### **📁 server/routes.js**
- **Chức năng**: Định nghĩa tất cả API routes
- **Mục đích**: RESTful API endpoints, business logic
- **Code chính**:
  ```javascript
  // Authentication routes (/api/auth/*)
  // Product routes (/api/products/*)
  // Order routes (/api/orders/*)
  // User routes (/api/users/*)
  // Review routes (/api/reviews/*)
  // Banner routes (/api/banners/*)
  // Stats routes (/api/stats/*)
  ```

### **📁 server/db.js**
- **Chức năng**: Database connection và operations
- **Mục đích**: MongoDB connection, database utilities
- **Code chính**:
  ```javascript
  // MongoDB connection setup
  // Connection retry logic
  // Database health checks
  // Connection pooling
  ```

### **📁 server/storage.js**
- **Chức năng**: Database operations layer
- **Mục đích**: CRUD operations, data access layer
- **Code chính**:
  ```javascript
  // Product operations (create, read, update, delete)
  // User operations
  // Order operations
  // Review operations
  // Statistics queries
  ```

### **📁 server/vite.js**
- **Chức năng**: Vite integration cho development
- **Mục đích**: Serve frontend trong dev mode
- **Code chính**: Vite dev server setup, static file serving

### **📁 server/swagger.js**
- **Chức năng**: API documentation generator
- **Mục đích**: Tự động generate Swagger UI
- **Code chính**: Swagger configuration, API specs

---

## 🔄 **SHARED CODE**

### **📁 shared/schema.js**
- **Chức năng**: Validation schemas
- **Mục đích**: Data validation cho cả frontend và backend
- **Code chính**:
  ```javascript
  // Zod schemas cho validation
  // loginSchema, registerSchema
  // productSchema, orderSchema
  // reviewSchema, bannerSchema
  ```

---

## 🛠️ **SCRIPTS & UTILITIES**

### **📁 scripts/seed-data.js**
- **Chức năng**: Tạo dữ liệu mẫu
- **Mục đích**: Populate database với sample data
- **Code chính**: Insert users, products, orders vào DB

### **📁 scripts/validate-env.js**
- **Chức năng**: Kiểm tra environment variables
- **Mục đích**: Validate cấu hình trước khi start
- **Code chính**: Check required env vars, security validation

### **📁 import-sample-data.js**
- **Chức năng**: Import dữ liệu từ JSON files
- **Mục đích**: Load sample data vào database
- **Code chính**: Read JSON files, insert to MongoDB

### **📁 import-sample-users.js**
- **Chức năng**: Import user data
- **Mục đích**: Tạo admin, staff, customer accounts
- **Code chính**: Create default users với roles

---

## 📊 **DATA FILES**

### **📁 data/*.json**
- **Chức năng**: Sample data files
- **Mục đích**: Dữ liệu mẫu cho demo
- **Files**:
  - `users.json` - User accounts
  - `products.json` - Product catalog
  - `orders.json` - Sample orders
  - `reviews.json` - Product reviews
  - `banners.json` - Marketing banners
  - `categories.json` - Product categories

---

## 🐳 **DOCKER CONFIGURATION**

### **📁 CONGNGHEPHANMEM/Dockerfile**
- **Chức năng**: Docker image definition
- **Mục đích**: Containerize ứng dụng
- **Code chính**: Multi-stage build, security setup

### **📁 CONGNGHEPHANMEM/docker-compose.yml**
- **Chức năng**: Multi-container setup
- **Mục đích**: Orchestrate app, database, cache
- **Code chính**: Services definition, networking, volumes

---

## ⚙️ **CONFIGURATION FILES**

### **📁 package.json**
- **Chức năng**: Project metadata và dependencies
- **Mục đích**: NPM configuration, scripts
- **Code chính**: Dependencies, scripts, project info

### **📁 vite.config.js**
- **Chức năng**: Vite build configuration
- **Mục đích**: Frontend build setup
- **Code chính**: Build options, plugins, proxy

### **📁 tailwind.config.js**
- **Chức năng**: Tailwind CSS configuration
- **Mục đích**: CSS framework setup
- **Code chính**: Theme, colors, responsive breakpoints

### **📁 .env**
- **Chức năng**: Environment variables
- **Mục đích**: Configuration secrets
- **Code chính**: Database URL, JWT secrets, API keys

---

## 🚀 **BUILD & DEPLOYMENT**

### **📁 start.js**
- **Chức năng**: Development server starter
- **Mục đích**: Start app trong dev mode
- **Code chính**: Concurrently run frontend + backend

### **📁 start-prod.js**
- **Chức năng**: Production server starter
- **Mục đích**: Start app trong production mode
- **Code chính**: Production optimizations, PM2 setup

---

## 📱 **STATIC ASSETS**

### **📁 public/uploads/**
- **Chức năng**: User uploaded files
- **Mục đích**: Store product images, user avatars
- **Files**: Screenshots, product images

### **📁 public/assets/**
- **Chức năng**: Built frontend assets
- **Mục đích**: Production CSS/JS files
- **Files**: Minified CSS, JS bundles

---

## 🔍 **DOCUMENTATION**

### **📁 README.md**
- **Chức năng**: Project documentation
- **Mục đích**: Setup instructions, project overview

### **📁 CHAYDOCKER.md**
- **Chức năng**: Docker usage guide
- **Mục đích**: Hướng dẫn chạy với Docker

### **📁 swagger-spec.json**
- **Chức năng**: API specification
- **Mục đích**: OpenAPI documentation

---

---

## 🔥 **CHI TIẾT CHỨC NĂNG TỪNG FILE**

### **🎯 BACKEND API ENDPOINTS (server/routes.js)**

#### **Authentication Routes**
```javascript
POST /api/auth/register     // Đăng ký tài khoản mới
POST /api/auth/login        // Đăng nhập
POST /api/auth/logout       // Đăng xuất
GET  /api/auth/me          // Lấy thông tin user hiện tại
```

#### **Product Routes**
```javascript
GET    /api/products        // Lấy danh sách sản phẩm
GET    /api/products/:id    // Lấy chi tiết sản phẩm
POST   /api/products        // Tạo sản phẩm mới (Admin)
PUT    /api/products/:id    // Cập nhật sản phẩm (Admin)
DELETE /api/products/:id    // Xóa sản phẩm (Admin)
POST   /api/products/upload // Upload hình ảnh sản phẩm
```

#### **Order Routes**
```javascript
GET    /api/orders          // Lấy danh sách đơn hàng
GET    /api/orders/:id      // Chi tiết đơn hàng
POST   /api/orders          // Tạo đơn hàng mới
PUT    /api/orders/:id      // Cập nhật trạng thái đơn hàng
DELETE /api/orders/:id      // Hủy đơn hàng
```

#### **User Management Routes**
```javascript
GET    /api/users           // Danh sách users (Admin)
GET    /api/users/:id       // Chi tiết user
PUT    /api/users/:id       // Cập nhật thông tin user
DELETE /api/users/:id       // Xóa user (Admin)
PUT    /api/users/:id/role  // Thay đổi role user (Admin)
```

#### **Review Routes**
```javascript
GET    /api/reviews         // Lấy reviews
POST   /api/reviews         // Tạo review mới
PUT    /api/reviews/:id     // Cập nhật review
DELETE /api/reviews/:id     // Xóa review
```

#### **Statistics Routes**
```javascript
GET    /api/stats/overview  // Thống kê tổng quan (Admin)
GET    /api/stats/sales     // Thống kê doanh thu (Admin)
GET    /api/stats/products  // Thống kê sản phẩm (Admin)
GET    /api/stats/users     // Thống kê users (Admin)
```

---

### **🎨 FRONTEND COMPONENTS DETAIL**

#### **Admin Components (client/src/components/admin/)**
```javascript
product-management.jsx      // Quản lý sản phẩm
  ├── ProductTable         // Bảng danh sách sản phẩm
  ├── ProductForm          // Form thêm/sửa sản phẩm
  ├── ProductModal         // Modal chi tiết sản phẩm
  └── ImageUpload          // Upload hình ảnh

order-management.jsx        // Quản lý đơn hàng
  ├── OrderTable           // Bảng danh sách đơn hàng
  ├── OrderDetail          // Chi tiết đơn hàng
  └── StatusUpdate         // Cập nhật trạng thái

user-management.jsx         // Quản lý người dùng
  ├── UserTable            // Bảng danh sách user
  ├── UserForm             // Form thêm/sửa user
  └── RoleManagement       // Quản lý quyền

dashboard.jsx               // Dashboard admin
  ├── StatsCards           // Thẻ thống kê
  ├── SalesChart           // Biểu đồ doanh thu
  └── RecentOrders         // Đơn hàng gần đây
```

#### **Customer Components (client/src/components/customer/)**
```javascript
product-list.jsx            // Danh sách sản phẩm
  ├── ProductCard          // Thẻ sản phẩm
  ├── ProductFilter        // Bộ lọc sản phẩm
  └── ProductSearch        // Tìm kiếm sản phẩm

cart.jsx                    // Giỏ hàng
  ├── CartItem             // Item trong giỏ hàng
  ├── CartSummary          // Tóm tắt giỏ hàng
  └── CheckoutButton       // Nút thanh toán

order-history.jsx           // Lịch sử đơn hàng
  ├── OrderCard            // Thẻ đơn hàng
  └── OrderTracking        // Theo dõi đơn hàng

profile.jsx                 // Thông tin cá nhân
  ├── ProfileForm          // Form cập nhật thông tin
  └── PasswordChange       // Đổi mật khẩu
```

#### **Shared Components (client/src/components/shared/)**
```javascript
header.jsx                  // Header chung
  ├── Navigation           // Menu điều hướng
  ├── UserMenu             // Menu user
  └── CartIcon             // Icon giỏ hàng

footer.jsx                  // Footer chung
sidebar.jsx                 // Sidebar navigation
loading.jsx                 // Loading spinner
error-boundary.jsx          // Error handling
modal.jsx                   // Modal component
toast.jsx                   // Notification toast
```

---

### **🗄️ DATABASE OPERATIONS (server/storage.js)**

#### **Product Operations**
```javascript
createProduct(data)         // Tạo sản phẩm mới
getProducts(filters)        // Lấy danh sách sản phẩm với filter
getProductById(id)          // Lấy sản phẩm theo ID
updateProduct(id, data)     // Cập nhật sản phẩm
deleteProduct(id)           // Xóa sản phẩm
searchProducts(query)       // Tìm kiếm sản phẩm
```

#### **User Operations**
```javascript
createUser(data)            // Tạo user mới
getUserById(id)             // Lấy user theo ID
getUserByEmail(email)       // Lấy user theo email
updateUser(id, data)        // Cập nhật thông tin user
deleteUser(id)              // Xóa user
updateUserRole(id, role)    // Cập nhật role user
```

#### **Order Operations**
```javascript
createOrder(data)           // Tạo đơn hàng mới
getOrders(filters)          // Lấy danh sách đơn hàng
getOrderById(id)            // Lấy đơn hàng theo ID
updateOrderStatus(id, status) // Cập nhật trạng thái
cancelOrder(id)             // Hủy đơn hàng
getOrdersByUser(userId)     // Đơn hàng của user
```

#### **Statistics Operations**
```javascript
getOverviewStats()          // Thống kê tổng quan
getSalesStats(period)       // Thống kê doanh thu
getProductStats()           // Thống kê sản phẩm
getUserStats()              // Thống kê người dùng
getTopProducts()            // Sản phẩm bán chạy
```

---

### **🔐 AUTHENTICATION & SECURITY**

#### **JWT Authentication (server/routes.js)**
```javascript
authenticateToken()         // Middleware xác thực JWT
requireRole(role)           // Middleware kiểm tra quyền
generateToken(user)         // Tạo JWT token
hashPassword(password)      // Hash mật khẩu
comparePassword(plain, hash) // So sánh mật khẩu
```

#### **File Upload Security**
```javascript
multerConfig               // Cấu hình upload file
fileFilter                 // Lọc loại file cho phép
fileSizeLimit             // Giới hạn kích thước file
sanitizeFilename          // Làm sạch tên file
```

---

### **🎛️ ENVIRONMENT CONFIGURATION**

#### **Required Environment Variables (.env)**
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/nafood

# Authentication
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-session-secret

# Server
PORT=3000
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=5MB
UPLOAD_PATH=./public/uploads
```

---

---

## 🚀 **DEPLOYMENT & BUILD PROCESS**

### **Development Workflow**
```bash
npm run dev                 // Start development server
npm run build              // Build for production
npm run preview            // Preview production build
npm run lint               // Check code quality
npm run test               // Run tests
```

### **Docker Workflow**
```bash
docker-compose up -d       // Start all services
docker-compose down        // Stop all services
docker-compose logs        // View logs
docker-compose exec backend sh // Access backend container
```

### **Production Deployment**
```bash
npm run build              // Build frontend
npm run start:prod         // Start production server
pm2 start ecosystem.config.js // PM2 process management
```

---

## 📋 **FILE DEPENDENCIES MAP**

### **Frontend Dependencies**
```
App.jsx
├── components/admin/product-management.jsx
├── components/customer/product-list.jsx
├── components/shared/header.jsx
├── hooks/useAuth.js
├── lib/queryClient.js
└── lib/config.js
```

### **Backend Dependencies**
```
index.js
├── routes.js
│   ├── storage.js
│   └── db.js
├── swagger.js
└── vite.js
```

### **Shared Dependencies**
```
shared/schema.js
├── Used by: server/routes.js
├── Used by: client/src/components/
└── Used by: scripts/validate-env.js
```

---

## 🎯 **MAIN BUSINESS LOGIC FILES**

### **🔥 Core Files (Quan trọng nhất)**
1. **server/routes.js** - Tất cả API logic
2. **server/storage.js** - Database operations
3. **client/src/App.jsx** - Frontend routing
4. **shared/schema.js** - Data validation
5. **server/index.js** - Server setup

### **🎨 UI Files (Giao diện)**
1. **client/src/components/admin/** - Admin interface
2. **client/src/components/customer/** - Customer interface
3. **client/src/components/shared/** - Shared UI components

### **⚙️ Configuration Files**
1. **package.json** - Project dependencies
2. **vite.config.js** - Build configuration
3. **.env** - Environment variables
4. **docker-compose.yml** - Container orchestration

### **📊 Data Files**
1. **data/*.json** - Sample data
2. **scripts/import-*.js** - Data import scripts
3. **public/uploads/** - User uploaded files

---

## 🔄 **DATA FLOW DIAGRAM**

```
User Request → Frontend (React) → API Call → Backend (Express) → Database (MongoDB)
     ↑                                                                      ↓
User Interface ← JSON Response ← API Response ← Business Logic ← Data Query
```

### **Authentication Flow**
```
Login Form → POST /api/auth/login → Validate Credentials → Generate JWT → Store in LocalStorage
```

### **Product Management Flow**
```
Admin Panel → Product Form → POST /api/products → Validate Data → Save to MongoDB → Update UI
```

### **Order Process Flow**
```
Cart → Checkout → POST /api/orders → Process Payment → Update Inventory → Send Confirmation
```

---

## 🛡️ **SECURITY LAYERS**

### **Frontend Security**
- Input validation với Zod schemas
- XSS protection với sanitization
- CSRF protection với tokens
- Route protection với authentication

### **Backend Security**
- JWT authentication
- Password hashing với bcrypt
- File upload validation
- Rate limiting
- CORS configuration

### **Database Security**
- MongoDB connection với authentication
- Data validation trước khi save
- Sanitization để tránh injection
- Backup và recovery procedures

---

## 📈 **PERFORMANCE OPTIMIZATION**

### **Frontend Optimization**
- Code splitting với React.lazy
- Image optimization
- Bundle size optimization với Vite
- Caching với TanStack Query

### **Backend Optimization**
- Database indexing
- Connection pooling
- Response compression
- Static file serving optimization

### **Docker Optimization**
- Multi-stage builds
- Layer caching
- Resource limits
- Health checks

---

## 🧪 **TESTING STRATEGY**

### **Unit Tests**
- Component testing với React Testing Library
- API endpoint testing với Jest
- Database operation testing
- Utility function testing

### **Integration Tests**
- API integration tests
- Database integration tests
- Frontend-backend integration
- Docker container tests

### **E2E Tests**
- User workflow testing
- Admin workflow testing
- Payment process testing
- Mobile responsiveness testing

---

## 📚 **DOCUMENTATION FILES**

### **Technical Documentation**
- **README.md** - Setup và overview
- **CODE_STRUCTURE.md** - File structure (file này)
- **CHAYDOCKER.md** - Docker instructions
- **swagger-spec.json** - API documentation

### **User Documentation**
- Screenshots trong public/uploads/
- User guides trong docs/
- API examples trong API_EXAMPLES.md

---

**💡 Kết luận**: Dự án được tổ chức theo kiến trúc full-stack hiện đại với separation of concerns rõ ràng, security tốt, và scalability cao. Mỗi file có vai trò cụ thể trong hệ thống tổng thể.
