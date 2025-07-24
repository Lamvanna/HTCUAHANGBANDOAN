#!/usr/bin/env node

/**
 * Script kiểm tra và validate các biến môi trường cần thiết
 * Sửa lỗi: Thiếu validation cho environment variables quan trọng
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Danh sách các biến môi trường bắt buộc
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'SESSION_SECRET'
];

// Danh sách các biến môi trường tùy chọn với giá trị mặc định
const optionalEnvVars = {
  'PORT': '5000',
  'NODE_ENV': 'development',
  'CORS_ORIGIN': 'http://localhost:5173'
};

console.log('🔍 Đang kiểm tra cấu hình môi trường...\n');

let hasErrors = false;

// Kiểm tra các biến bắt buộc
console.log('📋 Kiểm tra biến môi trường bắt buộc:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: THIẾU (bắt buộc)`);
    hasErrors = true;
  } else {
    // Ẩn giá trị nhạy cảm
    const displayValue = varName.includes('SECRET') || varName.includes('PASSWORD') 
      ? '***' 
      : value.length > 50 
        ? value.substring(0, 47) + '...'
        : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  }
});

console.log('\n📋 Kiểm tra biến môi trường tùy chọn:');
Object.entries(optionalEnvVars).forEach(([varName, defaultValue]) => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  ${varName}: Sử dụng mặc định (${defaultValue})`);
  } else {
    console.log(`✅ ${varName}: ${value}`);
  }
});

// Kiểm tra định dạng MongoDB URI
if (process.env.MONGODB_URI) {
  console.log('\n🔍 Kiểm tra định dạng MongoDB URI:');
  const mongoUri = process.env.MONGODB_URI;
  
  if (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://')) {
    console.log('✅ Định dạng MongoDB URI hợp lệ');
    
    // Kiểm tra có chứa database name không
    if (mongoUri.includes('/') && mongoUri.split('/').pop()) {
      console.log('✅ Database name được chỉ định');
    } else {
      console.log('⚠️  Cảnh báo: Không tìm thấy database name trong URI');
    }
  } else {
    console.log('❌ Định dạng MongoDB URI không hợp lệ');
    hasErrors = true;
  }
}

// Kiểm tra độ mạnh của JWT Secret
if (process.env.JWT_SECRET) {
  console.log('\n🔐 Kiểm tra độ mạnh JWT Secret:');
  const secret = process.env.JWT_SECRET;
  
  if (secret.length < 32) {
    console.log('⚠️  Cảnh báo: JWT Secret nên có ít nhất 32 ký tự');
  } else {
    console.log('✅ JWT Secret có độ dài phù hợp');
  }
  
  if (secret === 'your-secret-key' || secret === 'default-secret') {
    console.log('❌ Lỗi: Đang sử dụng JWT Secret mặc định (không an toàn)');
    hasErrors = true;
  } else {
    console.log('✅ JWT Secret không phải giá trị mặc định');
  }
}

console.log('\n' + '='.repeat(50));

if (hasErrors) {
  console.log('❌ Có lỗi trong cấu hình môi trường!');
  console.log('\n💡 Hướng dẫn sửa lỗi:');
  console.log('1. Tạo file .env từ .env.example');
  console.log('2. Điền đầy đủ các biến môi trường bắt buộc');
  console.log('3. Sử dụng JWT Secret mạnh (ít nhất 32 ký tự)');
  console.log('4. Kiểm tra định dạng MongoDB URI');
  process.exit(1);
} else {
  console.log('✅ Tất cả cấu hình môi trường đều hợp lệ!');
  console.log('🚀 Ứng dụng sẵn sàng khởi động.');
  process.exit(0);
}
