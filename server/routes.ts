import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema, insertProductSchema, insertOrderSchema, insertReviewSchema, insertBannerSchema } from "@shared/schema";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Middleware for JWT authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware for role-based access
const requireRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const { confirmPassword, ...userData } = validatedData;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email đã được sử dụng" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Tên đăng nhập đã được sử dụng" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.status(201).json({
        message: "Đăng ký thành công",
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Tài khoản đã bị khóa" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(validatedData.password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email hoặc mật khẩu không chính xác" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      res.json({
        message: "Đăng nhập thành công",
        token,
        user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Login error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      const products = await storage.getProducts(
        category as string,
        search as string
      );
      res.json(products);
    } catch (error) {
      console.error('Get products error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Get product error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.post("/api/products", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Create product error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/products/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Update product error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.delete("/api/products/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const success = await storage.deleteProduct(id);
      
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
      
      res.json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Order routes
  app.get("/api/orders", authenticateToken, async (req, res) => {
    try {
      const { status } = req.query;
      let orders;
      
      if (req.user.role === 'user') {
        orders = await storage.getOrders(req.user.id, status as string);
      } else {
        orders = await storage.getOrders(undefined, status as string);
      }
      
      res.json(orders);
    } catch (error) {
      console.error('Get orders error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.get("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      
      // Check if user can access this order
      if (req.user.role === 'user' && order.userId !== req.user.id) {
        return res.status(403).json({ message: "Không có quyền truy cập" });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Get order error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.post("/api/orders", authenticateToken, async (req, res) => {
    try {
      console.log('Order request body:', JSON.stringify(req.body, null, 2));
      
      // Map camelCase frontend fields to database fields with proper type conversion
      const orderData = {
        userId: req.user.id,
        total: req.body.total.toString(), // Convert number to string for decimal type
        paymentMethod: req.body.paymentMethod,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        customerAddress: req.body.customerAddress,
        items: req.body.items,
        notes: req.body.notes || null,
      };
      
      const validatedData = insertOrderSchema.parse(orderData);
      
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Order validation errors:', JSON.stringify(error.errors, null, 2));
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Create order error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/orders/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const order = await storage.getOrder(id);
      
      if (!order) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      
      // Check permissions
      if (req.user.role === 'user') {
        if (order.userId !== req.user.id) {
          return res.status(403).json({ message: "Không có quyền truy cập" });
        }
        // Users can only cancel their own pending orders
        if (req.body.status && req.body.status !== 'cancelled') {
          return res.status(403).json({ message: "Không có quyền thay đổi trạng thái này" });
        }
        if (req.body.status === 'cancelled' && order.status !== 'pending') {
          return res.status(400).json({ message: "Chỉ có thể hủy đơn hàng đang chờ xử lý" });
        }
      }
      
      const validatedData = insertOrderSchema.partial().parse(req.body);
      const updatedOrder = await storage.updateOrder(id, validatedData);
      
      res.json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Update order error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.delete("/api/orders/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const success = await storage.deleteOrder(id);
      
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      }
      
      res.json({ message: "Xóa đơn hàng thành công" });
    } catch (error) {
      console.error('Delete order error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // User management routes
  app.get("/api/users", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      // This would need to be implemented in storage - for now return empty array
      res.json([]);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/users/:id/role", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const { role } = req.body;
      
      if (!['user', 'staff', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Vai trò không hợp lệ" });
      }
      
      const user = await storage.updateUser(id, { role });
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/users/:id/status", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const { isActive } = req.body;
      
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
      }
      
      const user = await storage.updateUser(id, { isActive });
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { productId, approved } = req.query;
      const reviews = await storage.getReviews(
        productId ? parseInt(productId as string) : undefined,
        approved ? approved === 'true' : undefined
      );
      res.json(reviews);
    } catch (error) {
      console.error('Get reviews error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.post("/api/reviews", authenticateToken, async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: req.user.id,
      });
      
      // Check if order exists and belongs to user and is delivered
      const order = await storage.getOrder(validatedData.orderId);
      if (!order || order.userId !== req.user.id || order.status !== 'delivered') {
        return res.status(400).json({ message: "Chỉ có thể đánh giá món ăn từ đơn hàng đã giao" });
      }
      
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Create review error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/reviews/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const validatedData = insertReviewSchema.partial().parse(req.body);
      const review = await storage.updateReview(id, validatedData);
      
      if (!review) {
        return res.status(404).json({ message: "Không tìm thấy đánh giá" });
      }
      
      res.json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Update review error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.delete("/api/reviews/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const success = await storage.deleteReview(id);
      
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy đánh giá" });
      }
      
      res.json({ message: "Xóa đánh giá thành công" });
    } catch (error) {
      console.error('Delete review error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Banner routes
  app.get("/api/banners", async (req, res) => {
    try {
      const { active } = req.query;
      const banners = await storage.getBanners(
        active ? active === 'true' : undefined
      );
      res.json(banners);
    } catch (error) {
      console.error('Get banners error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.post("/api/banners", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const validatedData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(validatedData);
      res.status(201).json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Create banner error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/banners/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const validatedData = insertBannerSchema.partial().parse(req.body);
      const banner = await storage.updateBanner(id, validatedData);
      
      if (!banner) {
        return res.status(404).json({ message: "Không tìm thấy banner" });
      }
      
      res.json(banner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Dữ liệu không hợp lệ", errors: error.errors });
      }
      console.error('Update banner error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.delete("/api/banners/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const success = await storage.deleteBanner(id);
      
      if (!success) {
        return res.status(404).json({ message: "Không tìm thấy banner" });
      }
      
      res.json({ message: "Xóa banner thành công" });
    } catch (error) {
      console.error('Delete banner error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Statistics routes
  app.get("/api/statistics/overview", authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
    try {
      const stats = await storage.getOrderStats();
      res.json(stats);
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.get("/api/statistics/top-products", authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      const topProducts = await storage.getTopProducts(parseInt(limit as string));
      res.json(topProducts);
    } catch (error) {
      console.error('Get top products error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // User management routes
  app.get("/api/users", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      // Get all users for admin
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/users/:id", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const user = await storage.updateUser(id, req.body);
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/users/:id/status", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const { isActive } = req.body;
      const user = await storage.updateUser(id, { isActive });
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Update user status error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.put("/api/users/:id/role", authenticateToken, requireRole(['admin']), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID không hợp lệ" });
      }
      
      const { role } = req.body;
      const user = await storage.updateUser(id, { role });
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      
      res.json(user);
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  // Export routes (placeholder implementations)
  app.get("/api/orders/export/pdf", authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
    try {
      // TODO: Implement PDF export functionality
      res.status(501).json({ message: "Chức năng xuất PDF đang được phát triển" });
    } catch (error) {
      console.error('Export PDF error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  app.get("/api/orders/export/csv", authenticateToken, requireRole(['admin', 'staff']), async (req, res) => {
    try {
      // TODO: Implement CSV export functionality
      res.status(501).json({ message: "Chức năng xuất CSV đang được phát triển" });
    } catch (error) {
      console.error('Export CSV error:', error);
      res.status(500).json({ message: "Lỗi hệ thống" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
