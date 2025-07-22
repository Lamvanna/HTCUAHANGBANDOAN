import { registerSchema } from '../shared/schema.js';

// Test data similar to what frontend sends
const testData = {
  fullName: "Test User",
  email: "test@example.com",
  password: "123456",
  confirmPassword: "123456"
};

console.log('Testing register validation...');
console.log('Input data:', testData);

try {
  const validated = registerSchema.parse(testData);
  console.log('✅ Validation successful!');
  console.log('Validated data:', validated);
  console.log('Data types:', {
    fullName: typeof validated.fullName,
    email: typeof validated.email,
    password: typeof validated.password,
    confirmPassword: typeof validated.confirmPassword
  });
} catch (error) {
  console.log('❌ Validation failed!');
  console.log('Error:', error.message);
  if (error.errors) {
    console.log('Detailed errors:', JSON.stringify(error.errors, null, 2));
  }
}

// Test with invalid data
const invalidData = {
  fullName: "",
  email: "invalid-email",
  password: "123", // Too short
  confirmPassword: "456" // Doesn't match
};

console.log('\n--- Testing with invalid data ---');
console.log('Input data:', invalidData);

try {
  const validated = registerSchema.parse(invalidData);
  console.log('✅ Validation successful:', validated);
} catch (error) {
  console.log('❌ Validation failed (expected)!');
  console.log('Error:', error.message);
  if (error.errors) {
    console.log('Detailed errors:', JSON.stringify(error.errors, null, 2));
  }
}
