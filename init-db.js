const { initDb } = require('./database/init');

// Run the database initialization
initDb()
  .then(() => console.log('Database initialization script completed.'))
  .catch(err => console.error('Error in initialization script:', err));
