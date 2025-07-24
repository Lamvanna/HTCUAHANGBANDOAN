// Import các thư viện cần thiết
import express from "express";
import path from "path";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { mongodb } from "./db.js";
import { createServer } from "http";

// Khởi tạo ứng dụng Express
const app = express();

// Cấu hình middleware để xử lý JSON và form data (giới hạn 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Phục vụ các file đã upload (hình ảnh, tài liệu)
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Middleware ghi log cho các API request
app.use((req, res, next) => {
  const start = Date.now(); // Thời gian bắt đầu request
  const path = req.path;    // Đường dẫn API
  let capturedJsonResponse = undefined;

  // Ghi đè phương thức res.json để capture response
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Khi response hoàn thành, ghi log
  res.on("finish", () => {
    const duration = Date.now() - start; // Tính thời gian xử lý
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Cắt ngắn log nếu quá dài (tối đa 80 ký tự)
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Hàm tìm port khả dụng (tránh xung đột port)
async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createServer();

    // Xử lý lỗi khi port đã được sử dụng
    server.on('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        try {
          // Thử port tiếp theo nếu port hiện tại đã được sử dụng
          const nextPort = await findAvailablePort(startPort + 1);
          resolve(nextPort);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(err);
      }
    });

    // Thử kết nối đến port
    server.listen(startPort, 'localhost', () => {
      const port = server.address()?.port;
      server.close(() => resolve(port)); // Đóng server test và trả về port
    });
  });
}

// Endpoint kiểm tra sức khỏe hệ thống (dành cho Docker health check)
app.get('/api/health', async (_req, res) => {
  try {
    // Kiểm tra kết nối MongoDB
    await mongodb.ensureConnection();
    await mongodb.client.db('admin').command({ ping: 1 });

    // Trả về trạng thái khỏe mạnh
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mongodb: 'connected'
    });
  } catch (error) {
    // Trả về trạng thái lỗi nếu có vấn đề
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      mongodb: 'disconnected',
      error: error.message
    });
  }
});

// Export the app and server setup function for manual start
export async function startServer() {
  // Initialize MongoDB connection with retry logic for Docker
  let dbConnected = false;
  const maxDbRetries = 10;
  let dbRetries = 0;

  while (!dbConnected && dbRetries < maxDbRetries) {
    try {
      await mongodb.connect();
      dbConnected = true;
      console.log('✅ Database connection established');
    } catch (error) {
      dbRetries++;
      console.warn(`⚠️  Failed to connect to MongoDB (attempt ${dbRetries}/${maxDbRetries}):`, error.message);

      if (dbRetries >= maxDbRetries) {
        console.error('❌ Failed to connect to MongoDB after maximum retries. Server will start without database.');
        break;
      }

      // Wait before retrying (exponential backoff)
      const delay = Math.min(2000 * Math.pow(2, dbRetries - 1), 30000);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  const server = await registerRoutes(app);

  // Enhanced error handling middleware
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error details for debugging
    console.error('❌ Server error:', {
      status,
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      timestamp: new Date().toISOString()
    });

    res.status(status).json({
      message,
      timestamp: new Date().toISOString()
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  return server;
}

// Manual start function - only runs when explicitly called
export async function runServer() {
  const server = await startServer();

  // Docker-optimized port configuration
  const preferredPort = parseInt(process.env.PORT) || 3000;
  const isDocker = process.env.NODE_ENV === 'production' || process.env.DOCKER_ENV === 'true';

  let port = preferredPort;
  let host = '0.0.0.0'; // Always bind to all interfaces for Docker

  // Only try to find available port in development
  if (!isDocker) {
    port = await findAvailablePort(preferredPort);
    host = process.platform === 'win32' ? 'localhost' : '0.0.0.0';
  }

  const listenOptions = {
    port,
    host,
    ...(process.platform !== 'win32' && !isDocker && { reusePort: true }),
  };

  // Graceful shutdown handling
  const gracefulShutdown = async (signal) => {
    console.log(`\n🔄 Received ${signal}. Graceful shutdown...`);

    server.close(async () => {
      console.log('✅ HTTP server closed');

      try {
        await mongodb.disconnect();
        console.log('✅ Database connection closed');
      } catch (error) {
        console.error('❌ Error closing database connection:', error);
      }

      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('❌ Could not close connections in time, forcefully shutting down');
      process.exit(1);
    }, 10000);
  };

  // Register signal handlers
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  server.listen(listenOptions, () => {
    log(`🚀 Server running on port ${port} (host: ${listenOptions.host})`);
    if (!isDocker && port !== preferredPort) {
      log(`⚠️  Port ${preferredPort} was busy, using port ${port} instead`);
    }
    log(`🌐 Open your browser and go to: http://${listenOptions.host}:${port}`);

    if (isDocker) {
      log('🐳 Running in Docker environment');
    }
  });

  return server;
}

// Only auto-start if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  runServer().catch(console.error);
}
