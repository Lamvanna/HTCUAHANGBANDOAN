// MongoDB initialization script for Docker
db = db.getSiblingDB('na_food');

// Create collections
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('reviews');
db.createCollection('banners');
db.createCollection('counters');

// Initialize counters for auto-incrementing IDs
db.counters.insertMany([
  { _id: 'users', seq: 0 },
  { _id: 'products', seq: 0 },
  { _id: 'orders', seq: 0 },
  { _id: 'reviews', seq: 0 },
  { _id: 'banners', seq: 0 }
]);

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.products.createIndex({ category: 1 });
db.products.createIndex({ name: "text", description: "text" });
db.orders.createIndex({ userId: 1 });
db.orders.createIndex({ status: 1 });
db.orders.createIndex({ createdAt: -1 });
db.reviews.createIndex({ productId: 1 });
db.reviews.createIndex({ userId: 1 });
db.banners.createIndex({ isActive: 1 });
db.banners.createIndex({ order: 1 });

// Insert sample data
// Admin user
db.users.insertOne({
  id: 1,
  username: 'admin',
  email: 'admin@tgdd.com',
  password: '$2b$10$rOHQQnQKXwT5dQOjUzFdYORUYJzYNMfCQQXGJXqXzLqFfYWS3.nqW', // 123456
  fullName: 'Admin User',
  phone: '0333661157',
  address: 'Admin Address',
  role: 'admin',
  isActive: true,
  createdAt: new Date()
});

// Update counter
db.counters.updateOne({ _id: 'users' }, { $set: { seq: 1 } });

// Sample products
db.products.insertMany([
  {
    id: 1,
    name: 'Phở Bò Tái',
    description: 'Phở bò tái truyền thống với nước dùng đậm đà',
    price: 85000,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500',
    category: 'Món chính',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 2,
    name: 'Bún Bò Huế',
    description: 'Bún bò Huế cay nồng đặc trưng miền Trung',
    price: 75000,
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=500',
    category: 'Món chính',
    isActive: true,
    createdAt: new Date()
  },
  {
    id: 3,
    name: 'Cơm Tấm Sườn Nướng',
    description: 'Cơm tấm sườn nướng thơm ngon',
    price: 95000,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500',
    category: 'Món chính',
    isActive: true,
    createdAt: new Date()
  }
]);

// Update counter
db.counters.updateOne({ _id: 'products' }, { $set: { seq: 3 } });

// Sample banner
db.banners.insertOne({
  id: 1,
  title: 'Chào mừng đến với Na Food',
  description: 'Khám phá hương vị Việt Nam cùng chúng tôi',
  image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200',
  link: '/products',
  isActive: true,
  order: 1,
  createdAt: new Date()
});

// Update counter
db.counters.updateOne({ _id: 'banners' }, { $set: { seq: 1 } });

print('MongoDB initialization completed successfully!');