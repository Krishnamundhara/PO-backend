// update-db.js
// This script safely updates the database schema

require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function updateDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Updating database schema...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'database', 'update-schema.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Run the SQL commands
    await client.query(sqlScript);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('Database schema updated successfully!');
    
    // Verify tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\nVerified tables:');
    tables.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });
    
  } catch (error) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error('Error updating database:', error);
  } finally {
    client.release();
    pool.end();
  }
}

updateDatabase().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
