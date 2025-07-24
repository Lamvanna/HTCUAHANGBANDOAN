// Import thư viện MongoDB và dotenv
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Tải cấu hình từ file .env
dotenv.config();

// Kiểm tra biến môi trường MONGODB_URI
if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI phải được thiết lập trong file .env");
}

class MongoDB {
  constructor() {
    // Cấu hình kết nối MongoDB được tối ưu cho môi trường Docker
    const options = {
      maxPoolSize: 10,              // Số kết nối tối đa trong pool
      minPoolSize: 2,               // Số kết nối tối thiểu trong pool
      serverSelectionTimeoutMS: 10000, // Thời gian chờ chọn server (tăng cho Docker)
      socketTimeoutMS: 45000,       // Thời gian chờ socket
      connectTimeoutMS: 10000,      // Thời gian chờ kết nối
      family: 4,                    // Sử dụng IPv4, bỏ qua IPv6
      retryWrites: true,            // Thử lại khi ghi thất bại
      retryReads: true,             // Thử lại khi đọc thất bại
      maxIdleTimeMS: 30000,         // Thời gian tối đa kết nối idle
      waitQueueTimeoutMS: 5000,     // Thời gian chờ trong queue
      heartbeatFrequencyMS: 10000,  // Tần suất kiểm tra kết nối
    };

    this.client = new MongoClient(process.env.MONGODB_URI, options);
    this.db = this.client.db('nafood');  // Database chính của ứng dụng
    this.isConnected = false;            // Trạng thái kết nối
    this.isConnecting = false;           // Đang trong quá trình kết nối
    this.connectionRetries = 0;          // Số lần thử kết nối lại
    this.maxRetries = 5;                 // Số lần thử tối đa

    // Thiết lập các event listener cho kết nối MongoDB
    this.client.on('open', () => {
      console.log('✅ Kết nối MongoDB đã mở thành công');
      this.isConnected = true;
      this.connectionRetries = 0; // Reset số lần thử kết nối
    });

    this.client.on('close', () => {
      console.log('❌ Kết nối MongoDB đã đóng');
      this.isConnected = false;
    });

    this.client.on('error', (error) => {
      console.error('❌ Lỗi kết nối MongoDB:', error);
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
