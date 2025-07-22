import { storage } from '../server/storage.js';

async function testCreateReview() {
  try {
    console.log('Testing createReview function...');
    
    const testReview = {
      userId: 1,
      productId: 1,
      orderId: 28,
      rating: 5,
      comment: "Test review from script"
    };
    
    console.log('Test review data:', testReview);
    
    const result = await storage.createReview(testReview);
    console.log('✅ Review created successfully:', result);
    
  } catch (error) {
    console.log('❌ Error creating review:', error.message);
    console.log('Full error:', error);
  }
}

testCreateReview();
