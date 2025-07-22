import express from "express";
import path from "path";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { mongodb } from "./db.js";
import { createServer } from "http";

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Function to find available port
async function findAvailablePort(startPort) {
  return new Promise((resolve, reject) => {
    const server = createServer();

    server.on('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        try {
          const nextPort = await findAvailablePort(startPort + 1);
          resolve(nextPort);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(err);
      }
    });

    server.listen(startPort, 'localhost', () => {
      const port = server.address()?.port;
      server.close(() => resolve(port));
    });
  });
}

// Export the app and server setup function for manual start
export async function startServer() {
  // Initialize MongoDB connection
  try {
    await mongodb.connect();
  } catch (error) {
    console.warn('⚠️  Failed to connect to MongoDB, continuing without database:', error.message);
  }

  const server = await registerRoutes(app);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
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

  // Find available port starting from 5000
  const preferredPort = parseInt(process.env.PORT) || 5000;
  const port = await findAvailablePort(preferredPort);

  const listenOptions = {
    port,
    host: process.platform === 'win32' ? 'localhost' : '0.0.0.0',
    ...(process.platform !== 'win32' && { reusePort: true }),
  };

  server.listen(listenOptions, () => {
    log(`serving on port ${port} (host: ${listenOptions.host})`);
    if (port !== preferredPort) {
      log(`⚠️  Port ${preferredPort} was busy, using port ${port} instead`);
    }
    log(`🌐 Open your browser and go to: http://${listenOptions.host}:${port}`);
  });

  return server;
}

// Only auto-start if this file is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  runServer().catch(console.error);
}
