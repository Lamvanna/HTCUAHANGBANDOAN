import { mongodb } from '../server/db.js';

async function createTestOrders() {
  try {
    await mongodb.connect();
    console.log('Connected to MongoDB');

    // Get some users and products
    const users = await mongodb.users.find({ role: 'user' }).limit(3).toArray();
    const products = await mongodb.products.find({ isActive: true }).limit(5).toArray();

    if (users.length === 0) {
      console.log('No users found. Creating a test user...');
      const testUser = {
        id: await mongodb.getNextId('users'),
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$rQZ9QmjytWIHq8fJvXz0/.vQZ9QmjytWIHq8fJvXz0/.vQZ9QmjytW', // password: 123456
        fullName: 'Test User',
        phone: '0123456789',
        address: '123 Test Street',
        role: 'user',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await mongodb.users.insertOne(testUser);
      users.push(testUser);
    }

    if (products.length === 0) {
      console.log('No products found. Please add some products first.');
      return;
    }

    console.log(`Found ${users.length} users and ${products.length} products`);

    // Create test orders with "delivered" status
    const testOrders = [];
    
    for (let i = 0; i < 3; i++) {
      const user = users[i % users.length];
      const selectedProducts = products.slice(0, 2 + i); // Different products for each order
      
      const orderItems = selectedProducts.map(product => ({
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.floor(Math.random() * 3) + 1,
        image: product.image
      }));

      const total = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      const order = {
        id: await mongodb.getNextId('orders'),
        userId: user.id,
        total: total,
        status: 'delivered', // Important: Set to delivered so users can review
        paymentMethod: ['cod', 'bank_transfer', 'e_wallet'][Math.floor(Math.random() * 3)],
        customerName: user.fullName,
        customerPhone: user.phone || '0123456789',
        customerAddress: user.address || '123 Test Address',
        items: orderItems,
        notes: `Test order ${i + 1} - delivered for review testing`,
        createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000), // Different dates
        updatedAt: new Date()
      };

      testOrders.push(order);
    }

    // Insert test orders
    for (const order of testOrders) {
      await mongodb.orders.insertOne(order);
      console.log(`Created delivered order #${order.id} for user ${order.customerName}`);
    }

    console.log(`\n✅ Created ${testOrders.length} test orders with "delivered" status`);
    console.log('Users can now review products from these orders!');
    
    // Show summary
    console.log('\n📋 Order Summary:');
    testOrders.forEach(order => {
      console.log(`- Order #${order.id}: ${order.customerName} - ${order.items.length} items - ${order.total.toLocaleString('vi-VN')}đ`);
      order.items.forEach(item => {
        console.log(`  • ${item.name} x${item.quantity}`);
      });
    });

  } catch (error) {
    console.error('Error creating test orders:', error);
  } finally {
    await mongodb.client.close();
  }
}

createTestOrders();
