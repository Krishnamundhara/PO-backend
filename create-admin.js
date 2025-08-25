const bcrypt = require('bcrypt');
const db = require('./config/db');

const createAdminUser = async () => {
  try {
    // Generate a hash for the password 'admin123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    // First check if admin user exists
    const checkResult = await db.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );
    
    if (checkResult.rows.length === 0) {
      // Insert admin user if it doesn't exist
      await db.query(
        'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
        ['admin', hashedPassword, 'admin@example.com', 'admin']
      );
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (err) {
    console.error('Error creating admin user:', err);
  }
};

createAdminUser()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Script error:', err);
    process.exit(1);
  });
