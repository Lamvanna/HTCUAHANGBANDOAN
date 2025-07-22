import { insertReviewSchema } from '../shared/schema.js';

// Test data similar to what frontend sends
const testData = {
  userId: 1,
  productId: "1", // String from frontend
  orderId: "28", // String from frontend  
  rating: 5,
  comment: "Test review comment"
};

console.log('Testing review validation...');
console.log('Input data:', testData);

try {
  const validated = insertReviewSchema.parse(testData);
  console.log('✅ Validation successful!');
  console.log('Validated data:', validated);
  console.log('Data types:', {
    userId: typeof validated.userId,
    productId: typeof validated.productId,
    orderId: typeof validated.orderId,
    rating: typeof validated.rating,
    comment: typeof validated.comment
  });
} catch (error) {
  console.log('❌ Validation failed!');
  console.log('Error:', error.message);
  if (error.errors) {
    console.log('Detailed errors:', JSON.stringify(error.errors, null, 2));
  }
}

// Test with number inputs
const testData2 = {
  userId: 1,
  productId: 1,
  orderId: 28,
  rating: 5,
  comment: "Test review comment"
};

console.log('\n--- Testing with number inputs ---');
console.log('Input data:', testData2);

try {
  const validated = insertReviewSchema.parse(testData2);
  console.log('✅ Validation successful!');
  console.log('Validated data:', validated);
} catch (error) {
  console.log('❌ Validation failed!');
  console.log('Error:', error.message);
  if (error.errors) {
    console.log('Detailed errors:', JSON.stringify(error.errors, null, 2));
  }
}
