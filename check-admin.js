// check-admin.js
// This script checks if an admin user exists in the database

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkAdminUser() {
  const client = await pool.connect();
  
  try {
    console.log('Checking admin user...');
    const result = await client.query('SELECT id, username, email, role FROM users WHERE role = $1', ['admin']);
    
    if (result.rows.length > 0) {
      console.log('Admin user found:');
      result.rows.forEach(row => {
        console.log(`- User ID: ${row.id}`);
        console.log(`- Username: ${row.username}`);
        console.log(`- Email: ${row.email}`);
        console.log(`- Role: ${row.role}`);
      });
      
      console.log('\nYou can log in with:');
      console.log('- Username: admin');
      console.log('- Password: admin123');
    } else {
      console.log('No admin user found.');
    }
  } catch (err) {
    console.error('Error checking admin user:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAdminUser();
