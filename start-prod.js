#!/usr/bin/env node

// Production start script for Na Food application

// Set NODE_ENV to production
process.env.NODE_ENV = 'production';

import { runServer } from './server/index.js';

console.log('🍔 Starting Na Food application in PRODUCTION mode...');
console.log('📝 Environment: production');
console.log('📝 This is a manual start - the server will not auto-restart');
console.log('🔧 To stop the server, press Ctrl+C');
console.log('');

runServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
