# Hướng dẫn chạy dự án Na Food trên VSCode

## Yêu cầu hệ thống

### 1. Cài đặt phần mềm cần thiết
- **Node.js**: Phiên bản 18 hoặc cao hơn
  - Tải tại: https://nodejs.org/
  - Kiểm tra: `node --version` và `npm --version`
- **VSCode**: Phiên bản mới nhất
  - Tải tại: https://code.visualstudio.com/
- **Git**: Để clone project
  - Tải tại: https://git-scm.com/

### 2. Extensions VSCode khuyến nghị
Cài đặt các extensions sau trong VSCode:
- **TypeScript**: Hỗ trợ TypeScript
- **ES7+ React/Redux/React-Native snippets**: Snippets React
- **Prettier - Code formatter**: Format code tự động
- **ESLint**: Kiểm tra lỗi JavaScript/TypeScript
- **Tailwind CSS IntelliSense**: Hỗ trợ Tailwind CSS
- **Auto Rename Tag**: Rename tag HTML tự động
- **Bracket Pair Colorizer**: Tô màu ngoặc
- **GitLens**: Hỗ trợ Git nâng cao

## Cài đặt dự án

### 1. Clone dự án
```bash
git clone <repository-url>
cd na-food
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` trong thư mục gốc:
```env
# Database Configuration
DATABASE_URL=mongodb+srv://admin:ZQJEPt9VIlcRGVp9@lamv.tzc1slv.mongodb.net/

# JWT Configuration
JWT_SECRET=your-secret-key-here

# Development Configuration
NODE_ENV=development
```

### 4. Cấu hình VSCode
Tạo file `.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.includePackageJsonAutoImports": "on",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

Tạo file `.vscode/extensions.json`:
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "ms-vscode.vscode-typescript-next",
    "dsznajder.es7-react-js-snippets",
    "eamodio.gitlens"
  ]
}
```

## Chạy dự án

### 1. Chạy development server
```bash
npm run dev
```

Hoặc có thể chạy riêng biệt:
```bash
# Terminal 1: Backend
npm run dev:server

# Terminal 2: Frontend (nếu có script riêng)
npm run dev:client
```

### 2. Truy cập ứng dụng
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

### 3. Tài khoản mặc định
- **Admin**: 
  - Email: admin@tgdd.com
  - Password: 123456
- **User thường**: Đăng ký mới qua giao diện

## Cấu trúc thư mục

```
na-food/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   └── types/          # TypeScript types
│   └── index.html
├── server/                 # Backend Express
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── db.ts              # Database connection
│   └── storage.ts         # Data operations
├── shared/                 # Shared types/schemas
│   └── schema.ts          # Zod validation schemas
├── package.json
└── .env                   # Environment variables
```

## Scripts NPM

```json
{
  "dev": "Chạy development server",
  "build": "Build production",
  "start": "Chạy production server",
  "db:push": "Push database schema (nếu dùng SQL)",
  "db:studio": "Mở database studio (nếu dùng SQL)"
}
```

## Debugging trong VSCode

### 1. Cấu hình debug
Tạo file `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/server/index.ts",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "restart": true,
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"]
    }
  ]
}
```

### 2. Breakpoints
- Đặt breakpoint bằng cách click vào margin trái của code
- Chạy debug bằng F5 hoặc Run → Start Debugging

## Các vấn đề thường gặp

### 1. Lỗi "Module not found"
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
```

### 2. Lỗi TypeScript
```bash
# Kiểm tra TypeScript config
npx tsc --noEmit
```

### 3. Lỗi Database connection
- Kiểm tra connection string trong `.env`
- Đảm bảo MongoDB service đang chạy
- Kiểm tra network connection

### 4. Lỗi Port đã được sử dụng
```bash
# Tìm process đang dùng port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### 5. Lỗi Build
```bash
# Xóa cache và build lại
npm run clean
npm run build
```

## Development Workflow

### 1. Quy trình phát triển
1. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
2. Code và test
3. Commit: `git commit -m "feat: mô tả thay đổi"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

### 2. Code Standards
- Sử dụng TypeScript cho type safety
- Follow ESLint rules
- Format code với Prettier
- Viết component trong `client/src/components/`
- API routes trong `server/routes.ts`

### 3. Testing
```bash
# Chạy tests (nếu có)
npm test

# Chạy linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Deployment

### 1. Build production
```bash
npm run build
```

### 2. Deploy lên server
```bash
# Start production server
npm start
```

### 3. Environment variables production
Đảm bảo set các biến môi trường:
- `NODE_ENV=production`
- `DATABASE_URL=<production-database-url>`
- `JWT_SECRET=<secure-secret>`

## Hỗ trợ

### 1. Logs
- Server logs: Console output
- Client logs: Browser Developer Tools

### 2. Database
- MongoDB: Sử dụng MongoDB Compass hoặc mongo shell
- Data được tạo tự động khi khởi động server

### 3. Liên hệ
- Issues: Tạo GitHub issue
- Documentation: Xem `replit.md` cho thông tin chi tiết

## Shortcuts VSCode hữu ích

- `Ctrl+Shift+P`: Command Palette
- `Ctrl+P`: Quick Open file
- `Ctrl+Shift+F`: Search in files
- `Ctrl+K Ctrl+S`: Keyboard shortcuts
- `Ctrl+``: Toggle terminal
- `F12`: Go to definition
- `Shift+F12`: Find all references
- `Ctrl+Shift+R`: Refactor
- `Ctrl+Shift+O`: Go to symbol in file