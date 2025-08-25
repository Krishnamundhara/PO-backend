const db = require('../config/db');
const fs = require('fs');
const path = require('path');

const initDb = async () => {
  try {
    console.log('Initializing database...');
    
    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await db.query(schema);
    
    console.log('Database initialization complete!');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

// Export the function to be called from server.js or a separate script
module.exports = { initDb };
