# Hướng dẫn chạy Na Food trên VSCode

## Yêu cầu hệ thống

### Phần mềm cần thiết
- **Node.js**: Phiên bản 18 hoặc cao hơn
- **Visual Studio Code**: Phiên bản mới nhất
- **Git**: Để clone repository

### Extensions VSCode khuyến nghị
- **TypeScript and JavaScript Language Features** (có sẵn)
- **ESLint** - Kiểm tra lỗi code
- **Prettier** - Format code tự động
- **Auto Rename Tag** - Rename HTML/JSX tags
- **Bracket Pair Colorizer** - Màu sắc cho dấu ngoặc
- **GitLens** - Git history và blame
- **Thunder Client** - Test API (thay thế Postman)

## Thiết lập dự án

### 1. Clone repository
```bash
git clone <repository-url>
cd na-food
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Thiết lập database
Dự án sử dụng PostgreSQL với Neon Database (serverless). Database URL được cung cấp sẵn trong môi trường Replit.

### 4. Khởi tạo database schema
```bash
npm run db:push
```

## Chạy dự án

### Phát triển (Development)
```bash
npm run dev
```

Lệnh này sẽ:
- Khởi chạy server Express trên port 5000
- Khởi chạy Vite dev server cho frontend
- Bật hot reload cho cả frontend và backend

### Truy cập ứng dụng
- **Frontend**: http://localhost:5000
- **API Backend**: http://localhost:5000/api

## Cấu trúc thư mục

```
na-food/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities và helpers
│   │   ├── hooks/          # Custom React hooks
│   │   └── types/          # TypeScript types
│   └── index.html
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database connection
├── shared/                 # Shared types và schemas
│   └── schema.ts          # Database schema với Drizzle ORM
└── package.json
```

## Tài khoản mặc định

### Admin Account
- **Username**: admin
- **Email**: admin@tgdd.com
- **Password**: 123456
- **Role**: admin

### Test User Account
Bạn có thể tạo tài khoản mới thông qua trang đăng ký hoặc sử dụng tài khoản admin để quản lý.

## Debugging trong VSCode

### 1. Tạo file launch.json
Tạo thư mục `.vscode` và file `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "runtimeArgs": ["-r", "tsx/cjs"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### 2. Debugging Frontend
Sử dụng Chrome DevTools hoặc cài đặt extension "Debugger for Chrome"

### 3. Debugging API
- Sử dụng Thunder Client extension
- Hoặc sử dụng curl trong terminal
- Endpoints chính:
  - `GET /api/products` - Lấy danh sách sản phẩm
  - `POST /api/auth/login` - Đăng nhập
  - `GET /api/orders` - Lấy danh sách đơn hàng

## Scripts có sẵn

```bash
# Chạy development server
npm run dev

# Build production
npm run build

# Chạy production server
npm start

# Push database schema
npm run db:push

# Generate database types
npm run db:generate

# Lint code
npm run lint

# Format code
npm run format
```

## Công nghệ sử dụng

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool và dev server
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Query** - Data fetching
- **React Hook Form** - Form management
- **Zod** - Schema validation

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Drizzle ORM** - Database ORM

### Database
- **PostgreSQL** - Database
- **Neon Database** - Serverless PostgreSQL provider

## Troubleshooting

### Lỗi thường gặp

1. **Port 5000 đã được sử dụng**
   ```bash
   # Tìm và kill process
   lsof -ti:5000 | xargs kill -9
   ```

2. **Database connection error**
   - Kiểm tra DATABASE_URL trong environment
   - Chạy `npm run db:push` để sync schema

3. **Node modules error**
   ```bash
   # Xóa và cài lại dependencies
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **TypeScript errors**
   ```bash
   # Restart TypeScript server trong VSCode
   Ctrl+Shift+P > TypeScript: Restart TS Server
   ```

### Performance Tips

1. **Tắt extensions không cần thiết** khi làm việc với dự án lớn
2. **Sử dụng TypeScript strict mode** để catch errors sớm
3. **Bật auto-save** trong VSCode settings
4. **Sử dụng integrated terminal** thay vì external terminal

## Workflow phát triển

### 1. Tạo feature mới
```bash
# Tạo branch mới
git checkout -b feature/ten-tinh-nang

# Làm việc trên feature
# ...

# Commit và push
git add .
git commit -m "Add: mô tả tính năng"
git push origin feature/ten-tinh-nang
```

### 2. Code style
- Sử dụng Prettier để format code
- Tuân thủ ESLint rules
- Đặt tên biến và function rõ ràng
- Viết comments cho logic phức tạp

### 3. Testing
- Test manual qua UI
- Test API endpoints với Thunder Client
- Kiểm tra responsive design
- Test trên các trình duyệt khác nhau

## Liên hệ và hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Xem server logs trong terminal
3. Kiểm tra network tab trong DevTools
4. Tham khảo documentation của các thư viện sử dụng

---

*Cập nhật lần cuối: $(date)*