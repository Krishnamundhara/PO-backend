const bcrypt = require('bcrypt');
const db = require('./config/db');

async function recreateAdmin() {
  try {
    // Create a hashed password for 'admin123'
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Delete existing admin user if it exists
    await db.query('DELETE FROM users WHERE username = $1', ['admin']);
    console.log('Deleted existing admin user if existed');

    // Create a new admin user
    await db.query(
      'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4)',
      ['admin', hashedPassword, 'admin@example.com', 'admin']
    );
    console.log('Admin user created successfully with username: admin and password: admin123');

    return true;
  } catch (error) {
    console.error('Error recreating admin user:', error);
    return false;
  }
}

recreateAdmin()
  .then(() => {
    console.log('Script completed');
    process.exit(0);
  })
  .catch(err => {
    console.error('Script error:', err);
    process.exit(1);
  });
