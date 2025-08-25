// backend-health-check.js
// This script performs health checks on the backend systems

require('dotenv').config();
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

// Check environment variables
console.log('\n========== ENVIRONMENT VARIABLES CHECK ==========');
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
const missingVars = [];

requiredEnvVars.forEach(variable => {
  if (!process.env[variable]) {
    missingVars.push(variable);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
} else {
  console.log('✅ All required environment variables are set');
}

// Database connection check
console.log('\n========== DATABASE CONNECTION CHECK ==========');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDatabaseConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to the database');
    
    // Check for admin user
    const adminResult = await client.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
    
    if (adminResult.rows.length === 0) {
      console.error('❌ Admin user not found in database');
    } else {
      console.log('✅ Admin user exists in database');
    }
    
    // Check tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    console.log('\nDatabase tables:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
}

// JWT check
function checkJwt() {
  console.log('\n========== JWT CHECK ==========');
  try {
    const testPayload = { id: 'test-id', role: 'admin' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.id === testPayload.id && decoded.role === testPayload.role) {
      console.log('✅ JWT signing and verification working correctly');
    } else {
      console.error('❌ JWT verification returned incorrect payload');
    }
  } catch (err) {
    console.error('❌ JWT error:', err.message);
  }
}

// Password hashing check
async function checkPasswordHashing() {
  console.log('\n========== PASSWORD HASHING CHECK ==========');
  try {
    const testPassword = 'Admin@123';
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    
    if (isMatch) {
      console.log('✅ Password hashing and verification working correctly');
    } else {
      console.error('❌ Password verification failed');
    }
  } catch (err) {
    console.error('❌ Password hashing error:', err.message);
  }
}

// File system check
function checkFileSystem() {
  console.log('\n========== FILE SYSTEM CHECK ==========');
  const requiredDirs = ['uploads', 'public'];
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      console.log(`Creating missing directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  console.log('✅ Required directories exist or have been created');
}

// Run all checks
async function runAllChecks() {
  console.log('Starting backend health checks...');
  
  await checkDatabaseConnection();
  checkJwt();
  await checkPasswordHashing();
  checkFileSystem();
  
  console.log('\nHealth check completed.');
}

runAllChecks().catch(err => {
  console.error('Error during health check:', err);
});
