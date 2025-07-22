import { mongodb } from '../server/db.js';
import bcrypt from 'bcrypt';

const sampleProducts = [
  {
    id: 1,
    name: "Phở Bò Tái",
    description: "Phở bò tái truyền thống với nước dúng trong, thịt bò tái mềm ngon",
    price: 65000,
    category: "Món chính",
    image: "/images/pho-bo-tai.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    name: "Bún Bò Huế",
    description: "Bún bò Huế cay nồng đậm đà hương vị miền Trung",
    price: 70000,
    category: "Món chính",
    image: "/images/bun-bo-hue.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    name: "Cơm Tấm Sườn Nướng",
    description: "Cơm tấm sườn nướng thơm lừng, ăn kèm chả trứng và bì",
    price: 55000,
    category: "Món chính",
    image: "/images/com-tam-suon-nuong.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    name: "Bánh Mì Thịt Nướng",
    description: "Bánh mì Việt Nam với thịt nướng thơm ngon, rau sống tươi mát",
    price: 25000,
    category: "Món nhẹ",
    image: "/images/banh-mi-thit-nuong.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    name: "Chè Ba Màu",
    description: "Chè ba màu truyền thống với đậu xanh, đậu đỏ và thạch",
    price: 20000,
    category: "Món tráng miệng",
    image: "/images/che-ba-mau.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    name: "Trà Đá Chanh",
    description: "Trà đá chanh tươi mát, giải khát tuyệt vời",
    price: 15000,
    category: "Đồ uống",
    image: "/images/tra-da-chanh.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    name: "Gỏi Cuốn Tôm Thịt",
    description: "Gỏi cuốn tôm thịt tươi ngon, ăn kèm nước chấm đậm đà",
    price: 35000,
    category: "Món chay",
    image: "/images/goi-cuon-tom-thit.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    name: "Cà Phê Sữa Đá",
    description: "Cà phê sữa đá đậm đà hương vị Việt Nam",
    price: 18000,
    category: "Đồ uống",
    image: "/images/ca-phe-sua-da.jpg",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@nafood.com",
    password: "admin123",
    fullName: "Quản trị viên",
    phone: "0123456789",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    role: "admin",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    username: "staff1",
    email: "staff@nafood.com",
    password: "staff123",
    fullName: "Nhân viên 1",
    phone: "0987654321",
    address: "456 Đường DEF, Quận 2, TP.HCM",
    role: "staff",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    username: "user1",
    email: "user@nafood.com",
    password: "user123",
    fullName: "Nguyễn Văn A",
    phone: "0111222333",
    address: "789 Đường GHI, Quận 3, TP.HCM",
    role: "user",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleBanners = [
  {
    id: 1,
    title: "Thưởng thức món ngon mỗi ngày",
    description: "Đặt món yêu thích của bạn chỉ với vài cú click",
    image: "/images/hero-banner.jpg",
    link: "#menu",
    isActive: true,
    order: 1,
    createdAt: new Date()
  }
];

async function seedData() {
  try {
    console.log('🌱 Bắt đầu seed dữ liệu...');
    
    // Connect to MongoDB
    await mongodb.connect();
    
    // Clear existing data
    console.log('🗑️  Xóa dữ liệu cũ...');
    await mongodb.products.deleteMany({});
    await mongodb.users.deleteMany({});
    await mongodb.banners.deleteMany({});
    await mongodb.db.collection('counters').deleteMany({});
    
    // Hash passwords for users
    console.log('🔐 Mã hóa mật khẩu...');
    for (let user of sampleUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    
    // Insert sample data
    console.log('📦 Thêm sản phẩm...');
    await mongodb.products.insertMany(sampleProducts);
    
    console.log('👥 Thêm người dùng...');
    await mongodb.users.insertMany(sampleUsers);
    
    console.log('🖼️  Thêm banner...');
    await mongodb.banners.insertMany(sampleBanners);
    
    // Initialize counters
    console.log('🔢 Khởi tạo counters...');
    await mongodb.db.collection('counters').insertMany([
      { _id: 'products', seq: sampleProducts.length },
      { _id: 'users', seq: sampleUsers.length },
      { _id: 'orders', seq: 0 },
      { _id: 'reviews', seq: 0 },
      { _id: 'banners', seq: sampleBanners.length }
    ]);
    
    console.log('✅ Seed dữ liệu thành công!');
    console.log(`📊 Đã thêm:`);
    console.log(`   - ${sampleProducts.length} sản phẩm`);
    console.log(`   - ${sampleUsers.length} người dùng`);
    console.log(`   - ${sampleBanners.length} banner`);
    console.log('');
    console.log('🔑 Thông tin đăng nhập:');
    console.log('   Admin: admin@nafood.com / admin123');
    console.log('   Staff: staff@nafood.com / staff123');
    console.log('   User:  user@nafood.com / user123');
    
  } catch (error) {
    console.error('❌ Lỗi seed dữ liệu:', error);
  } finally {
    await mongodb.disconnect();
    process.exit(0);
  }
}

// Run seed
seedData();
