import { 
  users, products, orders, reviews, banners,
  type User, type InsertUser, type Product, type InsertProduct,
  type Order, type InsertOrder, type Review, type InsertReview,
  type Banner, type InsertBanner
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, or, count } from "drizzle-orm";

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
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  }

  async updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users).set(user).where(eq(users.id, id)).returning();
    return updatedUser || undefined;
  }

  // Product operations
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    let query = db.select().from(products).where(eq(products.isActive, true));
    
    if (category) {
      query = query.where(eq(products.category, category));
    }
    
    if (search) {
      query = query.where(
        or(
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`)
        )
      );
    }
    
    return query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db.insert(products).values(insertProduct).returning();
    return product;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updatedProduct] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updatedProduct || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount > 0;
  }

  // Order operations
  async getOrders(userId?: number, status?: string): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId));
    }
    
    if (status) {
      query = query.where(eq(orders.status, status));
    }
    
    return query.orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updatedOrder] = await db.update(orders).set({ ...order, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return updatedOrder || undefined;
  }

  async deleteOrder(id: number): Promise<boolean> {
    const result = await db.delete(orders).where(eq(orders.id, id));
    return result.rowCount > 0;
  }

  // Review operations
  async getReviews(productId?: number, approved?: boolean): Promise<Review[]> {
    let query = db.select().from(reviews);
    
    if (productId) {
      query = query.where(eq(reviews.productId, productId));
    }
    
    if (approved !== undefined) {
      query = query.where(eq(reviews.isApproved, approved));
    }
    
    return query.orderBy(desc(reviews.createdAt));
  }

  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review || undefined;
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const [review] = await db.insert(reviews).values(insertReview).returning();
    return review;
  }

  async updateReview(id: number, review: Partial<InsertReview>): Promise<Review | undefined> {
    const [updatedReview] = await db.update(reviews).set(review).where(eq(reviews.id, id)).returning();
    return updatedReview || undefined;
  }

  async deleteReview(id: number): Promise<boolean> {
    const result = await db.delete(reviews).where(eq(reviews.id, id));
    return result.rowCount > 0;
  }

  // Banner operations
  async getBanners(active?: boolean): Promise<Banner[]> {
    let query = db.select().from(banners);
    
    if (active !== undefined) {
      query = query.where(eq(banners.isActive, active));
    }
    
    return query.orderBy(banners.order);
  }

  async getBanner(id: number): Promise<Banner | undefined> {
    const [banner] = await db.select().from(banners).where(eq(banners.id, id));
    return banner || undefined;
  }

  async createBanner(insertBanner: InsertBanner): Promise<Banner> {
    const [banner] = await db.insert(banners).values(insertBanner).returning();
    return banner;
  }

  async updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner | undefined> {
    const [updatedBanner] = await db.update(banners).set(banner).where(eq(banners.id, id)).returning();
    return updatedBanner || undefined;
  }

  async deleteBanner(id: number): Promise<boolean> {
    const result = await db.delete(banners).where(eq(banners.id, id));
    return result.rowCount > 0;
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
    
    const [todayRevenue] = await db.select({
      total: count(orders.total)
    }).from(orders).where(and(
      eq(orders.status, 'delivered'),
      eq(orders.createdAt, today)
    ));
    
    const [newOrders] = await db.select({
      count: count()
    }).from(orders).where(eq(orders.status, 'pending'));
    
    const [totalOrders] = await db.select({
      count: count()
    }).from(orders);
    
    const [deliveredOrders] = await db.select({
      count: count()
    }).from(orders).where(eq(orders.status, 'delivered'));
    
    return {
      todayRevenue: Number(todayRevenue?.total || 0),
      newOrders: newOrders?.count || 0,
      totalOrders: totalOrders?.count || 0,
      deliveredOrders: deliveredOrders?.count || 0,
    };
  }

  async getTopProducts(limit: number = 10): Promise<Array<Product & { orderCount: number }>> {
    // This would require a more complex query to count orders per product
    // For now, returning basic products
    const productList = await db.select().from(products).where(eq(products.isActive, true)).limit(limit);
    return productList.map(product => ({ ...product, orderCount: 0 }));
  }
}

export const storage = new DatabaseStorage();
