# 📚 **API EXAMPLES - VÍ DỤ SỬ DỤNG CHI TIẾT**

> **Hướng dẫn chi tiết cách sử dụng các API endpoints với ví dụ request/response**

---

## 🔐 **1. XÁC THỰC (AUTHENTICATION)**

### **Đăng ký tài khoản**
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789"
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 123,
    "email": "customer@example.com",
    "fullName": "Nguyễn Văn A",
    "role": "customer"
  }
}
```

### **Đăng nhập**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@nafood.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@nafood.com",
    "fullName": "Admin User",
    "role": "admin"
  }
}
```

---

## 🍽️ **2. QUẢN LÝ SẢN PHẨM**

### **Lấy danh sách sản phẩm**
```http
GET /api/products?category=main-dish&search=phở&page=1&limit=10
```

**Response:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Phở Bò Tái",
      "description": "Phở bò tái truyền thống Hà Nội",
      "price": 45000,
      "category": "main-dish",
      "image": "/uploads/pho-bo-tai.jpg",
      "available": true,
      "rating": 4.5,
      "reviewCount": 128
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### **Tạo sản phẩm mới (Admin/Staff)**
```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Bún Bò Huế",
  "description": "Bún bò Huế cay nồng đặc trưng miền Trung",
  "price": 50000,
  "category": "main-dish",
  "image": "/uploads/bun-bo-hue.jpg",
  "available": true
}
```

**Response:**
```json
{
  "id": 25,
  "name": "Bún Bò Huế",
  "description": "Bún bò Huế cay nồng đặc trưng miền Trung",
  "price": 50000,
  "category": "main-dish",
  "image": "/uploads/bun-bo-hue.jpg",
  "available": true,
  "createdAt": "2025-07-24T10:30:00Z"
}
```

---

## 🛒 **3. QUẢN LÝ ĐỚN HÀNG**

### **Tạo đơn hàng mới**
```http
POST /api/orders
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 45000
    },
    {
      "productId": 5,
      "quantity": 1,
      "price": 25000
    }
  ],
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
  },
  "paymentMethod": "cod",
  "notes": "Giao hàng buổi chiều"
}
```

**Response:**
```json
{
  "id": 1001,
  "orderNumber": "ORD-20250724-1001",
  "status": "pending",
  "items": [
    {
      "productId": 1,
      "productName": "Phở Bò Tái",
      "quantity": 2,
      "price": 45000,
      "subtotal": 90000
    },
    {
      "productId": 5,
      "productName": "Chả Cá Lã Vọng",
      "quantity": 1,
      "price": 25000,
      "subtotal": 25000
    }
  ],
  "total": 115000,
  "customerInfo": {
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "address": "123 Đường ABC, Quận 1, TP.HCM"
  },
  "paymentMethod": "cod",
  "createdAt": "2025-07-24T10:45:00Z"
}
```

### **Cập nhật trạng thái đơn hàng (Staff/Admin)**
```http
PUT /api/orders/1001
Authorization: Bearer <staff-token>
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Đơn hàng đã được xác nhận, đang chuẩn bị"
}
```

**Response:**
```json
{
  "id": 1001,
  "status": "confirmed",
  "notes": "Đơn hàng đã được xác nhận, đang chuẩn bị",
  "updatedAt": "2025-07-24T11:00:00Z"
}
```

---

## ⭐ **4. QUẢN LÝ ĐÁNH GIÁ**

### **Tạo đánh giá sản phẩm**
```http
POST /api/reviews
Authorization: Bearer <customer-token>
Content-Type: application/json

{
  "productId": 1,
  "orderId": 1001,
  "rating": 5,
  "comment": "Phở rất ngon, nước dùng đậm đà, thịt bò tươi ngon!"
}
```

**Response:**
```json
{
  "id": 501,
  "productId": 1,
  "userId": 123,
  "userName": "Nguyễn Văn A",
  "rating": 5,
  "comment": "Phở rất ngon, nước dùng đậm đà, thịt bò tươi ngon!",
  "status": "pending",
  "createdAt": "2025-07-24T12:00:00Z"
}
```

---

## 📊 **5. THỐNG KÊ VÀ BÁO CÁO**

### **Lấy thống kê tổng quan (Admin)**
```http
GET /api/stats
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "overview": {
    "totalOrders": 1250,
    "totalRevenue": 125000000,
    "totalCustomers": 450,
    "totalProducts": 85
  },
  "todayStats": {
    "orders": 25,
    "revenue": 2500000,
    "newCustomers": 5
  },
  "monthlyRevenue": [
    {"month": "2025-01", "revenue": 45000000},
    {"month": "2025-02", "revenue": 52000000},
    {"month": "2025-03", "revenue": 48000000}
  ],
  "topCategories": [
    {"category": "main-dish", "orders": 450, "revenue": 45000000},
    {"category": "appetizer", "orders": 320, "revenue": 15000000}
  ]
}
```

### **Lấy sản phẩm bán chạy**
```http
GET /api/stats/top-products?limit=5
Authorization: Bearer <admin-token>
```

**Response:**
```json
{
  "topProducts": [
    {
      "id": 1,
      "name": "Phở Bò Tái",
      "totalOrders": 245,
      "totalRevenue": 11025000,
      "averageRating": 4.5
    },
    {
      "id": 3,
      "name": "Bún Chả Hà Nội",
      "totalOrders": 198,
      "totalRevenue": 9900000,
      "averageRating": 4.3
    }
  ]
}
```

---

## 📁 **6. UPLOAD FILE**

### **Upload hình ảnh sản phẩm**
```http
POST /api/upload
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

file: [binary-image-data]
```

**Response:**
```json
{
  "message": "Upload thành công",
  "filename": "product-1721812800000-123456789.jpg",
  "path": "/uploads/product-1721812800000-123456789.jpg",
  "originalName": "pho-bo-tai.jpg",
  "size": 245760
}
```

---

## ❌ **7. XỬ LÝ LỖI**

### **Lỗi xác thực**
```json
{
  "message": "Yêu cầu token xác thực",
  "status": 401
}
```

### **Lỗi phân quyền**
```json
{
  "message": "Không có quyền truy cập",
  "status": 403
}
```

### **Lỗi validation**
```json
{
  "message": "Dữ liệu không hợp lệ",
  "errors": [
    {
      "path": ["email"],
      "message": "Email không hợp lệ"
    },
    {
      "path": ["password"],
      "message": "Mật khẩu phải có ít nhất 6 ký tự"
    }
  ],
  "status": 400
}
```

### **Lỗi không tìm thấy**
```json
{
  "message": "Không tìm thấy sản phẩm",
  "status": 404
}
```

---

## 🔧 **8. TESTING VỚI CURL**

### **Test đăng nhập**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@nafood.com","password":"admin123"}'
```

### **Test lấy sản phẩm với token**
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Test tạo đơn hàng**
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"items":[{"productId":1,"quantity":2,"price":45000}],"customerInfo":{"fullName":"Test User","phone":"0123456789","address":"Test Address"},"paymentMethod":"cod"}'
```

---

**💡 Tip**: Sử dụng Postman hoặc Insomnia để test API dễ dàng hơn!
