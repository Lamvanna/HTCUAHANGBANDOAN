import { mongodb } from '../server/db.js';

async function checkCollections() {
  try {
    await mongodb.connect();
    console.log('Connected to MongoDB');

    // List all collections
    const collections = await mongodb.db.listCollections().toArray();
    console.log('\n📋 Available collections:');
    collections.forEach(col => {
      console.log(`- ${col.name}`);
    });

    // Check if reviews collection exists
    const reviewsExists = collections.some(col => col.name === 'reviews');
    console.log(`\n🔍 Reviews collection exists: ${reviewsExists ? 'Yes' : 'No'}`);

    if (!reviewsExists) {
      console.log('Creating reviews collection...');
      await mongodb.db.createCollection('reviews');
      console.log('✅ Reviews collection created');
    }

    // Check counters collection for reviews
    try {
      const counters = await mongodb.db.collection('counters').findOne({ _id: 'reviews' });
      console.log(`\n🔢 Reviews counter: ${counters ? counters.seq : 'Not found'}`);

      if (!counters) {
        console.log('Creating reviews counter...');
        await mongodb.db.collection('counters').insertOne({ _id: 'reviews', seq: 0 });
        console.log('✅ Reviews counter created');
      }
    } catch (counterError) {
      console.log('Counter check error:', counterError.message);
    }

    // Check some sample data
    try {
      const reviewCount = await mongodb.db.collection('reviews').countDocuments();
      console.log(`\n📊 Total reviews: ${reviewCount}`);

      const orderCount = await mongodb.db.collection('orders').countDocuments();
      console.log(`📊 Total orders: ${orderCount}`);

      const deliveredOrders = await mongodb.db.collection('orders').countDocuments({ status: 'delivered' });
      console.log(`📊 Delivered orders: ${deliveredOrders}`);
    } catch (dataError) {
      console.log('Data check error:', dataError.message);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongodb.client.close();
  }
}

checkCollections();
