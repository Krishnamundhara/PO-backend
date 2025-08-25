// force-create-admin.js
// This script directly inserts the admin user with a hardcoded password hash

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function forceCreateAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('Checking if users table exists...');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      // Create users table if it doesn't exist
      console.log('Creating users table...');
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
      console.log('Users table created successfully.');
    }
    
    // Delete existing admin user if it exists
    console.log('Removing any existing admin user...');
    await client.query('DELETE FROM users WHERE username = $1', ['admin']);
    
    // Insert admin user with hardcoded bcrypt hash for 'admin123'
    console.log('Creating admin user...');
    const adminHash = '$2b$10$2pXKV.zUDuJnNBrOlVRw2.OGDAy1Z6qJL71LXh47FRf/CfhMvUPm6'; // This is 'admin123'
    
    await client.query(`
      INSERT INTO users (username, password, email, role)
      VALUES ($1, $2, $3, $4)
    `, ['admin', adminHash, 'admin@example.com', 'admin']);
    
    console.log('Admin user created successfully with:');
    console.log('- Username: admin');
    console.log('- Password: admin123');
    console.log('- Email: admin@example.com');
    console.log('- Role: admin');
    
    // Verify the admin user was created
    const verifyResult = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
    
    if (verifyResult.rows.length > 0) {
      console.log('\nAdmin user verification successful ✅');
    } else {
      console.log('\nFailed to verify admin user ❌');
    }
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

forceCreateAdmin()
  .then(() => {
    console.log('Script completed successfully.');
  })
  .catch(err => {
    console.error('Script failed:', err);
    process.exit(1);
  });
