import { MongoClient, Db, Collection } from 'mongodb';
import dotenv from 'dotenv';
import { User, Product, Order, Review, Banner } from '@shared/schema';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in .env file");
}

class MongoDB {
  private client: MongoClient;
  private db: Db;
  private isConnected: boolean = false;

  constructor() {
    this.client = new MongoClient(process.env.MONGODB_URI!);
    this.db = this.client.db('nafood');
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
      console.log('Connected to MongoDB');
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.close();
      this.isConnected = false;
    }
  }

  getDb(): Db {
    if (!this.isConnected) {
      throw new Error('Database not connected');
    }
    return this.db;
  }

  // Collections
  get users(): Collection<User> {
    return this.db.collection<User>('users');
  }

  get products(): Collection<Product> {
    return this.db.collection<Product>('products');
  }

  get orders(): Collection<Order> {
    return this.db.collection<Order>('orders');
  }

  get reviews(): Collection<Review> {
    return this.db.collection<Review>('reviews');
  }

  get banners(): Collection<Banner> {
    return this.db.collection<Banner>('banners');
  }

  // Counter for auto-incrementing IDs
  async getNextId(collectionName: string): Promise<number> {
    const counters = this.db.collection('counters');
    const counter = await counters.findOneAndUpdate(
      { _id: collectionName },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    return counter?.seq || 1;
  }
}

export const mongodb = new MongoDB();
export const db = mongodb;