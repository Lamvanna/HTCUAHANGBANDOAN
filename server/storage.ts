import { mongodb } from './db';
import {
  User, Product, Order, Review, Banner,
  InsertUser, InsertProduct, InsertOrder, InsertReview, InsertBanner
} from '@shared/schema';
import bcrypt from 'bcrypt';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Product operations
  getProducts(category?: string, search?: string): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Order operations
  getOrders(userId?: number, status?: string): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
  
  // Review operations
  getReviews(productId?: number, approved?: boolean): Promise<Review[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;
  
  // Banner operations
  getBanners(active?: boolean): Promise<Banner[]>;
  getBanner(id: number): Promise<Banner | undefined>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined>;
  deleteBanner(id: number): Promise<boolean>;
  
  // Statistics
  getOrderStats(): Promise<{
    todayRevenue: number;
    newOrders: number;
    totalOrders: number;
    deliveredOrders: number;
  }>;
  
  getTopProducts(limit?: number): Promise<Array<Product & { orderCount: number }>>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database connection
    this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      await mongodb.connect();
      await this.createSampleData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  private async createSampleData() {
    // Check if admin user exists
    const adminExists = await mongodb.users.findOne({ email: 'admin@tgdd.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const adminId = await mongodb.getNextId('users');
      await mongodb.users.insertOne({
        id: adminId,
        username: 'admin',
        email: 'admin@tgdd.com',
        password: hashedPassword,
        fullName: 'Admin User',
        role: 'admin',
        isActive: true,
        createdAt: new Date(),
      });
    }

    // Check if sample products exist
    const productCount = await mongodb.products.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          id: await mongodb.getNextId('products'),
          name: 'Phở Bò Tái',
          description: 'Phở bò tái truyền thống với nước dầm đậm đà',
          price: 85000,
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500',
          category: 'Phở',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: await mongodb.getNextId('products'),
          name: 'Bún Bò Huế',
          description: 'Bún bò Huế cay nồng đậm đà hương vị miền Trung',
          price: 75000,
          image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500',
          category: 'Bún',
          isActive: true,
          createdAt: new Date(),
        },
        {
          id: await mongodb.getNextId('products'),
          name: 'Cơm Tấm Sườn Nướng',
          description: 'Cơm tấm sườn nướng thơm ngon với chả trứng',
          price: 95000,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500',
          category: 'Cơm',
          isActive: true,
          createdAt: new Date(),
        },
      ];

      await mongodb.products.insertMany(sampleProducts);
    }

    // Check if sample banner exists
    const bannerCount = await mongodb.banners.countDocuments();
    if (bannerCount === 0) {
      const bannerId = await mongodb.getNextId('banners');
      await mongodb.banners.insertOne({
        id: bannerId,
        title: 'Khuyến mãi đặc biệt',
        description: 'Giảm 20% cho đơn hàng đầu tiên',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
        isActive: true,
        order: 1,
        createdAt: new Date(),
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const user = await mongodb.users.findOne({ id });
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const user = await mongodb.users.findOne({ email });
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await mongodb.users.findOne({ username });
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    console.log('Getting all users...');
    const users = await mongodb.users.find({}).toArray();
    console.log('Found users:', users.length);
    return users;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = await mongodb.getNextId('users');
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    
    const user: User = {
      id,
      ...insertUser,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await mongodb.users.insertOne(user);
    return user;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const updateData: any = { ...user };
    if (user.password) {
      updateData.password = await bcrypt.hash(user.password, 10);
    }

    const result = await mongodb.users.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  // Product operations
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    const query: any = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    return await mongodb.products.find(query).toArray();
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const product = await mongodb.products.findOne({ id });
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = await mongodb.getNextId('products');
    const product: Product = {
      id,
      ...insertProduct,
      createdAt: new Date(),
    };

    await mongodb.products.insertOne(product);
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await mongodb.products.findOneAndUpdate(
      { id },
      { $set: product },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await mongodb.products.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Order operations
  async getOrders(userId?: number, status?: string): Promise<Order[]> {
    const query: any = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;

    return await mongodb.orders.find(query).sort({ createdAt: -1 }).toArray();
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const order = await mongodb.orders.findOne({ id });
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = await mongodb.getNextId('orders');
    const order: Order = {
      id,
      ...insertOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await mongodb.orders.insertOne(order);
    return order;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await mongodb.orders.findOneAndUpdate(
      { id },
      { $set: { ...order, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await mongodb.orders.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Review operations
  async getReviews(productId?: number, approved?: boolean): Promise<Review[]> {
    const query: any = {};
    if (productId) query.productId = productId;
    if (approved !== undefined) query.isApproved = approved;

    return await mongodb.reviews.find(query).sort({ createdAt: -1 }).toArray();
  }

  async getReview(id: number): Promise<Review | undefined> {
    const review = await mongodb.reviews.findOne({ id });
    return review || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = await mongodb.getNextId('reviews');
    const review: Review = {
      id,
      ...insertReview,
      createdAt: new Date(),
    };

    await mongodb.reviews.insertOne(review);
    return review;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined> {
    const result = await mongodb.reviews.findOneAndUpdate(
      { id },
      { $set: review },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await mongodb.reviews.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Banner operations
  async getBanners(active?: boolean): Promise<Banner[]> {
    const query: any = {};
    if (active !== undefined) query.isActive = active;

    return await mongodb.banners.find(query).sort({ order: 1 }).toArray();
  }

  async getBanner(id: number): Promise<Banner | undefined> {
    const banner = await mongodb.banners.findOne({ id });
    return banner || undefined;
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const id = await mongodb.getNextId('banners');
    const banner: Banner = {
      id,
      ...insertBanner,
      createdAt: new Date(),
    };

    await mongodb.banners.insertOne(banner);
    return banner;
  }

  async updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    const result = await mongodb.banners.findOneAndUpdate(
      { id },
      { $set: banner },
      { returnDocument: 'after' }
    );

    return result || undefined;
  }

  async deleteBanner(id: number): Promise<boolean> {
    const result = await mongodb.banners.deleteOne({ id });
    return result.deletedCount > 0;
  }

  // Statistics
  async getOrderStats(): Promise<{
    todayRevenue: number;
    newOrders: number;
    totalOrders: number;
    deliveredOrders: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayOrders, totalOrders, deliveredOrders] = await Promise.all([
      mongodb.orders.find({
        createdAt: { $gte: today, $lt: tomorrow }
      }).toArray(),
      mongodb.orders.countDocuments(),
      mongodb.orders.countDocuments({ status: 'delivered' })
    ]);

    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const newOrders = todayOrders.filter(order => order.status === 'pending').length;

    return {
      todayRevenue,
      newOrders,
      totalOrders,
      deliveredOrders,
    };
  }

  async getTopProducts(limit: number = 10): Promise<Array<Product & { orderCount: number }>> {
    const pipeline = [
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', orderCount: { $sum: '$items.quantity' } } },
      { $sort: { orderCount: -1 } },
      { $limit: limit }
    ];

    const topProductIds = await mongodb.orders.aggregate(pipeline).toArray();
    const products = await mongodb.products.find({
      id: { $in: topProductIds.map(item => item._id) }
    }).toArray();

    return products.map(product => ({
      ...product,
      orderCount: topProductIds.find(item => item._id === product.id)?.orderCount || 0
    }));
  }
}

export const storage = new DatabaseStorage();