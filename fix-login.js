// fix-login.js
// This script fixes login issues by ensuring the admin user exists with correct credentials

require('dotenv').config();
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// Create a new pool with the DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function fixLogin() {
  const client = await pool.connect();
  
  try {
    console.log('Starting login fix...');
    
    // 1. Check if the database has the users table
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    const usersTableExists = tableCheck.rows[0].exists;
    
    if (!usersTableExists) {
      console.log('Users table does not exist. Creating it...');
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
      console.log('Users table created.');
    }
    
    // 2. Check if admin user exists
    const adminCheck = await client.query(`
      SELECT * FROM users WHERE username = 'admin';
    `);
    
    // 3. Generate fresh admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    if (adminCheck.rows.length === 0) {
      // Admin doesn't exist, create it
      await client.query(`
        INSERT INTO users (username, password, email, role)
        VALUES ('admin', $1, 'admin@example.com', 'admin');
      `, [hashedPassword]);
      
      console.log('Admin user created successfully.');
    } else {
      // Admin exists, update password
      await client.query(`
        UPDATE users 
        SET password = $1
        WHERE username = 'admin';
      `, [hashedPassword]);
      
      console.log('Admin password updated successfully.');
    }
    
    // 4. Verify admin user
    const verifyAdmin = await client.query(`
      SELECT * FROM users WHERE username = 'admin';
    `);
    
    if (verifyAdmin.rows.length > 0) {
      console.log('Admin user verified:');
      console.log(`Username: ${verifyAdmin.rows[0].username}`);
      console.log(`Email: ${verifyAdmin.rows[0].email}`);
      console.log(`Role: ${verifyAdmin.rows[0].role}`);
    }
    
    console.log('\nLogin fix completed successfully!');
    console.log('You can now log in with:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error fixing login:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixLogin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
