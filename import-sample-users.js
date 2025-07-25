// Import sample users to database
import { storage } from './server/storage.js';
import bcrypt from 'bcrypt';
import fs from 'fs';

console.log('👥 IMPORTING SAMPLE USERS');
console.log('=========================\n');

// Read sample data
const sampleData = JSON.parse(fs.readFileSync('sample-data.json', 'utf8'));

async function importUsers() {
  try {
    console.log('🔗 Connecting to database...');
    
    // Import users
    console.log('\n👤 Creating users...');
    
    for (const userData of sampleData.users) {
      try {
        // Check if user already exists
        const existingUser = await storage.getUserByEmail(userData.email);
        
        if (existingUser) {
          console.log(`⚠️  User ${userData.email} already exists, skipping...`);
          continue;
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        // Create user
        const user = await storage.createUser({
          username: userData.username,
          email: userData.email,
          fullName: userData.fullName,
          phone: userData.phone || '',
          address: userData.address || '',
          password: hashedPassword,
          role: userData.role,
          isActive: userData.isActive
        });
        
        console.log(`✅ Created user: ${userData.email} (${userData.role})`);
        
      } catch (error) {
        console.log(`❌ Failed to create user ${userData.email}:`, error.message);
      }
    }
    
    console.log('\n🎉 User import completed!');
    
    // Test login with admin user
    console.log('\n🧪 Testing admin login...');
    
    const adminUser = await storage.getUserByEmail('admin@nafood.com');
    if (adminUser) {
      const isValidPassword = await bcrypt.compare('password123', adminUser.password);
      if (isValidPassword) {
        console.log('✅ Admin login test successful!');
        console.log('📋 Admin user details:');
        console.log('- Email:', adminUser.email);
        console.log('- Full Name:', adminUser.fullName);
        console.log('- Role:', adminUser.role);
        console.log('- Active:', adminUser.isActive);
      } else {
        console.log('❌ Admin password verification failed');
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    console.log('\n📋 CREDENTIALS FOR TESTING:');
    console.log('============================');
    sampleData.users.forEach(user => {
      console.log(`${user.role.toUpperCase()}: ${user.email} / password123`);
    });
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('==============');
    console.log('1. ✅ Users are now imported');
    console.log('2. 🔄 Server is already running');
    console.log('3. 🔑 Try login with: admin@nafood.com / password123');
    console.log('4. 🧪 Test JWT token generation');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    process.exit(0);
  }
}

importUsers();
