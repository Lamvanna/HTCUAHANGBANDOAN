import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import sample data
const sampleData = JSON.parse(fs.readFileSync(path.join(__dirname, 'sample-data.json'), 'utf8'));

console.log('🚀 IMPORT SAMPLE DATA SCRIPT');
console.log('============================\n');

// Function to simulate database import
async function importData() {
  try {
    console.log('📊 SAMPLE DATA OVERVIEW:');
    console.log(`   👥 Users: ${sampleData.users.length}`);
    console.log(`   📂 Categories: ${sampleData.categories.length}`);
    console.log(`   🍜 Products: ${sampleData.products.length}`);
    console.log(`   📦 Orders: ${sampleData.orders.length}`);
    console.log(`   ⭐ Reviews: ${sampleData.reviews.length}`);
    console.log(`   🎯 Banners: ${sampleData.banners.length}\n`);

    // Display sample users
    console.log('👥 SAMPLE USERS:');
    sampleData.users.forEach(user => {
      console.log(`   • ${user.username} (${user.role}) - ${user.email}`);
    });
    console.log('');

    // Display sample categories
    console.log('📂 SAMPLE CATEGORIES:');
    sampleData.categories.forEach(category => {
      console.log(`   • ${category.name} - ${category.description}`);
    });
    console.log('');

    // Display sample products
    console.log('🍜 SAMPLE PRODUCTS:');
    sampleData.products.forEach(product => {
      const category = sampleData.categories.find(cat => cat._id === product.category);
      console.log(`   • ${product.name} - ${product.price.toLocaleString('vi-VN')}đ (${category?.name})`);
    });
    console.log('');

    // Display sample orders
    console.log('📦 SAMPLE ORDERS:');
    sampleData.orders.forEach(order => {
      console.log(`   • Order ${order._id} - ${order.total.toLocaleString('vi-VN')}đ (${order.status})`);
      console.log(`     Customer: ${order.customerInfo.name} - ${order.customerInfo.phone}`);
      console.log(`     Items: ${order.items.length} items`);
    });
    console.log('');

    // Display sample reviews
    console.log('⭐ SAMPLE REVIEWS:');
    sampleData.reviews.forEach(review => {
      const product = sampleData.products.find(p => p._id === review.productId);
      console.log(`   • ${product?.name} - ${review.rating}/5 stars by ${review.customerName}`);
      console.log(`     "${review.comment}"`);
    });
    console.log('');

    // Display sample banners
    console.log('🎯 SAMPLE BANNERS:');
    sampleData.banners.forEach(banner => {
      console.log(`   • ${banner.title} - ${banner.position} (${banner.active ? 'Active' : 'Inactive'})`);
      console.log(`     ${banner.description}`);
    });
    console.log('');

    console.log('✅ SAMPLE DATA READY FOR IMPORT!');
    console.log('================================\n');

    // Generate MongoDB import commands
    console.log('📝 MONGODB IMPORT COMMANDS:');
    console.log('```bash');
    console.log('# Import users');
    console.log('mongoimport --db nafood --collection users --file users.json --jsonArray');
    console.log('');
    console.log('# Import categories');
    console.log('mongoimport --db nafood --collection categories --file categories.json --jsonArray');
    console.log('');
    console.log('# Import products');
    console.log('mongoimport --db nafood --collection products --file products.json --jsonArray');
    console.log('');
    console.log('# Import orders');
    console.log('mongoimport --db nafood --collection orders --file orders.json --jsonArray');
    console.log('');
    console.log('# Import reviews');
    console.log('mongoimport --db nafood --collection reviews --file reviews.json --jsonArray');
    console.log('');
    console.log('# Import banners');
    console.log('mongoimport --db nafood --collection banners --file banners.json --jsonArray');
    console.log('```\n');

    // Generate separate JSON files for each collection
    console.log('📁 GENERATING SEPARATE JSON FILES...');
    
    // Create data directory if not exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    // Write separate files
    fs.writeFileSync(path.join(dataDir, 'users.json'), JSON.stringify(sampleData.users, null, 2));
    console.log('   ✅ users.json created');

    fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(sampleData.categories, null, 2));
    console.log('   ✅ categories.json created');

    fs.writeFileSync(path.join(dataDir, 'products.json'), JSON.stringify(sampleData.products, null, 2));
    console.log('   ✅ products.json created');

    fs.writeFileSync(path.join(dataDir, 'orders.json'), JSON.stringify(sampleData.orders, null, 2));
    console.log('   ✅ orders.json created');

    fs.writeFileSync(path.join(dataDir, 'reviews.json'), JSON.stringify(sampleData.reviews, null, 2));
    console.log('   ✅ reviews.json created');

    fs.writeFileSync(path.join(dataDir, 'banners.json'), JSON.stringify(sampleData.banners, null, 2));
    console.log('   ✅ banners.json created');

    console.log('\n🎉 ALL FILES GENERATED SUCCESSFULLY!');
    console.log('=====================================');

    // Generate SQL insert statements for reference
    console.log('\n📝 SQL INSERT STATEMENTS (for reference):');
    console.log('```sql');
    console.log('-- Insert sample users');
    sampleData.users.forEach(user => {
      console.log(`INSERT INTO users (id, username, email, password, role, created_at) VALUES ('${user._id}', '${user.username}', '${user.email}', '${user.password}', '${user.role}', '${user.createdAt}');`);
    });
    console.log('```\n');

    // Generate test credentials
    console.log('🔐 TEST CREDENTIALS:');
    console.log('   Admin: admin@nafood.com / password123');
    console.log('   Staff: nguyen@nafood.com / password123');
    console.log('   Customer 1: tran.van.a@gmail.com / password123');
    console.log('   Customer 2: le.thi.b@gmail.com / password123');
    console.log('');

    console.log('💡 USAGE INSTRUCTIONS:');
    console.log('1. Use the generated JSON files in /data folder');
    console.log('2. Import to MongoDB using mongoimport commands above');
    console.log('3. Or use the data programmatically in your application');
    console.log('4. Test with the provided credentials');
    console.log('');

    return {
      success: true,
      message: 'Sample data generated successfully',
      stats: {
        users: sampleData.users.length,
        categories: sampleData.categories.length,
        products: sampleData.products.length,
        orders: sampleData.orders.length,
        reviews: sampleData.reviews.length,
        banners: sampleData.banners.length
      }
    };

  } catch (error) {
    console.error('❌ Error importing sample data:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the import
importData().then(result => {
  if (result.success) {
    console.log('🎊 IMPORT COMPLETED SUCCESSFULLY!');
  } else {
    console.log('💥 IMPORT FAILED:', result.error);
  }
});
