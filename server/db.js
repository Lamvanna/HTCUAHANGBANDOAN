import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in .env file");
}

class MongoDB {
  constructor() {
    // MongoDB connection options for better reliability
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      retryReads: true,
    };

    this.client = new MongoClient(process.env.MONGODB_URI, options);
    this.db = this.client.db('nafood');
    this.isConnected = false;
    this.isConnecting = false;

    // Set up connection event listeners
    this.client.on('open', () => {
      console.log('✅ MongoDB connection opened');
      this.isConnected = true;
    });

    this.client.on('close', () => {
      console.log('❌ MongoDB connection closed');
      this.isConnected = false;
    });

    this.client.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
      this.isConnected = false;
    });

    this.client.on('reconnect', () => {
      console.log('🔄 MongoDB reconnected');
      this.isConnected = true;
    });
  }

  async connect() {
    if (this.isConnected) {
      return;
    }

    if (this.isConnecting) {
      // Wait for existing connection attempt
      while (this.isConnecting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return;
    }

    this.isConnecting = true;
    try {
      await this.client.connect();
      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');
    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    } finally {
      this.isConnecting = false;
    }
  }

  async ensureConnection() {
    if (!this.isConnected) {
      console.log('🔄 Reconnecting to MongoDB...');
      await this.connect();
    }
  }

  async disconnect() {
    if (this.isConnected || this.isConnecting) {
      await this.client.close();
      this.isConnected = false;
      this.isConnecting = false;
      console.log('✅ Disconnected from MongoDB');
    }
  }

  getDb() {
    return this.db;
  }

  // Collections with connection check
  async getCollection(name) {
    await this.ensureConnection();
    return this.db.collection(name);
  }

  get users() {
    return this.db.collection('users');
  }

  get products() {
    return this.db.collection('products');
  }

  get orders() {
    return this.db.collection('orders');
  }

  get reviews() {
    return this.db.collection('reviews');
  }

  get banners() {
    return this.db.collection('banners');
  }

  // Counter for auto-incrementing IDs with safety check
  async getNextId(collectionName) {
    await this.ensureConnection();
    const counters = this.db.collection('counters');

    // Get current counter value
    let counter = await counters.findOne({ _id: collectionName });

    // If counter doesn't exist or we want to verify it's correct
    if (!counter) {
      // Find the maximum ID in the actual collection
      const collection = this.db.collection(collectionName);
      const maxDoc = await collection.findOne({}, { sort: { id: -1 } });
      const maxId = maxDoc?.id || 0;

      // Initialize counter with correct value
      counter = await counters.findOneAndUpdate(
        { _id: collectionName },
        { $set: { seq: maxId } },
        { upsert: true, returnDocument: 'after' }
      );
    }

    // Increment and return next ID
    const updatedCounter = await counters.findOneAndUpdate(
      { _id: collectionName },
      { $inc: { seq: 1 } },
      { returnDocument: 'after' }
    );

    return updatedCounter?.seq || 1;
  }
}

export const mongodb = new MongoDB();
export const db = mongodb;
