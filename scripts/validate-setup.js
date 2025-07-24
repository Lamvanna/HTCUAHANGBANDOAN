#!/usr/bin/env node

/**
 * Setup Validation Script
 * This script validates the entire application setup for potential issues
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

// Check if file exists
function fileExists(filePath) {
  try {
    return fs.existsSync(path.join(rootDir, filePath));
  } catch (error) {
    return false;
  }
}

// Check directory exists
function dirExists(dirPath) {
  try {
    const fullPath = path.join(rootDir, dirPath);
    return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  } catch (error) {
    return false;
  }
}

// Read JSON file safely
function readJsonFile(filePath) {
  try {
    const fullPath = path.join(rootDir, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

// Check package.json dependencies
function validatePackageJson() {
  log('\n📦 Validating package.json...', colors.cyan);
  
  const packageJson = readJsonFile('package.json');
  if (!packageJson) {
    log('❌ package.json not found or invalid', colors.red);
    return false;
  }

  const requiredDeps = [
    'express',
    'mongodb',
    'bcrypt',
    'jsonwebtoken',
    'multer',
    'dotenv',
    'zod'
  ];

  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies?.[dep]);
  
  if (missingDeps.length > 0) {
    log(`❌ Missing dependencies: ${missingDeps.join(', ')}`, colors.red);
    return false;
  }

  // Check scripts
  const requiredScripts = ['start', 'start:prod'];
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);
  
  if (missingScripts.length > 0) {
    log(`⚠️  Missing scripts: ${missingScripts.join(', ')}`, colors.yellow);
  }

  log('✅ package.json validation passed', colors.green);
  return true;
}

// Check required files
function validateRequiredFiles() {
  log('\n📁 Validating required files...', colors.cyan);
  
  const requiredFiles = [
    'server/index.js',
    'server/db.js',
    'server/storage.js',
    'server/routes.js',
    'shared/schema.js',
    'start.js',
    'start-prod.js'
  ];

  let allFilesExist = true;
  
  for (const file of requiredFiles) {
    if (fileExists(file)) {
      log(`✅ ${file}`, colors.green);
    } else {
      log(`❌ ${file} - Missing`, colors.red);
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

// Check Docker files
function validateDockerFiles() {
  log('\n🐳 Validating Docker files...', colors.cyan);
  
  const dockerFiles = [
    'CONGNGHEPHANMEM/Dockerfile',
    'CONGNGHEPHANMEM/docker-compose.yml',
    'CONGNGHEPHANMEM/.dockerignore',
    'CONGNGHEPHANMEM/scripts/init-mongo.js'
  ];

  let allDockerFilesExist = true;
  
  for (const file of dockerFiles) {
    if (fileExists(file)) {
      log(`✅ ${file}`, colors.green);
    } else {
      log(`❌ ${file} - Missing`, colors.red);
      allDockerFilesExist = false;
    }
  }

  return allDockerFilesExist;
}

// Check directories
function validateDirectories() {
  log('\n📂 Validating directories...', colors.cyan);
  
  const requiredDirs = [
    'server',
    'shared',
    'public',
    'scripts',
    'CONGNGHEPHANMEM'
  ];

  let allDirsExist = true;
  
  for (const dir of requiredDirs) {
    if (dirExists(dir)) {
      log(`✅ ${dir}/`, colors.green);
    } else {
      log(`❌ ${dir}/ - Missing`, colors.red);
      allDirsExist = false;
    }
  }

  // Check uploads directory
  const uploadsDir = 'public/uploads';
  if (dirExists(uploadsDir)) {
    log(`✅ ${uploadsDir}/`, colors.green);
  } else {
    log(`⚠️  ${uploadsDir}/ - Will be created automatically`, colors.yellow);
  }

  return allDirsExist;
}

// Check environment configuration
function validateEnvironment() {
  log('\n🔧 Validating environment configuration...', colors.cyan);
  
  const envExample = fileExists('.env.example');
  const dockerEnvExample = fileExists('CONGNGHEPHANMEM/.env.example');
  
  if (envExample) {
    log('✅ .env.example exists', colors.green);
  } else {
    log('⚠️  .env.example missing - should provide template', colors.yellow);
  }

  if (dockerEnvExample) {
    log('✅ CONGNGHEPHANMEM/.env.example exists', colors.green);
  } else {
    log('⚠️  CONGNGHEPHANMEM/.env.example missing', colors.yellow);
  }

  // Check for actual .env files (should not be in repo)
  if (fileExists('.env')) {
    log('⚠️  .env file exists - ensure it\'s in .gitignore', colors.yellow);
  }

  return true;
}

// Check code quality issues
function validateCodeQuality() {
  log('\n🔍 Checking for common code issues...', colors.cyan);
  
  let issues = [];

  // Check server/storage.js for ensureConnection calls
  try {
    const storageContent = fs.readFileSync(path.join(rootDir, 'server/storage.js'), 'utf8');
    
    // Count ensureConnection calls
    const ensureConnectionCalls = (storageContent.match(/ensureConnection\(\)/g) || []).length;
    const asyncMethods = (storageContent.match(/async \w+\(/g) || []).length;
    
    if (ensureConnectionCalls < asyncMethods * 0.8) {
      issues.push('Some async methods in storage.js may be missing ensureConnection() calls');
    } else {
      log('✅ MongoDB connection handling looks good', colors.green);
    }
  } catch (error) {
    issues.push('Could not analyze server/storage.js');
  }

  // Check server/db.js for Docker optimizations
  try {
    const dbContent = fs.readFileSync(path.join(rootDir, 'server/db.js'), 'utf8');
    
    if (dbContent.includes('maxRetries') && dbContent.includes('gracefulShutdown')) {
      log('✅ Database connection has Docker optimizations', colors.green);
    } else {
      issues.push('Database connection may need Docker optimizations');
    }
  } catch (error) {
    issues.push('Could not analyze server/db.js');
  }

  if (issues.length > 0) {
    issues.forEach(issue => log(`⚠️  ${issue}`, colors.yellow));
  }

  return issues.length === 0;
}

// Check security configurations
function validateSecurity() {
  log('\n🔒 Validating security configurations...', colors.cyan);
  
  let securityIssues = [];

  // Check for hardcoded secrets in code
  const filesToCheck = ['server/routes.js', 'server/index.js'];
  
  for (const file of filesToCheck) {
    try {
      const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
      
      if (content.includes('your-secret-key') || content.includes('password123')) {
        securityIssues.push(`${file} may contain hardcoded secrets`);
      }
    } catch (error) {
      // File doesn't exist or can't be read
    }
  }

  // Check Docker compose for default passwords
  try {
    const dockerCompose = fs.readFileSync(path.join(rootDir, 'CONGNGHEPHANMEM/docker-compose.yml'), 'utf8');
    
    if (dockerCompose.includes('password123')) {
      securityIssues.push('Docker compose uses default MongoDB password');
    }
  } catch (error) {
    // File doesn't exist
  }

  if (securityIssues.length > 0) {
    securityIssues.forEach(issue => log(`⚠️  ${issue}`, colors.yellow));
    log('💡 Remember to change default passwords in production!', colors.blue);
  } else {
    log('✅ No obvious security issues found', colors.green);
  }

  return securityIssues.length === 0;
}

// Main validation function
async function runValidation() {
  log('🔍 Starting Setup Validation...', colors.blue);
  log('================================', colors.blue);

  const results = {
    packageJson: validatePackageJson(),
    requiredFiles: validateRequiredFiles(),
    dockerFiles: validateDockerFiles(),
    directories: validateDirectories(),
    environment: validateEnvironment(),
    codeQuality: validateCodeQuality(),
    security: validateSecurity()
  };

  // Summary
  log('\n================================', colors.blue);
  log('📊 Validation Summary:', colors.blue);
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? 'PASS' : 'FAIL';
    const color = passed ? colors.green : colors.red;
    log(`${check}: ${status}`, color);
  });

  log(`\nOverall: ${passed}/${total} checks passed`, 
      passed === total ? colors.green : colors.yellow);

  if (passed === total) {
    log('\n🎉 All validations passed! Setup looks good.', colors.green);
    log('💡 Next steps:', colors.blue);
    log('  1. Review and update .env files', colors.reset);
    log('  2. Change default passwords for production', colors.reset);
    log('  3. Run: docker-compose up --build', colors.reset);
    log('  4. Test with: node scripts/test-docker-setup.js', colors.reset);
  } else {
    log('\n⚠️  Some validations failed. Please fix the issues above.', colors.yellow);
  }

  return passed === total;
}

// Run validation if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runValidation().catch((error) => {
    log(`💥 Validation failed: ${error.message}`, colors.red);
    process.exit(1);
  });
}

export { runValidation };
