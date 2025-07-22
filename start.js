#!/usr/bin/env node

// Manual start script for Na Food application
// Run this file to start the server manually

// Set NODE_ENV if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'development';
}

import { runServer } from './server/index.js';

console.log('🍔 Starting Na Food application manually...');
console.log(`📝 Environment: ${process.env.NODE_ENV}`);
console.log('📝 This is a manual start - the server will not auto-restart');
console.log('🔧 To stop the server, press Ctrl+C');
console.log('');

runServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
