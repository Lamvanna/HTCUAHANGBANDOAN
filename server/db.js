import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set in .env file");
}

class MongoDB {
  constructor() {
    // MongoDB connection options optimized for Docker environment
    const options = {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 10000, // Increased for Docker startup
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      retryReads: true,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000,
      // Heartbeat frequency for better connection monitoring
      heartbeatFrequencyMS: 10000,
    };

    this.client = new MongoClient(process.env.MONGODB_URI, options);
    this.db = this.client.db('nafood');
    this.isConnected = false;
    this.isConnecting = false;
    this.connectionRetries = 0;
    this.maxRetries = 5;

    // Set up connection event listeners
    this.client.on('open', () => {
      console.log('✅ MongoDB connection opened');
      this.isConnected = true;
      this.connectionRetries = 0;
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
      this.connectionRetries = 0;
    });

    // Handle process termination gracefully
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
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

    while (this.connectionRetries < this.maxRetries) {
      try {
        console.log(`🔄 Attempting to connect to MongoDB (attempt ${this.connectionRetries + 1}/${this.maxRetries})...`);
        await this.client.connect();

        // Test the connection
        await this.client.db('admin').command({ ping: 1 });

        this.isConnected = true;
        this.connectionRetries = 0;
        console.log('✅ Connected to MongoDB successfully');
        return;
      } catch (error) {
        this.connectionRetries++;
        console.error(`❌ Failed to connect to MongoDB (attempt ${this.connectionRetries}/${this.maxRetries}):`, error.message);

        if (this.connectionRetries >= this.maxRetries) {
          this.isConnected = false;
          this.isConnecting = false;
          throw new Error(`Failed to connect to MongoDB after ${this.maxRetries} attempts: ${error.message}`);
        }

        // Wait before retrying (exponential backoff)
        const delay = Math.min(1000 * Math.pow(2, this.connectionRetries - 1), 10000);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    this.isConnecting = false;
  }

  async ensureConnection() {
    if (!this.isConnected) {
      console.log('🔄 Ensuring MongoDB connection...');
      await this.connect();
    }

    // Double-check connection with ping
    try {
      await this.client.db('admin').command({ ping: 1 });
    } catch (error) {
      console.log('🔄 Connection lost, reconnecting...');
      this.isConnected = false;
      await this.connect();
    }
  }

  async disconnect() {
    if (this.isConnected || this.isConnecting) {
      try {
        await this.client.close();
        this.isConnected = false;
        this.isConnecting = false;
        console.log('✅ Disconnected from MongoDB');
      } catch (error) {
        console.error('❌ Error disconnecting from MongoDB:', error);
      }
    }
  }

  async gracefulShutdown() {
    console.log('🔄 Gracefully shutting down MongoDB connection...');
    await this.disconnect();
    process.exit(0);
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
