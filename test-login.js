// test-login.js
// Script to test login functionality

require('dotenv').config();
const axios = require('axios');

// Get the API URL from environment or use default
const apiUrl = process.env.API_URL || 'http://localhost:5000/api';

// Test login with admin credentials
async function testLogin() {
  console.log('Testing login API endpoint...');
  console.log(`API URL: ${apiUrl}/auth/login`);
  
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      username: 'admin',
      password: 'admin123'
    });
    
    console.log('Login successful!');
    console.log('Response status:', response.status);
    
    // Print token and user info (without showing the actual token value)
    if (response.data && response.data.token) {
      console.log('Token received ✓');
      console.log('User data:', {
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        role: response.data.user.role
      });
      
      return true;
    } else {
      console.error('No token in response');
      console.log('Response data:', response.data);
      return false;
    }
  } catch (error) {
    console.error('Login failed!');
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received');
    } else {
      console.error('Error:', error.message);
    }
    
    return false;
  }
}

testLogin().then(success => {
  if (success) {
    console.log('\nLogin API is working correctly ✓');
  } else {
    console.log('\nLogin API has issues ✗');
  }
});
