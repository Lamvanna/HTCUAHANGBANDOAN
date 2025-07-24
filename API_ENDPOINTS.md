# 📋 **API ENDPOINTS - HỆ THỐNG CỬA HÀNG BÁN ĐỒ ĂN**

> **Danh sách đầy đủ các API endpoints và chức năng của hệ thống**

---

## 🔐 **XÁC THỰC (AUTHENTICATION)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Xác thực | `/api/auth/register` | POST | Đăng ký tài khoản người dùng mới |
| Xác thực | `/api/auth/login` | POST | Đăng nhập, trả về token JWT |
| Xác thực | `/api/health` | GET | Kiểm tra trạng thái hệ thống |

---

## 👤 **QUẢN LÝ NGƯỜI DÙNG (USER MANAGEMENT)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Người dùng | `/api/users/profile` | GET | Truy xuất thông tin người dùng hiện tại |
| Người dùng | `/api/users/profile` | PUT | Cập nhật thông tin cá nhân |
| Người dùng | `/api/users` | GET | Lấy danh sách tất cả người dùng (Admin) |
| Người dùng | `/api/users/:id/role` | PUT | Thay đổi vai trò người dùng (Admin) |
| Người dùng | `/api/users/:id/status` | PUT | Thay đổi trạng thái người dùng (Admin) |

---

## 🍽️ **QUẢN LÝ SẢN PHẨM (PRODUCT MANAGEMENT)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Sản phẩm | `/api/products` | GET | Lấy danh sách tất cả sản phẩm |
| Sản phẩm | `/api/products/:id` | GET | Lấy chi tiết sản phẩm theo ID |
| Sản phẩm | `/api/products` | POST | Tạo sản phẩm mới (Admin/Staff) |
| Sản phẩm | `/api/products/:id` | PUT | Cập nhật thông tin sản phẩm (Admin/Staff) |
| Sản phẩm | `/api/products/:id` | DELETE | Xóa sản phẩm (Admin) |

---

## 🛒 **QUẢN LÝ ĐỚN HÀNG (ORDER MANAGEMENT)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Đơn hàng | `/api/orders` | GET | Lấy danh sách đơn hàng |
| Đơn hàng | `/api/orders/:id` | GET | Lấy chi tiết đơn hàng theo ID |
| Đơn hàng | `/api/orders` | POST | Tạo đơn hàng mới |
| Đơn hàng | `/api/orders/:id` | PUT | Cập nhật trạng thái đơn hàng (Staff/Admin) |
| Đơn hàng | `/api/orders/:id` | DELETE | Hủy đơn hàng (Admin) |

---

## ⭐ **QUẢN LÝ ĐÁNH GIÁ (REVIEW MANAGEMENT)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Đánh giá | `/api/reviews` | GET | Lấy danh sách đánh giá |
| Đánh giá | `/api/reviews` | POST | Tạo đánh giá mới (Customer) |
| Đánh giá | `/api/reviews/:id` | PUT | Cập nhật trạng thái đánh giá (Admin) |
| Đánh giá | `/api/reviews/:id` | DELETE | Xóa đánh giá (Admin) |

---

## 🎨 **QUẢN LÝ BANNER (BANNER MANAGEMENT)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Banner | `/api/banners` | GET | Lấy danh sách banner |
| Banner | `/api/banners` | POST | Tạo banner mới (Admin) |
| Banner | `/api/banners/:id` | PUT | Cập nhật banner (Admin) |
| Banner | `/api/banners/:id` | DELETE | Xóa banner (Admin) |

---

## 📊 **BÁO CÁO VÀ THỐNG KÊ (ANALYTICS)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| Thống kê | `/api/stats` | GET | Lấy thống kê tổng quan (Admin) |
| Thống kê | `/api/stats/top-products` | GET | Lấy danh sách sản phẩm bán chạy |
| Báo cáo | `/api/export/pdf` | GET | Xuất báo cáo PDF (Admin) |
| Báo cáo | `/api/export/csv` | GET | Xuất báo cáo CSV (Admin) |

---

## 📁 **QUẢN LÝ FILE (FILE MANAGEMENT)**

| **Phân hệ** | **Endpoint** | **Phương thức** | **Mô tả** |
|-------------|--------------|-----------------|-----------|
| File | `/api/upload` | POST | Upload hình ảnh sản phẩm |
| File | `/uploads/:filename` | GET | Truy cập file đã upload |

---

## 🔑 **PHÂN QUYỀN TRUY CẬP**

### **🔓 Public (Không cần xác thực)**
- `GET /api/health` - Kiểm tra sức khỏe hệ thống
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/products` - Xem danh sách sản phẩm
- `GET /api/products/:id` - Xem chi tiết sản phẩm
- `GET /api/banners` - Xem banner công khai

### **👤 Customer (Khách hàng)**
- `GET /api/users/profile` - Xem thông tin cá nhân
- `PUT /api/users/profile` - Cập nhật thông tin cá nhân
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Xem đơn hàng của mình
- `POST /api/reviews` - Tạo đánh giá sản phẩm

### **👨‍💼 Staff (Nhân viên)**
- Tất cả quyền của Customer
- `POST /api/products` - Thêm sản phẩm mới
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng
- `GET /api/orders` - Xem tất cả đơn hàng

### **👑 Admin (Quản trị viên)**
- Tất cả quyền của Staff
- `DELETE /api/products/:id` - Xóa sản phẩm
- `DELETE /api/orders/:id` - Hủy đơn hàng
- `GET /api/users` - Quản lý người dùng
- `PUT /api/users/:id/role` - Thay đổi vai trò
- `PUT /api/users/:id/status` - Thay đổi trạng thái
- `POST /api/banners` - Quản lý banner
- `GET /api/stats` - Xem thống kê
- `GET /api/export/*` - Xuất báo cáo

---

## 🚀 **CÁCH SỬ DỤNG**

### **1. Khởi động hệ thống**
```bash
# Chạy với Docker (khuyến nghị)
docker-compose up --build -d

# Hoặc chạy trực tiếp
npm run dev
```

### **2. Base URL**
```
http://localhost:3000/api
```

### **3. Authentication Header**
```javascript
Authorization: Bearer <your-jwt-token>
```

### **4. Ví dụ sử dụng**
```javascript
// Đăng nhập
POST /api/auth/login
{
  "email": "admin@nafood.com",
  "password": "admin123"
}

// Lấy danh sách sản phẩm
GET /api/products?category=main-dish&search=phở

// Tạo đơn hàng
POST /api/orders
{
  "items": [{"productId": 1, "quantity": 2}],
  "customerInfo": {...}
}
```

---

**📝 Lưu ý**: Tất cả endpoints đều trả về JSON và sử dụng HTTP status codes chuẩn.
