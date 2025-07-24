import { mongodb } from './db.js';
import bcrypt from 'bcrypt';

class MongoStorage {
  // User operations
  async getUser(id) {
    try {
      await mongodb.ensureConnection();
      const user = await mongodb.users.findOne({ id });
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      await mongodb.ensureConnection();
      const user = await mongodb.users.findOne({ email });
      return user;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  async getUserByUsername(username) {
    try {
      await mongodb.ensureConnection();
      const user = await mongodb.users.findOne({ username });
      return user;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      await mongodb.ensureConnection();
      const users = await mongodb.users.find({}).toArray();
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  async createUser(user) {
    try {
      const id = await mongodb.getNextId('users');
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      const newUser = {
        id,
        ...user,
        password: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await mongodb.users.insertOne(newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id, updates) {
    try {
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      if (updates.password) {
        updateData.password = await bcrypt.hash(updates.password, 10);
      }

      const result = await mongodb.users.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Product operations
  async getProducts(category, search) {
    try {
      // Ensure MongoDB connection is active
      await mongodb.ensureConnection();

      const filter = {};

      if (category) {
        filter.category = category;
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const products = await mongodb.products.find(filter).toArray();
      return products;
    } catch (error) {
      console.error('Error getting products:', error);
      throw error;
    }
  }

  async getProduct(id) {
    try {
      await mongodb.ensureConnection();
      const product = await mongodb.products.findOne({ id });
      return product;
    } catch (error) {
      console.error('Error getting product:', error);
      throw error;
    }
  }

  async createProduct(product) {
    try {
      await mongodb.ensureConnection();
      const id = await mongodb.getNextId('products');

      const newProduct = {
        id,
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await mongodb.products.insertOne(newProduct);
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct(id, updates) {
    try {
      await mongodb.ensureConnection();
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      const result = await mongodb.products.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      await mongodb.ensureConnection();
      const result = await mongodb.products.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Order operations
  async getOrders(userId, status) {
    try {
      await mongodb.ensureConnection();
      const filter = {};

      if (userId) {
        filter.userId = userId;
      }

      if (status) {
        filter.status = status;
      }

      const orders = await mongodb.orders.find(filter).sort({ createdAt: -1 }).toArray();
      return orders;
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  }

  async getOrder(id) {
    try {
      await mongodb.ensureConnection();
      const order = await mongodb.orders.findOne({ id });
      return order;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  }

  async createOrder(order) {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        await mongodb.ensureConnection();
        const id = await mongodb.getNextId('orders');

        const newOrder = {
          id,
          ...order,
          status: 'pending',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await mongodb.orders.insertOne(newOrder);
        return newOrder;
      } catch (error) {
        attempt++;

        // If it's a duplicate key error and we haven't exceeded max retries
        if (error.code === 11000 && attempt < maxRetries) {
          console.log(`Duplicate key error on attempt ${attempt}, retrying...`);
          // Wait a bit before retrying
          await new Promise(resolve => setTimeout(resolve, 100 * attempt));
          continue;
        }

        console.error('Error creating order:', error);
        throw error;
      }
    }

    throw new Error('Failed to create order after maximum retries');
  }

  async updateOrder(id, updates) {
    try {
      await mongodb.ensureConnection();
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      const result = await mongodb.orders.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  async deleteOrder(id) {
    try {
      await mongodb.ensureConnection();
      const result = await mongodb.orders.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }

  // Review operations
  async getReviews(productId, approved, userId) {
    try {
      await mongodb.ensureConnection();
      const filter = {};

      if (productId) {
        filter.productId = productId;
      }

      if (approved !== undefined) {
        filter.approved = approved;
      }

      if (userId) {
        filter.userId = userId;
      }

      const reviews = await mongodb.reviews.find(filter).sort({ createdAt: -1 }).toArray();

      // Populate user information
      const reviewsWithUserInfo = await Promise.all(
        reviews.map(async (review) => {
          const user = await mongodb.users.findOne({ id: review.userId });
          const product = await mongodb.products.findOne({ id: review.productId });
          return {
            ...review,
            userName: user?.fullName || user?.username || 'Người dùng',
            userEmail: user?.email || '',
            productName: product?.name || 'Sản phẩm không tồn tại'
          };
        })
      );

      return reviewsWithUserInfo;
    } catch (error) {
      console.error('Error getting reviews:', error);
      throw error;
    }
  }

  async getReview(id) {
    try {
      await mongodb.ensureConnection();
      const review = await mongodb.reviews.findOne({ id });
      return review;
    } catch (error) {
      console.error('Error getting review:', error);
      throw error;
    }
  }

  async createReview(review) {
    try {
      await mongodb.ensureConnection();
      const id = await mongodb.getNextId('reviews');

      const newReview = {
        id,
        userId: review.userId,
        productId: review.productId,
        orderId: review.orderId,
        rating: review.rating,
        comment: review.comment,
        approved: null, // null = pending, true = approved, false = rejected
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await mongodb.reviews.insertOne(newReview);
      return newReview;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  async updateReview(id, updates) {
    try {
      await mongodb.ensureConnection();
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };

      const result = await mongodb.reviews.findOneAndUpdate(
        { id },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  async deleteReview(id) {
    try {
      await mongodb.ensureConnection();
      const result = await mongodb.reviews.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Banner operations
  async getBanners(active) {
    try {
      await mongodb.ensureConnection();
      const filter = {};

      if (active !== undefined) {
        filter.isActive = active;
      }

      const banners = await mongodb.banners.find(filter).sort({ order: 1 }).toArray();
      return banners;
    } catch (error) {
      console.error('Error getting banners:', error);
      throw error;
    }
  }

  async getBanner(id) {
    try {
      await mongodb.ensureConnection();
      const banner = await mongodb.banners.findOne({ id });
      return banner;
    } catch (error) {
      console.error('Error getting banner:', error);
      throw error;
    }
  }

  async createBanner(banner) {
    try {
      await mongodb.ensureConnection();
      const id = await mongodb.getNextId('banners');

      const newBanner = {
        id,
        ...banner,
        createdAt: new Date()
      };

      await mongodb.banners.insertOne(newBanner);
      return newBanner;
    } catch (error) {
      console.error('Error creating banner:', error);
      throw error;
    }
  }

  async updateBanner(id, updates) {
    try {
      await mongodb.ensureConnection();
      const result = await mongodb.banners.findOneAndUpdate(
        { id },
        { $set: updates },
        { returnDocument: 'after' }
      );

      return result;
    } catch (error) {
      console.error('Error updating banner:', error);
      throw error;
    }
  }

  async deleteBanner(id) {
    try {
      await mongodb.ensureConnection();
      const result = await mongodb.banners.deleteOne({ id });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting banner:', error);
      throw error;
    }
  }

  // Statistics
  async getOrderStats() {
    try {
      await mongodb.ensureConnection();
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

      const todayRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
      const newOrders = todayOrders.filter(order => order.status === 'pending').length;

      return {
        todayRevenue,
        newOrders,
        totalOrders,
        deliveredOrders,
      };
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw error;
    }
  }

  async getTopProducts(limit = 10) {
    try {
      await mongodb.ensureConnection();
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
    } catch (error) {
      console.error('Error getting top products:', error);
      throw error;
    }
  }
}

export const storage = new MongoStorage();
