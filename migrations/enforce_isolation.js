require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

async function runMigration() {
  const client = await pool.connect();
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'enforce_data_isolation.sql'), 'utf8');
    console.log('Running migration: enforce_data_isolation.sql');
    await client.query(sql);
    console.log('Migration completed successfully');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigration();
